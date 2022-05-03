import codePointToUtf8 from "./codePointToUtf8.js";
import octetsToMarkup from "./octetsToMarkup.js";
import octetsToHex from "./octetsToHex.js";
export default { createMarkup };
function createMarkup(char, codePoint) {
    const bin = codePoint.toString(2);
    const hex = codePoint.toString(16);
    const octets = codePointToUtf8(codePoint);
    const utf8OctetsMarkup = octetsToMarkup(octets);
    const utf8Hex = octetsToHex(octets);
    return `
    <tr>
      <td class="glyph">${char}</td>
      <td class="dec">${codePoint}</td>
      <td class="hex"><a rel="nofollow noopener noreferrer" href="https://unicode-table.com/en/${hex}/">${hex}</a></td>
      <td class="bin">${bin}</td>
      <td>${utf8OctetsMarkup}</td>
      <td class="hex">${utf8Hex}</td>
    </tr>`;
}
