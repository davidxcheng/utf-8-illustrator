function octetsToHex(octets: string[]) : string {
  var hexNumbers: string[] = [];

  octets.forEach(octet => hexNumbers.push(parseInt(octet, 2).toString(16)));

  return hexNumbers.join(" ");
}

export default octetsToHex;