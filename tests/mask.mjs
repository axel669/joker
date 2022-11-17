import joker from "../joker.mjs"
import mask from "../mask.mjs"

const func = mask({
    root: {
        id: joker.string()
    }
})
