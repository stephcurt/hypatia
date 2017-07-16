const SIGDIG = 5;

export const KAPPA = 0.552284749830793398402251632279597438092895833835930764235;
export const GAMMA = 6.67408E-11;

/**
 * Get the current value to the precision defined in SIGDIG.
 * @param value
 * @returns {number}
 */
const precise = (value) => parseFloat(value.toFixed(SIGDIG));
/**
 * Move decimal point past significant digit point to perform floating point corrected arithmetic operation.
 * @param value
 * @returns {number}
 */
const bigify = (value) => precise(value) * Math.pow(10, SIGDIG);
/**
 * Move decimal point back to original position after floating point corrected arithmetic operation.
 * @param value
 * @returns {number}
 */
const smallify = (value) => precise(value / Math.pow(10, SIGDIG));

/**
 * Maintain precision to while performing addition operation, correcting for floating point arithmetic errors.
 * One argument returns arg+0
 * Two or more arguments returns arg1+arg2+...^arg(n)
 * @param {...number} values
 * @returns {number}
 */
export const add = (...values) => values.reduce((acc, cur) => smallify(bigify(acc) + bigify(cur)), 0);
/**
 * Maintain precision to while performing subtraction operation, correcting for floating point arithmetic errors.
 * One argument returns arg-0
 * Two or more arguments returns arg1-arg2-...^arg(n)
 * @param {...number} values
 * @returns {number}
 */
export const subtract = (...values) => values.reduce((acc, cur, i) => i === 0 ? cur : smallify(bigify(acc) - bigify(cur)), 0);
/**
 * Maintain precision to while performing multiplication operation, correcting for floating point arithmetic errors.
 * One argument returns arg*1
 * Two or more arguments returns arg1*arg2*...^arg(n)
 * @param {...number} values
 * @returns {number}
 */
export const multiply = (...values) => values.reduce((acc, cur) => smallify(bigify(acc) * cur), 1);
/**
 * Maintain precision to while performing division operation, correcting for floating point arithmetic errors.
 * One argument returns arg/1
 * Two or more arguments returns arg1/arg2/...^arg(n)
 * @param {...number} values
 * @returns {number}
 */
export const divide = (...values) => values.reduce((acc, cur, i) => i === 0 ? cur : smallify(bigify(acc) / cur), 0);
/**
 * Maintain precision to while performing power operation.
 * One argument returns arg^1 power
 * Two or more arguments returns arg1^arg2...^arg(n) power
 * @param {...number} values
 * @returns {number}
 */
export const pow = (...values) => values.reverse().reduce((acc, cur, i) => precise(Math.pow(precise(cur), acc)), 1);

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
export const e2 = (value) => pow(value, 2);
/**
 * Get the cube of a given value.
 * @param {number} value
 * @returns {number}
 */
export const e3 = (value) => pow(value, 3);
/**
 * Get the negative of a given value.
 * @param {number} value
 * @returns {number}
 */
export const neg = (value) => multiply(value, -1);

/**
 * Get the change (delta) between two values.
 * @param {value} a
 * @param {value} b
 * @returns {number}
 */
export const delta = (a, b) => subtract(b, a);
/**
 * Get linear interpolation value.
 * @param {number} a - starting point value
 * @param {number} b - control point value
 * @param {number} c - ending point value
 * @param {number} t - percentage distance between start and end value
 * @returns {number}
 */
const lerp1 = (a, b, t) => add(a, multiply(delta(a, b), t));
/**
 * Get linear interpolation point.
 * @param {Object} start - starting point
 * @param {number} start.x x0
 * @param {number} start.y y0
 * @param {Object} end - ending point
 * @param {number} end.x x1
 * @param {number} end.y y1
 * @param {number} t - percentage distance between start and end point
 * @returns {number}
 */
export const lerp2 = ({x: x0, y: y0}, {x: x1, y: y1}, t) => ({x: lerp1(x0, x1, t), y: lerp1(y0, y1, t)});

/**
 * Get quadratic bezier interpolation value given a control value.
 * @param {number} a - starting point value
 * @param {number} b - control point value
 * @param {number} c - ending point value
 * @param {number} t - percentage distance between start and end value
 * @returns {number}
 */
const qbez1 = (a, b, c, t) =>
    add(
        multiply(a, e2(inv(t))),
        multiply(b, e2(t)),
        multiply(c,multiply(2,subtract(t, e2(t)))));
/**
 * Get quadratic bezier interpolation point given a control point.
 * @param {Object} start - starting point
 * @param {number} start.x x0
 * @param {number} start.y y0
 * @param {Object} control - control point
 * @param {number} control.x cx
 * @param {number} control.y cy
 * @param {Object} end - ending point
 * @param {number} end.x x1
 * @param {number} end.y y1
 * @param {number} t - percentage distance between start and end point
 * @returns {number}
 */
export const qbez2 = ({x: x0, y: y0}, {x: cx, y: cy}, {x: x1, y: y1}, t) => ({x: qbez1(x0, x1, cx, t), y: qbez1(y0, y1, cy, t)});

/**
 * Get cubic bezier interpolation value given two control values.
 * @param {number} a - starting value
 * @param {number} b - first control value
 * @param {number} c - second control value
 * @param {number} d - ending value
 * @param {number} t - percentage distance between start and end value
 * @returns {number}
 */
const cbez1 = (a, b, c, d, t) =>
    add(a,
        multiply(neg(3), a, t),
        multiply(3, a, e2(t)),
        multiply(neg(a), e3(t)),
        multiply(3, b, t),
        multiply(neg(6), b, e2(t)),
        multiply(3, b, e3(t)),
        multiply(3, c, e2(t)),
        multiply(neg(3), c, e3(t)),
        multiply(d, e3(t)));

/**
 * Get cubic bezier interpolation point given two control points.
 * @param {Object} start - starting point
 * @param {number} start.x x0
 * @param {number} start.y y0
 * @param {Object} control1 - first control point
 * @param {number} control1.x cx0
 * @param {number} control1.y cy0
 * @param {Object} control2 - second control point
 * @param {number} control2.x cx1
 * @param {number} control2.y cy1
 * @param {Object} end - ending point
 * @param {number} end.x x1
 * @param {number} end.y y1
 * @param {number} t - percentage distance between start and end point
 * @returns {number}
 */
export const cbez2 = ({x: x0, y: y0}, {x: cx0, y: cy0}, {x: cx1, y: cy1}, {x: x1, y: y1}, t) =>
    ({x: cbez1(x0, cx0, cx1, x1, t), y: cbez1(y0, cy0, cy1, y1, t)});