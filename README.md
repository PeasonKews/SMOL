# SMOL

SMOL uses...
- Success-Unknowable Encryption
- Memory-Efficient Symmetric-Key Cryptography
- Obfuscated Length
- Lossless Dictionary Compression

(NOTE: This is in beta, and further backwards-compatibility-breaking changes will be made to the protocol.)

A dictionary-compression and symmetric-key encryption algorithm for compressing and encrypting English text, written originally in JavaScript. Its purpose is for use in applications where storage is a constraint, such as blockchain-based social media (e.g. memo.cash), and also where an optional feature to encrypt the contents to only show them to certain peers may be desired.

The compression algorithm takes the most common 6000+ english words and phrases and assigns each a 13 bit binary value, and uses some intelligent grammar-guessing to get compression rates as high as possible. Words that are not on the list do not typically bloat the message too much because the most common double and triple pairs of english characters are included in the dictionary, so that words that are not included on the list only contribute around 15% bloat instead of the otherwise 50%+ bloat (this covers things like personal and brand names).

The encryption algorithm uses a cipher that rotates each character in a message with a unique pseudorandom value, generated symmetrically using both the entropy from a password and the message itself. We can do this by splitting a message in two and using each half to encrypt each other. If a nonce is used its appended here, then the whole ciphertext is shuffled together.

The key used to randomize the message is created by appending the password to itself (text.length x2) times, rotating the values of each substring of the text (not each "character" like a Vignere cipher) by a dynamic cipherwheel seeded with the total value of a password (defined as the sum of all values of each character in the password), and then shuffled using a password-based shuffling algorithm that vigoruously transposes each character with some pseudorandomly selected character pair, and then the final step involves taking each pair of two characters and adding their values together, creating a one-way value derivation function that produces a completely new key, which is the exact length of the target text.

The encryption algorithm shines best due to the fact that a brute-force-attacker cannot know with certainty if a message is valid, because all password attempts produce self-consistent garbage data, and will decompress to English text even if its garbage text. An attacker therefore must have ample human context to the extent of already almost knowing the entire message and also must go through every brute-force attempt and analyze them for their likelihood of being valid, which is in theory, impossible.

The ciphertext will almost always be smaller than the plaintext, and preliminary tests show an average of 52% plaintext compression even with encryption, sometimes more. It can also be less however, and there are certain characters not currently allowed, such as multi-byte characters and emojis. Current speed tests shows a SMOL operation (with both compression and encryption, or the inverse) around 10-15 ms for a somewhat-long message (like a couple paragraphs).
