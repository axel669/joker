const builtin = {
    array: {
        $: item => Array.isArray(item) !== true
    },
    object: {
        $: item => typeof item !== "object" || item === null
    },
    string: {
        $: item => typeof item !== "string",
        min: (item, value) => item.length < value,
        max: (item, value) => item.length > value,
        length: (item, value) => item.length !== value,
        format: (item, regex) => regex.test(item)
    },
    number: {
        $: item => typeof item !== "number",
        min: (item, value) => item < value,
        max: (item, value) => item > value,
    },
    int: {
        $: item => typeof item !== "number" || (item % 1) !== 0,
        min: (item, value) => item < value,
        max: (item, value) => item > value,
    },
    bool: {
        $: item => typeof item !== "boolean"
    },
}

export { builtin }
