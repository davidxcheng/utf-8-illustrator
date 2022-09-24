import input from "../input/input.js";
import createMarkup from "./illustrator/illustrator.js";
import bitFlipper from "./bitFlipper.js";
import outputEvents from "./customEvents.js";
const elHtml = document.documentElement;
const elHeaders = document.getElementById("headers");
const elOutput = document.getElementById("output");
const elLegend = document.getElementById("legend");
let currentCodePoints = [];
export default { setupUI };
function setupUI() {
    elHtml.addEventListener(input.events.inputChanged, (e) => {
        render(e.detail.codePoints);
    });
    elHtml.addEventListener(outputEvents.bitFlipped, (e) => {
        const { rowIndex: index, codePoint } = e.detail;
        currentCodePoints[index] = codePoint;
    });
    bitFlipper.setupUI(elOutput);
}
function render(codePoints) {
    var _a;
    if (codePoints.length === 0) {
        elHeaders.classList.add("hide");
        elLegend.classList.add("hide");
        elOutput.innerHTML = "";
        currentCodePoints = [];
        return;
    }
    elHeaders.classList.remove("hide");
    elLegend.classList.remove("hide");
    for (let i = 0; i < codePoints.length; i++) {
        if (i > currentCodePoints.length - 1) {
            appendOutput(codePoints[i]);
            continue;
        }
        if (codePoints[i] !== currentCodePoints[i]) {
            elOutput.children[i].innerHTML = createMarkup(codePoints[i]);
        }
    }
    for (let i = codePoints.length; i < currentCodePoints.length; i++) {
        (_a = elOutput.lastChild) === null || _a === void 0 ? void 0 : _a.remove();
    }
    currentCodePoints = codePoints;
}
function appendOutput(codePoint) {
    const template = document.createElement("template");
    template.innerHTML = createMarkup(codePoint);
    elOutput.appendChild(template.content);
}
