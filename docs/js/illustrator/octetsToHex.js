export default function octetsToHex(octets) {
    const hexNumbers = [];
    octets.forEach(octet => hexNumbers.push(parseInt(octet, 2).toString(16)));
    return hexNumbers.join(" ");
}
