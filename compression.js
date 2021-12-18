/*Dictionary Compression Algorithm: 
*/

let spaceIndex = comms.length + base96.length - 2;
let noCapIndex = comms.indexOf("<~NOCAP~>");
let capIndex = comms.indexOf("<~CAPITALIZE~>");
let noSpaceIndex = comms.indexOf("<~NOSPACE~>");
let preceding = comms.length+base96.length+capitalizedEnglishWords.length;
let preceding2 = preceding - capitalizedEnglishWords.length;

function repeatCase(str, lim){
  let newStr = "";
  for (i = 0; i < lim; i++){
    newStr+= str;
  };
  return newStr;
};

//Compress Base96
function convertToBin(str){
  //Hide 0s and 1s
  str = str.replaceAll("0", "<~?~>");
  str = str.replaceAll("1", "<~!~>");
  //
  //Replace All-Capsed English Words With Binary Codes
  let leadingSpace = false;
  if (str.substring(0,1) === " ") leadingSpace = true;
  for (let w = capitalizedEnglishWords.length - 2; w > 0; w--){
    if (!str.includes(capitalizedEnglishWords[w])) continue;
    str = str.replaceAll(" " + capitalizedEnglishWords[w], binary13[w+preceding2]);
    str = str.replaceAll(capitalizedEnglishWords[w], 
      binary13[noSpaceIndex]+binary13[w+preceding2]);
    if (!leadingSpace && str.substring(0,13) === binary13[noSpaceIndex]) str = str.substring(13);
    if (leadingSpace){
    	str = binary13[spaceIndex]+str;
    	leadingSpace = false;
    };
  };
  //Insert Capitalize Commands
  let capitalizedChar;
  str = ". " + str;
  for (let c = 36; c < 62; c++){
    //Grant Exceptions for Uncapitalized Leading Characters
    str = str.replaceAll(". " + base96[c-26], ". " + binary13[noCapIndex] + base96[c-26]);
    str = str.replaceAll("? " + base96[c-26], "? " + binary13[noCapIndex] + base96[c-26]);
    str = str.replaceAll("! " + base96[c-26], "! " + binary13[noCapIndex] + base96[c-26]);
    
    //Capitalize All Summoned Characters
    capitalizedChar = binary13[capIndex]+base96[c-26];
    str = str.replaceAll(base96[c], capitalizedChar);
    
    //Reject Capitalizations At Start of Sentence and Message
    str = str.replaceAll(".  " + capitalizedChar, ".  " + base96[c-26]);
    str = str.replaceAll(". " + capitalizedChar, ". " + base96[c-26]);
    str = str.replaceAll("? " + capitalizedChar, "? " + base96[c-26]);
    str = str.replaceAll("! " + capitalizedChar, "! " + base96[c-26]);
  };
  str = str.substring(2);
  
  //Replace English Words With Binary Codes
  leadingSpace = false;
  if (str.substring(0,1) === " ") leadingSpace = true;
  for (let w = englishWords.length - 2; w > 0; w--){
    if (!str.includes(englishWords[w])) continue;
    str = str.replaceAll(" " + englishWords[w], binary13[w+preceding]);
    str = str.replaceAll(englishWords[w], binary13[noSpaceIndex]+binary13[w+preceding]);
    if (!leadingSpace && str.substring(0,13) === binary13[noSpaceIndex]) str = str.substring(13);
    if (leadingSpace){
    	str = binary13[spaceIndex]+str;
    	leadingSpace = false;
    };
  };
  
  //Replace Suffx With Binary Codes
  for (let i = 0; i < suffx.length; i++){
   if (!str.includes(suffx[i])) continue;
    str = str.replaceAll(suffx[i], binary13[preceding+englishWords.length+i]);
  };
  
  let charStart = comms.length;
  //Bring back 1s and 0s
  str = str.replaceAll("<~?~>", binary13[charStart]);
  str = str.replaceAll("<~!~>", binary13[charStart+1]);
  
  //Replace Chars With Binary Codes
  for (let i = 2; i < base96.length; i++){
   if (!str.includes(base96[i])) continue;
    str = str.replaceAll(base96[i], binary13[charStart+i]);
  };
  return str;
};

