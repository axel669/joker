import fs from "node:fs/promises"
import validate from "./validate.js"
import mask from "./mask.js"
import closureValue from "./closure-value.js"
import jsonc from "jsonc-parser"

export default {
    async load(file) {
        if (file.endsWith(".joker.json") === false) {
            return
        }
        const schemaSource = await fs.readFile(file, "utf8")
        const schema = jsonc.parse(schemaSource)
        const validator = validate(
            schema,
            closureValue.module,
            "export const validate ="
        )
        const masker = mask(
            schema,
            closureValue.module,
            "export const mask ="
        )
        console.log(validator.code)
        return `/*\nSchema\n${schemaSource}\n*/\n${validator.code}\n\n${masker.code}`
    }
}
