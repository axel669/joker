import { transform } from "./schema.mjs"
import { builtin } from "./types.mjs"

const fname = (func) => func.replace(/\.|\-/g, "_")
let count = {}
const varname = (varname) => {
    const n = count[varname]  ?? 0
    const name = `${varname}${n}`
    count[varname] = n + 1
    return name
}
const nullable = (optional, name, core) => {
    if (optional === true) {
        return [
            `if (${name} !== null && ${name} !== undefined) {`,
            ...core,
            `}`
        ]
    }
    return core
}
const typeForm = (type, sub, args) => {
    const f = builtin[type][sub]
    if (typeof f === "function") {
        if (args === undefined) {
            return [`${type}.${sub}`, f]
        }
        return [`${type}.${sub}`, f, varname("args"), args]
    }
    return { expr: f, args }
}
const validationExpr = (thing, name) => {
    const [func, , argname] = thing
    if (argname === undefined) {
        return `${fname(func)}(${name})`
    }
    return [`${fname(func)}(${name}, ${argname})`, argname, func]
}
const $if = (name, path, optional, type, typeargs, closure) => {
    const funcs = [
        typeForm(type, "$"),
        ...Object.keys(typeargs).map(
            (key) => typeForm(type, key, typeargs[key])
        )
    ]
    funcs.forEach(
        ([key, value, argname, args]) => {
            closure[key] = value
            if (args === undefined) {
                return
            }
            closure[argname] = args
        }
    )
    const condition = funcs.map(
        (cond) => validationExpr(cond, name)
    )
    const argname = varname("schemaArgs")
    closure[argname] = typeargs
    const [top, ...subs] = condition
    const core = [
        `if (${top}) {`,
        `errors.push({message:\`item${path.join("")} failed validation: ${type}\`, type: "${type}", path: \`item${path.join("")}\`, value: ${name}})`,
        `}`,
        ...(
            (subs.length === 0)
            ? []
            : [
                `else {`,
                ...subs.map(
                    ([cond, schema, type]) => [
                        `if (${cond}) {`,
                        `errors.push({message:\`item${path.join("")} failed validation: ${type}\`, type: "${type}", schema: ${schema}, path: \`item${path.join("")}\`, value: ${name}})`,
                        `}`
                    ]
                ).flat(),
                `}`
            ]
        ),
    ]
    return nullable(optional, name, core)
}
const codifyArray = (itemName, info, path, closure) => {
    const index = varname("index")
    const loopName = varname("item")
    const core = [
        `if (Array.isArray(${itemName}) === false) {`,
        `errors.push({message: \`item${path.join("")} is not an array\`, value: ${itemName}, path: \`item${path.join("")}\`})`,
        `}`,
        `else {`,
        `for (let source = ${itemName}, ${index} = 0; ${index} < source.length; ${index} += 1) {`,
        ...codify(
            `source[${index}]`,
            {
                array: false,
                type: info.type,
                name: "",
                optional: info.itemOptional,
                props: info.props,
            },
            [...path, `[\${${index}}]`],
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

    if (info.array === true) {
        return codifyArray(name, info, path, closure)
    }

    if (type === "conditional") {
        const condName = varname("cond")
        closure[condName] = typeargs.condition
        return [
            `if (${condName}(${name})) {`,
            ...codify(name, typeargs.true, path, closure),
            `}`,
            `else {`,
            ...codify(name, typeargs.false, path, closure),
            `}`
        ]
    }

    if (type !== "object") {
        return $if(name, path, info.optional, type, typeargs, closure)
    }

    const nextName = varname("item")
    const core = [
        `const ${nextName} = ${name}`,
        `if (typeof ${nextName} !== "object" || ${nextName} === null) {`,
        `errors.push({message: \`item${path.join("")} is not an object\`, value: ${nextName}, path: \`item${path.join("")}\`})`,
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
const closureExpr = ([name, value]) => {
}
const validator = (schema) => {
    const rootName = Object.keys(schema).find(
        key => key.startsWith("root") || key.startsWith("?root")
    )
    const typeInfo = transform(schema[rootName], rootName)
    typeInfo.name = ""

    const closure = {}
    const body = codify("item", typeInfo, [], closure)
    const { lines } = [
        ...Object.keys(closure).map(
            (name) => `const ${fname(name)} = closure["${name}"]`
        ),
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
    )
    const code = lines.join("\n")

    const validate = new Function("closure", code)(closure)
    validate.code = code
    validate.schema = schema
    return validate
}

export default validator
