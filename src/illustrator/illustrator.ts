import codePointToUtf8 from "./codePointToUtf8.js";
import octetsToMarkup from "./octetsToMarkup.js";
import octetsToHex from "./octetsToHex.js";

/**
 * Creates markup for a table row (<tr>) that contains the char/glyph that is
 * being illustrated (given that it's not a non-printable char) and its encoding.
 * Slightly leaky that this component is aware that the UI presents the illustration
 * in a table - but this is an application and not a lib:)
 *
 * @param char The character that is about to have its encoding illustrated.
 *             The code point could have been used to resolve the char/glyph
 *             but since the caller of this function already knows it we'll
 *             take a shortcut
 * @param codePoint The characters unicode codepoint (decimal)
 * @returns A string that contains markup for the illustration of the char
 *          and its encoding
 */
export default { createMarkup };

function createMarkup(char: string, codePoint: number): string {
  const bin: string = codePoint.toString(2);
  const hex: string = codePoint.toString(16);
  const octets: string[] = codePointToUtf8(codePoint);
  const utf8OctetsMarkup: string = octetsToMarkup(octets);
  const utf8Hex: string = octetsToHex(octets);

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