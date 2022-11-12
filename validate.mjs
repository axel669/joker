import { transform } from "./schema.mjs"
import { builtin } from "./types.mjs"

const fname = (func) => func.replace(/\./g, "_")
let nameCount = 0
const varname = (varname) => {
    const name = `${varname}${nameCount}`
    nameCount += 1
    return name
}
const nullable = (optional, name, core) => {
    if (optional === true) {
        return [
            `if (empty(${name}) === false) {`,
            ...core,
            `}`
        ]
    }
    return core
}
const $if = (name, path, optional, type, typeargs, closure) => {
    const funcs = [
        [`${type}.$`],
        ...Object.keys(typeargs).map(
            (key) => [
                `${type}.${key}`,
                JSON.stringify(typeargs[key])
            ]
        )
    ]
    funcs.forEach(
        (key) => closure[key[0]] = true
    )
    const condition = funcs.map(
        ([func, value]) =>
            (value === undefined)
                ? `${fname(func)}(${name})`
                : `${fname(func)}(${name}, ${value})`
    )
    const args = funcs.length > 1 ? JSON.stringify(typeargs) : ""
    const core = [
        `if ((${condition.join(" && ")}) === false) {`,
        `errors.push(\`item${path.join("")} failed validation: ${type}${args}\`)`,
        `}`,
    ]
    return nullable(optional, name, core)
}
const codifyArray = (itemName, info, path, closure) => {
    const index = varname("index")
    const loopName = varname("item")
    const core = [
        `if (Array.isArray(${itemName}) === false) {`,
        `errors.push(\`item${path.join("")} is not an array\`)`,
        `}`,
        `else {`,
        `for (let source = ${itemName}, ${index} = 0; ${index} < source.length; ${index} += 1) {`,
        `const ${loopName} = source[${index}]`,
        ...codify(
            loopName,
            {
                array: false,
                type: info.type,
                name: "",
                optional: info.itemOptional,
                props: info.props,
            },
            [...path, `.\${${index}}`],
            closure
        ),
        `}`,
        `}`
    ]
    return nullable(info.optional, itemName, core)
}
const codify = (itemName, info, path, closure) => {
    const { "joker.type": type, ...typeargs } = info.type
    const name = `${itemName}${info.name}`
    if (type !== "object") {
        return $if(name, path, info.optional, type, typeargs, closure)
    }

    if (info.array === true) {
        return codifyArray(name, info, path, closure)
    }

    const nextName = varname("item")
    const core = [
        `const ${nextName} = ${name}`,
        `if (typeof ${nextName} !== "object" || ${nextName} === null) {`,
        `errors.push(\`item${path.join("")} is not an object\`)`,
        `}`,
        `else {`,
        ...info.props
            .map(
                prop => codify(
                    nextName,
                    prop,
                    [...path, prop.name],
                    closure
                )
            )
            .flat(),
        `}`
    ]
    return nullable(info.optional, itemName, core)
}
const validator = (schema) => {
    const rootName = Object.keys(schema).find(
        key => key.startsWith("root") || key.startsWith("?root")
    )
    const typeInfo = transform(schema[rootName], rootName)
    typeInfo.name = ""

    const closure = {}
    const body = codify("item", typeInfo, [], closure)
    const code = [
        ...Object.keys(closure).map(
            (name) => `const ${fname(name)} = types.${name}`
        ),
        `const empty = (item) => item === null || item === undefined`,
        `return (item) => {`,
        `const errors = []`,
        ...body,
        `return errors.length ? errors : true`,
        `}`
    ].reduce(
        ({ lines, indent }, line) => {
            if (line.endsWith("{") === true) {
                lines.push(`${indent}${line}`)
                return { lines, indent: `${indent}    ` }
            }
            indent = (line === "}") ? indent.slice(0, -4) : indent
            lines.push(`${indent}${line}`)
            return { indent, lines }
        },
        { lines: [], indent: "" }
    ).lines

    const validate = new Function("types", code.join("\n"))(builtin)
    validate.code = code
    validate.schema = schema
    return validate
}

export default validator
