"use strict";

import codePointToUtf8 from "./codePointToUtf8.js";
import octetsToMarkup from "./octetsToMarkup.js";

var elInput = document.getElementById("txtInput");
var elOutput = document.getElementById("output");

elInput.addEventListener("input", e => {
  elOutput.innerHTML = "";

  var text = e.target.value;

  for(var char of text) {
    let codePoint = char.codePointAt(0);
    let utf8OctetsMarkup = octetsToMarkup(codePointToUtf8(codePoint));

    elOutput.innerHTML =
    `
      ${elOutput.innerHTML}
      <tr>
        <td class="char">${char}</td>
        <td class="dec">${codePoint}</td>
        <td>${utf8OctetsMarkup}</td>
      </tr>
    `;
  }
});
