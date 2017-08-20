/**
 * @module Maths
 */

/**
 * Default number of decimal places for an operation to be accurate to.
 * @type {number}
 */
export const DECIMALS = 5;

/**
 * Number of decimal places for an operation to be accurate to.
 * @constant {Symbol} Decimals
 */
export const Decimals = {
    [1]: Symbol(1),
    [2]: Symbol(2),
    [3]: Symbol(3),
    [4]: Symbol(4),
    [5]: Symbol(5),
    [6]: Symbol(6),
    [7]: Symbol(7),
    [8]: Symbol(8),
    [9]: Symbol(9),
    [10]: Symbol(10),
    [11]: Symbol(11),
    [12]: Symbol(12),
    [13]: Symbol(13),
    [14]: Symbol(14)
};

/**
 * @constant {number} Sign
 * @property {number} POS
 * @property {number} NEG
 */
export const Sign = {
    POS: 1,
    NEG: -1
};

/**
 * Creates a function that accepts arguments of func and either invokes func returning its result, if at least arity number of arguments have been provided, or returns a function that accepts the remaining func arguments, and so on. The arity of func may be specified if func.length is not sufficient.
 * @param {Function} fn
 * @param {...*} args1
 */
const curry = (fn, ...args1) => (...args2) => fn(...args1, ...args2);
/**
 * Perfoms right-to-left function composition. The rightmost function may have any arity; the remaining functions must be unary.
 * @param {...Function} fns
 */
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
/**
 * Performs left-to-right function composition. The leftmost function may have any arity; the remaining functions must be unary.
 * @param {...Function} fns
 */
const pipe = (...fns) => compose.apply(compose, fns.reverse());

/**
 * Parse single value to integer.
 * @param {number} value
 * @return {number}
 */
const parseIntUnary = value => parseInt(value);
/**
 * Move the decimal point to the right based on given number of decimal places.
 * @param {number} value
 * @param {number} [decimals]
 * @return {number}
 */
const bigify = (value, decimals = DECIMALS) => value * Math.pow(10, decimals);
/**
 * Move the decimal point to the left based on a given number of decimal places.
 * @param {number} value
 * @param {number} [decimals]
 * @return {number}
 */
const smallify = (value, decimals = DECIMALS) => value / Math.pow(10, decimals);

/**
 * Parses result of {@link Maths#bigify} as an integer.
 * @param {number} value
 * @param {number} [decimals]
 * @return {number}
 */
const bigifyToInt = pipe(bigify, parseIntUnary);
/**
 * Parses result of {@link Maths#smallify} as an integer.
 * @param {number} value
 * @param {number} [decimals]
 * @return {number}
 */
const smallifyFromInt = pipe(parseIntUnary, smallify);
/**
 * Returns given value to specified decimal accuracy.
 * @param {number} value
 * @param {number} [decimals]
 * @return {number}
 */
const precise = pipe(bigifyToInt, smallifyFromInt);

/**
 * Finds {@link Maths#Decimals} in arguments and prepends to front of arguments list.
 * @param {function} fn
 * @return {function(number, ...number)}
 */
const decimalify = fn => {
    return (...values) => {
        const symbol = values.find(value => typeof value === 'symbol');
        const decimals = Object.keys(Decimals).find(key => Decimals[key] === symbol);
        values = values.filter(value => typeof value !== 'symbol');
        return Reflect.apply(fn, null, [decimals, ...values]);
    };
};

/**
 * Returns sum of given arguments to a specified accuracy.
 * @param {number} [decimals]
 * @param {number} a
 * @param {number} b
 */
export const plus = curry((decimals, a, b) => smallifyFromInt(bigifyToInt(a, decimals) + bigifyToInt(b, decimals), decimals));
/**
 * Maintain decimal accuracy while performing addition operation, correcting for floating point arithmetic errors.
 * One argument returns arg+0
 * Two or more arguments returns arg1+arg2+...^arg(n)
 * @param {Maths#Decimals} [decimals]
 * @param {...number} values
 * @returns {number}
 */
export const add = decimalify((decimals, ...values) => values.reduce((acc, cur) => plus(decimals, acc, cur), 0));
/**
 * Returns difference between given arguments to a specified accuracy.
 * @param {number} [decimals]
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const minus = curry((decimals, a, b) => smallifyFromInt(bigifyToInt(a) - bigifyToInt(b), decimals));
/**
 * Maintain decimal accuracy while performing subtraction operation, correcting for floating point arithmetic errors.
 * One argument returns arg-0
 * Two or more arguments returns arg1-arg2-...^arg(n)
 * @param {Maths#Decimals} [decimals]
 * @param {...number} values
 * @returns {number}
 */
