import x from "./codePointToUtf8.js";
import y from "./octetsToMarkup.js";

var elInput = document.getElementById("txtInput");
var elOutput = document.getElementById("output");

elInput.addEventListener("input", e => {
  elInput.value.split("").forEach(char => {
    elOutput.innerHTML = y(x(char.codePointAt(0)))
  });
});
