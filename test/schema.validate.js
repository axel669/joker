const number_$ = item => typeof item !== "number"
const schemaArgs0 = {}
const bool_$ = item => typeof item !== "boolean"
const schemaArgs1 = {}
const schemaArgs2 = {}
const string_$ = item => typeof item !== "string"
const string_max = (item, value) => item.length > value
const args0 = 20
const schemaArgs3 = {"max":20}
const number_min = (item, value) => item < value
const args1 = 5
const schemaArgs4 = {"min":5}
const string_length = (item, value) => item.length !== value
const args2 = 10
const schemaArgs5 = {"length":10}
const schemaArgs6 = {}
export default (item) => {
    const errors = []
    const item0 = item
    if (typeof item0 !== "object" || item0 === null) {
        errors.push({message: `config is not an object`, type: "[internal] object", path: `config`, value: item0})
    }
    else {
        if (number_$(item0.id)) {
            errors.push({message: `config.id is not a number`, type: "number.$", path: `config.id`, value: item0.id})
        }
        if (item0.thing !== null && item0.thing !== undefined) {
            if (bool_$(item0.thing)) {
                errors.push({message: `config.thing is not a bool`, type: "bool.$", path: `config.thing`, value: item0.thing})
            }
        }
        const item1 = item0.nested
        if (typeof item1 !== "object" || item1 === null) {
            errors.push({message: `config.nested is not an object`, type: "[internal] object", path: `config.nested`, value: item1})
        }
        else {
            if (bool_$(item1.tagged)) {
                errors.push({message: `config.nested.tagged is not a bool`, type: "bool.$", path: `config.nested.tagged`, value: item1.tagged})
            }
        }
        if (Array.isArray(item0.wat) === false) {
            errors.push({message: `config.wat is not an array`, type: "[internal] array", path: `config.wat`, value: item0.wat})
        }
        else {
            for (let source = item0.wat, index0 = 0; index0 < source.length; index0 += 1) {
                const item2 = source[index0]
                if (typeof item2 !== "object" || item2 === null) {
                    errors.push({message: `config.wat[${index0}] is not an object`, type: "[internal] object", path: `config.wat[${index0}]`, value: item2})
                }
                else {
                    if (string_$(item2.name)) {
                        errors.push({message: `config.wat[${index0}].name is not a string`, type: "string.$", path: `config.wat[${index0}].name`, value: item2.name})
                    }
                    else {
                        if (string_max(item2.name, args0)) {
                            errors.push({message: `config.wat[${index0}].name needs to be at most 20 characters`, type: "string.max", path: `config.wat[${index0}].name`, value: item2.name, args: args0})
                        }
                    }
                    if (number_$(item2.count)) {
                        errors.push({message: `config.wat[${index0}].count is not a number`, type: "number.$", path: `config.wat[${index0}].count`, value: item2.count})
                    }
                    else {
                        if (number_min(item2.count, args1)) {
                            errors.push({message: `config.wat[${index0}].count needs to be at least 5`, type: "number.min", path: `config.wat[${index0}].count`, value: item2.count, args: args1})
                        }
                    }
                }
            }
        }
        if (Array.isArray(item0.tags) === false) {
            errors.push({message: `config.tags is not an array`, type: "[internal] array", path: `config.tags`, value: item0.tags})
        }
        else {
            for (let source = item0.tags, index1 = 0; index1 < source.length; index1 += 1) {
                if (source[index1] !== null && source[index1] !== undefined) {
                    if (string_$(source[index1])) {
                        errors.push({message: `config.tags[${index1}] is not a string`, type: "string.$", path: `config.tags[${index1}]`, value: source[index1]})
                    }
                    else {
                        if (string_length(source[index1], args2)) {
                            errors.push({message: `config.tags[${index1}] needs to be exactly 10 characters`, type: "string.length", path: `config.tags[${index1}]`, value: source[index1], args: args2})
                        }
                    }
                }
            }
        }
        const obj0 = item0.funcs
        if (typeof obj0 !== "object" || obj0 === null) {
            errors.push({message: `config.funcs is not an object`, type: "[internal] object", path: `config.funcs`, value: obj0})
        }
        else {
            for (const key0 of Object.keys(obj0)) {
                const value0 = obj0[key0]
                const item3 = value0
                if (typeof item3 !== "object" || item3 === null) {
                    errors.push({message: `config.funcs[${key0}] is not an object`, type: "[internal] object", path: `config.funcs[${key0}]`, value: item3})
                }
                else {
                    if (string_$(item3.name)) {
                        errors.push({message: `config.funcs[${key0}].name is not a string`, type: "string.$", path: `config.funcs[${key0}].name`, value: item3.name})
                    }
                }
            }
        }
    }
    return errors.length ? errors : true
}
