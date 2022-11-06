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
        //  with the key being the basic validator function to use
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
            "name": "string",
            "count": "number",
        },
        //  an array marked with "[?]" allows individual items to be nullable
        "tags[?]": "string"
    }
}
```
Current validators
- int
- number
- string
- bool
