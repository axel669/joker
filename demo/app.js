import * as joker from "https://esm.sh/@axel669/joker@0.3.6"
import { render, html, useEffect } from "./comp.js"

const codeSample = `const schema = {
    root: {
        id: "number",
        name: "string",
        class: "string",
        spec: "string"
    }
}

const validate = joker.validator(schema)

console.log(
    validate(data)
)
`
const validData = JSON.stringify({
    id: 100,
    name: "axel669",
    class: "Monk",
    spec: "Mistweaver",
}, null, 4)
const invalidData = JSON.stringify({
    id: 100,
    name: "axel669",
    class: "Monk",
    spec: false,
}, null, 4)
const examples = {
    code: ["code", codeSample],
    valid: ["data", validData],
    invalid: ["data", invalidData],
}

ws.macro("section")`
    area: %0;
    bg.c: hsl(%1, @layer-element);
    t.c: black;
    flex;
    fl.cn;
`
// ws.macro("app.grid")`
//     gr.cols: 1fr 1fr;
// `

const editor = {}
const aceSetup = () => {
    const code = ace.edit("code")
    code.setTheme("ace/theme/monokai")
    code.session.setMode("ace/mode/javascript")
    code.setOptions({
        fontFamily: "Kode Mono",
        fontSize: "14px",
    })
    code.setValue(localStorage.code ?? "")
    code.on(
        "change",
        () => {
            localStorage.code = code.getValue()
        }
    )

    editor.code = code

    const data = ace.edit("data")
    data.setTheme("ace/theme/cobalt")
    data.session.setMode("ace/mode/json")
    data.setOptions({
        fontFamily: "Kode Mono",
        fontSize: "14px",
    })
    data.setValue(localStorage.data ?? "")
    data.on(
        "change",
        () => {
            localStorage.data = data.getValue()
        }
    )

    editor.data = data
}
const App = () => {
    useEffect(aceSetup, [])
    const run = () => {
        const code = editor.code.getValue()
        const data = JSON.parse(
            editor.data.getValue()
        )
        const f = new Function("joker", "data", code)
        console.clear()
        f(joker, data)
    }
    const setExample = (evt) => {
        const [target, value] = examples[evt.target.value]
        evt.target.value = null
        editor[target].setValue(value)
    }
    return html`
        <ws-screen data-ws="@pad-left: 0px; @screen-width: 1024px;">
            <ws-paper data-ws="@color: @primary;">
                <ws-flex data-ws="area: header;">
                    <ws-text>
                        The code does not try to make a fancy output for the
                        screen; instead it runs as normal an outputs to the
                        browser console so that the full set of browser
                        debugging tools can be used without worrying about my
                        code getting in the way.
                    <//>
                    <ws-select onChange=${setExample} data-ws="variant.outline; @color: @info;">
                        <div slot="selected">
                            Examples
                            <ws-selected data-ws="hide;"><//>
                        <//>
                        <ws-option value="code">Fill Example Code<//>
                        <ws-option value="valid">Fill Valid Data<//>
                        <ws-option value="invalid">Fill Invalid Data<//>
                    <//>
                    <button data-ws="variant.fill; @color: @accent;" onClick=${run}>
                        Run
                    <//>
                <//>
                <ws-grid data-ws="gr.cols: 1.5fr 1fr; gr.rows.a: unset;">
                    <div id="code" data-ws="h: 100%;"><//>
                    <div id="data" data-ws="h: 100%;"><//>
                <//>
            <//>
        <//>
    `
}

render(html`<${App} />`, document.body)