export const subtract = decimalify((decimals, ...values) => values.reduce((acc, cur, i) => i === 0 ? cur : minus(decimals, acc, cur), 0));
/**
 * Returns product of given arguments to a specified accuracy.
 * @param {number} [decimals]
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const times = curry((decimals, a, b) => smallifyFromInt(bigifyToInt(a, decimals) * precise(b, decimals), decimals));
/**
 * Maintain decimal accuracy while performing multiplication operation, correcting for floating point arithmetic errors.
 * One argument returns arg*1
 * Two or more arguments returns arg1*arg2*...^arg(n)
 * @param {Maths#Decimals} [decimals]
 * @param {...number} values
 * @returns {number}
 */
export const multiply = decimalify((decimals, ...values) => values.reduce((acc, cur) => times(decimals, acc, cur), 1));
/**
 * Returns quotient of given arguments to a specified accuracy.
 * @param {number} [decimals]
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const over = curry((decimals, a, b) => smallifyFromInt(bigifyToInt(a, decimals) / precise(b, decimals), decimals));
/**
 * Maintain decimal accuracy while performing division operation, correcting for floating point arithmetic errors.
 * One argument returns arg/1
 * Two or more arguments returns arg1/arg2/...^arg(n)
 * @param {Maths#Decimals} [decimals]
 * @param {...number} values
 * @returns {number}
 */
export const divide = decimalify((decimals, ...values) => values.reduce((acc, cur, i) => i === 0 ? cur : over(decimals, acc, cur), 0));
/**
 * Returns power of given arguments to a specified accuracy.
 * @param {number} [decimals]
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const exp = curry((decimals, a, b) => precise(a ** precise(b, decimals), decimals));
/**
 * Maintain decimal accuracy while performing power operation.
 * One argument returns arg^1 power
 * Two or more arguments returns arg1^arg2...^arg(n) power
 * @param {Maths#Decimals} [decimals]
 * @param {...number} values
 * @returns {number}
 */
export const pow = decimalify((decimals, ...values) => values.reverse().reduce((acc, cur) => exp(decimals, cur, acc), 1));
/**
 * Maintain decimal accuracy while performing arc cosine (inverse cosine) operation.
 * @param {number} value
 * @param {number} [decimals]
 * @returns {number}
 */
export const acos = curry((value, decimals) => precise(Math.acos(precise(value, decimals)), decimals));
/**
 * Maintain decimal accuracy while performing cosine operation.
 * @param {number} value
 * @param {number} [decimals]
 * @returns {number}
 */
export const cos = curry((value, decimals) => precise(Math.cos(precise(value, decimals)), decimals));
/**
 * Maintain decimal accuracy while performing arc sine operation.
 * @param {number} value
 * @param {number} [decimals]
 * @returns {number}
 */
export const asin = curry((value, decimals) => precise(Math.asin(precise(value, decimals)), decimals));
/**
 * Maintain decimal accuracy while performing sine operation.
 * @param {number} value
 * @param {number} [decimals]
 * @returns {number}
 */
export const sin = curry((value, decimals) => precise(Math.sin(precise(value, decimals)), decimals));
/**
 * Maintain decimal accuracy while performing tangent operation.
 * @param {number} value
 * @param {number} [decimals]
 * @returns {number}
 */
export const tan = curry((value, decimals) => precise(Math.tan(precise(value, decimals)), decimals));
/**
 * Maintain decimal accuracy while performing arc tangent (inverse tangent)
 * @param {number} value
 * @param {number} [decimals]
 * @returns {number}
 */
export const atan = curry((value, decimals) => precise(Math.atan(precise(value, decimals)), decimals));
/**
 * Maintain decimal accuracy while performing arc cosine (inverse cosine) operation.
 * @param {number} y
 * @param {number} x
 * @param {number} [decimals]
 * @returns {number}
 */
export const atan2 = curry((y, x, decimals) => precise(Math.atan2(precise(y, decimals), precise(x, decimals)), decimals));

/**
 * Get the additive inverse of given subtrahend.
 * @param {number} value - subtrahend
 * @param {number} [minuend=1] - minuend defaults to 1
 * @param {number} [decimals]
 * @returns {number}
 */
export const inv = curry((value, minuend = 1, decimals) => minus(decimals, minuend, value));
/**
 * Get the square of a given value.
 * @param {number} value
 * @param {number} [decimals]
 * @returns {number}
 */
export const e2 = curry((value, decimals) => exp(decimals, value, 2));
/**
 * Get the cube of a given value.
 * @param {number} value
 * @param {number} [decimals]
 * @returns {number}
 */
export const e3 = curry((value, decimals) => exp(decimals, value, 3));
/**
 * Get the negative of a given value.
 * @param {number} value
 * @param {number} [decimals]
 * @returns {number}
 */
export const neg = curry((value, decimals) => times(decimals, value, -1));
/**
 * Get the change (delta) between two values.
 * @param {number} a
 * @param {number} b
 * @param {number} [decimals]
 * @returns {number}
 */
export const delta = curry((a, b, decimals) => minus(decimals, b, a));