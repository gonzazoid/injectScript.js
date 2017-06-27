import {injectScript} from './index';

const test1 = () => 'hello!!!';
const test2 = () => {
    return new Promise((resolve: Function, reject: Function) => {
        resolve('hello!!!');
    });
};

const test3 = () => {
    return new Promise((resolve: Function, reject: Function) => {
        reject('hello!!!');
    });
};

const test4 = () => {
    return new Promise((resolve: Function, reject: Function) => {
        reject(new Error('hello!!!'));
    });
};

const test5 = () => {
    return new Promise((resolve: Function, reject: Function) => {
        JSON.parse('!&@^#');
    });
};

const test6 = (str: string) => {
    return str;
};

const test8 = (pattern: string, obj: any) => {
    return pattern === obj.target;
};

injectScript(document, test1)
    .then((response: any) => {
        document.getElementById('test1').innerHTML = JSON.stringify(response);
    });

injectScript(document, test2)
    .then((response: any) => {
        document.getElementById('test2').innerHTML = JSON.stringify(response);
    });

injectScript(document, test3)
    .then((response: any) => {
        document.getElementById('test3').innerHTML = JSON.stringify('passed');
    })
    .catch((err: any) => {
        document.getElementById('test3').innerHTML = JSON.stringify(err);
    });

injectScript(document, test4)
    .then((response: any) => {
        document.getElementById('test4').innerHTML = JSON.stringify('passed');
    })
    .catch((err: any) => {
        console.log(err);
        document.getElementById('test4').innerHTML = JSON.stringify(err);
    });

injectScript(document, test5)
    .then((response: any) => {
        document.getElementById('test5').innerHTML = JSON.stringify('passed');
    })
    .catch((err: any) => {
        console.log(err);
        document.getElementById('test5').innerHTML = JSON.stringify(err);
    });

injectScript(document, test6, 'hello!!!')
    .then((response: any) => {
        document.getElementById('test6').innerHTML = JSON.stringify(response);
    })
    .catch((err: any) => {
        console.log(err);
        document.getElementById('test6').innerHTML = JSON.stringify(err);
    });

injectScript(document, test6, 'hell\'o!!!')
    .then((response: any) => {
        document.getElementById('test7').innerHTML = JSON.stringify(response);
    })
    .catch((err: any) => {
        console.log(err);
        document.getElementById('test7').innerHTML = JSON.stringify(err);
    });

injectScript(document, test8, 'hell\'o!!!', {target: 'hell\'o!!!'})
    .then((response: any) => {
        document.getElementById('test8').innerHTML = JSON.stringify(response);
    })
    .catch((err: any) => {
        console.log(err);
        document.getElementById('test8').innerHTML = JSON.stringify(err);
    });
