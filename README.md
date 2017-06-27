# <img src="https://img.shields.io/npm/v/gonzazoid.injectscript.js.svg"></img> <img src="https://img.shields.io/badge/strongly%20typed-npm-blue.svg"></img>

# injectScript.js
### injectScript: (document: Document, func: string | Function, ...params: any[]) => any;

[read in russian](/README_ru.md)

The script is designed to work in the content scripts of extensions of chrome/opera/firefox

If we need to run some code in the user land in the content script (such scripts run in their own environment and have access only to the DOM of the open page, but not to the variables and everything happening in the js on the user's side ([read more](https://developer.chrome.com/extensions/content_scripts)), then of course we go to SO and read articles like these:
* [Can I add javascript dynamically to an existing script element](https://stackoverflow.com/questions/3619484/can-i-add-javascript-dynamically-to-an-existing-script-element)

* [Adding <script> element to the DOM and have the javascript run?](https://stackoverflow.com/questions/6432984/adding-script-element-to-the-dom-and-have-the-javascript-run)

* [document.createElement(“script”) synchronously](https://stackoverflow.com/questions/3248384/document-createelementscript-synchronously)

After dirty cursing, we write our lib, in which we can transfer the required function (or its source) and parameters, get the result at the output, and if during the execution there was an error - intercept it with the ability to rummage later on the stack.
We do it naturally on the promises, and it does not matter what the transferred function will return - at the output we get an resolved result. Naturally after the execution, we delete the created script tag - we are neat programmers, are we?
Well, after all this, we publish the written module that all suffering people could use it for.
Usage (typescript, add this to content script of your extension, you can also use it when embedding code in a frame):

```npm install -save gonzazoid.injectscript.js```

```
import {injectScript} from 'gonzazoid.injectscript.js';

const payload = function(some_param: string){
    return some_param.split('.');
}

const res = injectScript(document, payload, 'some.test.string');
console.log(res); // ['some', 'test', 'string']
```

or find out the value of a variable (the user space variables are not available in the script content):
for example, find out the version of JQuery
```
declare var $: any;

import {injectScript} from 'gonzazoid.injectscript.js';

const checker = function(){
    return $.fn.jquery;
}

injectScript(document, checker)
    .then((version:string)=>{

    });

```
or find out the version of Jquery correctly:
```
declare var $: any;
declare var window: Window;

import {injectScript} from 'gonzazoid.injectscript.js';
import {checkOff} from 'gonzazoid.checkoff.js';
import {sprintf} from 'gonzazoid.sprintf.js';

const checker = function(){
    const checkOff = /%checkOffSource%/;

    return (checkOff as any)(window, {$: fn: {jquery:''}}) ? $.fn.jquery : null;
};

const src = sprintf(checker.toString(), {checkOffSource: checkOff.toString()});
const version = await injectScript(document, src);

```
Notice how we pass our modules to the user space - we serialize them into a string. Not with each module it will pass. See:
```
const a = function(){
    b();
}
const b = function(){

};

module.exports = a;

```

If we serialize the function imported from the module to the string, we get:
```
const a = function(){
    b();
}
```
You can not create a workable function from this string - the source of function `b` is lost. To avoid this, the function `a` must be described as follows

```
const a = function(){
    const b = function(){

    };

    b();
}

module.exports = a;
```
In this case, you can serialize it to string, put it onto the script tag and it'll properly work in user land.
It's the reason why for this module I had to rewrite the function [serializeError](https://github.com/sindresorhus/serialize-error/blob/master/index.js) taken from the npm package [serialize-error](https://www.npmjs.com/package/serialize-error) - one of the auxiliary functions was described outside the main one - when imported, it was captured (javascript closures), when serialized it was be lost.

We pass the `document` as the first parameter - this is done in order to be able to work with frames and not only with the current document, it also reduces the number of implicitly passed parameters that makes the function closer to its mathematical definition.

The described technique can both read and write in everything that is in user land. In general, it's possible to make binding so that all userland will be mapped to the variable in the content script. Maybe I'll even write such a module. Later.

Enjoy!!!
