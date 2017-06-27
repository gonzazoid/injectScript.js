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

    it('with passing params without error', (testDone) => {
        browser.findElement(By.id('test6')).getText().then((response:string) => {
            expect('hello!!!').to.eql(JSON.parse(response));
            testDone();
        });
    });

    it('with passing params with quotas without error', (testDone) => {
        browser.findElement(By.id('test7')).getText().then((response:string) => {
            expect('hell\'o!!!').to.eql(JSON.parse(response));
            testDone();
        });
    });

    it('with passing params with quotas, two params, without error', (testDone) => {
        browser.findElement(By.id('test8')).getText().then((response:string) => {
            expect(true).to.eql(JSON.parse(response));
            testDone();
        });
    });
});
