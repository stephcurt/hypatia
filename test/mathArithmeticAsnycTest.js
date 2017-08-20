import {DECIMALS, add, subtract, multiply, divide} from '../src/maths.js';
import {expect} from 'chai';
import rp from 'request-promise';
import {DOMParser} from 'xmldom';
import {Promise} from 'bluebird';

//digits after decimal point + 1 for one's place
const precision = DECIMALS + 1;
const api = 'http://api.wolframalpha.com/v2/query';
//appid from https://developer.wolframalpha.com/
const appid = 'RLT6U6-W7YY6AXP92';
const baseUri = `${api}?appid=${appid}&input=`;
const parser = new DOMParser();
const transform = response => {
    const document = parser.parseFromString(response);
    const result = document.getElementById('Result').getElementsByTagName('plaintext')[0].firstChild.nodeValue;
    return parseFloat(result);
};

describe('Verify Binary',() => {
    it('binary floating point error correction operations results should match decimal results', done => {

        const a = 1.12345;
        const b = 1.01234;

        const createEquationUri = sign => `${baseUri}${precision}+digits+of+${a}${encodeURIComponent(sign)}${b}`;
        const createOptions = operator => ({uri: createEquationUri(operator), transform: transform});
        const verifyResults = operation => answer => Promise.method(() => expect(operation(a, b)).to.equal(answer));

        rp(createOptions('+'))
            .then(verifyResults(add))
            .then(() => rp(createOptions('-')))
            .then(verifyResults(subtract))
            .then(() => rp(createOptions('*')))
            .then(verifyResults(multiply))
            .then(() => rp(createOptions('/')))
            .then(verifyResults(divide))
            .then(() => done())
            .catch(err => done(err));

    });
});

describe('Verify Ternary', () => {
    it('ternary floating point error correction operations results should match decimal results', done => {

        const a = 1.12345;
        const b = 1.01234;
        const c = 1.00123;

        const createEquationUri = sign => `${baseUri}${precision}+digits+of+${a}${encodeURIComponent(sign)}${b}${encodeURIComponent(sign)}${c}`;
        const createOptions = operator => ({uri: createEquationUri(operator), transform: transform});
        const verifyResults = operation => answer => Promise.method(() => expect(operation(a, b, c), `${operation.name} ${operation(a, b, c)}`).to.equal(answer));

        rp(createOptions('+'))
            .then(verifyResults(add))
            .then(() => rp(createOptions('-')))
            .then(verifyResults(subtract))
            .then(() => rp(createOptions('*')))
            .then(verifyResults(multiply))
            .then(() => rp(createOptions('/')))
            .then(verifyResults(divide))
            .then(() => done())
            .catch(err => done(err));

    });
});