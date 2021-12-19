/*
Dictionary Compression Algorithm: 
*/

let spaceIndex = comms.length + chars.indexOf(" ");
let noCapIndex = comms.indexOf("<~NOCAP~>");
let capIndex = comms.indexOf("<~CAPITALIZE~>");
let noSpaceIndex = comms.indexOf("<~NOSPACE~>");
let preceding = comms.length+chars.length+capitalizedEnglishWords.length;
let preceding2 = preceding - capitalizedEnglishWords.length;

function repeatCase(str, lim){
  let newStr = "";
  for (i = 0; i < lim; i++){
    newStr+= str;
  };
  return newStr;
};

//Compress Chars
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
  for (let c = 65; c < 90; c++){
    //Grant Exceptions for Uncapitalized Leading Characters
    str = str.replaceAll(". " + chars[c+32], ". " + binary13[noCapIndex] + chars[c+32]);
    str = str.replaceAll("? " + chars[c+32], "? " + binary13[noCapIndex] + chars[c+32]);
    str = str.replaceAll("! " + chars[c+32], "! " + binary13[noCapIndex] + chars[c+32]);
    
    //Capitalize All Summoned Characters
    capitalizedChar = binary13[capIndex]+chars[c+32];
    str = str.replaceAll(chars[c], capitalizedChar);
    
    //Reject Capitalizations At Start of Sentence and Message
    str = str.replaceAll(".  " + capitalizedChar, ".  " + chars[c+32]);
    str = str.replaceAll(". " + capitalizedChar, ". " + chars[c+32]);
    str = str.replaceAll("? " + capitalizedChar, "? " + chars[c+32]);
    str = str.replaceAll("! " + capitalizedChar, "! " + chars[c+32]);
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
  
  //Replace Chars With Binary Codes
  let charStart = comms.length;
  for (let i = 0; i < chars.length; i++){
   if (!str.includes(chars[i]) || chars[i] === "0" || chars[i] === "1") continue;
    str = str.replaceAll(chars[i], binary13[charStart+i]);
  };
  return str;
};

//Decompress Binary
function convertTochars(str){
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
    for (let l = 97; l < 122; l++){
      newStr = newStr.replaceAll(capitalize +" "+chars[l], chars[l-32]);
      newStr = newStr.replaceAll(capitalize + chars[l], chars[l-32]);
      //Grant Capitalizations At Start of Sentence
        newStr = newStr.replaceAll(".  " + chars[l], ".  " + chars[l-32]);
        newStr = newStr.replaceAll(". " + chars[l], ". " + chars[l-32]);
        newStr = newStr.replaceAll("? " + chars[l], "? " + chars[l-32]);
        newStr = newStr.replaceAll("! " + chars[l], "! " + chars[l-32]);
    };
    newStr = newStr.substring(2);
    newStr = newStr.replaceAll("<~NOCAP~>", "");
  return newStr;
};

//Shrink Binary
function convertToBase64(str){
  let newStr = str;
  while (newStr.length % 7 !== 0){
    newStr+= "0";
  };
  let len = newStr.length;
  let newStr2 = newStr;
  newStr = "";
  while (newStr2){
    newStr+= (newStr2.substring(0,7)+"<~R~>");
    newStr2 = newStr2.replace(newStr2.substring(0,7),"");
  };
  for (let c = 0; c < chars.length; c++){
    newStr = newStr.replaceAll(binary7[c], chars[c]);
  };
  newStr = newStr.replaceAll("<~R~>", "");
return newStr;
};

//Shrink Binary
function decompressBase64(str){
let newStr = "";
let byte7 = "";
let sub = "";
  while (str){
    sub = "";
    sub = str.substring(0,1);
    str = str.replace(sub, "");
    for (let c = 0; c < chars.length; c++){
      byte7 = sub;
      byte7 = byte7.replace(chars[c], binary7[c]);
      if (sub != byte7){
        newStr+= byte7;
        byte7 = "";
        break;
      };
    };
  };
return newStr;
};

function decompress(str){
  if (!str) return false;
  str = decompressBase64(str);
  str = convertTochars(str);
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
  };*/
  
  //console.log(binary13[allItems.length])

  str = convertToBase64(str);
  return str;
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
};
