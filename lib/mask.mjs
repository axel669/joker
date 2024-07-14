import { transform } from "./schema.mjs"

const fname = (func) => func.replace(/\.|\-/g, "_")
let count = {}
const varname = (varname) => {
    const n = count[varname] ?? 0
    const name = `${varname}${n}`
    count[varname] = n + 1
    return name
}
const returnValue = (lines, prefix = "") => [
    `${prefix} return ${lines[0]}`,
    ...lines.slice(1),
]
const codify = (args) => {
    const { name, schema, path, closure } = args
    const { "joker.type": type, ...typeargs } = schema.type

    if (schema.array === true) {
        const items = codify({
            name: "source",
            schema: {
                array: false,
                type: schema.type,
                name: "",
                optional: schema.itemOptional,
                props: schema.props,
                object: schema.object,
            },
            path,
            closure,
        })
        return [
            `${name}.map( (source) => {`,
            ...returnValue(items),
            `})`,
        ]
    }

    if (schema.object === true) {
        const key = varname("key")
        const value = varname("value")
        const objValue = varname("objValue")
        const inner = codify({
            name: value,
            schema: {
                array: schema.array,
                type: schema.type,
                name: "",
                optional: schema.optional,
                props: schema.props,
                object: false,
            },
            path,
            closure,
        }).join("\n")
        closure[objValue] = [
            `(source) => {`,
            `if (source === null) {`,
            `return null`,
            `}`,
            `if (source === undefined) {`,
            `return undefined`,
            `}`,
            `const obj = {}`,
            `for (const [${key}, ${value}] of Object.entries(source)) {`,
            `obj[${key}] = ${inner}`,
            `}`,
            `return obj`,
            `}`,
        ].join("\n")
        return [`${objValue}(${name})`]
    }

    if (type === "conditional") {
        const condName = varname("cond")
        const condValue = varname("condValue")
        const { condition, ...exprs } = typeargs
        closure[condName] = condition
        closure[condValue] = [
            `(source) => {`,
            `switch(${condName}(source)) {`,
            ...Object.entries(exprs).map(
                ([key, schema]) => returnValue(
                    codify({
                        name: "source",
                        schema,
                        path,
                        closure,
                    }),
                    `case "${key}":`
                )
            ).flat(),
            `default: return undefined`,
            `}`,
            `}`,
        ].join("\n")
        return [`${condValue}(${name})`]
    }

    if (type !== "object") {
        return [name]
    }

    return [
        `{`,
        ...schema.props.map(
            prop => {
                const propCode = codify({
                    name: `${name}${prop.name}`,
                    schema: prop,
                    path,
                    closure,
                })
                const code = Array.isArray(propCode)
                    ? propCode.join("\n")
                    : propCode
                return `${prop.name.slice(1)}: ${code},`
            }
        ),
        `}`,
    ]
}

const maskCache = new Map()
const mask = (schema) => {
    if (maskCache.has(schema) === true) {
        return maskCache.get(schema)
    }
    const rootName = Object.keys(schema).find(key => key.startsWith("root"))
    const longSchema = transform(
        schema[rootName],
        rootName
    )
    longSchema.name = ""

    const closure = {}
    const body = codify({
        name: "source",
        schema: longSchema,
        path: [],
        closure,
    })

    const { lines } = [
        ...Object.entries(closure).map(
            ([name, value]) =>
                (typeof value === "string")
                ? `const ${name} = ${value}`
                : `const ${name} = closure["${name}"]`
        ),
        `return (source) => {`,
        `return ${body[0]}`,
        ...body.slice(1),
        `}`
    ].join("\n").split("\n").reduce(
        ({ lines, indent }, line) => {
            if (line.endsWith("{") === true) {
                lines.push(`${indent}${line}`)
                return { lines, indent: `${indent}    ` }
            }
            indent = line.startsWith("}") ? indent.slice(0, -4) : indent
            lines.push(`${indent}${line}`)
            return { indent, lines }
        },
        { lines: [], indent: "" }
    )
    const code = lines.join("\n")

    const mask = new Function("closure", code)(closure)
    mask.code = code
    mask.schema = schema
    mask.closure = closure

    return mask
}

export default mask
