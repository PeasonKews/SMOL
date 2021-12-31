let language = "english";
let version = "auto";
let nonceSize = 0;
let log = true;
let message = "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending. We propose a solution to the double-spending problem using a peer-to-peer network. The network timestamps transactions by hashing them into an ongoing chain of hash-based proof-of-work, forming a record that cannot be changed without redoing the proof-of-work. The longest chain not only serves as proof of the sequence of events witnessed, but proof that it came from the largest pool of CPU power. As long as a majority of CPU power is controlled by nodes that are not cooperating to attack the network, they'll generate the longest chain and outpace attackers. The network itself requires minimal structure. Messages are broadcast on a best effort basis, and nodes can leave and rejoin the network at will, accepting the longest proof-of-work chain as proof of what happened while they were gone."
let pass = "password";

if (log){
console.time("Compressed and Encrypted");
let ciphertext = SMOL_Encode(message, language, version, pass, nonceSize);
console.timeEnd("Compressed and Encrypted");

console.time("Decompressed and Decrypted");
let plaintext = SMOL_Decode(ciphertext, pass, nonceSize);
console.timeEnd("Decompressed and Decrypted");
console.log("\n");
let a = "hi"
console.log("Ciphertext:  " + ciphertext +  " %c" + byteCount(ciphertext) + " (Base-64)", "color: green");
console.log("Decrypted:  \n" + plaintext +  " %c" + byteCount(plaintext) + " (UTF-8)", "color: green");
console.log("Successful:  ", (message === plaintext));
console.log("Bytes Saved: ", Math.round((1-byteCount(ciphertext)/byteCount(plaintext))*100)+"%");
console.log("Prefix (" + ciphertext.substring(0,3) + "):", readPrefix(ciphertext))
};

//analyzeBin(message,language,version)

console.log(allItems.length, "out of 8192")













































/*
let uncompressedText = "A purely peer-to-peer version of electronic cash would allow online payments to be sent directly from one party to another without going through a financial institution. Digital signatures provide part of the solution, but the main benefits are lost if a trusted third party is still required to prevent double-spending. We propose a solution to the double-spending problem using a peer-to-peer network. The network timestamps transactions by hashing them into an ongoing chain of hash-based proof-of-work, forming a record that cannot be changed without redoing the proof-of-work. The longest chain not only serves as proof of the sequence of events witnessed, but proof that it came from the largest pool of CPU power. As long as a majority of CPU power is controlled by nodes that are not cooperating to attack the network, they'll generate the longest chain and outpace attackers. The network itself requires minimal structure. Messages are broadcast on a best effort basis, and nodes can leave and rejoin the network at will, accepting the longest proof-of-work chain as proof of what happened while they were gone.";

//let uncompressedText = "Hello world";

let compressedText;
let decompressedText;

console.log(englishWords.length, 2**12, 2**12 - englishWords.length +" remaining");

console.log("\nCOMPRESSION: \n");

console.time();
compressedText = compress(uncompressedText, 0);
console.timeEnd();
console.log("compressedText:   ", compressedText);
let byteCountOfCom = byteCount(compressedText);
console.log("byte count: ", byteCountOfCom);

console.time();
decompressedText = decompress(compressedText, 0);
console.timeEnd();
console.log("decompressedText: ", decompressedText);
let byteCountOfDecom = byteCount(decompressedText);
console.log("byte count: ", byteCountOfDecom);

console.log("valid conversion: ", uncompressedText === decompressedText);
console.log("byte compression: ", Math.floor((1-byteCountOfCom / byteCountOfDecom)*100)+"%");

console.log("\nENCRYPTION: \n");

let text = compressedText;
let key = "password";
let nSize = 2;
console.log("Original Message: ", text);
console.log("Password: ", key);
console.log("Nonce Size: ", nSize);

console.time();
let encryptedText = encrypt(text, key, nSize);
console.timeEnd();
console.log("Encrypted Message: ", encryptedText);

console.time()
let decryptedText = decrypt(encryptedText, key, nSize);
console.timeEnd();
console.log("Decrypted Message: ", decryptedText);
let validResult = (decryptedText === decrypt(encryptedText, key, nSize));
console.log("Valid Decryption (Returns Original Message): ", decryptedText === text);
console.log("Self-Consistent (Same result done twice):    ", validResult);

let falsePass = "passwor1";
let newTest = decrypt(encryptedText, falsePass, nSize);
console.log("	False Password: ", falsePass);
console.log("	False Decrypted Message: ", newTest);
let botchedResult = (newTest === decrypt(encryptedText, falsePass, nSize));
console.log("	Valid Decryption (Returns Original Message): ", newTest === text);
console.log("	Self-Consistent (Same result done twice):    ", botchedResult);

console.log("\nFINAL STATS: \n");
console.log("Original Text & Bytes: ", uncompressedText, byteCount(uncompressedText));
console.log("Final Text & Bytes:    ", encryptedText, byteCount(encryptedText));
console.log("Byte Compression:      ", Math.floor((1-byteCount(encryptedText) / byteCount(uncompressedText))*100)+"%");
console.log("Valid Compression:     ", uncompressedText === decompressedText);
console.log("Valid Decryption:      ", decryptedText === text);
console.log("Self-Consistent:       ", validResult && botchedResult);*/
