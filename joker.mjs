import validator from "./validate.mjs"
import { builtin } from "./types.mjs"

const addType = (name, $) => {
    if (builtin[name] !== undefined) {
        return false
    }
    builtin[name] = {$}
    return true
}
const extendType = (name, extensions) => {
    if (builtin[name] === undefined) {
        return false
    }
    for (const [key, func] of Object.entries(extensions)) {
        builtin[name][key] = builtin[name][key] ?? func
    }
    return true
}

export default {
    validator,
    addType,
    extendType,
}
