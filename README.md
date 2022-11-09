# Joker
Validation (and soon masking) library that is small, fast, and simple.

## TODO
- add some more built in validators
- allow custom validators
- maybe other stuff if people suggest it

## Usage
```js
import joker from "@axel669/joker"

const validate = joker.compile(schema)
console.log(
    validate(data)
)
```

## Schema
```js
const schema = {
    //  root defines the top level the data
    root: {
        //  use object syntax for object validation
        //  with the key being the validator function to use
        "id": joker.number(),
        //  start a key name with "?" to mark as nullable (can be null/undefined)
        "?thing": joker.bool(),
        //  nested objects generate nested checks with the validator
        "nested": {
            "tagged": joker.bool()
        },
        //  keys with "[]" are checked as arrays, with each item using the
        //  given schema for validation
        "wat[]": {
            "name": joker.string({max: 20}),
            "count": joker.number({min: 5}),
        },
        //  an array marked with "[?]" allows individual items to be nullable
        "tags[?]": joker.string({length: 10})
    }
}
```
### Built-in Validators
- int {min, max}
- number {min, max}
- string {min, max, length}
- bool

### Custom Validators
Joker contains a utility to help make custom validators.
Custom validator functions should return a string with the code to run for the
the validation; Specifically, the code returned is used to mark a value as
invalid. The function to generate the code will be given a `name` argument
that represents the value being checked.
The `joker.buildType` function can be used to help create custom validators
that can take options for extended validation.

```js
const hi = joker.buildType(
    //  name of the type to display in validation errors
    "hi",
    //  basic validation of the type (regardless of options)
    (name) => `typeof ${name} !== "string" || ${name}.startsWith("hi") === false`,
    //  any number of [key, function] pairs for options that can generate
    //  more specific validation of a type
    ["end", (name, optionValue) => `${name}.endsWith("${optionValue}") === false`]
)
```
