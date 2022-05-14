import events from "./custom-events.js";
import bitFlipperEvents from "../bit-flipper/custom-events.js";

const elHtml = document.documentElement;
const elOutput = <HTMLElement>document.getElementById("output");
let elInput: HTMLInputElement;
let currentInput = "";
let currentInputIsEscapeSequence = false;

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
    disptachInputEvent(incomingText);
    currentInput = incomingText;
  });

  elHtml.addEventListener(bitFlipperEvents.bitFlipped, () => {
    let hexCodePoints: number[] = [];
    elOutput.querySelectorAll("[data-hex]").forEach((elHex: Element) => {
      hexCodePoints.push(parseInt(<string>(<HTMLElement>elHex).dataset["hex"], 16));
    });

    elInput.value = String.fromCodePoint(...hexCodePoints);
  });
}

function set(incoming: string, isPopStateInduced: boolean = false) {
  // Note: setting value will not trigger an input event
  elInput.value = incoming;
  disptachInputEvent(incoming, isPopStateInduced);
  currentInput = incoming;

  elInput.focus();
}

// Matches unicode code point escape sequence. Ex: "\u{FEFF}"
const unicodeCodePointEscapeRegEx = /^\\u\{[A-Fa-f0-9]{1,6}\}$/;

function disptachInputEvent(incoming: string, isPopStateInduced: boolean = false) {
  if (unicodeCodePointEscapeRegEx.test(incoming)) {
    // User input is Unicode code point escape (i.e. \u{FEFF}).
    // Abort normal flow and just show that char
    currentInputIsEscapeSequence = true;
    elHtml.dispatchEvent(new CustomEvent(events.hexInput, {
      detail: {
        hex: incoming.slice(3, -1),
        input: incoming,
        isPopStateInduced
      },
    }));

    return;
  }

  if (inputIsBeingExtendedByOneChar(incoming)) {
    elHtml.dispatchEvent(new CustomEvent(events.inputPushed, {
      detail: {
        pushedChar: incoming.slice(-1),
        input: incoming,
        isPopStateInduced
      }
    }));
  } else {
    elHtml.dispatchEvent(new CustomEvent(events.inputChanged, {
      detail: { input: incoming, isPopStateInduced },
    }));
  }

  currentInputIsEscapeSequence = false;
}

function inputIsBeingExtendedByOneChar(incoming: string): boolean {
  // This doesn't detect chars that adds more than 1 to the length of the
  // input (i.e. emoji) but this is supposed to be an optimization so it
  // doesn't make sense to cover too many edge cases.
  return incoming.length - currentInput.length === 1
    && incoming.slice(0, -1) === currentInput
    // Edge case: rerender when typing first char to display column headers
    && currentInput.length !== 0
    // Edge case: rerender when breaking out of hex mode
    && currentInputIsEscapeSequence == false;
}
