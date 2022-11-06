import fs from "fs/promises"

import joker from "../joker.mjs"

const schema = {
    root: {
        "id": "number",
        "wat[]": {
            "name": "string",
            "count": "number",
        },
        "?tags[]": "string"
    }
}
const data = {
    id: 100,
    wat: [
        { name: "hi", count: "0" },
        { name: "test", count: 10 },
        { name: "another one", count: 0 },
    ],
    tags: null,
}

const schemaBig = {
    "root[]": {
        "_id": "string",
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
const dataBig = JSON.parse(
    await fs.readFile("tests/big.json", "utf8")
)

export const test = ({Assert, Section}) => {
    Section("small")

    {
        const validate = joker.compile(schema)
        const valid = validate(data)

        Assert(typeof validate)
            .eq("function")
        Assert(valid)
            ("length").eq(1)
            ("0").eq(".wat.0.count is not a number")
    }

    Section("big")

    {
        const validate = joker.compile(schemaBig)
        const valid = validate(dataBig)

        Assert(typeof validate)
            .eq("function")
        Assert(valid)
            .eq(true)
    }
}
