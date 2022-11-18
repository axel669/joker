const builtin = {
    "array.$": item => Array.isArray(item) !== true,
    "array.min": (item, value) => item.length < value,
    "array.max": (item, value) => item.length > value,
    "array.length": (item, value) => item.length !== value,

    "object.$": item => typeof item !== "object" || item === null,

    "string.$": item => typeof item !== "string",
    "string.min": (item, value) => item.length < value,
    "string.max": (item, value) => item.length > value,
    "string.length": (item, value) => item.length !== value,
    "string.format": (item, regex) => regex.test(item) === false,

    "number.$": item => typeof item !== "number",
    "number.min": (item, value) => item < value,
    "number.max": (item, value) => item > value,

    "int.$": item => typeof item !== "number" || (item % 1) !== 0,
    "int.min": (item, value) => item < value,
    "int.max": (item, value) => item > value,

    "bool.$": item => typeof item !== "boolean",
}
const errors = {
    "array.$": (path) => `${path} is not an array`,
    "array.min": (path, min) => `${path} needs to have at least ${min} elements`,
    "array.max": (path, max) => `${path} needs to have at most ${max} elements`,
    "array.length": (path, size) => `${path} does not have exactly ${size} elements`,

    "object.$": (path) => `${path} is not an object`,

    "string.$": path => `${path} is not a string`,
    "string.min": (path, value) => `${path} needs to be at least ${value} characters`,
    "string.max": (path, value) => `${path} needs to be at most ${value} characters`,
    "string.length": (path, value) => `${path} needs to be exactly ${value} characters`,
    "string.format": (path, regex) => `${path} did not match regex ${regex.toString()}`,

    "number.$": path => `${path} is not a number`,
    "number.min": (path, value) => `${path} needs to be at least ${value}`,
    "number.max": (path, value) => `${path} needs to be at most ${value}`,

    "int.$": path => `${path} is not an integer`,
    "int.min": (path, value) => `${path} needs to be at least ${value}`,
    "int.max": (path, value) => `${path} needs to be at most ${value}`,

    "bool.$": path => `${path} is not a bool`,

    "[internal] array": (path) => `${path} is not an array`,
    "[internal] object": (path) => `${path} is not an object`,
    "[internal] conditional": path => `${path} condition did not return a valid key`,
}

export { builtin, errors }
