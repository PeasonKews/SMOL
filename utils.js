//Create List
  let arr = [
  
  ];
  
  for (let i = 0; i < arr.length; i++){
    if (arr[i].includes(" ")) arr[i] = "remove";
  };

  //remove duplicates
  arr = arr.filter((c,index) => {
  return arr.indexOf(c) === index;
  });

  //order alphabetically
  arr = arr.sort(function(a,b) {
  var textA = a.toLowerCase();
  var textB = b.toLowerCase();
  return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });

  //order from small to large
  arr = arr.sort((a,b) => a.length - b.length);

  //create fake array
  let fakeArr = "[";
  for (let i = 0; i < arr.length; i++){
  fakeArr+= "\""+arr[i]+"\","
  };
  fakeArr+= "];";
  if (arr[0]){
    console.log(fakeArr)
    console.log(arr)
    console.log("Array filled: ", arr.length, "out of 8192");
  };

//Count Bytes
function byteCount(s) {
    return encodeURI(s).split(/%(?:u[0-9A-F]{2})?[0-9A-F]{2}|./).length - 1;
};

//Analyze Binary Encoding
function analyzeBin(str, l, v){
  if (v === "auto") v = vers;
  l = interpretLang(l);
  str = convertToBin(str, l, v); 
  //Test
  let testStr = str;
  console.log(testStr)
  while (testStr){
    console.log(testStr.substring(0,13), convBin2Text[testStr.substring(0,13)].text);
    testStr = testStr.substring(13);
  };
};
