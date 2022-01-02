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
let utfCharIndex = comms.indexOf("<~UTF-CHAR~>");
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

function checkMultibytes(str, l, v){
  let newStr = "";
  let emojis = prefixType[l].version[v].emojis;
  while (str){
    if (allChars.indexOf(str.substring(0,1)) === -1){
      for (let j = 0; j < emojis.length; j++){
        if (str.substring(0,2) === emojis[j] || str.substring(0,1) === emojis[j]){
          newStr+= binary13[utfCharIndex]+binary13[j];
          if (str.substring(0,2) === emojis[j]) str = str.substring(2);
          if (str.substring(0,1) === emojis[j]) str = str.substring(1);
          break;
        };
      };
      
    } else {
      newStr+= str.substring(0,1);
      str = str.substring(1);
    };
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
  
  //Convert Multibytes
  str = checkMultibytes(str, l, v);
  
  str = ". " + str;
  

  
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
  let cappy = "0202020";
  for (let c = 36; c < 62; c++){
    //Grant Exceptions for Uncapitalized Leading Characters   
    str = str.replaceAll(".  " + allChars[c-26], ".  " + cappy + allChars[c-26]);
    str = str.replaceAll(". " + allChars[c-26], ". " + cappy + allChars[c-26]);
    str = str.replaceAll("? " + allChars[c-26], "? " + cappy + allChars[c-26]);
    str = str.replaceAll("! " + allChars[c-26], "! " + cappy + allChars[c-26]);
    
    //Capitalize All Summoned Characters
    capitalizedChar = binary13[capIndex]+allChars[c-26];
    str = str.replaceAll(allChars[c], capitalizedChar);
    
    //Reject Capitalizations At Start of Sentence and Message
    str = str.replaceAll(".  " + capitalizedChar, ".  " + allChars[c-26]);
    str = str.replaceAll(". " + capitalizedChar, ". " + allChars[c-26]);
    str = str.replaceAll("? " + capitalizedChar, "? " + allChars[c-26]);
    str = str.replaceAll("! " + capitalizedChar, "! " + allChars[c-26]);
    
    str = str.replace(cappy, binary13[capIndex]);
  };
  if (str.substring(0,2) === ". ") str = str.substring(2);
  
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
    if (convBin2Text[byte13].text === "<~UTF-CHAR~>"){
      let emojis = prefixType[l].version[v].emojis;
      byte13 = str.substring(0,13);
      str = str.replace(byte13, "");
      newStr+= emojis[binary13.indexOf(byte13)];
    } else {
      ind = convBin2Index[byte13].index*1;
      if ((ind >= preceding && ind < preceding + englishWords.length) || 
      (ind >= preceding2 && ind < preceding2 + capitalizedEnglishWords.length)){
      newStr+= " " + convBin2Text[byte13].text;
      } else {
        newStr+= convBin2Text[byte13].text;
      };
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
      //leading uncapitalized
      newStr = newStr.replaceAll(". " + capitalize + allChars[l], ".0 " + allChars[l]);
      newStr = newStr.replaceAll(". " + capitalize + " " + allChars[l], " "+allChars[l]);
      
      //normal
      newStr = newStr.replaceAll(capitalize +" "+allChars[l], " "+allChars[l+26]);
      newStr = newStr.replaceAll(capitalize + allChars[l], allChars[l+26]);
      
      //Grant Capitalizations At Start of Sentence
        newStr = newStr.replaceAll(".  " + allChars[l], ".  " + allChars[l+26]);
        newStr = newStr.replaceAll(". " + allChars[l], ". " + allChars[l+26]);
        newStr = newStr.replaceAll("? " + allChars[l], "? " + allChars[l+26]);
        newStr = newStr.replaceAll("! " + allChars[l], "! " + allChars[l+26]);
    };
    newStr = newStr.replaceAll(".0 ", ". ");
    if (newStr.substring(0,2) === ". ") newStr = newStr.substring(2);
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

function convertUTF8ToBase64(str, l, v){
  let emojis = prefixType[1].version[0].emojis;
  str = str.replaceAll("0", "<~?~>");
  str = str.replaceAll("1", "<~!~>");
  str = str.replaceAll("<~?~>", binary7[chars7.indexOf("0")]);
  str = str.replaceAll("<~!~>", binary7[chars7.indexOf("1")]);
  for (let i = chars7.length - 1; i >= 2; i--){
    str = str.replaceAll(chars7[i], binary7[i]);
  };
  for (let i = 0; i < emojis.length; i++){
    str = str.replaceAll(emojis[i], binary7[127]+binary13[i]);
  };
  str = convertToBase64(str);
  return str;
};

function convertBase64ToUTF8(str, l, v){
let emojis = prefixType[1].version[0].emojis;
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
  str = newStr;
  newStr = "";
  let temp = "";
  while (str) {
    temp = str.substring(0,7);
    if (temp.length < 7) break;
    if (temp === "1111111"){
      str = str.substring(7);
      newStr+= emojis[binary13.indexOf(str.substring(0,13))];
      str = str.substring(13);      
    } else {
      newStr+= chars7[binary7.indexOf(temp)];
      str = str.substring(7);
    };
  };
  str = newStr;
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

function SMOL_Decode(str, key, nSize){
  if (!str) return false;
  let prefix = readPrefix(str);
  str = str.substring(3);
  if (key && prefix.encrypted) {
    key = formatKey(key);
    str = decrypt(str, key, nSize);
  };
  if (prefix.language > 0){
    str = decompressBase64(str);
    str = convertToText(str, prefix.language, prefix.version);
  } else {
    if (key && prefix.encrypted) str = convertBase64ToUTF8(str, prefix.language, prefix.version);
  };
  return str;
};

function SMOL_Encode(str, l, v, key, nSize){
  let ogString = str;
  let ogKey = key;
  if (v === "auto") v = vers;
  l = interpretLang(l);
  str = convertToBin(str, l, v);  
  str = convertToBase64(str);
  if (key){
    key = formatKey(key);
    str = encrypt(str, key, nSize);
  };
  str = formatPrefix(str, key, l, v);
  let checkString = SMOL_Decode(str, ogKey, nSize);
  if (checkString !== ogString || str.length > ogString.length){
    str = ogString;
    if (key){
      str = convertUTF8ToBase64(ogString, l, v);
      key = formatKey(ogKey);
      str = encrypt(str, key, nSize);
    };
    str = formatPrefix(str, key, 0, 0);
  };
  return str;
};














