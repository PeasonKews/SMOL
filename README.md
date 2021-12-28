# SMOL

SMOL uses...
- Success-Unknowable Encryption
- Memory-Efficient Symmetric-Key Cryptography
- Obfuscated Length
- Lossless Dictionary Compression

(NOTE: This is in beta, and further backwards-compatibility-breaking changes will be made to the protocol.)

A dictionary-compression and symmetric-key encryption algorithm for compressing and encrypting English text, written originally in JavaScript. Its purpose is for use in applications where storage is a constraint, such as blockchain-based social media (e.g. memo.cash), and also where an optional feature to encrypt the contents to only show them to certain peers may be desired.

The compression algorithm takes the most common 8000+ english words and phrases and assigns each a 13 bit binary value, and uses some intelligent grammar-guessing to get compression rates as high as possible. Words that are not on the list do not typically bloat the message too much because the most common double and triple pairs of english characters are included in the dictionary, so that words that are not included on the list only contribute around 15% bloat instead of the otherwise 50%+ bloat (this covers things like personal and brand names). Common compression rates is around 60%+ and takes around 10 milliseconds to compress most messages.

The encryption algorithm uses a cipher that rotates each substring of a message along a cipherwheel, seeded with the password and the location of that substring within the message, and this is after randomizing the position of each of the characters in the cipherwheel, the final step in the process being a password based shuffle. The frequency of character occurance in a message will be completely randomized, as will the relative relationship between each of the characters. The only thing that is not randomized is the length, but this is obfuscated by the compression algorithm itself, and can be further obfuscated by using a large custom nonce size. The speed of the encryption itself is very fast and takes just a few milliseconds.

The "success-unknowability" property of the encryption is atrributed to the fact that the encryption algorithm itself does not reveal to a brute-force attacker if they cracked the right message or not, and furthermore every attempt to crack a message with a wrong password is going to result in a message written in valid English, making it even harder for brute-force attackers to distinguish a valid message. In theory, encrypting messages with smaller keys than whats normally considered secure should be secure, because a human would need to review cracked message attempts, and if this involves billions of different attempts then they won't be able to. This is all assuming however that the protocol is not bugged in any way, and that a determined attacker doesn't know enough context about your message to find a way to algorithmically brute-force it. It's still recommended to use longer passwords, and if you want to combine this encryption with another encryption algorithm like AES-256, then separate and independently secure passwords should be used. 

To use SMOL, open tester.js and edit the written values to immediately see the encryption algorithm in action, just make sure to open index.html in your browser and inspect element to open your console. To call the SMOL function yourself, call SMOL_Encode(<msg>, <key>, <nSize>) to compress and encrypt your message, and use SMOL_Decode(<msg>, <key>, <nSize>) to convert it back to its original form. Currently, emojis and other multibyte characters are not supported and will break SMOL.
