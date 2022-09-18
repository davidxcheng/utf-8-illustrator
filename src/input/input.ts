import events from "./customEvents.js";
import outputEvents from "../output/customEvents.js";
import {scan, Token} from "./scanner.js";

const elHtml = document.documentElement;
let elInput: HTMLInputElement;
let currentTokens: Token[] = [];

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
    const tokens = scan(incomingText);

    dispatchInputEvent(incomingText, tokens.map(x => x.codePoint));
    currentTokens = tokens;
  });

  elHtml.addEventListener(outputEvents.bitFlipped, (e: CustomEvent) => {
    const { rowIndex: index, codePoint } = e.detail;
    currentTokens[index].codePoint = codePoint;

    const text = resolveInputStringFromCurrentTokens();

    elInput.value = text;
    window.history.pushState({ text }, "Input", `#${text}`);
  });

  window.addEventListener("popstate", (e: PopStateEvent) => {
    if (e.state) {
      set(e.state.text, true);
    }
  });
}

function resolveInputStringFromCurrentTokens() {
  const codePoints = currentTokens.reduce<number[]>((acc, curr) => {
    if (curr.sourceIsEscSeq) {
      const hex = curr.codePoint.toString(16);
      const hexDigitsAsCodePoints: number[] = <number[]>([...hex].map(hexDigit => hexDigit.codePointAt(0)));
      // 92 = '\', 117 = 'u', 123 = '{', 125 = '}'
      acc.push(92, 117, 123, ...hexDigitsAsCodePoints, 125);
    } else {
      acc.push(curr.codePoint);
    }

    return acc;
  }, []);

  return String.fromCodePoint(...codePoints)
}

function set(incoming: string, isPopStateInduced: boolean = false) {
  // Note: setting value will not trigger an input event
  elInput.value = incoming;
  const tokens = scan(incoming);
  dispatchInputEvent(incoming, tokens.map(x => x.codePoint), isPopStateInduced);
  currentTokens = tokens;

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
