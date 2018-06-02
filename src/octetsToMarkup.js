function decapitate(octet) {
  if (octet[0] === "0") {
    // Single octet code-point (i.e. no header)
    var indexOfFirstSignificantBit = octet.indexOf(1);

    return {
      head: null,
      insignificant: octet.slice(0, indexOfFirstSignificantBit),
      significant: octet.slice(indexOfFirstSignificantBit),
    };
  }

  var indexOfHeaderDelimiter = octet.indexOf(0);

  if (indexOfHeaderDelimiter === "1") {
    //
    return {
      head: octet.slice(0, indexOfHeaderDelimiter + 1),
      significant: octet.slice(indexOfHeaderDelimiter + 1),
    };
  }

  // First octet in a multiple octet code-point
  indexOfFirstSignificantBit = octet.indexOf(1, indexOfHeaderDelimiter);

  var insignificant = indexOfFirstSignificantBit === indexOfHeaderDelimiter + 1
    ? null
    : octet.slice(indexOfHeaderDelimiter + 1, indexOfFirstSignificantBit);

  return {
    head: octet.slice(0, indexOfHeaderDelimiter + 1),
    insignificant: insignificant,
    significant: octet.slice(indexOfFirstSignificantBit),
  };
}

function applyTemplate({head, insignificant, significant}) {
  var x = ['<span class="octet">'];

  if (head)
    x.push(`<b class="header">${head}</b>`);

  if (insignificant)
    x.push(`<b class="insignificant">${insignificant}</b>`);

  x.push(`<b class="significant">${significant}</b>`);
  x.push("</span>");

  return x.join("");
}

var octetsToMarkup = function(octets) {
  return octets.reduce((acc, octet) => {
      acc.push(applyTemplate(decapitate(octet)));
      return acc;
  }, []).join("");
};

exports.main = octetsToMarkup;