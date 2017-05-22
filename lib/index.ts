/// <reference path='index.d.ts' />

import {sprintf} from 'gonzazoid.sprintf.js';
import {serializeError} from './serializeError';

export const injectScript = function(document: Document, func:Function, params?: any){

    const MutationObserver = (document.defaultView as any).MutationObserver;
    const Promise = (document.defaultView as any).Promise;

    return new Promise(function(resolve: Function, reject: Function){

        const head = document.getElementsByTagName('head')[0];

        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.defer = true;
        script.async = true;

        const argv = params ? (params.length ? params : [params]) : [];

        const executor = function(){
            const cScript = document.currentScript;
            const func = /%funcSource%/;
            const serializeError = /%serializeErrorSource%/;
            const argv = JSON.parse('/%argvSource%/');
            try {
                (cScript as any).__response = (func as any)(...argv);
            } catch(err) {
                (cScript as any).__response = new Promise(function(resolve: Function, reject: Function){reject(err);});
            };
            Promise.all([(cScript as any).__response])
                .then((values: any[]) => {
                    console.log('promise callback', cScript, values);
                    cScript.setAttribute('data-response', JSON.stringify(values[0]));
                    cScript.setAttribute('data-status', 'fulfilled');
                }, (err: any) => {
                    // что за ошибка?
                    if('object' === typeof err && err instanceof Error){
                        cScript.setAttribute('data-type', 'error');
                        cScript.setAttribute('data-response', JSON.stringify((serializeError as any)(err)));
                    }else{
                        cScript.setAttribute('data-response', JSON.stringify(err));
                    }
                    cScript.setAttribute('data-status', 'rejected');
                });
        };

        const src = sprintf(executor.toString(), {
            funcSource: func.toString()
           ,serializeErrorSource: serializeError.toString()
           ,argvSource: JSON.stringify(argv)
        });

        script.text = `(${src})();`;

        const observer = new MutationObserver(function (mutations: MutationRecord[]) {
            mutations.forEach((mutation)=>{
                // TODO attributeNameSpace - надо бы разобраться
                if(mutation.type === 'attributes' && mutation.attributeName && mutation.attributeName === 'data-status'){
                    const status = (mutation.target as HTMLElement).getAttribute('data-status');
                    const result = JSON.parse((mutation.target as HTMLElement).getAttribute('data-response'));
                    const type = (mutation.target as HTMLElement).getAttribute('data-type');

                    script.parentElement.removeChild(script);
                    switch(status){
                        case 'fulfilled':
                            resolve(result);
                            break;
                        case 'rejected':
                            if(!type || type !== 'error'){
                                reject(result);
                            }else{
                                const err = new Error();
                                reject(Object.assign(err, result));
                            }
                            break;
                        default:
                            reject(new Error('injectScript: unknown response'));
                    }
                }
                observer.disconnect();
            });
        });
        observer.observe(script, {attributes: true});
        head.appendChild(script);
    });
};
