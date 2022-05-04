import illustrator from "./illustrator/illustrator.js";
import input from "./input/input.js";
import bitFlipper from "./bit-flipper/bit-flipper.js";

const elHtml = document.documentElement;
const elHeaders = <HTMLElement>document.getElementById("headers");
const elOutput = <HTMLElement>document.getElementById("output");
const elLegend = <HTMLElement>document.getElementById("legend");
const elHintput = <HTMLElement>document.getElementById("hintput");

function rerender(text: string): void {
  if (text.length === 0) {
    elHeaders.classList.add("hide");
    elLegend.classList.add("hide");
  } else {
    elHeaders.classList.remove("hide");
    elLegend.classList.remove("hide");
  }

  let ouputMarkup = "";

  for(const char of text) {
    const codePoint = <number>char.codePointAt(0);
    ouputMarkup += illustrator.createMarkup(codePoint);
  }

  elOutput.innerHTML = ouputMarkup;
}

function renderPushedInput(char: string) {
  const template = document.createElement("template");
  const codePoint = <number>char.codePointAt(0);

  template.innerHTML = illustrator.createMarkup(codePoint);;
  elOutput.appendChild(template.content);
}

function renderFromHex(hex: string) {
  const codePoint = parseInt(hex, 16);
  elOutput.innerHTML = illustrator.createMarkup(codePoint);
}

window.addEventListener("load", () => {
  const elForm = <HTMLFormElement>document.getElementById("frmInput");
  const elInput = <HTMLInputElement>document.getElementById("txtInput");

  input.setupUI(elInput, elForm);
  bitFlipper.setupUI(elOutput);

  elHtml.addEventListener(input.events.inputChanged, (e: CustomEvent) => {
    const text = e.detail.input;
    rerender(text);

    if (e.detail.isPopStateInduced === false)
      window.history.pushState({ text }, "Input", `#${text}`);
  });

  elHtml.addEventListener(input.events.inputPushed, (e: CustomEvent) => {
    renderPushedInput(e.detail.pushedChar);
    const text = e.detail.input;

    if (e.detail.isPopStateInduced === false)
      window.history.pushState({ text }, "Input", `#${text}`);
  });

  elHtml.addEventListener(input.events.hexInput, (e: CustomEvent) => {
    renderFromHex(e.detail.hex);
    const text = e.detail.input;

    if (e.detail.isPopStateInduced === false)
      window.history.pushState({ text }, "Input", `#${text}`);
  });

  let text = "";

  if (window.location.hash.length) {
    try {
      text = decodeURI(window.location.hash.slice(1));
    } catch (error) {
      // Best effort: just show what's in the hash
      text = window.location.hash.slice(1);
    }
  } else {
    // Default input (x, o, snowman, carrot)
    text = decodeURI("x%C3%B8%E2%98%83%F0%9F%A5%95");
  }

  input.set(text);
});

window.addEventListener("popstate", (e: PopStateEvent) => {
  if (e.state) {
    input.set(e.state.text, true);
  }
});

elHintput.addEventListener("click", (e: Event) => {
  const escapedHexString = (<HTMLElement>e.target).innerText;
  input.set(escapedHexString);
});
