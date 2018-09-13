"use strict";

import codePointToUtf8 from "./codePointToUtf8.js";
import octetsToMarkup from "./octetsToMarkup.js";
import octetsToHex from "./octetsToHex.js";

var elInput = document.getElementById("txtInput");
var elHeaders = document.getElementById("headers");
var elOutput = document.getElementById("output");
var elLegend = document.getElementById("legend");

elInput.addEventListener("input", e => {
  elOutput.innerHTML = "";

  var text = e.target.value;
  window.location.hash = encodeURI(text);

  if (text.length === 0) {
    elHeaders.classList.add("hide");
    elLegend.classList.add("hide");
  } else {
    elHeaders.classList.remove("hide");
    elLegend.classList.remove("hide");
  }

  for(var char of text) {
    let codePoint = char.codePointAt(0);
    let octets = codePointToUtf8(codePoint);
    let utf8OctetsMarkup = octetsToMarkup(octets);
    let utf8Hex = octetsToHex(octets)

    elOutput.innerHTML =
    `${elOutput.innerHTML}
      <tr>
        <td class="char">${char}</td>
        <td class="dec">${codePoint}</td>
        <td>${utf8OctetsMarkup}</td>
        <td class="hex">${utf8Hex}</td>
      </tr>`;
  }
});

window.addEventListener("load", () => {
  elInput.value = window.location.hash.length
    ? decodeURI(window.location.hash.slice(1))
    // Default input (x, o, snowman, carrot)
    : decodeURI("x%C3%B8%E2%98%83%F0%9F%A5%95");

  // Trigger the input event
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("input", false, true);
  txtInput.dispatchEvent(evt);
});
