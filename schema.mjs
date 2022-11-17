const nameRegex = /^(?<optional>\?)?(?<name>[a-zA-Z\$_\.][a-zA-Z\$_0-9\.]*)(?<array>\[(?<itemopt>\?)?\])?(\/(?<desc>.+))?$/
const formatSchema = (schema, propName) => {
    if (typeof schema === "string") {
        return { "joker.type": schema }
    }

    if (schema["joker.type"] === "conditional") {
        const t = transform(schema.true, propName)
        const f = transform(schema.false, propName)

        t.name = ""
        f.name = ""
        return {
            "joker.type": "conditional",
            condition: schema.condition,
            true: t,
            false: f,
        }
    }

    return schema
}
const transform = (schema, propName) => {
    const { groups } = nameRegex.exec(propName)

    const name = `.${groups.name}`
    const array = groups.array !== undefined
    const itemOptional = groups.itemopt !== undefined
    const optional = groups.optional !== undefined
    if (typeof schema === "object" && schema["joker.type"] === undefined) {
        return {
            type: {"joker.type": "object"},
            name,
            array,
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
        itemOptional,
        optional,
    }
}

export { transform }
