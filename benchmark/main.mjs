import data from "./big.json" assert {type: "json"}

import bench from "benchmark"

import joker from "../joker.mjs"
import AJV from "ajv"

const suite = new bench.Suite()

const schema = {
    "root[]": {
        "_id": {
            "joker.type": "conditional",
            condition: () => Math.random() < 0.5 ? "a" : "b",
            a: {"joker.type": "string", min: 5},
            b: "string"
        },
        // "_id": {"joker.type": "string", format: /.+/},
        // "_id": "string",
        "index": "number",
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
const ajvSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            // "_id": { type: "string", minLength: 5 },
            "_id": { type: "string", pattern: ".+" },
            // "_id": { type: "string" },
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
}

const validate = joker.validator(schema)

const ajv = new AJV()
const validate2 = ajv.compile(ajvSchema)

const valid = [
    validate(data),
    validate2(data)
]

console.log(valid)

if (valid[0] !== true || valid[1] !== true) {
    process.exit(1)
}

suite.add(
    "joker",
    () => validate(data)
)
suite.add(
    "ajv",
    () => validate2(data)
)

suite.on('cycle', function (event) {
    console.log(String(event.target));
})

suite.run()
