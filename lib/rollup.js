// import fs from "node:fs/promises"
import fs from "fs-jetpack"
import path from "node:path"
import { pathToFileURL } from "node:url"

import glob from "fast-glob"

import validate from "./validate.js"
import mask from "./mask.js"
import closureValue from "./closure-value.js"
import jsonc from "jsonc-parser"

export default async (options = {}) => {
    const {
        extensions,
    } = options

    const exts =
        (Array.isArray(extensions) === true)
        ? extensions
        : [extensions].filter(ext => ext !== undefined)

    const files = await glob(exts)
    const extensionImports = files.map(
        loc => `import ${JSON.stringify(path.resolve(loc))}`
    ).join("\n")

    for (const file of files) {
        await import(
            pathToFileURL(
                path.resolve(file)
            )
        )
    }

    return {
        async load(file) {
            if (file.endsWith(".joker.json") === false) {
                return
            }
            const schemaSource = await fs.readAsync(file)
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
            const code = `
import { builtin } from "@axel669/joker/functions"
${extensionImports}
/*
Schema
${schemaSource}
*/
${validator.code}
${masker.code}
            `
            return code
        }
    }
}
