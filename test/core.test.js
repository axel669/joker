import { aegis, $ } from "@axel669/aegis"

import * as joker from "@axel669/joker"

import * as data from "./data.js"

aegis.test`Mask`(
    ($f) => {
        const mask = joker.mask(data.schema)
        $.check`creates a function`(
            $.instanceof(mask, Function)
        )

        const masked = mask(data.validData)
        $.check`filters data`(
            $.eq(masked.wat[0].extra, undefined)
        )
        $.check`skips optionals that dont exist`(
            $.eq(mask.testing, undefined)
        )
    }
)

aegis.test`Validate`(
    () => {
        const validate = joker.validator(data.schema)

        $.check`creates a function`(
            $.instanceof(validate, Function)
        )

        const noErrors = validate(data.validData)
        $.check`no errors for valid data`(
            $.eq(noErrors.length, 0),
            $.instanceof(noErrors, Array)
        )

        const errors = validate(data.invalidData)
        $.check`catches all errors in bad data`(
            $.eq(errors.length, 3)
        )
        $.check`reports specific errors correctly`(
            $.eq(errors[0].type, "number.$"),
            $.eq(errors[0].path, "item.wat[0].count"),
            $.eq(errors[1].type, "string.$"),
            $.eq(errors[1].path, "item.tags[0]"),
            $.eq(errors[2].type, "[internal] object"),
            $.eq(errors[2].path, "item.funcs"),
        )
    }
)
