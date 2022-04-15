/// <reference lib="es2017.string" />

export default main();

function main() {
  /**
  * Returns an array of the binary representation of the codePoint
  * Example: 65 -> [0, 1, 0, 0, 0, 0, 0, 1]
  */
  var _toBinary = function (codePoint: number): number[] {
    return codePoint
      .toString(2)
      .padStart(8, "0")
      .split("")
      .map(bit => parseInt(bit, 10));
  };

  /**
  * Prepares octets by adding their headers and returns them in an array
  * Example: [[1, 1, 0], [1, 0]] for a 2-byte sequence
  */
  var _prepareOctetHeaders = function (codePoint: number): number[][] {
    var octets: number[][] = [];
    var numberOfOctets: number = 0;

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

    var firstOctet: number[] = [];

    for (var i = 0; i < numberOfOctets; i++)
      firstOctet.push(1);

    firstOctet.push(0);
    // 110xxxxx for a 2-byte sequence
    // 1110xxxx for a 3-byte sequence and so on.
    octets.push(firstOctet);

    for (var i = 1; i < numberOfOctets; i++)
      // header of subsequent bytes are always 10xxxxxx
      octets.push([1, 0]);

    return octets;
  };

  /**
  * Returns an array of strings of the binary utf-8 representation of the code point;
  * Example: 162 -> ["11000010", "10100010"]
  */
  var toUtf8Octets = function (codePoint: number): string[] {
    var binary: number[] = _toBinary(codePoint);
    var octetHeaders: number[][] = _prepareOctetHeaders(codePoint);
    var octets: string[] = [];

    if (octetHeaders.length == 1) {
      return [binary.join('')];
    }

    do {
      // Start with the last/rightmost octet and work towards the first/leftmost
      var header: number[] = octetHeaders.pop();
      var payloadCapacity: number = 8 - header.length;

      if (payloadCapacity > binary.length) {
        // Pad payload with zeros to fill up all free space
        while (binary.length < payloadCapacity) {
          binary.unshift(0);
        }
      }

      octets.unshift(header.concat(binary.splice(payloadCapacity * -1, payloadCapacity)).join(''));
    } while (octetHeaders.length);

    return octets;
  };

  return toUtf8Octets;
}
