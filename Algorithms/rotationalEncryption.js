//Rotational Encryption

let chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "{", "]", "}", "\\", "|", ";", ":", "'", "\"", ",", "<", ".", ">", "/", "?", " ", "	"];

function random(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function valueOf(text, arr){
  let max = arr.length - 1;
  text = text.substring(0,1);
  let textValue = 0;
  for (let i = 0; i <= max; i++){
    if (text === arr[i]){
      textValue = i;
      break;
    };
  };
  return textValue;
};

function swap(text, start, end) {
  let newText = "";
  if (end > text.length - 1) end = text.length - 1;
  let temp = text.substring(start, start+1);
  let preTemp = text.substring(0, start);
  let temp2 = text.substring(end, end+1);
  let preTemp2 = text.substring(start+1, end);
  let postTemp2 = text.substring(end+1);
  newText = preTemp + temp2 + preTemp2 + temp + postTemp2;
  return newText;
};

function shuffle(text, key, arr) {
  let shift = 0;
  let keyVal = 0;
  for (let j = 0; j < text.length-1; j++){
    keyVal = j % (key.length);
    shift = valueOf(key.substring(keyVal, keyVal+1), arr) % text.length;
    text = swap(text, j, j + 1 + shift);
  };
  return text;
};

function unshuffle(text, key, arr){
  let shift = 0;
  let keyVal = 0;
  for (let j = text.length-2; j >= 0; j--){
    keyVal = j % (key.length);
    shift = valueOf(key.substring(keyVal, keyVal+1), arr) % text.length;
    text = swap(text, j, j + 1 + shift);
  };
  return text;
};

function reverseList(arr){
  let newArr = [];
  let max = arr.length - 1;
  for (let i = 0; i <= max; i++){
    newArr[i] = arr[max-i];
  };
  return newArr;
};

function rotateCharPositive(text, rotations, arr){
  let max = arr.length - 1;
  let textValue = (valueOf(text, arr) + rotations) % (max + 1);
  return arr[textValue];
};

function rotateCharNegative(text, rotations, arr){
  arr = reverseList(arr);
  let max = arr.length - 1;
  let textValue = (valueOf(text, arr) - rotations) % (max + 1);
  return arr[textValue];
};

function rotate(text, key, arr){
  let temp = text.substring(0,1);
  let rotate = 0;
  let newText = "";
  for (let k = 1; k <= key.length; k++){
    rotate = valueOf(key.substring(k-1, k), arr);
    for (let t = 1; t <= text.length; t++){
      temp = text.substring(t-1, t);
      newText = newText + rotateCharPositive(temp, (rotate+t), arr);
    };
    text = newText; newText = "";
  };
  return text;
};

function unrotate(text, key, arr){
  let temp = text.substring(0,1);
  let rotate = 0;
  let newText = "";
  for (let k = 1; k <= key.length; k++){
    rotate = valueOf(key.substring(k-1, k), arr);
    for (let t = 1; t <= text.length; t++){
      temp = text.substring(t-1, t);
      newText = newText + rotateCharNegative(temp, (rotate+t)*-1, arr);
    };
    text = newText; newText = "";
  };
  return text;
};

function encrypt(text, key, nSize){
  let nonce = "";
  let arr = chars;
  let max = arr.length - 1;
  for (let i = 0; i < nSize; i++){
    nonce+= arr[random(0, max)];
  };
  text = shuffle(text, key, arr);
  text = rotate(text, key+nonce, arr);
  text = nonce + text;
  return text;
};

function decrypt(text, key, nSize){
  let arr = chars;
  nonce = text.substring(0, nSize);
  text = text.substring(nSize);
  text = unrotate(text, key+nonce, arr);
  text = unshuffle(text, key, arr);
  return text;
};
