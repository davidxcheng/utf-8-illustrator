export default {
    scan
};
const unicodeEscSeqPrefix = ["\\", "u", "{"];
const hexRange = /([0-9A-F])/i;
function scan(incoming) {
    let codePoints = [];
    const iterator = incoming[Symbol.iterator]();
    var chr = iterator.next();
    while (!chr.done) {
        if (chr.value !== unicodeEscSeqPrefix[0])
            codePoints.push(chr.value.codePointAt(0));
        else
            codePoints = codePoints.concat(maybeResolveCodePointFromEscSeq(iterator));
        chr = iterator.next();
    }
    return codePoints;
}
function maybeResolveCodePointFromEscSeq(iterator) {
    let i = 0;
    const codePoints = [92];
    const hex = [];
    while (true) {
        var chr = iterator.next();
        i++;
        if (chr.done)
            return codePoints;
        codePoints.push(chr.value.codePointAt(0));
        if (i < 3 && chr.value != unicodeEscSeqPrefix[i])
            return codePoints;
        if (i === 3 && hexRange.test(chr.value) === false)
            return codePoints;
        if (i >= 3 && i <= 9) {
            if (chr.value === "}") {
                return [parseInt(hex.join(""), 16)];
            }
            if (!hexRange.test(chr.value))
                return codePoints;
            hex.push(chr.value);
        }
        else if (i > 9) {
            return codePoints;
        }
    }
}
