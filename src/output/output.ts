import input from "../input/input.js";
import createMarkup from "./illustrator/illustrator.js";
import bitFlipper from "./bitFlipper.js";
import outputEvents from "./customEvents.js";

const elHtml: HTMLElement = document.documentElement;

const elHeaders = <HTMLElement>document.getElementById("headers");
const elOutput = <HTMLElement>document.getElementById("output");
const elLegend = <HTMLElement>document.getElementById("legend");

let currentCodePoints: number[] = [];

export default { setupUI };

function setupUI() {
  elHtml.addEventListener(input.events.inputChanged, (e: CustomEvent) => {
    render(<number[]>e.detail.codePoints);
  });

  elHtml.addEventListener(outputEvents.bitFlipped, (e: CustomEvent) => {
    const { rowIndex: index, codePoint } = e.detail;
    currentCodePoints[index] = codePoint;
  });

  bitFlipper.setupUI(elOutput);
}

function render(codePoints: number[]): void {
  if (codePoints.length === 0) {
    elHeaders.classList.add("hide");
    elLegend.classList.add("hide");
    elOutput.innerHTML = "";
    currentCodePoints = [];
    return;
  }

  elHeaders.classList.remove("hide");
  elLegend.classList.remove("hide");

  for(let i = 0;i < codePoints.length; i++) {
    if (i > currentCodePoints.length - 1) {
      appendOutput(codePoints[i]);
      continue;
    }

    // Prevent re-rendering of rows that hasn't changed (user is typing?)
    if (codePoints[i] !== currentCodePoints[i]) {
      elOutput.children[i].innerHTML = createMarkup(codePoints[i]);
    }
  }

  // Remove rows at the end if incoming text is shorter than current
  for(let i = codePoints.length; i < currentCodePoints.length; i++) {
    elOutput.lastChild?.remove();
  }

  currentCodePoints = codePoints;
}

function appendOutput(codePoint: number) {
  const template = document.createElement("template");
  template.innerHTML = createMarkup(codePoint);

  elOutput.appendChild(template.content);
}