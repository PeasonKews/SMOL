/*
Rotational Encryption Algorithm
*/

let max = base64.length;

function setArr(arr){
  let charIndx = [];
  let charIndxR = [];
    for (let i = 0; i < base64.length; i++){
      charIndx[i] = i;
      charIndxR[i] = (base64.length - 1) - i;
    };
  let arrPackage = {
  
    convChar2Index: 
    
      arr.reduce((prev, item, i) => {
        prev[item] = {
          index: charIndx[i]
        }
        return prev;
      }, {}),
    
    convChar2IndexR: 
    
      arr.reduce((prev, item, i) => {
      prev[item] = {
        index: charIndxR[i]
      }
      return prev;
    }, {})
  
  };    
  return arrPackage;
};


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

function reverseString(str) {
  return str.split("").reverse().join("");
};

function shuffle(text, key, arr, convChar2Index) {
  let shift = 0;
  let keyVal = 0;
  let j;
  for (let t = 0; t < text.length; t++){
    j = t;
    keyVal = j % (key.length);
    shift = (convChar2Index[key.substring(keyVal, keyVal+1)].index * j) % text.length;
    text = swap(text, j, j + 1 + shift);
  };
  return text;
};

function unshuffle(text, key, arr, convChar2Index){
  let shift = 0;
  let keyVal = 0;
  let j;
  for (let t = 0; t < text.length; t++){
    j = (text.length - 1 - t);
    keyVal = j % (key.length);
    shift = (convChar2Index[key.substring(keyVal, keyVal+1)].index * j) % text.length;
    text = swap(text, j, j + 1 + shift);
  };
  return text;
};

function totalValue(key, arr, convChar2Index){
  let value = 0;
  for (let i = 0; i < key.length; i++){
    value+= convChar2Index[key.substring(i,i+1)].index;
  };
  value = value + key.length;
  return value % max + 1;
};

function rotate(text, key, arr, convChar2Index){
  let temp = text.substring(0,1);
  let rotate; 
  let newText = "";
  let tv = totalValue(key, arr, convChar2Index);
    for (let t = 0; t < text.length; t++){
      rotate = convChar2Index[key.substring(t % key.length, (t+1) % 
        key.length).substring(0,1)].index + 1;
      temp = text.substring(t, t+1);
      newText = newText + arr[((convChar2Index[temp].index + (rotate*(t+1)*tv)) % max)];
    };
  return newText;
};

function unrotate(text, key, arr, convChar2Index, convChar2IndexR){
  let temp = text.substring(0,1);
  let rotate;
  let newText = "";
  let tv = totalValue(key, arr, convChar2Index);
    for (let t = 0; t < text.length; t++){
      rotate = convChar2Index[key.substring(t % key.length, (t+1) % 
          key.length).substring(0,1)].index + 1;
      temp = text.substring(t, t+1);
      newText = newText + arr[arr.length - 1 - 
        ((convChar2IndexR[temp].index + (rotate*(t+1)*tv)) % max)];
    };
  return newText;
};

function scrambleArr(arr, key){
  let arrPackage = setArr(arr);
  const convChar2Index = arrPackage.convChar2Index;
  let str = "";
  for (let i = 0; i < arr.length; i++){
    str+= arr[i];
  };
  str = shuffle(str, key, arr, convChar2Index);
  let newArr = [];
  for (let i = 0; i < str.length; i++){
    newArr[i]= str.substring(i,i+1);
  };
  return newArr;
};

function shakeUp(text, key, arr, convChar2Index){
  let piece1;
  let piece2;
  for (let i = 0; i < 2; i++){
    piece1 = text.substring(0,Math.floor(text.length/2));
    piece2 = text.substring(Math.floor(text.length/2),text.length);
    piece1 = rotate(piece1, piece2, arr, convChar2Index);
    piece1 = shuffle(piece1, piece2, arr, convChar2Index);
    piece2 = rotate(piece2, piece1, arr, convChar2Index);
    piece2 = shuffle(piece2, piece1, arr, convChar2Index);
    text = piece1+piece2;
    text = shuffle(text, key, arr, convChar2Index);
    }; 
  return text;
};

function unShake(text, key, arr, convChar2Index, convChar2IndexR){
  let piece1;
  let piece2;
  for (let i = 0; i < 2; i++){
    text = unshuffle(text, key, arr, convChar2Index);
    let piece1 = text.substring(0,Math.floor(text.length/2));
    let piece2 = text.substring(Math.floor(text.length/2),text.length);
    piece2 = unshuffle(piece2, piece1, arr, convChar2Index);
    piece2 = unrotate(piece2, piece1, arr, convChar2Index, convChar2IndexR);
    piece1 = unshuffle(piece1, piece2, arr, convChar2Index);
    piece1 = unrotate(piece1, piece2, arr, convChar2Index, convChar2IndexR);
    text = piece1+piece2;
  };
  return text;
};

function encrypt(text, key, nSize){
  let arr = scrambleArr(base64, key);
  let arrPackage = setArr(arr);
  const convChar2Index = arrPackage.convChar2Index;
  let nonce = "";
  for (let i = 0; i < nSize; i++){
    nonce+= arr[random(0, max-1)];
  };
  let nKey = nonce + key + "";
  text = shakeUp(text, nKey, arr, convChar2Index);
  text = rotate(text, nKey, arr, convChar2Index);
  text = nonce + text;
  text = shuffle(text, key, arr, convChar2Index);
  return text;
};

function decrypt(text, key, nSize){
  let arr = scrambleArr(base64, key);
  let arrPackage = setArr(arr);
  const convChar2Index = arrPackage.convChar2Index;
  const convChar2IndexR = arrPackage.convChar2IndexR;
  text = unshuffle(text, key, arr, convChar2Index);
  let nonce = text.substring(0, nSize);
  text = text.substring(nSize);
  let nKey = nonce + key + "";
  text = unrotate(text, nKey, arr, convChar2Index, convChar2IndexR);
  text = unShake(text, nKey, arr, convChar2Index, convChar2IndexR);
  return text;
};