//Decompress Binary
function convertToBase96(str){
  let byte13 = "";
  let sub = "";
  let newStr = "";
  let ind = 0;
  while (str){
    byte13 = "";
    byte13 = str.substring(0,13);
    str = str.replace(byte13, "");  
    if (!str){
    if (byte13.length < 13) break;
      while (byte13.length < 13) byte13+= "0";
    };    
    ind = convBin2Index[byte13].index*1;
    if ((ind > preceding && ind < preceding + englishWords.length) || 
    ind > preceding2 && ind < preceding2 + capitalizedEnglishWords.length){
    newStr+= " " + convBin2Text[byte13].text;
    } else {
      newStr+= convBin2Text[byte13].text;
    };
  };
  if (newStr.substring(0,1) === " ") newStr = newStr.substring(1);
  //Handle Commands
    //Capitalization
    newStr = ". " + newStr;
    newStr = newStr.replaceAll("<~NOSPACE~> ", "");
    let capitalize = "<~CAPITALIZE~>";
    for (let l = 10; l < 36; l++){
      newStr = newStr.replaceAll(capitalize +" "+base96[l], base96[l+26]);
      newStr = newStr.replaceAll(capitalize + base96[l], base96[l+26]);
      //Grant Capitalizations At Start of Sentence
        newStr = newStr.replaceAll(".  " + base96[l], ".  " + base96[l+26]);
        newStr = newStr.replaceAll(". " + base96[l], ". " + base96[l+26]);
        newStr = newStr.replaceAll("? " + base96[l], "? " + base96[l+26]);
        newStr = newStr.replaceAll("! " + base96[l], "! " + base96[l+26]);
    };
    newStr = newStr.substring(2);
    newStr = newStr.replaceAll("<~NOCAP~>", "");
  return newStr;
};

let charArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "`", "~"];

let extraBytes = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "\\", "|", ";", ":", "'", "\"", ",", "<", ".", ">", "/", "?", " ", "	"];

//Shrink Binary
function convertToBase64(str){
  let newStr = str;
  while (newStr.length % 6 !== 0){
    newStr+= "0";
  };
  let len = newStr.length;
  let newStr2 = newStr;
  newStr = "";
  while (newStr2){
    newStr+= (newStr2.substring(0,6)+"<~R~>");
    newStr2 = newStr2.replace(newStr2.substring(0,6),"");
  };
  for (let c = 0; c < charArr.length; c++){
    newStr = newStr.replaceAll(binary6[c], charArr[c]);
  };
  newStr = newStr.replaceAll("<~R~>", "");
  
  //Use the extra bytes
  for (let i = 10; i < 42; i++){
    newStr = newStr.replaceAll("0"+charArr[i], extraBytes[i-10]);
  };
return newStr;
};

//Shrink Binary
function decompressBase64(str){
let newStr = "";
let byte6 = "";
let sub = "";
//Use the extra bytes first
  for (let i = 10; i < 42; i++){
    str = str.replaceAll(extraBytes[i-10], "0"+charArr[i]);
  };
  while (str){
    sub = "";
    sub = str.substring(0,1);
    str = str.replace(sub, "");
    for (let c = 0; c < charArr.length; c++){
      byte6 = sub;
      byte6 = byte6.replace(charArr[c], binary6[c]);
      if (sub != byte6){
        newStr+= byte6;
        byte6 = "";
        break;
      };
    };
  };
return newStr;
};

function decompress(str){
  if (!str) return false;
  str = decompressBase64(str);
  str = convertToBase96(str);
  return str;
};

function compress(str){
  str = convertToBin(str);
  
  /*//Test
  let testStr = str;
  console.log(testStr)
  while (testStr){
    console.log(testStr.substring(0,13), convBin2Text[testStr.substring(0,13)].text);
    testStr = testStr.substring(13);
  };
  */

  str = convertToBase64(str);
  return str;
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
};