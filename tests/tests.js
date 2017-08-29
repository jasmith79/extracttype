/*
 * extracttype.js tests
 * @author jasmith79
 * @copyright Jared Smith
 * @license MIT
 *
 * Attempts to extract the type of a JavaScript object. For built-ins
 * it returns their internal [[Class]] slot, for custom constructed
 * objects it attempts to extract the name of their constructor.
 */

import { extractType, isSameType } from 'extracttype';

export default function runTests () {
  /*********** BUILT IN TYPES ***********/

  console.assert(extractType(Math) === 'Math');
  console.assert(extractType(JSON) === 'JSON');
  console.assert(extractType(/foo/) === 'RegExp');
  console.assert(extractType(new Date()) === 'Date');
  console.assert(extractType('') === 'String');
  console.assert(extractType(0) === 'Number');
  console.assert(extractType(false) === 'Boolean');
  console.assert(extractType(undefined) === 'Undefined');
  console.assert(extractType(null) === 'Null');
  console.assert(extractType(function(){}) === 'Function');
  console.assert(extractType({}) === 'Object');
  console.assert(extractType([]) === 'Array');
  console.assert(extractType(new Error()) === 'Error');
  console.assert(extractType((function() { return arguments })(1)) === 'Arguments');
  console.assert(extractType(Object.create(null)) === '');

  if (typeof Symbol === 'function') {
    console.assert(extractType(Symbol('foo')) === 'Symbol');
  }

  if (typeof Map === 'function') {
    console.assert(extractType(new Map()) === 'Map');
  }

  if (typeof WeakMap === 'function') {
    console.assert(extractType(new WeakMap()) === 'WeakMap');
  }

  if (typeof Set === 'function') {
    console.assert(extractType(new Set()) === 'Set');
  }

  if (typeof WeakSet === 'function') {
    console.assert(extractType(new WeakSet()) === 'WeakSet');
  }

  if (typeof Promise === 'function') {
    console.assert(extractType(Promise.resolve()) === 'Promise');
  }

  if (typeof ArrayBuffer === 'function') {
    console.assert(extractType(new ArrayBuffer(2)) === 'ArrayBuffer');
  }

  if (typeof Uint8Array === 'function') {
    console.assert(extractType(new Uint8Array(2)) === 'Uint8Array');
  }

  if (typeof Int8Array === 'function') {
    console.assert(extractType(new Int8Array(2)) === 'Int8Array');
  }

  if (typeof Uint8ClampedArray === 'function') {
    console.assert(extractType(new Uint8ClampedArray(2)) === 'Uint8ClampedArray');
  }

  if (typeof Int16Array === 'function') {
    console.assert(extractType(new Int16Array(2)) === 'Int16Array');
  }

  if (typeof Uint16Array === 'function') {
    console.assert(extractType(new Uint16Array(2)) === 'Uint16Array');
  }

  if (typeof Int32Array === 'function') {
    console.assert(extractType(new Int32Array(2)) === 'Int32Array');
  }

  if (typeof Uint32Array === 'function') {
    console.assert(extractType(new Uint32Array(2)) === 'Uint32Array');
  }

  if (typeof Float32Array === 'function') {
    console.assert(extractType(new Float32Array(2)) === 'Float32Array');
  }

  if (typeof Float64Array === 'function') {
    console.assert(extractType(new Float64Array(2)) === 'Float64Array');
  }

  /*********** CUSTOM TYPES ***********/

  class Foo {
    constructor () {}
  };

  function Ctor() {}

  console.assert(extractType(new Foo()) === 'Foo');
  console.assert(extractType(new Ctor()) === 'Ctor');


  /*********** isSameType ***********/

  // primitive
  console.assert(isSameType('', 'foo'));
  console.assert(isSameType(0, 1));
  console.assert(isSameType(false, true));
  console.assert(isSameType(undefined, (void 0)));

  // builtin obj

  console.assert(isSameType(/foo/, new RegExp('bar')));
  console.assert(isSameType(new Date(), new Date(2014, 1, 1)));
  console.assert(isSameType(function(){}, Date));
  console.assert(isSameType([], new Array()));
  console.assert(isSameType(new Error(), new TypeError()));
  console.assert(isSameType((function() { return arguments })(1), (function() { return arguments })('')));

  console.assert(!isSameType(/foo/, {}));
  console.assert(!isSameType(new Date(), {}));
  console.assert(!isSameType(function(){}, {}));
  console.assert(!isSameType({}, Object.create(null)));
  console.assert(!isSameType([], {}));
  console.assert(!isSameType(new Error(), {}));
  console.assert(!isSameType((function() { return arguments })(1), {}));

  // inheritance

  class Bar extends Foo {
    constructor () {
      super();
    }
  };

  function C2() {};
  C2.prototype = Ctor.prototype;

  console.assert(isSameType(new Foo(), new Bar()));
  console.assert(isSameType(new Ctor, new C2));
  console.assert(!isSameType(new Foo, new Ctor));

  // structural

  const a = {
    foo: 'foo'
  };

  const b = {
    foo: 'bar'
  };

  const c = {
    foo: 3
  };

  console.assert(isSameType({}, Object.create({})));
  console.assert(isSameType(a, b));
  console.assert(!isSameType({}, a));
  console.assert(!isSameType(a, c));


  console.log('All tests complete.');
  if (typeof process !== 'undefined') process.exit(0);
};
