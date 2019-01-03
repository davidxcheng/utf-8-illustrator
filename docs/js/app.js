"use strict";

import codePointToUtf8 from "./codePointToUtf8.js";
import octetsToMarkup from "./octetsToMarkup.js";
import octetsToHex from "./octetsToHex.js";

var elInput = document.getElementById("txtInput");
var elHeaders = document.getElementById("headers");
var elOutput = document.getElementById("output");
var elLegend = document.getElementById("legend");
var elHintput = document.getElementById("hintput");

var unicodeCodePointEscapeRegEx = /^\\u\{[A-Fa-f0-9]{1,6}\}$/;

function createMarkup(char, codePoint) {
  let bin = codePoint.toString(2);
  let hex = codePoint.toString(16);
  let octets = codePointToUtf8(codePoint);
  let utf8OctetsMarkup = octetsToMarkup(octets);
  let utf8Hex = octetsToHex(octets);

  return `<tr>
      <td class="glyph">${char}</td>
      <td class="dec">${codePoint}</td>
      <td class="hex">${hex}</td>
      <td class="bin">${bin}</td>
      <td>${utf8OctetsMarkup}</td>
      <td class="hex">${utf8Hex}</td>
    </tr>`;
}

function render(text) {
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

  for(var char of text) {
    let codePoint = char.codePointAt(0);
    ouputMarkup += createMarkup(char, codePoint);
  }

  elOutput.innerHTML = ouputMarkup;
}

elInput.addEventListener("input", e => {
  var text = e.target.value;
  window.history.pushState({ text }, "Input", `#${text}`);
  render(text);
});

window.addEventListener("load", () => {
  var text = window.location.hash.length
  ? decodeURI(window.location.hash.slice(1))
  // Default input (x, o, snowman, carrot)
  : decodeURI("x%C3%B8%E2%98%83%F0%9F%A5%95");

  window.history.pushState({ text }, "Input", `#${text}`);
  elInput.value = text;
  render(text);
});

window.addEventListener("popstate", e => {
  if (e.state) {
    elInput.value = e.state.text;
    elInput.focus();
    render(e.state.text);
  }
});

elHintput.addEventListener("click", (e) => {
  elInput.value = e.target.innerText;
  elInput.focus();
  render(e.target.innerText);
});
