import jokerRollup from "@axel669/joker/rollup-plugin"

export default {
    input: "main.js",
    output: {
        file: "out/test.js",
        format: "esm"
    },
    plugins: [ jokerRollup ]
}
