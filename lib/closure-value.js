/** @type {{
    func: (Object, String) => String
    module: (Object, String) => String
}} */
export default {
    func: (closure, name) => `closure["${name}"]`,
    module: (closure, name) => {
        const value = closure[name]
        if (typeof value === "function") {
            return value.toString()
        }
        return JSON.stringify(value)
    }
}
