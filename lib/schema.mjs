const nameRegex = /^(?<optional>\?)?(?<name>[a-zA-Z\$_\.][a-zA-Z\$_0-9\.]*)(?<array>\[(?<itemopt>\?)?\])?(?<obj>\{\})?(\/(?<desc>.+))?$/
const formatSchema = (schema, propName) => {
    if (typeof schema === "string") {
        return { "joker.type": schema }
    }

    if (schema["joker.type"] === "conditional") {
        const { "joker.type": _, condition, ...rest } = schema
        return Object.fromEntries([
            ["joker.type", "conditional"],
            ["condition", schema.condition],
            ...Object.entries(rest).map(
                ([key, value]) => {
                    const res = [
                        key,
                        transform(value, propName)
                    ]
                    res[1].name = ""
                    return res
                }
            )
        ])
    }

    return schema
}
const transform = (schema, propName) => {
    const { groups } = nameRegex.exec(propName)

    const name = `.${groups.name}`
    const array = groups.array !== undefined
    const object = groups.obj !== undefined
    const itemOptional = groups.itemopt !== undefined
    const optional = groups.optional !== undefined
    if (typeof schema === "object" && schema["joker.type"] === undefined) {
        return {
            type: {"joker.type": "object"},
            name,
            array,
            object,
            itemOptional,
            optional,
            props: Object.entries(schema).map(
                ([key, subSchema]) => transform(subSchema, key)
            )
        }
    }

    return {
        // type: typeof schema === "string" ? {"joker.type": schema} : schema,
        type: formatSchema(schema, groups.name),
        name,
        array,
        object,
        itemOptional,
        optional,
    }
}

export { transform }
