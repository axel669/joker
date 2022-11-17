import { buildType } from "./types.mjs"
import { transform } from "./schema.mjs"

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

    const code = codify("source", longSchema, [])

    return code
}

export default mask
