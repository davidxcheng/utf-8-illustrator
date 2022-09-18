import createMarkup from "../output/illustrator/illustrator.js";
import events from "./customEvents.js";

const elHtml = document.documentElement;

export default {
  setupUI
};

function setupUI(elOutput: HTMLElement) {
  elHtml.addEventListener("click", (e: MouseEvent) => {
    const elTarget = <HTMLElement>e.target;

    if (elTarget.classList.contains("bit") && elTarget.dataset.power) {
      // User flipped a bit in the binary column
      const elRow = <HTMLTableRowElement>elTarget.closest("tr");
      const elDec = <HTMLElement>elRow?.children[1];
      // Resolve the new decimal value by applying a XOR mask where 1 is
      // shifted {power} bits to the left (https://bit.ly/3MOF76F)
      const codePoint = parseInt(elDec.innerText) ^ (1 << parseInt(elTarget.dataset.power));
      elRow.innerHTML = createMarkup(codePoint, false);

      const rowIndex = Array.from((<HTMLElement>elRow.parentNode).children).indexOf(elRow);

      elHtml.dispatchEvent(new CustomEvent(events.bitFlipped, {
        detail: {
          rowIndex,
          codePoint
        }
      }));
    }
  });
}
