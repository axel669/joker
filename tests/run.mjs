import fs from "fs/promises"

import { validator } from "../joker.mjs"

import AJV from "ajv"
const ajv = new AJV()

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
const data = [{
    "_id": "test",
    "index": 0,
    "guid": "testing",
    "isActive": true,
    "age": 100,
    "eyeColor": "testing",
    "name": "testing",
    "gender": "testing",
    "latitude": 100,
    "longitude": 100,
    "tags": ["testing", null],
    "favoriteFruit": "testing"
}]

// const validate = validator(schema)
// console.log(validate.toString())

// const valid = validate(data)
// console.log(valid)

{
    const schema = {
        root: {
            "id": "number",
            "wat[]": {
                "name": "string",
                "count": "number",
            }
        }
    }
    const data = {
        id: 100,
        wat: [
            { name: "hi", count: "0" },
            { name: "test", count: 10 },
            { name: "another one", count: 0 },
        ]
    }
    const validate = validator(schema)

    console.log(data)
    console.log(validate.toString())
    console.log(
        validate(data)
    )
}
