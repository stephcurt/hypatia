import * as Maths from './maths.js';

/**
 * @module Geometry
 */

/**
 * Approximation of 4 * ((√(2) - 1) / 3) used to generate control points for a cubic bezier curve ellipse approximation.
 * @type {number}
 */
export const KAPPA = 0.552284749830793398402251632279597438092895833835930764235;

//@todo consider changing enum-like object to ES6 maps

/**
 * Symbols used in geometric equations.
 * @enum {Symbol} Symbol
 * @property r - radius distance (spherical coordinates)
 * @property θ - polar angle (spherical coordinates)
 * @property φ - azimuth angle (spherical coordinates)
 * @property theta - Geometry.Symbols.θ
 * @property phi - Geometry.Symbols.φ
 */
export const Symbols = {
    r: Symbol('r'),
    θ: Symbol('θ'),
    φ: Symbol('φ'),
    theta: this.θ,
    phi: this.φ
};

/**
 * Space dimensions in n-dimensional geometric settings.
 * @enum {Symbol} Dimension
 * @property 1 - the first space dimension
 * @property 2 - the second space dimension
 * @property 3 - the third space dimension
 */
export const Dimension = {
    [1]: Symbol(1),
    [2]: Symbol(2),
    [3]: Symbol(3)
};

/**
 * Names of the coordinate axes in n-dimensional coordinate systems.
 * @enum {Symbol} Axis
 * @property x - first coordinate axis in the cartesian coordinate system
 * @property y - second coordinate axis in the cartesian coordinate system
 * @property z - third coordinate axis in the cartesian coordinate system
 * @property U - first coordinate axis in the galactic coordinate system
 * @property V - second coordinate axis in the galactic coordinate system
 * @property W - third coordinate axis in the galactic coordinate system
 */
export const Axis = {
    x: Symbol('x'),
    y: Symbol('y'),
    z: Symbol('y'),
    U: Symbol('U'),
    V: Symbol('V'),
    W: Symbol('W')
};

/**
 * Orientation of the coordinate system. Determines the direction of the axes.
 * @enum {{Maths:Sign}} Orientation
 * @property right - positive orientation
 * @property left - negative orientation
 */
export const Orientation = {
    RIGHT: Maths.Sign.POS,
    LEFT: Maths.Sign.NEG
};

/**
 * @typedef {Object} Point
 * @property {number} Point[Axis.x] - distance from 0 on the cartesian first dimensional axis
 * @property {number} Point[Axis.y] - distance from 0 on the cartesian second dimensional axis
 * @property {?number} Point[Axis.z] - distance from 0 on the cartesian third dimensional axis
 * @property {number} Point[Axis.U] - distance from 0 on the galactic first dimensional axis
 * @property {number} Point[Axis.V] - distance from 0 on the galactic second dimensional axis
 * @property {?number} Point[Axis.W] - distance from 0 on the galactic third dimensional axis
 * @property {Dimension} Point.dimensions - returns the type of dimensional representation
 * @property {number} Point[Symbols.r] - the radial distance of that point from a fixed origin in the spherical coordinate system
 * @property {number} Point[Symbols.θ] - the polar angle measured from a fixed zenith direction in the spherical coordinate system
 * @property {number} Point[Symbols.φ] - the azimuth angle measured from the orthogonal to the reference plane in the spherical coordinate system
 * @property {Orientation} Point.rotation - the direction of rotation about the origin
 */

/**
 * Factory that creates a Geometry:Point object.
 * @param {number} x
 * @param {number} y
 * @param {?number} z
 * @param {Orientation} orientation
 * @returns {typeof Point}
 */
