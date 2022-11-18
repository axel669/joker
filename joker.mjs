import validator from "./validate.mjs"
import { builtin, errors } from "./types.mjs"

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
    extendTypes,
    extendErrors,
}
