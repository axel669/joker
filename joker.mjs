import validator from "./lib/validate.mjs"
import mask from "./lib/mask.mjs"
import { builtin, errors } from "./lib/types.mjs"

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
    validator,
    mask,
    extendTypes,
    extendErrors,
}
