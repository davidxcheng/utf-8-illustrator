import events from "./customEvents.js";
import outputEvents from "../output/customEvents.js";
import scanner from "./scanner.js";
const elHtml = document.documentElement;
let elInput;
let currentInput = "";
let currentInputIsEscapeSequence = false;
const unicodeCodePointEscapeRegEx = /^\\u\{[A-Fa-f0-9]{1,6}\}$/;
const unicodeCodePointEscapeUpperCaseRegEx = /^\\u\{[A-F0-9]{1,6}\}$/;
export default {
    setupUI,
    set,
    events,
};
function setupUI(elTextInput, elFrom) {
    elInput = elTextInput;
    elFrom.addEventListener("submit", e => e.preventDefault);
    elTextInput.addEventListener("input", (e) => {
        const incomingText = e.target.value;
        const incomingCodePoints = scanner.scan(incomingText);
        dispatchInputEvent(incomingText, incomingCodePoints);
        currentInput = incomingText;
    });
    elHtml.addEventListener(outputEvents.bitFlipped, (e) => {
        const hexCodePoints = e.detail.hexCodePoints;
        let text = "";
        if (currentInputIsEscapeSequence) {
            text = unicodeCodePointEscapeUpperCaseRegEx.test(currentInput)
                ? `\\u{${hexCodePoints[0].toString(16).toUpperCase()}}`
                : `\\u{${hexCodePoints[0].toString(16)}}`;
        }
        else {
            text = String.fromCodePoint(...hexCodePoints);
        }
        elInput.value = text;
        currentInput = text;
        window.history.pushState({ text }, "Input", `#${text}`);
    });
    window.addEventListener("popstate", (e) => {
        if (e.state) {
            set(e.state.text, true);
        }
    });
}
function set(incoming, isPopStateInduced = false) {
    elInput.value = incoming;
    const incomingCodePoints = scanner.scan(incoming);
    dispatchInputEvent(incoming, incomingCodePoints, isPopStateInduced);
    currentInput = incoming;
    elInput.focus();
}
function dispatchInputEvent(incoming, codePoints, isPopStateInduced = false) {
    elHtml.dispatchEvent(new CustomEvent(events.inputChanged, {
        detail: {
            codePoints,
        },
    }));
    if (isPopStateInduced === false) {
        window.history.pushState({ text: incoming }, "Input", `#${incoming}`);
    }
}
