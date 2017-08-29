/*
 * extracttype.js
 * @author jasmith79
 * @copyright Jared Smith
 * @license MIT
 *
 * Attempts to extract the type of a JavaScript object. For built-ins
 * it returns their internal [[Class]] slot, for custom constructed
 * objects it attempts to extract the name of their constructor.
 *
 * **BROWSER COMPATIBILITY NOTES**
 *
 * If using with Internet Explorer this function will work better if
 * you polyfill the missing Function.prototype.name property.
 *
 * All of the ES 2015+ stuff (arrow fns, const, Symbol, Promise, class,
 * Object.entries, Array.prototype.from, Array.prototype.includes, etc.
 * will obviously have to be transpiled/polyfilled).
 *
 * Note that the isSameType function IS NOT 100% RELIABLE. I highly
 * recommend simply duck-typing your objects to see if they have the
 * appropriate method/attribute but there are some corner cases where
 * it is handy. Use with care. I've annotated the failure conditions
 * in the function itself best as I can. Note also that it is recursive
 * and *can* blow the stack for deeply nested structures if nominal
 * typing fails.
 */

// NOTE: this isn't meant to be *totally* comprehensive.
const BUILTINS = [
  // All JavaScript. Object deliberately omitted.
  'Math',
  'JSON',
  'RegExp',
  'Date',
  'String',
  'Number',
  'Symbol',
  'Boolean',
  'Undefined',
  'Null',
  'Function',
  'Array',
  'Map',
  'WeakMap',
  'Set',
  'WeakSet',
  'Error',
  'Promise',
  'ArrayBuffer',
  'Uint8Array',
  'Int8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'Arguments',

  // Browser specific
  'NodeList',
  'DOMTokenList',
  'CSSStyleDeclaration',
  'Text', // text node
  'DocumentFragment',
  'Event',
  'CustomEvent',
  'XMLHTTPRequest',
];

const CLASS_REGEX = / ([a-z0-9]+)]$/i;
const HTML_ELEMENT_REGEX = /^HTML[a-zA-Z]*Element$/;

// Extracts the hidden internal [[Class]] slot of a JavaScript object.
const _extractHiddenClass = a => Object.prototype.toString.call(a).match(CLASS_REGEX)[1];

const _getConstructorName = obj => ((obj != null) && obj.constructor && obj.constructor.name) || '';

// Somewhat reliably types JavaScript objects, mostly built-ins.
const extractType = function extractType(item) {
  let clazz = _extractHiddenClass(item); // covers all built-ins, primitives, etc.
  if (clazz !== 'Object') {
    return clazz;
  }
  clazz = _getConstructorName(item);
  return clazz; // returns '' for Object.create(null);
};

const _isBuiltIn = type => {
  return BUILTINS.includes(type) || type.match(HTML_ELEMENT_REGEX);
};

const isSameType = function isSameType(a, b) {
  const tA = typeof a;
  const tB = typeof b;

  // This can fail in older Safari as typeof (function(){}) returns 'Object'
  if (tA !== 'object' && tA === tB) return true;

  // This can give a misleading response if the code does not follow the
  // Liskov Substitution Prinicple.
  if (a != null && b != null) {
    if (a.constructor && a.constructor !== Object && b instanceof a.constructor) return true;
    if (b.constructor && b.constructor !== Object && a instanceof b.constructor) return true;
  }

  const typeA = extractType(a);
  const typeB = extractType(b);

  if (typeA !== typeB) return false;

  // This is necessary because the instanceof test above fails in
  // cross-realm scenarios.
  if (_isBuiltIn(typeA) && _isBuiltIn(typeB)) return true;

  // If all attempts at nominal typing have failed to yield a definitive answer,
  // fall back to structural. This avoids the false positive from two constructors
  // that coincidentally share a name.
  const as = Object.entries(a).sort();
  const bs = Object.entries(b).sort();
  if (as.length === bs.length) {
    return as.every(([keyA, valA], i) => {
      const [keyB, valB] = bs[i];
      return keyA === keyB && (valA === valB || isSameType(valA, valB));
    });
  }

  return false;
};

export {
  extractType,
  isSameType,
};

export default extractType;