export const pointFactory = (x, y, z = null, orientation  = Orientation.RIGHT) => {
    return {
        [Axis.x]: x,
        [Axis.y]: y,
        [Axis.z]: z,
        get [Axis.U]() {return this[Axis.x];},
        get [Axis.V]() {return this[Axis.y];},
        get [Axis.W]() {return this[Axis.z];},
        get dimensions() {return this[Axis.z] ? Dimension[1] : this[Axis.y] ? Dimension[2]  : Dimension[3];},
        get [Symbols.r]() {return Maths.pow(Maths.add(Maths.pow(this[Axis.x]),Maths.pow(this[Axis.y]),Maths.pow(this[Axis.z])), .5);},
        get [Symbols.θ]() {return Maths.acos(Maths.divide(this[Axis.z], this[Symbols.r]));},
        get [Symbols.φ]() {return Maths.atan(Maths.divide(this[Axis.y], this[Axis.z]));},
        orientation,
        get rotation() {return this.orientation;},
        set rotation(value) {this.orientation = value;}
    };
};

/**
 * Get linear interpolation value.
 * @param {number} a - starting point value
 * @param {number} b - control point value
 * @param {number} t - between 0 and 1
 * @returns {number}
 */
const lerp1 = (a, b, t) => Maths.add(a, Maths.multiply(Maths.delta(a, b), t));
/**
 * Get linear interpolation point.
 * @param {number} x0 - start point x value
 * @param {number} y0 - start point y value
 * @param {number} x1 - end point x value
 * @param {number} y1 - end point y value
 * @param {number} t - between 0 and 1
 * @returns {number}
 */
export const lerp2 = ({x: x0, y: y0}, {x: x1, y: y1}, t) => ({x: lerp1(x0, x1, t), y: lerp1(y0, y1, t)});

/**
 * Get quadratic bezier interpolation value given a control value.
 * @param {number} a - start point value
 * @param {number} b - control point value
 * @param {number} c - end point value
 * @param {number} t - between 0 and 1
 * @returns {number}
 */
const qbez1 = (a, b, c, t) =>
    Maths.add(
        Maths.multiply(a, Maths.e2(Maths.inv(t))),
        Maths.multiply(b, Maths.e2(t)),
        Maths.multiply(c, Maths.multiply(2,Maths.subtract(t, Maths.e2(t)))));
/**
 * Get quadratic bezier interpolation point given a control point.
 * @param {number} x0 - start point x value
 * @param {number} y0 - start point y value
 * @param {number} cx - control point x value
 * @param {number} cy - control point y value
 * @param {number} x1 - end point x value
 * @param {number} y1 - end point y value
 * @param {number} t - between 0 and 1
 * @returns {number}
 */
export const qbez2 = ({x: x0, y: y0}, {x: cx, y: cy}, {x: x1, y: y1}, t) => ({x: qbez1(x0, x1, cx, t), y: qbez1(y0, y1, cy, t)});

/**
 * Get cubic bezier interpolation value given two control values.
 * @param {number} a - start value
 * @param {number} b - first control value
 * @param {number} c - second control value
 * @param {number} d - end value
 * @param {number} t - between 0 and 1
 * @returns {number}
 */
const cbez1 = (a, b, c, d, t) =>
    Maths.add(a,
        Maths.multiply(Maths.neg(3), a, t),
        Maths.multiply(3, a, Maths.e2(t)),
        Maths.multiply(Maths.neg(a), Maths.e3(t)),
        Maths.multiply(3, b, t),
        Maths.multiply(Maths.neg(6), b, Maths.e2(t)),
        Maths.multiply(3, b, Maths.e3(t)),
        Maths.multiply(3, c, Maths.e2(t)),
        Maths.multiply(Maths.neg(3), c, Maths.e3(t)),
        Maths.multiply(d, Maths.e3(t)));
/**
 * Get cubic bezier interpolation point given two control points.
 * @param {number} x0 - start point x value
 * @param {number} y0 - start point x value
 * @param {number} cx0 - first control point point x value
 * @param {number} cy0 - first control point y value
 * @param {number} cx1 - second control point x value
 * @param {number} cy1 - second control point y value
 * @param {number} x1 - end point x value
 * @param {number} y1 - end point y value
 * @param {number} t - between 0 and 1
 * @returns {number}
 */
export const cbez2 = ({x: x0, y: y0}, {x: cx0, y: cy0}, {x: cx1, y: cy1}, {x: x1, y: y1}, t) => ({x: cbez1(x0, cx0, cx1, x1, t), y: cbez1(y0, cy0, cy1, y1, t)});