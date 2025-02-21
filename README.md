# Joker
Validation (and soon masking) library that is small, fast, and simple.

## TODO
No ideas left, maybe its time for a 1.0 soon?

## Installation

### CLI
```bash
pnpm add @axel669/joker
```

### Browser
```js
import joker from "https://esm.sh/@axel669/joker"
```

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
    //  itemName can be used to customize the path reported by validation
    //  errors. default is "item"
    itemName: "config",
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
        "tags[?]": {"joker.type": "string", length: 10},
        //  use {} to check that the values of all keys in an object are of the
        //  right form
        "funcs{}": {
            "name": "string",
        }
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
`joker.extendTypes` function, as well as extensions to any of the built in
validators. Does not support overriding built-in validators or keywords.

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
joker.extendTypes({
    //  Define when the item is bad
    //  typeName.$ is the base type validator that runs regardless of any params
    //  that get passed in. typeName.paramName allows for validating custom
    //  params on a type.
    "string-number.$": (item) => (
        typeof item !== "string"
        && typeof string !== "number"
    ),
    "string-number.nan": (item, isnan) => isNaN(item) !== isnan
})
```

### Custom Error Messages
Joker has a generic validation failure message, but it doesn't look great when
used in things like libraries for config validation, or validating parameters
passed to rest endpoints, etc. The `extendErrors` function allows for custom
error messages for any custom types, or overriding built-in type error messages.
The keys for the error messages are the same as the type/param keys.

```js
joker.extendErrors({
    "string-number.$": (path) => `${path} is not a string or a number`,
    "string-number.nan": (path, isnan) => `${path} is${isnan ? " not" : ""} NaN`
})
```

## Rollup Plugin
Joker includes a rollup plugin that can be used to precompile the schema into
high speed validation/masking functions. The plugin allows you to import a
`.joker.json` file that contains the schema. The file is parsed as jsonc so
comments/trailing commas are allowed (I think you only need to put quotes on
string if you copy-paste from code directly). The plugin generates both a mask
and validate function that can be imported by name.

```js
import jokerRollup from "@axel669/joker/rollup-plugin"

export default {
    input: "./main.js",
    output: {
        file: "./out/test.js",
        format: "esm"
    },
    plugins: [ jokerRollup ]
}
```

```js
import { validate as validateConfig } from "./config.joker.json"
import * as postData from "./post-data.joker.json"

if (validateConfig(config) !== true) {
    // do something about invalid config
}

const validData = postData.validate(post)
const masked = postData.mask(post)
```

## CLI Generator
Joker includes a cli tool to generate importable files with masks and/or
validators (mostly for use in environments like Cloudflare workers).

Source files should be jsonc (comments allowed \o/), but are otherwise identical
to the normal joker schema expected by the functions.

### Options / Example

| Option | Required | Description |
| --- | --- | --- |
| `--validator`, `-v` | yes* | Generates a validator file |
| `--mask`, `-m` | yes* | Generates a mask file |
| `---dest` | no | The output folder to save the generated files |

* at least one of the output types is required

```bash
joker -vm --dest=folder file1.json file2.json
```
