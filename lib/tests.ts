declare var describe: Mocha.IContextDefinition;

import { expect } from 'chai';
import {injectScript} from './index';
import * as webdriver from 'selenium-webdriver';

const By = webdriver.By;
let browser: any;

describe('injectScript', function(){
    this.timeout(5000);
    before(function() {
        browser = new webdriver
           .Builder()
           .withCapabilities({
               browserName: 'chrome'
            })
           .build();

        return browser.get(`file://${__dirname}/test.html`);
    });

    after(function() {
        return browser.quit();
    });

    it('just string', (testDone) => {
        browser.findElement(By.id('test1')).getText().then((response:string) => {
            expect('hello!!!').to.eql(JSON.parse(response));
            testDone();
        });
    });

    it('promised string', (testDone) => {
        browser.findElement(By.id('test2')).getText().then((response:string) => {
            expect('hello!!!').to.eql(JSON.parse(response));
            testDone();
        });
    });

    it('reject with scalar', (testDone) => {
        browser.findElement(By.id('test3')).getText().then((response:string) => {
            expect('hello!!!').to.eql(JSON.parse(response));
            testDone();
        });
    });

    it('reject with error', (testDone) => {
        browser.findElement(By.id('test4')).getText().then((response:string) => {
            expect({ name: 'Error', message: 'hello!!!' }).to.eql(JSON.parse(response));
            testDone();
        });
    });

    it('error while executed', (testDone) => {
        browser.findElement(By.id('test5')).getText().then((response:string) => {
            expect({ name: 'SyntaxError',
                    message: 'Unexpected token ! in JSON at position 0' }).to.eql(JSON.parse(response));
            testDone();
        });
    });
});
