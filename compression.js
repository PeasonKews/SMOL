/*
Dictionary Compression Algorithm: 
*/

let comms = prefixType[lang].version[vers].comms;
let suffx = prefixType[lang].version[vers].suffx;
let capitalizedEnglishWords = prefixType[lang].version[vers].capitalizedEnglishWords;
let englishWords = prefixType[lang].version[vers].englishWords;
let allItemsPackage = instantiateRelationships(lang, vers);
let allItems = allItemsPackage.allItems;
let convBin2Text = allItemsPackage.convBin2Text;
let convBin2Index = allItemsPackage.convBin2Index;

let spaceIndex = comms.length + allChars.indexOf(" ");
let noCapIndex = comms.indexOf("<~NOCAP~>");
let capIndex = comms.indexOf("<~CAPITALIZE~>");
let noSpaceIndex = comms.indexOf("<~NOSPACE~>");
let apostropheNoSpaceIndex = comms.indexOf("<~ApostropheNoSpace~>");
let quotationNoSpaceIndex = comms.indexOf("<~QuotationNoSpace~>");
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
function convertToBin(str, l, v){
  if (l !== lang || v !== vers){
    comms = prefixType[l].version[v].comms;
    suffx = prefixType[l].version[v].suffx;
    capitalizedEnglishWords = prefixType[l].version[v].capitalizedEnglishWords;
    englishWords = prefixType[l].version[v].englishWords;
    allItemsPackage = instantiateRelationships(lang, vers);
    allItems = allItemsPackage.allItems;
    convBin2Text = allItemsPackage.convBin2Text;
    convBin2Index = allItemsPackage.convBin2Index;
  };
  //Safely Convert 0s and 1s
  str = str.replaceAll("0", "<~?~>");
  str = str.replaceAll("1", "<~!~>");
  str = str.replaceAll("<~?~>", binary13[allItems.indexOf("0")]);
  str = str.replaceAll("<~!~>", binary13[allItems.indexOf("1")]);
  
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
  
  //Cancel Out NOSPACE and SPACE
  str = str.replaceAll(" "+binary13[capIndex]+binary13[noSpaceIndex],binary13[capIndex]);
  
  //Condense quotation/apostrophe marks
  str = str.replaceAll("'"+binary13[noSpaceIndex], binary13[apostropheNoSpaceIndex]);
  str = str.replaceAll("\""+binary13[noSpaceIndex], binary13[quotationNoSpaceIndex]);
  
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
function convertToText(str, l, v){
  if (l !== lang || v !== vers){
    comms = prefixType[l].version[v].comms;
    suffx = prefixType[l].version[v].suffx;
    capitalizedEnglishWords = prefixType[l].version[v].capitalizedEnglishWords;
    englishWords = prefixType[l].version[v].englishWords;
    allItemsPackage = instantiateRelationships(lang, vers);
    allItems = allItemsPackage.allItems;
    convBin2Text = allItemsPackage.convBin2Text;
    convBin2Index = allItemsPackage.convBin2Index;
  };
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
    (ind >= preceding2 && ind < preceding2 + capitalizedEnglishWords.length)){
    newStr+= " " + convBin2Text[byte13].text;
    } else {
      newStr+= convBin2Text[byte13].text;
    };
  };
  if (newStr.substring(0,1) === " ") newStr = newStr.substring(1);
  //Handle Commands
    //Capitalization
    newStr = ". " + newStr;
    newStr = newStr.replaceAll("<~ApostropheNoSpace~>"+" ", "'");
    newStr = newStr.replaceAll("<~QuotationNoSpace~>"+" ", "\"");
    newStr = newStr.replaceAll("<~NOSPACE~> ", "");
    let capitalize = "<~CAPITALIZE~>";
    for (let l = 10; l < 36; l++){
      newStr = newStr.replaceAll(capitalize +" "+allChars[l], " "+allChars[l+26]);
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

function decompressBase64(str){
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
  let totalLength = Math.floor(newStr.length/13);
  newStr = newStr.substring(0, totalLength*13);
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

function formatPrefix(str, enc, lang, vers){  
  enc ? enc = "1" : enc = "0";
  lang = binary8[lang];
  vers = binary9[vers];
  let binCode = enc+lang+vers;
  let byte1 = base64[binary6.indexOf(binCode.substring(0,6))];
  let byte2 = base64[binary6.indexOf(binCode.substring(6,12))];
  let byte3 = base64[binary6.indexOf(binCode.substring(12,18))];
  return byte1+byte2+byte3+str;
};

function readPrefix(str){
  let prefix = {
    encrypted: null,
    language: null,
    version: null
  };
  let byte1 = str.substring(0,1);
  let byte2 = str.substring(1,2);
  let byte3 = str.substring(2,3);
  let rawData = "";
  rawData+= binary6[base64.indexOf(byte1)];
  rawData+= binary6[base64.indexOf(byte2)];
  rawData+= binary6[base64.indexOf(byte3)];
  prefix.encrypted = !!(rawData.substring(0,1)*1);
  prefix.language = binary8.indexOf(rawData.substring(1,9));
  prefix.version = binary9.indexOf(rawData.substring(9,18));
  return prefix;
};

function SMOL_Decode(str, key, nSize){
  if (!str) return false;
  let prefix = readPrefix(str);
  str = str.substring(3);
  if (key && prefix.encrypted) {
    key = formatKey(key);
    str = decrypt(str, key, nSize);
  };
  str = decompressBase64(str);
  str = convertToText(str, prefix.language, prefix.version);
  return str;
};

function interpretLang(l){
  if (typeof l === 'string'){
    l = l.toLowerCase();
    switch (l){
      case "english": 
      l = 1;
      break;
    };
  };
  return l;
};

function SMOL_Encode(str, l, v, key, nSize){
  if (v === "auto") v = vers;
  l = interpretLang(l);
  str = convertToBin(str, l, v);  
  str = convertToBase64(str);
  if (key){
    key = formatKey(key);
    str = encrypt(str, key, nSize);
  };
  str = formatPrefix(str, key, 1, 0);
  return str;
};
