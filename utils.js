// LZW-compress a string
function lzw_encode(s) {
  var dict = {};
  var data = (s + "").split("");
  var out = [];
  var currChar;
  var phrase = data[0];
  var code = 256;
  for (var i=1; i<data.length; i++) {
    currChar=data[i];
    if (dict[phrase + currChar] != null) {
      phrase += currChar;
    } else {
      out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
      dict[phrase + currChar] = code;
      code++;
      phrase=currChar;
    };
  };
  out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
  for (var i=0; i<out.length; i++) {
    out[i] = String.fromCharCode(out[i]);
  };
  return out.join("");
};

// Decompress an LZW-encoded string
function lzw_decode(s) {
  var dict = {};
  var data = (s + "").split("");
  var currChar = data[0];
  var oldPhrase = currChar;
  var out = [currChar];
  var code = 256;
  var phrase;
  for (var i=1; i<data.length; i++) {
    var currCode = data[i].charCodeAt(0);
    if (currCode < 256) {
      phrase = data[i];
    } else {
      phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
    };
    out.push(phrase);
    currChar = phrase.charAt(0);
    dict[code] = oldPhrase + currChar;
    code++;
    oldPhrase = phrase;
  };
  return out.join("");
};

function byteCount(s) {
    return encodeURI(s).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1;
};

function textToBinary(string) { 
  return string.split('').map(function (char) { 
    return char.charCodeAt(0).toString(2); 
  }).join(' '); 
};

function SMOL(str, dir, key, nSize){
  if (nSize == null) nSize = 2;
  if (dir >= 1){
    str = compress(str);
    if (key) str = encrypt(str, key, nSize);
    //str = lzw_encode(str);
    } else {
      //str = lzw_decode(str);
      if (key) str = decrypt(str, key, nSize);
      str = decompress(str);
    };
  return str;
};

/*
How To Use:

A SMOL operation has 4 parameters:

  - Parameter #1: The Message (Required)
  - Parameter #2: The Direction (Required)
  - Parameter #3: The Password (Optional)
  - Parameter #4: The Nonce Size (Optional)
  
1) To use SMOL in general, put the contents of your message in the first parameter, and put "1" in the second parameter to compress and encrypt, or "-1" to decompress and decrypt.

2) To use SMOL with standard encryption, create a third parameter and in it use your password of choice. By default there is a nonce size of 2, which adds 2 bytes to your message and creates over 4000 possible outputs per message.

3) To change the nonce size, change the last parameter, after setting the first three parameters. A nonce size of 0 is allowed but not reccommended because it won't create randomness. 2 is default.

4) To use SMOL without any encryption, leave the last two parameters empty, and only use the first two.

Do not modify the SMOL process or you risk breaking or bugging the compression and/or encryption algorithms. The underlying algorithms should remain untouched or at least well-tested.

To test SMOL its best it's best to test it in tester.js.
*/
