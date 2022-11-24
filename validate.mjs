import { transform } from "./schema.mjs"
import { builtin, errors } from "./types.mjs"

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
    const key = `${type}.${sub}`
    const f = builtin[key]
    if (typeof f === "function") {
        if (args === undefined) {
            return [key, f]
        }
        return [key, f, varname("args"), args]
    }
    return { expr: f, args }
}
const validationExpr = (thing, name) => {
    const [func, , argname, arg] = thing
    if (argname === undefined) {
        return [`${fname(func)}(${name})`, func]
    }
    return [`${fname(func)}(${name}, ${argname})`, argname, func, arg]
}
const errorMessage = ({path, typeName, schema, value, args, config}) => {
    const topName = config.itemName ?? "item"
    const fullPath = `${topName}${path.join("")}`
    const message = (
        errors[typeName]?.(fullPath, args)
        ?? `${fullPath} failed validation: ${typeName}`
    )
    const parts = [
        `message: \`${message}\``,
        `type: "${typeName}"`,
        `path: \`${fullPath}\``,
        `value: ${value}`,
        schema ? `args: ${schema}` : null,
    ].filter(part => part !== null)
    .join(", ")
    return `errors.push({${parts}})`
}
const $if = (name, path, optional, type, typeargs, closure, config) => {
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
        `if (${top[0]}) {`,
        errorMessage({
            path,
            typeName: top[1],
            value: name,
            config,
        }),
        `}`,
    ]
    if (subs.length === 0) {
        return nullable(optional, name, core)
    }
    return nullable(
        optional,
        name,
        [
            ...core,
            `else {`,
            ...subs.map(
                ([cond, schema, type, args]) => [
                    `if (${cond}) {`,
                    errorMessage({
                        path,
                        typeName: type,
                        schema,
                        value: name,
                        args,
                        config,
                    }),
                    `}`
                ]
            ).flat(),
            `}`
        ]
    )
}
const codifyArray = ({itemName, info, path, closure, config}) => {
    const index = varname("index")
    const loop = {
        vars: `let source = ${itemName}, ${index} = 0`,
        cond: `${index} < source.length`,
        iter: `${index} += 1`,
    }
    const core = [
        `if (Array.isArray(${itemName}) === false) {`,
        errorMessage({
            path,
            typeName: "[internal] array",
            value: itemName,
            config,
        }),
        `}`,
        `else {`,
        `for (${loop.vars}; ${loop.cond}; ${loop.iter}) {`,
        ...codify({
            itemName: `source[${index}]`,
            info: {
                array: false,
                type: info.type,
                name: "",
                optional: info.itemOptional,
                props: info.props,
                object: info.object,
            },
            path: [...path, `[\${${index}}]`],
            closure,
            config,
        }),
        `}`,
        `}`
    ]
    return nullable(info.optional, itemName, core)
}
const codify = ({itemName, info, path, closure, config}) => {
    const { "joker.type": type, ...typeargs } = info.type
    const name = `${itemName}${info.name}`

    if (info.array === true) {
        return codifyArray({
            itemName: name,
            info,
            path,
            closure,
            config,
        })
    }

    if (info.object === true) {
        const key = varname("key")
        const value = varname("value")
        const obj = varname("obj")
        const core = [
            `const ${obj} = ${name}`,
            `if (typeof ${obj} !== "object" || ${obj} === null) {`,
            errorMessage({
                path,
                typeName: "[internal] object",
                value: obj,
                config,
            }),
            `}`,
            `else {`,
            `for (const ${key} of Object.keys(${obj})) {`,
            `const ${value} = ${obj}[${key}]`,
            ...codify({
                itemName: value,
                info: {
                    name: "",
                    type: info.type,
                    array: false,
                    object: false,
                    optional: info.optional,
                    props: info.props,
                },
                path: [...path, `[\${${key}}]`],
                closure,
                config,
            }),
            `}`,
            `}`,
        ]
        return nullable(info.optional, name, core)
    }

    if (type === "conditional") {
        const condName = varname("cond")
        const condValue = varname("condValue")
        const { "joker.type": _, condition, ...exprs } = typeargs
        closure[condName] = condition
        return [
            `const ${condValue} = ${condName}(${name})`,
            `switch(${condValue}) {`,
            ...Object.entries(exprs).map(
                ([key, schema]) => [
                    `case "${key}": {`,
                    ...codify({
                        itemName: name,
                        info: schema,
                        path,
                        closure,
                        config,
                    }),
                    `}`,
                    `break`,
                ]
            ).flat(),
            `default: {`,
            errorMessage({
                path,
                typeName: "[internal] conditional",
                value: condValue,
                config,
            }),
            `}`,
            `}`
        ]
    }

    if (type !== "object") {
        return $if(name, path, info.optional, type, typeargs, closure, config)
    }

    const nextName = varname("item")
    const core = [
        `const ${nextName} = ${name}`,
        `if (typeof ${nextName} !== "object" || ${nextName} === null) {`,
        errorMessage({
            path,
            typeName: "[internal] object",
            value: nextName,
            config,
        }),
        `}`,
        `else {`,
        ...info.props
            .map(
                prop => codify({
                    itemName: nextName,
                    info: prop,
                    path: [...path, prop.name],
                    closure,
                    config,
                })
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
    const { [rootName]: root, ...config } = schema
    const typeInfo = transform(root, rootName)
    typeInfo.name = ""

    const closure = {}
    const body = codify({
        itemName: "item",
        info: typeInfo,
        path: [],
        closure,
        config,
    })
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
