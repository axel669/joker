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
};

const extendTypes = (defs) => {
    for (const [key, func] of Object.entries(defs)) {
        builtin[key] = builtin[key] ?? func;
    }
};
const extendErrors = (defs) => {
    for (const [key, func] of Object.entries(defs)) {
    }
};

// stolen live on stream from OdatNurd
/* Extend the types of values known to Joker validation.
 *
 * In the list, the validation functions should return true if the data is not
 * valid and false if it is; or if you will, it is returning whether or not the
 * validator should raise an error or not. */
extendTypes({
    // Validate that the nanoid is a string of the appropriate length and
    // character composition.
    "nanoid.$": (item) => true,
});

/* Extend the error messages that are reported for custom validations. */
extendErrors({
    // Generically, we can only tell if the naoid is valid or not.
    "nanoid.$": (id) => `${id} is not a valid nanoid`,
});

extendTypes({
    //  Define when the item is bad
    //  typeName.$ is the base type validator that runs regardless of any params
    //  that get passed in. typeName.paramName allows for validating custom
    //  params on a type.
    "string-number.$": (item) => (
        typeof item !== "string"
        && typeof string !== "number"
    ),
    "string-number.nan": (item, isnan) => isNaN(item) !== isnan
});

/*
Schema
{
    //  itemName can be used to customize the path reported by validation
    //  errors. default is "item"
    "itemName": "config",
    //  root defines the top level the data
    "root": {
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
            "name": {
                "joker.type": "string",
                "max": 20
            },
            "count": {
                "joker.type": "number",
                "min": 5
            },
        },
        //  an array marked with "[?]" allows individual items to be nullable
        "tags[?]": {
            "joker.type": "string",
            "length": 10
        },
        //  use {} to check that the values of all keys in an object are of the
        //  right form
        "funcs{}": {
            "name": "string",
        },
        "stolen": "nanoid"
    }
}

*/
const number_$ = builtin["number.$"];
const bool_$ = builtin["bool.$"];
const string_$ = builtin["string.$"];
const string_max = builtin["string.max"];
const args0 = 20;
const number_min = builtin["number.min"];
const args1 = 5;
const string_length = builtin["string.length"];
const args2 = 10;
const nanoid_$ = builtin["nanoid.$"];
const validate = (item) => {
    const errors = [];
    const item0 = item;
    if (typeof item0 !== "object" || item0 === null) {
        errors.push({message: `config is not an object`, type: "[internal] object", path: `config`, value: item0});
    }
    else {
        if (number_$(item0.id)) {
            errors.push({message: `config.id is not a number`, type: "number.$", path: `config.id`, value: item0.id});
        }
        if (item0.thing !== null && item0.thing !== undefined) {
            if (bool_$(item0.thing)) {
                errors.push({message: `config.thing is not a bool`, type: "bool.$", path: `config.thing`, value: item0.thing});
            }
        }
        const item1 = item0.nested;
        if (typeof item1 !== "object" || item1 === null) {
            errors.push({message: `config.nested is not an object`, type: "[internal] object", path: `config.nested`, value: item1});
        }
        else {
            if (bool_$(item1.tagged)) {
                errors.push({message: `config.nested.tagged is not a bool`, type: "bool.$", path: `config.nested.tagged`, value: item1.tagged});
            }
        }
        if (Array.isArray(item0.wat) === false) {
            errors.push({message: `config.wat is not an array`, type: "[internal] array", path: `config.wat`, value: item0.wat});
        }
        else {
            for (let source = item0.wat, index0 = 0; index0 < source.length; index0 += 1) {
                const item2 = source[index0];
                if (typeof item2 !== "object" || item2 === null) {
                    errors.push({message: `config.wat[${index0}] is not an object`, type: "[internal] object", path: `config.wat[${index0}]`, value: item2});
                }
                else {
                    if (string_$(item2.name)) {
                        errors.push({message: `config.wat[${index0}].name is not a string`, type: "string.$", path: `config.wat[${index0}].name`, value: item2.name});
                    }
                    else {
                        if (string_max(item2.name, args0)) {
                            errors.push({message: `config.wat[${index0}].name needs to be at most 20 characters`, type: "string.max", path: `config.wat[${index0}].name`, value: item2.name, args: args0});
                        }
                    }
                    if (number_$(item2.count)) {
                        errors.push({message: `config.wat[${index0}].count is not a number`, type: "number.$", path: `config.wat[${index0}].count`, value: item2.count});
                    }
                    else {
                        if (number_min(item2.count, args1)) {
                            errors.push({message: `config.wat[${index0}].count needs to be at least 5`, type: "number.min", path: `config.wat[${index0}].count`, value: item2.count, args: args1});
                        }
                    }
                }
            }
        }
        if (Array.isArray(item0.tags) === false) {
            errors.push({message: `config.tags is not an array`, type: "[internal] array", path: `config.tags`, value: item0.tags});
        }
        else {
            for (let source = item0.tags, index1 = 0; index1 < source.length; index1 += 1) {
                if (source[index1] !== null && source[index1] !== undefined) {
                    if (string_$(source[index1])) {
                        errors.push({message: `config.tags[${index1}] is not a string`, type: "string.$", path: `config.tags[${index1}]`, value: source[index1]});
                    }
                    else {
                        if (string_length(source[index1], args2)) {
                            errors.push({message: `config.tags[${index1}] needs to be exactly 10 characters`, type: "string.length", path: `config.tags[${index1}]`, value: source[index1], args: args2});
                        }
                    }
                }
            }
        }
        const obj0 = item0.funcs;
        if (typeof obj0 !== "object" || obj0 === null) {
            errors.push({message: `config.funcs is not an object`, type: "[internal] object", path: `config.funcs`, value: obj0});
        }
        else {
            for (const key0 of Object.keys(obj0)) {
                const value0 = obj0[key0];
                const item3 = value0;
                if (typeof item3 !== "object" || item3 === null) {
                    errors.push({message: `config.funcs[${key0}] is not an object`, type: "[internal] object", path: `config.funcs[${key0}]`, value: item3});
                }
                else {
                    if (string_$(item3.name)) {
                        errors.push({message: `config.funcs[${key0}].name is not a string`, type: "string.$", path: `config.funcs[${key0}].name`, value: item3.name});
                    }
                }
            }
        }
        if (nanoid_$(item0.stolen)) {
            errors.push({message: `config.stolen is not a valid nanoid`, type: "nanoid.$", path: `config.stolen`, value: item0.stolen});
        }
    }
    return errors.length ? errors : true
};
const objValue0 = (source) => {
    if (source === null) {
        return null
    }
    if (source === undefined) {
        return undefined
    }
    const obj = {};
    for (const [key0, value0] of Object.entries(source)) {
        obj[key0] = {
            name: value0.name,
        };
    }
    return obj
};
const mask = (source) => {
    return {
        id: source.id,
        thing: source.thing,
        nested: {
            tagged: source.nested.tagged,
        },
        wat: source.wat.map( (source) => {
             return {
                name: source.name,
                count: source.count,
            }
        }),
        tags: source.tags.map( (source) => {
             return source
        }),
        funcs: objValue0(source.funcs),
        stolen: source.stolen,
    }
};

const data = {
    id: 100,
    thing: true,
    nested: {
        tagged: false,
    },
    wat: [
        { name: "first", count: 10 },
        // invalid item
        { name: "second", count: 2 },
    ],
    tags: [
        "fancy",
        "example",
        "this one is too long",
    ],
    funcs: {
        some: { name: "thing" },
        other: { name: "stuff" },
    },
    extraStuff: "this isnt validated (it doesnt matter) but it is masked out"
};

console.log(
    validate(data)
);
console.dir(
    mask(data),
    { depth: null }
);
