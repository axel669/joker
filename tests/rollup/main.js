import validate from "./schema.joker.json"

const data = [
    { id: 1 },
    { id: 2, name: "test" },
    { id: 3, name: 10 },
    { id: 4 },
]

console.log(
    validate(data)
)
