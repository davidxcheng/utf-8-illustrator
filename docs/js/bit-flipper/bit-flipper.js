import illustrator from "../illustrator/illustrator.js";
import events from "./custom-events.js";
const elHtml = document.documentElement;
function setupUI(elOutput) {
    elOutput.addEventListener("click", (e) => {
        const elTarget = e.target;
        if (elTarget.classList.contains("bit") && elTarget.dataset.power) {
            const elRow = elTarget.closest("tr");
            const elDec = elRow === null || elRow === void 0 ? void 0 : elRow.children[1];
            const codePoint = parseInt(elDec.innerText) ^ (1 << parseInt(elTarget.dataset.power));
            elRow.innerHTML = illustrator.createMarkup(codePoint, false);
            elHtml.dispatchEvent(new CustomEvent(events.bitFlipped));
        }
    });
}
export default {
    setupUI
};
