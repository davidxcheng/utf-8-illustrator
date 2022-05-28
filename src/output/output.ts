import input from "../input/input.js";
import createMarkup from "./illustrator/illustrator.js";
import bitFlipper from "./bitFlipper.js";

const elHtml: HTMLElement = document.documentElement;

const elHeaders = <HTMLElement>document.getElementById("headers");
const elOutput = <HTMLElement>document.getElementById("output");
const elLegend = <HTMLElement>document.getElementById("legend");

export default { setupUI };

function setupUI() {
  elHtml.addEventListener(input.events.inputChanged, (e: CustomEvent) => {
    rerender(e.detail.input);
  });

  elHtml.addEventListener(input.events.inputPushed, (e: CustomEvent) => {
    renderPushedInput(e.detail.pushedChar);
  });

  elHtml.addEventListener(input.events.hexInput, (e: CustomEvent) => {
    renderFromHex(e.detail.hex);
  });

  bitFlipper.setupUI(elOutput);
}

function rerender(text: string): void {
  if (text.length === 0) {
    elHeaders.classList.add("hide");
    elLegend.classList.add("hide")
  } else {
    elHeaders.classList.remove("hide");
    elLegend.classList.remove("hide");
  }

  let ouputMarkup = "";

  for(const char of text) {
    const codePoint = <number>char.codePointAt(0);
    ouputMarkup += createMarkup(codePoint);
  }

  elOutput.innerHTML = ouputMarkup;
}

function renderPushedInput(char: string) {
  const template = document.createElement("template");
  const codePoint = <number>char.codePointAt(0);

  template.innerHTML = createMarkup(codePoint);;
  elOutput.appendChild(template.content);
}

function renderFromHex(hex: string) {
  const codePoint = parseInt(hex, 16);
  elOutput.innerHTML = createMarkup(codePoint);
}
