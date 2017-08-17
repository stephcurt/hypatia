import { add, subtract, multiply, divide } from '../src/maths.js';
import { DIGITS } from '../src/config.js';
import { expect } from 'chai';
import request from 'request-promise';
import xml2js from 'xml2js-es6-promise';

describe('Precision', () => {
    it('operations should result in a number', () => {
        expect(add(1,2)).to.be.a('number');
        expect(subtract(2,1)).to.be.a('number');
        expect(multiply(2,2)).to.be.a('number');
        expect(divide(3,2)).to.be.a('number');
    });
    it('operations should be precise to the significant digit', () => {
        const a = 1.1234567890123457;
        const b = 1.0123456789012344;
        const countPrecision = n => String(n).split('.')[1].length;

        expect(countPrecision(add(a,b))).to.equal(DIGITS);
        expect(countPrecision(subtract(a,b))).to.equal(DIGITS);
        expect(countPrecision(multiply(a,b))).to.equal(DIGITS);
        expect(countPrecision(divide(a,b))).to.equal(DIGITS);
    });
    it('floating point error correction operations results should match decimal results', () => {
        const a = 1.1234567890123457;
        const b = 1.0123456789012344;

        const api = 'http://api.wolframalpha.com/v2/query';
        //appid from https://developer.wolframalpha.com/
        const appid = 'RLT6U6-W7YY6AXP92';

        //addition
        request({method: 'GET', uri: `${api}?input=${DIGITS-1}+digits+of+${a}%2B${b}&appid=${appid}`})
            .then(response => xml2js(response))
            .then(result => console.log(result))
            .catch(err => console.log(err));

        //subtraction
        request({method: 'GET', uri: `${api}?input=${DIGITS-1}+digits+of+${a}-${b}&appid=${appid}`})
            .then(response => xml2js(response))
            .then(result => console.log(result))
            .catch(err => console.log(err));

        //multiplication
        request({method: 'GET', uri: `${api}?input=${DIGITS-1}+digits+of+${a}%2A${b}&appid=${appid}`})
            .then(response => xml2js(response))
            .then(result => console.log(result))
            .catch(err => console.log(err));

        //division
        request({method: 'GET', uri: `${api}?input=${DIGITS-1}+digits+of+${a}%2F${b}&appid=${appid}`})
            .then(response => xml2js(response))
            .then(result => console.log(result))
            .catch(err => console.log(err));

    });
});

describe('Addition', () => {
    it('binary operations should calculate 1 + 1, -1 + 1, -1 + -1 correctly', () => {
        const simpleAdditionResult = 2;
        expect(add(1,1)).to.equal(simpleAdditionResult);
        const negativeAdditionResult = 0;
        expect(add(-1,1)).to.equal(negativeAdditionResult);
        const doubleNegativeAdditionResult = -2;
        expect(add(-1,-1)).to.equal(doubleNegativeAdditionResult);
    });
    it('ternary operations should calculate 1 + 1 + 1, -1 + 1 + -1, -1 + -1 + -1 correctly', () => {
        const simpleAdditionResult = 3;
        expect(add(1,1,1)).to.equal(simpleAdditionResult);
        const negativeAdditionResult = -1;
        expect(add(-1,1,-1)).to.equal(negativeAdditionResult);
        const doubleNegativeAdditionResult = -3;
        expect(add(-1,-1,-1)).to.equal(doubleNegativeAdditionResult);
    });
    it('floating point error correction operations should calculate .1 + .3, -.1 + .3, -.1 + .3 + -.2 correctly', () => {
        const simpleAdditionResult = .4;
        expect(add(.1,.3)).to.equal(simpleAdditionResult);
        const negativeAdditionResult = .2;
        expect(add(-.1,.3)).to.equal(negativeAdditionResult);
        const chainAdditionResult = 0;
        expect(add(-.1,.3,-.2)).to.equal(chainAdditionResult);
    });
});

describe('Subtraction', () => {
    it('binary operations should calculate 1 - 1, -1 - 1, -1 - -1 correctly', () => {
        const simpleSubtractionResult = 0;
        expect(subtract(1,1)).to.equal(simpleSubtractionResult);
        const negativeSubtractionResult = -2;
        expect(subtract(-1,1)).to.equal(negativeSubtractionResult);
        const doubleNegativeSubtractionResult = 0;
        expect(subtract(-1,-1)).to.equal(doubleNegativeSubtractionResult);
    });
    it('ternary operations should calculate 1 - 1 - 1, -1 - 1 - -1, -1 - -1 - -1 correctly', () => {
        const simpleSubtractionResult = -1;
        expect(subtract(1, 1, 1)).to.equal(simpleSubtractionResult);
        const negativeSubtractionResult = -1;
        expect(subtract(-1, 1, -1)).to.equal(negativeSubtractionResult);
        const doubleNegativeSubtractionResult = 1;
        expect(subtract(-1, -1, -1)).to.equal(doubleNegativeSubtractionResult);
    });
    it('floating point error correction operations should calculate .1 - .3, -.1 - .3, -.1 - .2 - -.3 correctly', () => {
        const simpleSubtractionResult = -.2;
        expect(subtract(.1,.3)).to.equal(simpleSubtractionResult);
        const negativeSubtractionResult = -.4;
        expect(subtract(-.1,.3)).to.equal(negativeSubtractionResult);
        const chainSubtractionResult = 0;
        expect(subtract(-.1,.2,-.3)).to.equal(chainSubtractionResult);
    });
});