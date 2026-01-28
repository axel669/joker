import jokerRollup from "@axel669/joker/rollup-plugin"
import resolve from "@rollup/plugin-node-resolve"

export default {
    input: "./main.js",
    output: {
        file: "./out/test.js",
        format: "esm"
    },
    plugins: [
        resolve(),
        jokerRollup({
            extensions: [
                "./ext/**/*.js"
            ]
        }),
    ]
}
