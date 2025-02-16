import {validate, mask} from "./schema.joker.json"

const data = {
    id: 100,
    thing: true,
    nested: {
        tagged: false,
    },
    wat: [
        { name: "first", count: 10 },
        // invalid item
        { name: "second", count: 2 },
    ],
    tags: [
        "fancy",
        "example",
        "this one is too long",
    ],
    funcs: {
        some: { name: "thing" },
        other: { name: "stuff" },
    },
    extraStuff: "this isnt validated (it doesnt matter) but it is masked out"
}

console.log(
    validate(data)
)
console.dir(
    mask(data),
    { depth: null }
)
