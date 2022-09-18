const unicodeEscSeqPrefix = ["\\", "u", "{"];
const hexRange = /([0-9A-F])/i;

export type Token = {
  codePoint: number,
  sourceIsEscSeq: boolean
}

export function scan(incoming: string): Token[] {
  let codePoints: Token[] = [];

  const iterator = incoming[Symbol.iterator]();
  var chr = iterator.next();

  while (!chr.done) {
    if (chr.value !== unicodeEscSeqPrefix[0])
      codePoints.push({codePoint: <number>chr.value.codePointAt(0), sourceIsEscSeq: false});
    else
      codePoints = codePoints.concat(maybeResolveCodePointFromEscSeq(iterator));

    chr = iterator.next();
  }

  return codePoints;
}

function maybeResolveCodePointFromEscSeq(iterator: IterableIterator<string>): Token[] {
  let i = 0;
  const codePoints = [92]; // 92 = CodePoint of '\'
  const hex: string[] = [];

  while(true) {
    var chr = iterator.next(); i++;

    if (chr.done)
      return codePoints.map(x => ({codePoint: x, sourceIsEscSeq: false}));

    codePoints.push(<number>chr.value.codePointAt(0));

    if (i < 3 && chr.value != unicodeEscSeqPrefix[i])
      // Not a unicode code point escape, first 3 chars must be '\u{'
      return codePoints.map(x => ({codePoint: x, sourceIsEscSeq: false}));

    if (i === 3 && hexRange.test(chr.value) === false)
      // Not a unicode code point escape, 4th char must be hex digit
      return codePoints.map(x => ({codePoint: x, sourceIsEscSeq: false}));

    if (i >= 3 && i <= 9) {
      if (chr.value === "}") {
        // End of unicode code point escape, resolve hex code point
        return [{codePoint: parseInt(hex.join(""), 16), sourceIsEscSeq: true}];
      }

      if (!hexRange.test(chr.value))
        // Not a unicode code point escape
        return codePoints.map(x => ({codePoint: x, sourceIsEscSeq: false}));

      // Finally, a hex digit!
      hex.push(chr.value);
    } else if (i > 9) {
      // Using more than 6 hex digits is not supported
      return codePoints.map(x => ({codePoint: x, sourceIsEscSeq: false}));
    }
  }
}
