import codePointToUtf8 from "./codePointToUtf8.js";
import octetsToMarkup from "./octetsToMarkup.js";
import octetsToHex from "./octetsToHex.js";
export default { createMarkup };
function createMarkup(codePoint, includeRowTag = true) {
    const hex = codePoint.toString(16);
    const octets = codePointToUtf8(codePoint);
    const utf8OctetsMarkup = octetsToMarkup(octets);
    const utf8Hex = octetsToHex(octets);
    const columnsMarkup = `
    <td class="glyph">&#x${hex}</td>
    <td class="dec">${codePoint}</td>
    <td class="hex" data-hex="${hex}"><a rel="nofollow noopener noreferrer" href="https://unicode-table.com/en/${hex}/">${hex}</a></td>
    <td class="bin">${codePointToBinaryMarkup(codePoint)}</td>
    <td>${utf8OctetsMarkup}</td>
    <td class="hex">${utf8Hex}</td>
  `;
    return includeRowTag ? `<tr>${columnsMarkup}</tr>` : columnsMarkup;
}
function codePointToBinaryMarkup(codePoint) {
    return codePoint
        .toString(2)
        .split("")
        .reverse()
        .map((bit, index) => `<b class="bit" data-power="${index}" title="${Math.pow(2, index)}">${bit}</b>`)
        .reverse()
        .join("");
}
