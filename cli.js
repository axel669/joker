#! /usr/bin/env node

import { parseArgs } from "node:util"
import fs from "node:fs/promises"
import path from "node:path"

import joker from "./joker.mjs"
import jsonc from "jsonc-parser"

const args = parseArgs({
    options: {
        validator: {
            default: false,
            type: "boolean",
            short: "v"
        },
        mask: {
            default: false,
            type: "boolean",
            short: "m"
        },
        dest: {
            type: "string",
            default: "."
        },
    },
    allowPositionals: true,
})

if (args.positionals.length === 0) {
    console.warn("No source files given")
    process.exit(1)
}

const closureValue = (value) =>
    (typeof value === "function")
        ? value.toString()
        : JSON.stringify(value)

const generateStandalone = async (source, dest) => {
    const outputCode =
        source.code
            .replace(
                /closure\["([\w\.\$]+)"\]/g,
                (_, key) => closureValue(source.closure[key])
            )
            .replace(
                /^return \((item|source)\) \=\>/m,
                "export default ($1) =>"
            )
    await fs.writeFile(dest, `${outputCode}\n`)
}

const dest = path.resolve(args.values.dest)
for (const sourceFile of args.positionals) {
    const schema = jsonc.parse(
        await fs.readFile(sourceFile, "utf8")
    )
    const dir = path.dirname(sourceFile)
    const name = path.basename(sourceFile, path.extname(sourceFile))

    if (args.values.validator === true) {
        console.log(`Generating validator file for ${sourceFile}`)
        await generateStandalone(
            joker.validator(schema),
            path.resolve(dest, `${name}.validate.js`)
        )
    }
    if (args.values.validator === true) {
        console.log(`Generating mask file for ${sourceFile}`)
        await generateStandalone(
            joker.mask(schema),
            path.resolve(dest, `${name}.mask.js`)
        )
    }
}
