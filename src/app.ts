import codePointToUtf8 from "./codePointToUtf8.js";
import octetsToMarkup from "./octetsToMarkup.js";
import octetsToHex from "./octetsToHex.js";

const elForm = <HTMLElement>document.getElementById("frmInput");
const elInput = <HTMLInputElement>document.getElementById("txtInput");
const elHeaders = <HTMLElement>document.getElementById("headers");
const elOutput = <HTMLElement>document.getElementById("output");
const elLegend = <HTMLElement>document.getElementById("legend");
const elHintput = <HTMLElement>document.getElementById("hintput");

const unicodeCodePointEscapeRegEx = /^\\u\{[A-Fa-f0-9]{1,6}\}$/;

function createMarkup(char: string, codePoint: number): string {
  const bin: string = codePoint.toString(2);
  const hex: string = codePoint.toString(16);
  const octets: string[] = codePointToUtf8(codePoint);
  const utf8OctetsMarkup: string = octetsToMarkup(octets);
  const utf8Hex: string = octetsToHex(octets);

  return `<tr>
      <td class="glyph">${char}</td>
      <td class="dec">${codePoint}</td>
      <td class="hex">${hex}</td>
      <td class="bin">${bin}</td>
      <td>${utf8OctetsMarkup}</td>
      <td class="hex">${utf8Hex}</td>
    </tr>`;
}

function render(text: string): void {
  if (text.length === 0) {
    elHeaders.classList.add("hide");
    elLegend.classList.add("hide");
  } else {
    elHeaders.classList.remove("hide");
    elLegend.classList.remove("hide");
  }

  if (unicodeCodePointEscapeRegEx.test(text)) {
    // User input is Unicode code point escape (i.e. \u{FEFF}).
    // Abort normal flow and just show that char
    let hex = text.slice(3, -1);
    let codePoint = parseInt(hex, 16);
    elOutput.innerHTML = createMarkup(`&#x${hex}`, codePoint);

    return;
  }

  let ouputMarkup = "";

  for(const char of text) {
    const codePoint = <number>char.codePointAt(0);
    ouputMarkup += createMarkup(char, codePoint);
  }

  elOutput.innerHTML = ouputMarkup;
}

elInput.addEventListener("input", (e: Event) => {
  const text = (<HTMLInputElement>e.target).value;
  window.history.pushState({ text }, "Input", `#${text}`);
  render(text);
});

// Submitting the form causes a '?' to be added to the url
elForm.addEventListener("submit", e => e.preventDefault());

window.addEventListener("load", () => {
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

  window.history.pushState({ text }, "Input", `#${text}`);
  elInput.value = text;
  render(text);
});

window.addEventListener("popstate", (e: PopStateEvent) => {
  if (e.state) {
    elInput.value = e.state.text;
    elInput.focus();
    render(e.state.text);
  }
});

elHintput.addEventListener("click", (e: Event) => {
  const escapedHexString = (<HTMLElement>e.target).innerText;

  elInput.value = escapedHexString;
  window.history.pushState({ text: escapedHexString }, "Input", `#${escapedHexString}`);
  elInput.focus();

  render(escapedHexString);
});
