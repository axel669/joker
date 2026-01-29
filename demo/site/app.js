import * as joker from "https://esm.sh/@axel669/joker@0.3.6"
import { render, html, useEffect } from "./comp.js"

import { cssText } from "./theme.js"

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
ws.macro("menu.grid")`
    area: action;
    gr.cols: 1fr 1fr;
    p: 0px;
    h: 100%;
    gr.rows.a: unset;
    t.sz: @text-size-title;
`

const aceTron = {
    isDark: true,
    cssClass: "ace-tron",
    cssText,
}
const editor = {}
const aceSetup = () => {
    const code = ace.edit("code")
    // code.setTheme("ace/theme/monokai")
    code.setTheme(aceTron)
    code.session.setMode("ace/mode/javascript")
    code.setOptions({
        fontFamily: "Kode Mono",
        fontSize: "14px",
    })
    code.setKeyboardHandler("ace/keyboard/sublime")
    code.setValue(localStorage.code ?? "")
    code.clearSelection()
    code.on(
        "change",
        () => {
            localStorage.code = code.getValue()
        }
    )

    editor.code = code

    const data = ace.edit("data")
    data.setTheme(aceTron)
    data.session.setMode("ace/mode/json")
    data.setOptions({
        fontFamily: "Kode Mono",
        fontSize: "14px",
    })
    data.setKeyboardHandler("ace/keyboard/sublime")
    data.setValue(localStorage.data ?? "")
    data.clearSelection()
    data.on(
        "change",
        () => {
            localStorage.data = data.getValue()
        }
    )

    editor.data = data
}
const load = (type) =>
    () => {
        const [target, value] = examples[type]
        editor[target].setValue(value)
        editor[target].clearSelection()
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
    return html`
        <ws-screen data-ws="@pad-left: 0px; @screen-width: 1024px; @base-radius: 0px;">
            <ws-paper data-ws="@color: @primary;">
                <ws-flex data-ws="area: header; p: 0px;">
                    <ws-titlebar data-ws="@color: @primary; variant.fill;">
                        <ws-text title="">
                            Joker Playground
                        <//>

                        <ws-grid data-ws="menu.grid;">
                            <a href="https://github.com/axel669/joker"
                            target="_blank" data-ws="" button>
                                <ws-icon data-icon="brand-github" />
                            <//>
                            <a href="https://www.npmjs.com/package/@axel669/joker"
                            target="_blank" data-ws="" button>
                                <ws-icon data-icon="brand-npm" />
                            <//>
                        <//>
                    <//>
                    <ws-text>
                        The code does not try to make a fancy output for the
                        screen; instead it runs as normal an outputs to the
                        browser console so that the full set of browser
                        debugging tools can be used without worrying about my
                        code getting in the way.
                    <//>
                <//>
                <ws-grid data-ws="gr.cols: 1.5fr 1fr; gr.rows: min-content 1fr; p: 0px; gap: 0px 8px;">
                    <ws-titlebar data-ws="@color: @info; variant.fill;">
                        <ws-text title="">
                            Code
                        <//>

                        <ws-flex data-ws="area: action; fl.dir: row; p: 0px;">
                            <button data-ws="pad.compact;" onClick=${load("code")}>
                                <ws-icon data-icon="file-type-js" /> Load Example
                            <//>
                            <button data-ws="pad.compact;" onClick=${run}>
                                <ws-icon data-icon="player-play-filled" /> Run
                            <//>
                        <//>
                    <//>
                    <ws-titlebar data-ws="@color: @info; variant.fill;">
                        <ws-text title="">
                            Data
                        <//>

                        <ws-flex data-ws="area: action; fl.dir: row; p: 0px;">
                            <button data-ws="pad.compact;" onClick=${load("valid")}>
                                <ws-icon data-icon="mist" /> Load Valid
                            <//>
                            <button data-ws="pad.compact;" onClick=${load("invalid")}>
                                <ws-icon data-icon="mist-off" /> Load Invalid
                            <//>
                        <//>
                    <//>
                    <div id="code" data-ws="h: 100%;"><//>
                    <div id="data" data-ws="h: 100%;"><//>
                <//>
            <//>
        <//>
    `
}

render(html`<${App} />`, document.body)
