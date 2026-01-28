import createValidator from "./lib/validate.js"
import createMask from "./lib/mask.js"
import { builtin, errors } from "./lib/types.js"
import closureValue from "./lib/closure-value.js"

export const extendTypes = (defs) => {
    for (const [key, func] of Object.entries(defs)) {
        builtin[key] = builtin[key] ?? func
    }
}
export const extendErrors = (defs) => {
    for (const [key, func] of Object.entries(defs)) {
        errors[key] = func
    }
}

export const validator = (schema) => createValidator(schema, closureValue.func, "return")
export const mask = (schema) => createMask(schema, closureValue.func, "return")
