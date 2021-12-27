/*
Dictionary Compression Algorithm: 
*/

let spaceIndex = comms.length + allChars.indexOf(" ");
let noCapIndex = comms.indexOf("<~NOCAP~>");
let capIndex = comms.indexOf("<~CAPITALIZE~>");
let noSpaceIndex = comms.indexOf("<~NOSPACE~>");
let preceding = comms.length+allChars.length+capitalizedEnglishWords.length;
let preceding2 = preceding - capitalizedEnglishWords.length;

function repeatCase(str, lim){
  let newStr = "";
  for (i = 0; i < lim; i++){
    newStr+= str;
  };
  return newStr;
};

//Compress allChars
function convertToBin(str){
  //Safely Convert 0s and 1s
  str = str.replaceAll("0", "<~?~>");
  str = str.replaceAll("1", "<~!~>");
  str = str.replaceAll("<~?~>", binary13[allItems.indexOf("0")]);
  str = str.replaceAll("<~!~>", binary13[allItems.indexOf("1")]);
  
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
    str = str.replaceAll(". " + allChars[c-26], ". " + binary13[noCapIndex] + allChars[c-26]);
    str = str.replaceAll("? " + allChars[c-26], "? " + binary13[noCapIndex] + allChars[c-26]);
    str = str.replaceAll("! " + allChars[c-26], "! " + binary13[noCapIndex] + allChars[c-26]);
    
    //Capitalize All Summoned Characters
    capitalizedChar = binary13[capIndex]+allChars[c-26];
    str = str.replaceAll(allChars[c], capitalizedChar);
    
    //Reject Capitalizations At Start of Sentence and Message
    str = str.replaceAll(".  " + capitalizedChar, ".  " + allChars[c-26]);
    str = str.replaceAll(". " + capitalizedChar, ". " + allChars[c-26]);
    str = str.replaceAll("? " + capitalizedChar, "? " + allChars[c-26]);
    str = str.replaceAll("! " + capitalizedChar, "! " + allChars[c-26]);
  };
  str = str.substring(2);
  
  //Replace English Words With Binary Codes
  leadingSpace = false;
  if (str.substring(0,1) === " ") leadingSpace = true;
  for (let w = englishWords.length - 2; w >= 0; w--){
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
  
  //Replace allChars With Binary Codes
  let charstart = comms.length;
  for (let i = 0; i < allChars.length; i++){
   if (!str.includes(allChars[i]) || allChars[i] === "0" || allChars[i] === "1") continue;
    str = str.replaceAll(allChars[i], binary13[charstart+i]);
  };
  return str;
};

//Decompress Binary
function convertToText(str){
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
    if ((ind >= preceding && ind < preceding + englishWords.length) || 
    ind >= preceding2 && ind < preceding2 + capitalizedEnglishWords.length){
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
      newStr = newStr.replaceAll(capitalize +" "+allChars[l], allChars[l+26]);
      newStr = newStr.replaceAll(capitalize + allChars[l], allChars[l+26]);
      //Grant Capitalizations At Start of Sentence
        newStr = newStr.replaceAll(".  " + allChars[l], ".  " + allChars[l+26]);
        newStr = newStr.replaceAll(". " + allChars[l], ". " + allChars[l+26]);
        newStr = newStr.replaceAll("? " + allChars[l], "? " + allChars[l+26]);
        newStr = newStr.replaceAll("! " + allChars[l], "! " + allChars[l+26]);
    };
    newStr = newStr.substring(2);
    newStr = newStr.replaceAll("<~NOCAP~>", "");
  return newStr;
};

function convertToBase64(str){
  let newStr = str;
  while (newStr.length % 6 !== 0){
    newStr+= "0";
  };
  let len = newStr.length;
  let newStr2 = newStr;
  newStr = "";
  while (newStr2){
    newStr+= ("<~R~>"+newStr2.substring(0,6)+"<~R~>");
    newStr2 = newStr2.replace(newStr2.substring(0,6),"");
  };
  for (let c = 0; c < base64.length; c++){
    newStr = newStr.replaceAll(binary6[c], base64[c]);
  };
  newStr = newStr.replaceAll("<~R~>", "");
return newStr;
};

function decompressBase64(str, size){
let newStr = "";
let byte6 = "";
let sub = "";
  while (str){
    sub = "";
    sub = str.substring(0,1);
    str = str.replace(sub, "");
    for (let c = 0; c < base64.length; c++){
      byte6 = sub;
      byte6 = byte6.replace(base64[c], binary6[c]);
      if (sub != byte6){
        newStr+= byte6;
        byte6 = "";
        break;
      };
    };
  };
  let totalLength = Math.floor(newStr.length/size);
  newStr = newStr.substring(0, totalLength*size);
return newStr;
};

function textToBinary(string) {
return string.split('').map(function (char) { return char.charCodeAt(0).toString(2).padStart(8, '0'); }).join('');
}

function formatKey(str){
  str = textToBinary(str);
  str = convertToBase64(str);
  return str;
};

function decompress(str, key, nSize){
  if (!str) return false;
  if (key) {
    key = formatKey(key);
    str = decrypt(str, key, nSize);
  };
  str = decompressBase64(str, 13);
  str = convertToText(str);
  return str;
};

function compress(str, key, nSize){
  str = convertToBin(str);
  /*//Test
  let testStr = str;
  console.log(testStr)
  while (testStr){
    console.log(testStr.substring(0,13), convBin2Text[testStr.substring(0,13)].text);
    testStr = testStr.substring(13);
  };*/
  
  //console.log(binary13[allItems.length])
  
  str = convertToBase64(str);
  if (key){
    key = formatKey(key);
    str = encrypt(str, key, nSize);
  };
  return str;
};
