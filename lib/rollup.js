import fs from "node:fs/promises"
import { moduleValidate } from "./validate.mjs"

export default {
    async load(file) {
        if (file.endsWith(".joker.json") === false) {
            return
        }
        const schema = JSON.parse(
            await fs.readFile(file, "utf8")
        )
        return moduleValidate(schema)
    }
}
