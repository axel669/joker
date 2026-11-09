export const schema = {
    root: {
        "id": "number",
        "wat[]": {
            "name": "string",
            "count": "number",
        },
        "?tags[]": "string",
        "?testing[?]": {
            "id": "string"
        },
        "funcs{}": {
            "name": "string"
        }
    }
}
export const validData = {
    id: 100,
    wat: [
        { name: "hi", count: -5, extra: true },
        { name: "test", count: 10 },
        { name: "another one", count: 0 },
    ],
    tags: null,
    funcs: {
        test: { name: "wat" }
    }
}
export const invalidData = {
    id: 69,
    tags: [ 100 ],
    wat: [
        { name: "hi", count: "-5" }
    ],
    testing: [ null ]
}
