import fs from "fs/promises"

import bench from "benchmark"

import { validator } from "../joker.mjs"
import AJV from "ajv"

const suite = new bench.Suite()

const schema = {
    "root[?]": {
        "_id": "string",
        "?index": "number",
        "guid": "string",
        "isActive": "bool",
        "age": "number",
        "eyeColor": "string",
        "name": "string",
        "gender": "string",
        "latitude": "number",
        "longitude": "number",
        "tags[]": "string",
        "favoriteFruit": "string"
    }
}
const data = JSON.parse(
    await fs.readFile("tests/big.json", "utf8")
)
// const data = {
//     id: 100,
//     wat: [
//         { name: "hi", count: "0" },
//         { name: "test", count: 10 },
//         { name: "another one", count: 0 },
//     ]
// }
const validate = validator(schema)

const ajv = new AJV()
const validate2 = ajv.compile({
    type: "array",
    items: {
        type: "object",
        properties: {
            "_id": { type: "string" },
            "index": { type: "number" },
            "guid": { type: "string" },
            "isActive": { type: "boolean" },
            "age": { type: "number" },
            "eyeColor": { type: "string" },
            "name": { type: "string" },
            "gender": { type: "string" },
            "latitude": { type: "number" },
            "longitude": { type: "number" },
            "tags": {
                type: "array",
                items: { type: "string" }
            },
            "favoriteFruit": { type: "string" },
        }
    }
})

// console.log(JSON.stringify(data).length)

const valid = [
    validate(data),
    validate2(data)
]

console.log(valid)

if (valid.includes(false) === true) {
    process.exit(1)
}

// console.log(validate)
// console.log(validate2)

suite.add(
    "joker - reuse",
    () => validate(data)
)
suite.add(
    "ajv",
    () => validate2(data)
)
// suite.add(
//     "joker - create and use",
//     () => {
//         const validate = validator(schema)
//         const valid = validate(data)
//     }
// )

suite.on('cycle', function (event) {
    console.log(String(event.target));
})

suite.run()
