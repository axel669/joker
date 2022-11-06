const check = {
    "number": (name) => `typeof ${name} !== "number"`,
    "string": (name) => `typeof ${name} !== "string"`,
    "bool": (name) => `typeof ${name} !== "boolean"`,
    "int": (name) => `typeof ${name} !== "number" && (${name} % 1) !== 0`
}
const nullable = (opt, name) =>
    (opt === true)
        ? `${name} !== null && ${name} !== undefined && `
        : ""
let index = 0
const varname = (varname) => {
    const name = `${varname}${index}`
    index += 1
    return name
}
const codifyArray = (name, schema, path) => {
    const index = varname("index")
    const itemName = varname("item")
    const nil = nullable(schema.optional, name)
    return [
        `if (${nil}Array.isArray(${name}) === false) { errors.push(\`${path.join("")} is not an array\`) }`,
        `for (let source = ${name} ?? [], ${index} = 0; ${index} < source.length; ${index} += 1) {`,
        `const ${itemName} = source[${index}]`,
        ...codify(
            itemName,
            {
                array: false,
                type: schema.type,
                name: "",
                optional: schema.itemOptional,
                props: schema.props,
            },
            [...path, `.\${${index}}`],
        ),
        `}`,
    ]
}
const codify = (itemName, schema, path) => {
    if (schema.type !== "object") {
        const name = `${itemName}${schema.name}`
        const nil = nullable(schema.optional, name)
        if (schema.array === true) {
            return codifyArray(name, schema, path)
        }
        return [
            `if (${nil}${check[schema.type](name)}) { errors.push(\`${path.join("")} is not a ${schema.type}\`) }`
        ]
    }

    if (schema.array === true) {
        return codifyArray(`${itemName}${schema.name}`, schema, path)
    }

    const nextName = varname("item")
    return [
        `const ${nextName} = ${itemName}${schema.name}`,
        ...schema.props
            .map(prop => codify(nextName, prop, [...path, prop.name]))
            .flat()
    ]
}
const nameRegex = /^(?<optional>\?)?(?<name>[a-zA-Z\$_][a-zA-Z\$_0-9]*)(?<array>\[(?<itemopt>\?)?\])?(\/(?<desc>.+))?$/
const transform = (schema, name) => {
    const { groups } = nameRegex.exec(name)

    if (typeof schema === "object") {
        return {
            type: "object",
            name: `.${groups.name}`,
            array: groups.array !== undefined,
            itemOptional: groups.itemopt !== undefined,
            optional: groups.optional !== undefined,
            props: Object.entries(schema).map(
                ([key, subSchema]) => transform(subSchema, key)
            )
        }
    }

    return {
        type: schema,
        name: `.${groups.name}`,
        array: groups.array !== undefined,
        itemOptional: groups.itemopt !== undefined,
        optional: groups.optional !== undefined,
    }
}
const funcHeader = `
const errors = []
`
const compile = (schema) => {
    const rootName = Object.keys(schema).find(key => key.startsWith("root"))
    const longSchema = transform(
        schema[rootName],
        rootName
    )

    longSchema.name = ""
    const code = codify("item", longSchema, [])

    return new Function("item", `${funcHeader}${code.join("\n")}\nreturn errors.length ? errors : true`)
}

export default { compile }
