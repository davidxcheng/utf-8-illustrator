function octetsToHex(octets) {
    var hexNumbers = [];
    octets.forEach(octet => hexNumbers.push(parseInt(octet, 2).toString(16)));
    return hexNumbers.join(" ");
}
export default octetsToHex;
