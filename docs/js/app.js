import illustrator from "./illustrator/illustrator.js";
import input from "./input/input.js";
const elHtml = document.documentElement;
const elHeaders = document.getElementById("headers");
const elOutput = document.getElementById("output");
const elLegend = document.getElementById("legend");
const elHintput = document.getElementById("hintput");
function rerender(text) {
    if (text.length === 0) {
        elHeaders.classList.add("hide");
        elLegend.classList.add("hide");
    }
    else {
        elHeaders.classList.remove("hide");
        elLegend.classList.remove("hide");
    }
    let ouputMarkup = "";
    for (const char of text) {
        const codePoint = char.codePointAt(0);
        ouputMarkup += illustrator.createMarkup(char, codePoint);
    }
    elOutput.innerHTML = ouputMarkup;
}
function renderPushedInput(char) {
    const template = document.createElement("template");
    const codePoint = char.codePointAt(0);
    var markup = illustrator.createMarkup(char, codePoint);
    template.innerHTML = markup;
    elOutput.appendChild(template.content);
}
function renderFromHex(hex) {
    const codePoint = parseInt(hex, 16);
    elOutput.innerHTML = illustrator.createMarkup(`&#x${hex}`, codePoint);
}
window.addEventListener("load", () => {
    const elForm = document.getElementById("frmInput");
    const elInput = document.getElementById("txtInput");
    input.setupUI(elForm, elInput);
    elHtml.addEventListener(input.events.inputChanged, (e) => {
        const text = e.detail.input;
        rerender(text);
        if (e.detail.isPopStateInduced === false)
            window.history.pushState({ text }, "Input", `#${text}`);
    });
    elHtml.addEventListener(input.events.inputPushed, (e) => {
        renderPushedInput(e.detail.pushedChar);
        const text = e.detail.input;
        if (e.detail.isPopStateInduced === false)
            window.history.pushState({ text }, "Input", `#${text}`);
    });
    elHtml.addEventListener(input.events.hexInput, (e) => {
        renderFromHex(e.detail.hex);
        const text = e.detail.input;
        if (e.detail.isPopStateInduced === false)
            window.history.pushState({ text }, "Input", `#${text}`);
    });
    let text = "";
    if (window.location.hash.length) {
        try {
            text = decodeURI(window.location.hash.slice(1));
        }
        catch (error) {
            // Best effort: just show what's in the hash
            text = window.location.hash.slice(1);
        }
    }
    else {
        // Default input (x, o, snowman, carrot)
        text = decodeURI("x%C3%B8%E2%98%83%F0%9F%A5%95");
    }
    input.set(text);
});
window.addEventListener("popstate", (e) => {
    if (e.state) {
        input.set(e.state.text, true);
    }
});
elHintput.addEventListener("click", (e) => {
    const escapedHexString = e.target.innerText;
    input.set(escapedHexString);
});
