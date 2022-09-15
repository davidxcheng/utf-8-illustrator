import events from "./customEvents.js";
import outputEvents from "../output/customEvents.js";
import scanner from "./scanner.js";

const elHtml = document.documentElement;
let elInput: HTMLInputElement;
let currentInput = "";
let currentInputIsEscapeSequence = false;

// Matches unicode code point escape sequence. Ex: "\u{FEFF}"
const unicodeCodePointEscapeRegEx = /^\\u\{[A-Fa-f0-9]{1,6}\}$/;
const unicodeCodePointEscapeUpperCaseRegEx = /^\\u\{[A-F0-9]{1,6}\}$/;

export default {
  setupUI,
  set,
  events,
};

/**
 * Attach event listeners to the input field and the form
 *
 * @param elTextInput The text input element
 * @param elFrom The form that the text input belongs to
 */
function setupUI(elTextInput: HTMLInputElement, elFrom: HTMLFormElement) {
  elInput = elTextInput;

  // Submitting the form causes a '?' to be added to the url
  elFrom.addEventListener("submit", e => e.preventDefault);

  elTextInput.addEventListener("input", (e: Event) => {
    const incomingText = (<HTMLInputElement>e.target).value;
    const incomingCodePoints = scanner.scan(incomingText);
    
    dispatchInputEvent(incomingText, incomingCodePoints);
    currentInput = incomingText;
  });

  elHtml.addEventListener(outputEvents.bitFlipped, (e: CustomEvent) => {
    const hexCodePoints: number[] = e.detail.hexCodePoints;
    let text = "";

    if (currentInputIsEscapeSequence) {
      // Try to detect the casing of the hex (won't work if casing is mixed)
      text = unicodeCodePointEscapeUpperCaseRegEx.test(currentInput)
        ? `\\u{${hexCodePoints[0].toString(16).toUpperCase()}}`
        : `\\u{${hexCodePoints[0].toString(16)}}`;
    } else {
      text = String.fromCodePoint(...hexCodePoints);
    }

    elInput.value = text;
    currentInput = text;
    window.history.pushState({ text }, "Input", `#${text}`);
  });

  window.addEventListener("popstate", (e: PopStateEvent) => {
    if (e.state) {
      set(e.state.text, true);
    }
  });
}

function set(incoming: string, isPopStateInduced: boolean = false) {
  // Note: setting value will not trigger an input event
  elInput.value = incoming;
  const incomingCodePoints = scanner.scan(incoming);
  dispatchInputEvent(incoming, incomingCodePoints, isPopStateInduced);
  currentInput = incoming;

  elInput.focus();
}

function dispatchInputEvent(incoming: string, codePoints: number[],  isPopStateInduced: boolean = false) {
  elHtml.dispatchEvent(new CustomEvent(events.inputChanged, {
    detail: {
      codePoints,
    },
  }));

  if (isPopStateInduced === false) {
    window.history.pushState({ text: incoming }, "Input", `#${incoming}`);
  }
}
