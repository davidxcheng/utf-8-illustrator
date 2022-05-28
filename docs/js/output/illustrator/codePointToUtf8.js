export default function codePointToUtf8Octets(codePoint) {
    const binary = toBinary(codePoint);
    const octetHeaders = prepareOctetHeaders(codePoint);
    const octets = [];
    if (octetHeaders.length == 1) {
        return [binary.join('')];
    }
    do {
        const header = octetHeaders.pop();
        const payloadCapacity = 8 - header.length;
        if (payloadCapacity > binary.length) {
            while (binary.length < payloadCapacity) {
                binary.unshift(0);
            }
        }
        octets.unshift(header.concat(binary.splice(payloadCapacity * -1, payloadCapacity)).join(''));
    } while (octetHeaders.length);
    return octets;
}
;
function toBinary(codePoint) {
    return codePoint
        .toString(2)
        .padStart(8, "0")
        .split("")
        .map(bit => parseInt(bit, 10));
}
;
function prepareOctetHeaders(codePoint) {
    const octets = [];
    let numberOfOctets = 0;
    if (codePoint < 128)
        numberOfOctets = 1;
    else if (codePoint < 2048)
        numberOfOctets = 2;
    else if (codePoint < 65536)
        numberOfOctets = 3;
    else if (codePoint < 2097152)
        numberOfOctets = 4;
    else if (codePoint < 67108864)
        numberOfOctets = 5;
    else if (codePoint = 2147483647)
        numberOfOctets = 6;
    if (numberOfOctets == 1) {
        octets.push([]);
        return octets;
    }
    const firstOctet = [];
    for (let i = 0; i < numberOfOctets; i++)
        firstOctet.push(1);
    firstOctet.push(0);
    octets.push(firstOctet);
    for (let i = 1; i < numberOfOctets; i++)
        octets.push([1, 0]);
    return octets;
}
;
