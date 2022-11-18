import joker from "../joker.mjs"

import AJV from "ajv"
const ajv = new AJV()

const schema = {
    "root[]": {
        "_id": {"joker.type": "string", min: 5},
        // "_id": "string",
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

// response.document.count.maximum
// response.document.size.maximum

// const ajvSchema = {
//     type: "array",
//     items: {
//         type: "object",
//         properties: {
//             // "_id": { type: "string", minLength: 5 },
//             "_id": { type: "string" },
//             "index": { type: "number" },
//             "guid": { type: "string" },
//             "isActive": { type: "boolean" },
//             "age": { type: "number" },
//             "eyeColor": { type: "string" },
//             "name": { type: "string" },
//             "gender": { type: "string" },
//             "latitude": { type: "number" },
//             "longitude": { type: "number" },
//             "tags": {
//                 type: "array",
//                 items: { type: "string" }
//             },
//             "favoriteFruit": { type: "string" },
//         }
//     }
// }
// const v = ajv.compile(ajvSchema)
// console.log(v.toString())

// const valid = validate(data)
// console.log(valid)

{
    const schema = {
        "root": {
            "?id": "number",
            "wat": {"joker.type": "array", length: 2},
            "wat[]": {
                "joker.type": "conditional",
                condition: (item) => item.name.length < 3 ? "a" : "b",
                a: {
                    "name": "string",
                    "count": {"joker.type": "string", min: 5},
                    "tags[]": "string"
                },
                b: {
                    "name": {
                        "joker.type": "string",
                        format: /^\w+$/
                    },
                    "count": "number",
                }
            }
        }
    }
    const data = {
        id: 100,
        wat: [
            { name: "hi", count: "0", tags: ["a", "b"] },
            { name: "test", count: 10 },
            { name: "another one", count: "0" },
        ]
    }
    const validate = joker.validator(schema)

    console.log(validate)
    console.log(validate(null))
    console.log(validate(data))

    // const _valid = joker.validator(_schema)
    // console.log(_valid)
    // console.log(_valid(_data))

    // console.log(validate({id: "hi"}))

    // console.log(data)
    // console.log(validate.toString())
    // console.log(
    //     validate(data)
    // )
}
