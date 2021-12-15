
//Randomized Encryption
let chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "\\", "|", ";", ":", "'", "\"", ",", "<", ".", ">", "/", "?", " ", "	"];

let charIndx = [];
let charIndxR = [];
  for (let i = 0; i < chars.length; i++){
    charIndx[i] = i;
    charIndxR[i] = (chars.length - 1) - i;
  };

const convChar2Index = chars.reduce((prev, item, i) => {
    prev[item] = {
      index: charIndx[i]
    }
    return prev;
  }, {});

const convChar2IndexR = chars.reduce((prev, item, i) => {
    prev[item] = {
      index: charIndxR[i]
    }
    return prev;
  }, {});

function random(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(("0."+(window.crypto.getRandomValues(new Uint32Array(1))[0]+"").substring(1)) * (max - min + 1)) + min;
};

function swap(str, a, b){
  b = b % str.length;
  a = a % b;
  let x = str.substring(a, a+1);
  let y = str.substring(b, b+1);
  let temp;
  temp = str.substring(0, a);
  str = str.substring(a);
  str = temp + str.replace(x, y);
  temp = str.substring(0, b);
  str = str.substring(b);
  str = temp + str.replace(y, x);
  return str;
};

function shuffle(text, key, arr) {
  let shift = 0;
  let keyVal = 0;
  for (let j = 0; j < text.length; j++){
    keyVal = j % (key.length);
    shift = (convChar2Index[key.substring(keyVal, keyVal+1)].index * j) % text.length;
    text = swap(text, j, j + 1 + shift);
  };
  return text;
};

function unshuffle(text, key, arr){
  let shift = 0;
  let keyVal = 0;
  for (let j = text.length - 1; j >= 0; j--){
    keyVal = j % (key.length);
    shift = (convChar2Index[key.substring(keyVal, keyVal+1)].index * j) % text.length;
    text = swap(text, j, j + 1 + shift);
  };
  return text;
};

/*


function rotateCharNegative(text, rotations, arr){
  arr = reverseList(arr);
  let max = arr.length - 1;
  let textValue = (convChar2Index[text].index - rotations) % (max + 1);
  return arr[textValue];
};

function totalValue(key, arr){
  let max = arr.length - 1;
  let value = 0;
  for (let i = 0; i < key.length; i++){
    value+= convChar2Index[key.substring(i,i+1)].index;
  };
  value = value + key.length;
  return value % max;
};

*/

function rotateCharPositive(text, rotations, arr){
  let max = arr.length - 1;
  let textValue = (convChar2Index[text].index + rotations) % (max + 1);
  return arr[textValue];
};

function rotate(text, key, arr){
  let temp = text.substring(0,1);
  let rotate = 0;
  let newText = "";
    rotate = totalValue(key,arr);
    for (let t = 1; t <= text.length; t++){
      temp = text.substring(t-1, t);
      newText = newText + rotateCharPositive(temp, ((rotate*t)-t), arr);
    };
    text = newText; newText = "";
  return text;
};

function totalValue(key, arr){
  let max = arr.length - 1;
  let value = 0;
  for (let i = 0; i < key.length; i++){
    value+= convChar2Index[key.substring(i,i+1)].index;
  };
  value = value + key.length;
  return value % max;
};

function combineBits(str, arr){
let max = arr.length - 1;
let temp = "";
let newStr = "";
  while (str){
    temp = str.substring(0,2);
    str = str.substring(2);
    newStr+= arr[(convChar2Index[temp.substring(0,1)].index +  
      convChar2Index[temp.substring(1,2)].index) % max];
  };
  return newStr;
};


function generateKey(len, key, arr){
  let newKey = "";
  while(newKey.length < len*2){
    newKey+= key;
  };
  newKey = newKey.substring(0,len*2);
  newKey = rotate(newKey, key, arr);
  key = newKey.substring(0, key.length);
  newKey = shuffle(newKey, key, arr);
  newKey = combineBits(newKey, arr);
  return newKey;
};


function randomize(text, key, arr){
  let max = arr.length - 1;
  key = generateKey(text.length, key, arr);
  let temp = text.substring(0,1);
  let rotate = 0;
  let newText = "";
  for (let k = 1; k <= key.length; k++){
    rotate = convChar2Index[key.substring(k-1, k)].index;
    temp = text.substring(k-1, k);
    newText = newText + arr[(convChar2Index[temp].index + rotate) % (max + 1)];
  };
  return newText;
};

function reverseList(arr){
  let newArr = [];
  let max = arr.length - 1;
  for (let i = 0; i <= max; i++){
    newArr[i] = arr[max-i];
  };
  return newArr;
};

function unrandomize(text, key, arr){
  let max = arr.length - 1;
  key = generateKey(text.length, key, arr);
  let rArr = reverseList(arr);
  let temp = text.substring(0,1);
  let rotate = 0;
  let newText = "";
  for (let k = 1; k <= key.length; k++){
    rotate = arr.indexOf(key.substring(k-1, k));
      temp = text.substring(k-1, k);
      newText = newText + rArr[(convChar2IndexR[temp].index + rotate) % (max + 1)];
  };
  return newText;
};

function flip(text){
  let newText = "";
  for (let i = 0; i < text.length; i++){
    newText+= text.substring(text.length-(1+i), text.length-i)
  };
  return newText;
};

function encrypt(text, key, nSize){
  let nonce = "";
  let trueLen = text.length;
  let arr = chars;
  let max = arr.length - 1;
  for (let i = 0; i < nSize; i++){
    nonce+= arr[random(0, max)];
  };
  let text1 = randomize(text.substring(0,Math.ceil(text.length/2)),
    text.substring(Math.ceil(text.length/2))+key+nonce,arr);
  text = text1+text.substring(Math.ceil(text.length/2));
  let text2 = randomize(text.substring(Math.ceil(text.length/2)),
    text.substring(0,Math.floor(text.length/2))+key+nonce,arr);
  text = text1+text2;
  text = nonce + text;
  text = shuffle(text,key+trueLen+1,arr);
  return text;
};

function decrypt(text, key, nSize){
  let arr = chars;
  let trueLen = text.length-nSize;
  text = unshuffle(text,key+trueLen+1,arr);
  let nonce = text.substring(0, nSize);
  text = text.substring(nSize);
  let text2 = unrandomize(text.substring(Math.ceil(text.length/2)),
    text.substring(0,Math.floor(text.length/2))+key+nonce,arr);
  text = text.substring(0,Math.ceil(text.length/2))+text2;
  let text1 = unrandomize(text.substring(0,Math.ceil(text.length/2)),
    text.substring(Math.ceil(text.length/2))+key+nonce,arr);
  text = text1+text2;
  return text;
};
