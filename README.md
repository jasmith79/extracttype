# extracttype

Attempts to extract the type of a JavaScript object. For built-ins
it returns their internal [[Class]] slot, for custom constructed
objects it attempts to extract the name of their constructor. Exports
a function `extractType` to that end.

## BROWSER COMPATIBILITY NOTES

If using with Internet Explorer this function will work better if
you polyfill the missing `Function.prototype.name` property.

All of the ES 2015+ stuff (arrow fns, `const`, `Symbol`, `Promise`, `class`,
`Object.entries`, `Array.prototype.from`, `Array.prototype.includes`, etc.
will obviously have to be transpiled/polyfilled). Uses JavaScript
modules (i.e. `import/export`) and you will need to use a *very* new
browser or an appropriate loader (e.g. webpack).

## NOTE
The `isSameType` function **IS NOT 100% RELIABLE**. I highly
recommend simply duck-typing your objects to see if they have the
appropriate method/attribute but there are some corner cases where
it is handy. Use with care. I've annotated the failure conditions
in the function itself best as I can. Note also that it is recursive
and *can* blow the stack for deeply nested structures if nominal
typing fails. **USE WITH CAUTION**: I will close without further
comment any github issues that ignore this warning.
