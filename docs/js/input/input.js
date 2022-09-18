import events from "./customEvents.js";
import outputEvents from "../output/customEvents.js";
import { scan } from "./scanner.js";
const elHtml = document.documentElement;
let elInput;
let currentTokens = [];
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
        const tokens = scan(incomingText);
        dispatchInputEvent(incomingText, tokens.map(x => x.codePoint));
        currentTokens = tokens;
    });
    elHtml.addEventListener(outputEvents.bitFlipped, (e) => {
        const { rowIndex: index, codePoint } = e.detail;
        currentTokens[index].codePoint = codePoint;
        const text = resolveInputStringFromCurrentTokens();
        elInput.value = text;
        window.history.pushState({ text }, "Input", `#${text}`);
    });
    window.addEventListener("popstate", (e) => {
        if (e.state) {
            set(e.state.text, true);
        }
    });
}
function resolveInputStringFromCurrentTokens() {
    const codePoints = currentTokens.reduce((acc, curr) => {
        if (curr.sourceIsEscSeq) {
            const hex = curr.codePoint.toString(16);
            const hexDigitsAsCodePoints = ([...hex].map(hexDigit => hexDigit.codePointAt(0)));
            acc.push(92, 117, 123, ...hexDigitsAsCodePoints, 125);
        }
        else {
            acc.push(curr.codePoint);
        }
        return acc;
    }, []);
    return String.fromCodePoint(...codePoints);
}
function set(incoming, isPopStateInduced = false) {
    elInput.value = incoming;
    const tokens = scan(incoming);
    dispatchInputEvent(incoming, tokens.map(x => x.codePoint), isPopStateInduced);
    currentTokens = tokens;
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
