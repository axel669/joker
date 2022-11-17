# Joker
Validation (and soon masking) library that is small, fast, and simple.

## TODO
- ~~add some more built in validators~~
- ~~allow custom validators~~
- ~~keyed conditions?~~
- wildcard object keys?
- maybe other stuff if people suggest it

## Usage
```js
import joker from "@axel669/joker"

const validate = joker.validator(schema)
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
        "id": "number",
        //  start a key name with "?" to mark as nullable (can be null/undefined)
        "?thing": "bool",
        //  nested objects generate nested checks with the validator
        "nested": {
            "tagged": "bool"
        },
        //  keys with "[]" are checked as arrays, with each item using the
        //  given schema for validation
        "wat[]": {
            "name": {"joker.type": "string", max: 20},
            "count": {"joker.type": "number", min: 5},
        },
        //  an array marked with "[?]" allows individual items to be nullable
        "tags[?]": {"joker.type": "string", length: 10}
    }
}
```
### Built-in Validators
- int {min, max}
- number {min, max}
- string {min, max, length, format}
- bool
- array {min, max, length}
- object

### Conditional Validators
Joker has the ability to change which schema it validates an item with based on
a custom condition function. The condition function should return a key that
defines which key within the schema to validate with. All keys are treated as
strings regardless of the type it might look like as an object key.
Symbols are not supported values.

```js
const schema = {
    "root": {
        "?id": "number",
        "wat": {"joker.type": "array", length: 2},
        "wat[]": {
            //  use the joker.type "conditional" with a condition function
            "joker.type": "conditional",
            //  the condition to eval on an item
            condition: (item) => item.name.length < 3 ? "first" : "second",
            //  keys are picked based on the value of the condition function
            first: {
                "name": "string",
                "count": {"joker.type": "string", min: 5},
                "tags[]": "string"
            },
            second: {
                "name": {
                    "joker.type": "string",
                    format: /^\w+$/
                },
                "count": "number",
            }
        }
    }
}
```

### Custom Validators
Joker allows for the creation of custom type validators through the
`joker.addType` function, as well as extensions to any of the built in
validators through the `joker.extendType` function. To add a custom type with
extra keywords, a call to addType and extendType is needed. Maybe in the future
I'll shorthand that opr something.

> Names can contain dashes, underscores, and letters/numbers. Other characters
> are not supported.

### IMPORTANT INFO (maybe I'll even read it)
> NOTE: All validation functions are used to check if an item is **bad**, so
> the functions should return `true` when it finds an issue with the value.
> I recommend looking up deMorgan's rule in symbolic logic to make things
> easier.
>
> This means <br />
> `validation(item) -> true`, item is **bad** <br />
> `validation(item) -> false`, item is **good**

```js
joker.addType(
    "string-number",
    //  Define when the item is bad
    (item) => typeof item !== "string" && typeof string !== "number"
)
joker.extendType(
    "int",
    {
        even: item => (item % 2) !== 0,
        odd: item => (item % 2) !== 1
    }
)
```
