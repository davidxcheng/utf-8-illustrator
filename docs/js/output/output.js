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
        rerender(e.detail.codePoints);
    });
    bitFlipper.setupUI(elOutput);
}
function rerender(codePoints) {
    if (codePoints.length === 0) {
        elHeaders.classList.add("hide");
        elLegend.classList.add("hide");
    }
    else {
        elHeaders.classList.remove("hide");
        elLegend.classList.remove("hide");
    }
    let ouputMarkup = "";
    for (const codePoint of codePoints) {
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
