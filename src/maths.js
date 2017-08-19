import * as Config from './config.js';

/**
 * @module Maths
 */

/**
 * @enum {number} Sign
 * @property {number} POS
 * @property {number} NEG
 */
export const Sign = {
    POS: 1,
    NEG: -1
};

/**
 * Get the current value to the precision defined in SIGDIG.
 * @param value
 * @returns {number}
 */
const precise = value => smallify(bigify(value));
/**
 * Move decimal point past significant digit point to perform floating point corrected arithmetic operation.
 * @param value
 * @returns {number}
 */
const bigify = value => parseInt(value * Math.pow(10, Config.DIGITS));
/**
 * Move decimal point back to original position after floating point corrected arithmetic operation.
 * @param value
 * @returns {number}
 */
const smallify = value => parseInt(value) / Math.pow(10, Config.DIGITS);

/**
a * Maintain precision while performing addition operation, correcting for floating point arithmetic errors.
 * One argument returns arg+0
 * Two or more arguments returns arg1+arg2+...^arg(n)
 * @param {...number} values
 * @returns {number}
 */
export const add = (...values) => values.reduce((acc, cur) => smallify(bigify(acc) + bigify(cur)), 0);
/**
 * Maintain precision while performing subtraction operation, correcting for floating point arithmetic errors.
 * One argument returns arg-0
 * Two or more arguments returns arg1-arg2-...^arg(n)
 * @param {...number} values
 * @returns {number}
 */
export const subtract = (...values) => values.reduce((acc, cur, i) => i === 0 ? cur : smallify(bigify(acc) - bigify(cur)), 0);
/**
 * Maintain precision while performing multiplication operation, correcting for floating point arithmetic errors.
 * One argument returns arg*1
 * Two or more arguments returns arg1*arg2*...^arg(n)
 * @param {...number} values
 * @returns {number}
 */
export const multiply = (...values) => values.reduce((acc, cur) => smallify(bigify(acc) * precise(cur)), 1);
/**
 * Maintain precision while performing division operation, correcting for floating point arithmetic errors.
 * One argument returns arg/1
 * Two or more arguments returns arg1/arg2/...^arg(n)
 * @param {...number} values
 * @returns {number}
 */
export const divide = (...values) => values.reduce((acc, cur, i) => i === 0 ? cur : smallify(bigify(acc) / precise(cur)), 0);
/**
 * Maintain precision while performing power operation.
 * One argument returns arg^1 power
 * Two or more arguments returns arg1^arg2...^arg(n) power
 * @param {...number} values
 * @returns {number}
 */
export const pow = (...values) => values.reverse().reduce((acc, cur, i) => precise(cur ** precise(acc)), 1);
/**
 * Maintain precision while performing arc cosine (inverse cosine) operation.
 * @param {number} value
 * @returns {number}
 */
export const acos = value => precise(Math.acos(precise(value)));
/**
 * Maintain precision while performing cosine operation.
 * @param {number} value
 * @returns {number}
 */
export const cos = value => precise(Math.cos(precise(value)));
/**
 * Maintain precision while performing arc sine operation.
 * @param {number} value
 * @returns {number}
 */
export const asin = value => precise(Math.asin(precise(value)));
/**
 * Maintain precision while performing sine operation.
 * @param {number} value
 * @returns {number}
 */
export const sin = value => precise(Math.sin(precise(value)));
/**
 * Maintain precision while performing tangent operation.
 * @param {number} value
 * @returns {number}
 */
export const tan = value => precise(Math.tan(precise(value)));
/**
 * Maintain precision while performing arc tangent (inverse tangent) operation.
 * @param {number} value
 * @returns {number}
 */
export const atan = value => precise(Math.atan(precise(value)));
/**
 * Maintain precision while performing arc cosine (inverse cosine) operation.
 * @param {number} y
 * @param {number} x
 * @returns {number}
 */
export const atan2 = (y, x) => precise(Math.atan2(precise(y), precise(x)));

/**
 * Get the additive inverse of given subtrahend.
 * @param {number} value - subtrahend
 * @param {number} [minuend=1] - minuend defaults to 1
 * @returns {number}
 */
export const inv = (value, minuend = 1) => subtract(minuend, value);
/**
 * Get the square of a given value.
 * @param {number} value
 * @returns {number}
 */
export const e2 = value => pow(value, 2);
/**
 * Get the cube of a given value.
 * @param {number} value
 * @returns {number}
 */
export const e3 = value => pow(value, 3);
/**
 * Get the negative of a given value.
 * @param {number} value
 * @returns {number}
 */
export const neg = value => multiply(value, -1);
/**
 * Get the change (delta) between two values.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const delta = (a, b) => subtract(b, a);