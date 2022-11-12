import { builtin } from "./types.mjs"

const type = Symbol("type")
const nameRegex = /^(?<optional>\?)?(?<name>[a-zA-Z\$_\.][a-zA-Z\$_0-9\.]*)(?<array>\[(?<itemopt>\?)?\])?(\/(?<desc>.+))?$/
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
        type: typeof schema === "string" ? {"joker.type": schema} : schema,
        name,
        array,
        itemOptional,
        optional,
    }
}

export { transform }
