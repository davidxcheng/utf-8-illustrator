import input from "../input/input.js";

const elHintput = <HTMLElement>document.getElementById("hintput");

export default { setupUI };

function setupUI() {
  elHintput.addEventListener("click", (e: Event) => {
    const escapedHexString = (<HTMLElement>e.target).innerText;
    input.set(escapedHexString);
  });
}