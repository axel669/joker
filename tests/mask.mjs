import joker from "../joker.mjs"

const schema = {
    "root[]": {
        "joker.type": "conditional",
        condition: (item) => item.key,
        first: {
            a: "int",
            "c{}": {
                "d[]": "int"
            }
        },
        second: {
            b: "string",
        }
    }
}
const data = [
    {
        key: "first",
        a: 10,
        b: 12,
        c: {
            wat: {
                d: [1, 2, 3, 4]
            }
        }
    },
    {key: "second", a: 10, b: 12},
]
// const schema = {
//     root: {
//         a: "int",
//         b: "string",
//     }
// }
const mask = joker.mask(schema)
const m = (source) => {
    return source
}
const m2 = (source) => {
    return {
        a: source.a,
        b: source.b,
    }
}
const m3 = (source) => {
    return source.map(
        source => source
    )
}

console.log(mask)
console.log(mask.code)

console.log(
    JSON.stringify(mask(data), null, 2)
)
