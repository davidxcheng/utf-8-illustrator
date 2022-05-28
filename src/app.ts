import input from "./input/input.js";
import output from "./output/output.js";
import footer from "./footer/footer.js";

window.addEventListener("load", () => {
  const elForm = <HTMLFormElement>document.getElementById("frmInput");
  const elInput = <HTMLInputElement>document.getElementById("txtInput");

  input.setupUI(elInput, elForm);
  output.setupUI();
  footer.setupUI();

  // Figure out initial value for the input field
  let text = "";

  if (window.location.hash.length) {
    try {
      text = decodeURI(window.location.hash.slice(1));
    } catch (error) {
      // Best effort: just show what's in the hash
      text = window.location.hash.slice(1);
    }
  } else {
    // Default input (x, o, snowman, carrot)
    text = decodeURI("x%C3%B8%E2%98%83%F0%9F%A5%95");
  }

  input.set(text);
});
