# <img src="https://img.shields.io/npm/v/gonzazoid.injectscript.js.svg"></img> <img src="https://img.shields.io/badge/strongly%20typed-npm-blue.svg"></img>

# injectScript.js
### injectScript: (document: Document, func: string | Function, ...params: any[]) => any;
Скрипт предназначен для работы в контент-скриптах web-extension расширений хрома/оперы/файрфокса

Если нам необходимо, находясь в контент скрипте запустиь какой либо код в user land(а контент скрипты запускаются в своем окружении и имеют доступ только к DOM открытой страницы, но не к переменным и всему происходящему в js на стороне пользователя ([тут подробнее](https://developer.chrome.com/extensions/content_scripts)), то мы конечно идем на SO и читаем статей типа этих:
* [Can I add javascript dynamically to an existing script element](https://stackoverflow.com/questions/3619484/can-i-add-javascript-dynamically-to-an-existing-script-element)

* [Adding <script> element to the DOM and have the javascript run?](https://stackoverflow.com/questions/6432984/adding-script-element-to-the-dom-and-have-the-javascript-run)

* [document.createElement(“script”) synchronously](https://stackoverflow.com/questions/3248384/document-createelementscript-synchronously)

После, грязно выругавшись пишем свою либу, в котору можно передавать требуемую функцию (или ее исходник) и параметры, получать на выходе результат, а если в ходе исполнения произошла ошибка - перехватывать ее с возможностью покопаться в дальнейшем в стеке.
Делаем мы ее естественно на промисах, причем неважно что будет возвращать передаваемая функция - на выходе мы получим разрезолвленный результат. Естественно после исполнения мы удаляем созданный тег скрипт - мы же чистоплотные программисты, are we?
Ну и после всего этого публикуем написанный модуль что бы им могли воспользоваться все страждующие. 

Usage (typescript, add this to content script of your extension, так же можно использовать при внедрении кода во фрейм):
```
import {injectScript} from 'gonzazoid.injectscript.js';

const payload = function(some_param: string){
    return some_param.split('.');
}

const res = injectScript(document, payload, 'some.test.string');
console.log(res); // ['some', 'test', 'string']
```

или узнать значение переменной (в контент скрипте переменные user space не доступны):
например узнать версию Jquery:
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
или узнать версию Jquery правильно:

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
Обратите внимание как мы передаем в user space свои модули - сериализуем их в строку. Не с каждым модулем это пройдет. Смотрите:

```
const a = function(){
    b();
}
const b = function(){

};

module.exports = a;

```

если мы приведем функцию импортированную из модуля к строке, то получим:
```
const a = function(){
    b();
}
```
создать из этой строки работоспособную функцию не получится - исходники функции b потеряны. Что бы избежать этого функция a должна быть описана следующим образом:

```
const a = function(){
    const b = function(){

    };

    b();
}

module.exports = a;
```
В этом случае можно привести ее к строке, передать в тег script и она нормально сработает в user land.
Мне например для этого модуля пришлось переписать функцию [serializeError](https://github.com/sindresorhus/serialize-error/blob/master/index.js) взятую с npm пакета [serialize-error](https://www.npmjs.com/package/serialize-error) именно по этой причине - одна из вспомогательных функций описывалась за пределами основной - при импортировании она естественно захватывалась, при сериализации - терялась.

Мы передаем первым параметром document - это сделано для того что бы иметь возможность работать с фреймами а не только с текущим доментом, также это снижает число неявно передаваемых параметров что делает функции ближе к ее математическому определению.

Описанной техникой можно и читать и писать во все, что есть в user land. Вообще можно сделать биндинг так, что весь юзерленд будет отображаться в переменную контент скрипта (возможно я даже напишу такой модуль) А пока - чем богаты тем и рады :)
Enjoy!!!
