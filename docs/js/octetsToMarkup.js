function decapitate(octet, firstSignificantBitLocated) {
    if (octet[0] === "0") {
        // Single octet code-point (i.e. no header)
        const indexOfFirstSignificantBit = octet.indexOf("1");
        return {
            head: null,
            insignificant: octet.slice(0, indexOfFirstSignificantBit),
            significant: octet.slice(indexOfFirstSignificantBit),
        };
    }
    const indexOfHeaderDelimiter = octet.indexOf("0");
    if (indexOfHeaderDelimiter === 1 && firstSignificantBitLocated) {
        // Trailing octets all begin with "10"
        return {
            head: octet.slice(0, indexOfHeaderDelimiter + 1),
            insignificant: null,
            significant: octet.slice(indexOfHeaderDelimiter + 1),
        };
    }
    // First octet in a multiple octet code-point
    const indexOfFirstSignificantBit = octet.indexOf("1", indexOfHeaderDelimiter);
    let insignificant = null;
    if (indexOfFirstSignificantBit === -1) {
        // All payload bits are insignificant
        insignificant = octet.slice(indexOfHeaderDelimiter + 1);
    }
    else if (indexOfFirstSignificantBit !== indexOfHeaderDelimiter + 1) {
        // Insignificant bits in the payload
        insignificant = octet.slice(indexOfHeaderDelimiter + 1, indexOfFirstSignificantBit);
    }
    let significant = indexOfFirstSignificantBit === -1
        ? null
        : octet.slice(indexOfFirstSignificantBit);
    return {
        head: octet.slice(0, indexOfHeaderDelimiter + 1),
        insignificant: insignificant,
        significant: significant,
    };
}
function applyTemplate({ head, insignificant, significant }) {
    const markup = ['<span class="octet">'];
    if (head)
        markup.push(`<b class="header">${head}</b>`);
    if (insignificant)
        markup.push(`<b class="insignificant">${insignificant}</b>`);
    if (significant)
        markup.push(`<b class="significant">${significant}</b>`);
    markup.push("</span>");
    return markup.join("");
}
const octetsToMarkup = function (octets) {
    let firstSignificantBitLocated = false;
    return octets.reduce((acc, octet) => {
        const decapitatedOctet = decapitate(octet, firstSignificantBitLocated);
        firstSignificantBitLocated = firstSignificantBitLocated || decapitatedOctet.significant != null;
        acc.push(applyTemplate(decapitatedOctet));
        return acc;
    }, []).join("");
};
export default octetsToMarkup;
