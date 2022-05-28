import input from "../input/input.js";
const elHintput = document.getElementById("hintput");
export default { setupUI };
function setupUI() {
    elHintput.addEventListener("click", (e) => {
        const escapedHexString = e.target.innerText;
        input.set(escapedHexString);
    });
}
