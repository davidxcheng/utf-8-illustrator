let elHtml = document.documentElement;
let elInput: HTMLInputElement;
let currentInput = "";
let currentInputIsEscapeSequence = false;

// Matches unicode code point escape sequence. Ex: "\u{FEFF}"
const unicodeCodePointEscapeRegEx = /^\\u\{[A-Fa-f0-9]{1,6}\}$/;

type InputEventNames = {
  inputChanged: "inputchanged",
  inputPushed: "inputpushed",
  hexInput: "hexinput"
};

const events: InputEventNames = {
  // Cue for the UI to rerender
  inputChanged: "inputchanged",

  // Cue for the UI to tuck on a row at the end of the table
  inputPushed: "inputpushed",

  // Input is Unicode code point escape sequence (ie "\u{FEFF}")
  hexInput: "hexinput",
};

export default {
  setupUI,
  set,
  events
};

// TypeScript hack to make tsc happy when adding event listener
declare global {
  interface HTMLElementEventMap {
    inputchanged: CustomEvent,
    inputpushed: CustomEvent,
    hexinput: CustomEvent,
  }
}

function setupUI(elFrom: HTMLFormElement, elTextInput: HTMLInputElement) {
  elInput = elTextInput;

  // Submitting the form causes a '?' to be added to the url
  elFrom.addEventListener("submit", e => e.preventDefault);

  elTextInput.addEventListener("input", (e: Event) => {
    const incomingText = (<HTMLInputElement>e.target).value;
    disptachInputEvent(incomingText);
    currentInput = incomingText;
  });
}

function set(incoming: string, isPopStateInduced: boolean = false) {
  // Note: setting value will not trigger an input event
  elInput.value = incoming;
  disptachInputEvent(incoming, isPopStateInduced);
  currentInput = incoming;

  elInput.focus();
}

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
