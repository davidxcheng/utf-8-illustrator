import illustrator from "../illustrator/illustrator.js";
import events from "./custom-events.js";

const elHtml = document.documentElement;

function setupUI(elOutput: HTMLElement) {
  elOutput.addEventListener("click", (e: MouseEvent) => {
    const elTarget = <HTMLElement>e.target;

    if (elTarget.classList.contains("bit") && elTarget.dataset.power) {
      // User flipped a bit in the binary column
      const elRow = <HTMLTableRowElement>elTarget.closest("tr");
      const elDec = <HTMLElement>elRow?.children[1];
      // Resolve the new decimal value by applying a XOR mask where 1 is
      // shifted {power} bits to the left (https://bit.ly/3MOF76F)
      const codePoint = parseInt(elDec.innerText) ^ (1 << parseInt(elTarget.dataset.power));

      elRow.innerHTML = illustrator.createMarkup(codePoint, false);

      elHtml.dispatchEvent(new CustomEvent(events.bitFlipped));
    }
  });
}

export default {
  setupUI
};