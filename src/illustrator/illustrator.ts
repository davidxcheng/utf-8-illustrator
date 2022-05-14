import codePointToUtf8 from "./codePointToUtf8.js";
import octetsToMarkup from "./octetsToMarkup.js";
import octetsToHex from "./octetsToHex.js";

/**
 * Creates markup for a table row (<tr>) that contains the char/glyph that is
 * being illustrated (given that it's not a non-printable char) and its encoding.
 * Slightly leaky that this component is aware that the UI presents the illustration
 * in a table - but this is an application and not a lib:)
 *
 * @param codePoint The characters unicode codepoint (decimal)
 * @returns A string that contains markup for the illustration of the char
 *          and its encoding
 */
export default { createMarkup };

function createMarkup(codePoint: number, includeRowTag: boolean = true): string {
  //const bin = codePoint.toString(2);
  const hex = codePoint.toString(16);
  const octets: string[] = codePointToUtf8(codePoint);
  const utf8OctetsMarkup: string = octetsToMarkup(octets);
  const utf8Hex: string = octetsToHex(octets);
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

function codePointToBinaryMarkup(codePoint: number): string {
  return codePoint
    .toString(2)
    .split("")
    .reverse() // Reverse so index of .map() matches the power of 2
    .map((bit, index) => `<b class="bit" data-power="${index}" title="${Math.pow(2, index)}">${bit}</b>`)
    .reverse()
    .join("");
}
