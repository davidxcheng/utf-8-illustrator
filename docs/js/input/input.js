import events from "./custom-events.js";
import bitFlipperEvents from "../bit-flipper/custom-events.js";
const elHtml = document.documentElement;
const elOutput = document.getElementById("output");
let elInput;
let currentInput = "";
let currentInputIsEscapeSequence = false;
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
        disptachInputEvent(incomingText);
        currentInput = incomingText;
    });
    elHtml.addEventListener(bitFlipperEvents.bitFlipped, () => {
        let hexCodePoints = [];
        elOutput.querySelectorAll("[data-hex]").forEach((elHex) => {
            hexCodePoints.push(parseInt(elHex.dataset["hex"], 16));
        });
        elInput.value = String.fromCodePoint(...hexCodePoints);
    });
}
function set(incoming, isPopStateInduced = false) {
    elInput.value = incoming;
    disptachInputEvent(incoming, isPopStateInduced);
    currentInput = incoming;
    elInput.focus();
}
const unicodeCodePointEscapeRegEx = /^\\u\{[A-Fa-f0-9]{1,6}\}$/;
function disptachInputEvent(incoming, isPopStateInduced = false) {
    if (unicodeCodePointEscapeRegEx.test(incoming)) {
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
    }
    else {
        elHtml.dispatchEvent(new CustomEvent(events.inputChanged, {
            detail: { input: incoming, isPopStateInduced },
        }));
    }
    currentInputIsEscapeSequence = false;
}
function inputIsBeingExtendedByOneChar(incoming) {
    return incoming.length - currentInput.length === 1
        && incoming.slice(0, -1) === currentInput
        && currentInput.length !== 0
        && currentInputIsEscapeSequence == false;
}
