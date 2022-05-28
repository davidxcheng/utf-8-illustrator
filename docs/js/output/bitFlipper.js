import createMarkup from "../output/illustrator/illustrator.js";
import events from "./customEvents.js";
const elHtml = document.documentElement;
export default {
    setupUI
};
function setupUI(elOutput) {
    elHtml.addEventListener("click", (e) => {
        const elTarget = e.target;
        if (elTarget.classList.contains("bit") && elTarget.dataset.power) {
            const elRow = elTarget.closest("tr");
            const elDec = elRow === null || elRow === void 0 ? void 0 : elRow.children[1];
            const codePoint = parseInt(elDec.innerText) ^ (1 << parseInt(elTarget.dataset.power));
            elRow.innerHTML = createMarkup(codePoint, false);
            let hexCodePoints = [];
            elOutput.querySelectorAll("[data-hex]").forEach((elHex) => {
                hexCodePoints.push(parseInt(elHex.dataset["hex"], 16));
            });
            elHtml.dispatchEvent(new CustomEvent(events.bitFlipped, {
                detail: {
                    hexCodePoints
                }
            }));
        }
    });
}
