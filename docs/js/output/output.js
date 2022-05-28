import input from "../input/input.js";
import createMarkup from "./illustrator/illustrator.js";
import bitFlipper from "./bitFlipper.js";
const elHtml = document.documentElement;
const elHeaders = document.getElementById("headers");
const elOutput = document.getElementById("output");
const elLegend = document.getElementById("legend");
export default { setupUI };
function setupUI() {
    elHtml.addEventListener(input.events.inputChanged, (e) => {
        rerender(e.detail.input);
    });
    elHtml.addEventListener(input.events.inputPushed, (e) => {
        renderPushedInput(e.detail.pushedChar);
    });
    elHtml.addEventListener(input.events.hexInput, (e) => {
        renderFromHex(e.detail.hex);
    });
    bitFlipper.setupUI(elOutput);
}
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
        ouputMarkup += createMarkup(codePoint);
    }
    elOutput.innerHTML = ouputMarkup;
}
function renderPushedInput(char) {
    const template = document.createElement("template");
    const codePoint = char.codePointAt(0);
    template.innerHTML = createMarkup(codePoint);
    ;
    elOutput.appendChild(template.content);
}
function renderFromHex(hex) {
    const codePoint = parseInt(hex, 16);
    elOutput.innerHTML = createMarkup(codePoint);
}
