import validator from "./lib/validate.js"
import mask from "./lib/mask.js"
import { builtin, errors } from "./lib/types.js"
import closureValue from "./lib/closure-value.js"

const extendTypes = (defs) => {
    for (const [key, func] of Object.entries(defs)) {
        builtin[key] = builtin[key] ?? func
    }
}
const extendErrors = (defs) => {
    for (const [key, func] of Object.entries(defs)) {
        errors[key] = func
    }
}

export default {
    validator: (schema) => validator(schema, closureValue.func, "return"),
    mask: (schema) => mask(schema, closureValue.func, "return"),
    extendTypes,
    extendErrors,
}
