import input from "./input/input.js";
import output from "./output/output.js";
import footer from "./footer/footer.js";
window.addEventListener("load", () => {
    const elForm = document.getElementById("frmInput");
    const elInput = document.getElementById("txtInput");
    input.setupUI(elInput, elForm);
    output.setupUI();
    footer.setupUI();
    let text = "";
    if (window.location.hash.length) {
        try {
            text = decodeURI(window.location.hash.slice(1));
        }
        catch (error) {
            text = window.location.hash.slice(1);
        }
    }
    else {
        text = decodeURI("x%C3%B8%E2%98%83%F0%9F%A5%95");
    }
    input.set(text);
});
