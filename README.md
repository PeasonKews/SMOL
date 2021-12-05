# SMOL

SMOL uses...
- Symmetric-Key Encryption
- Memory-Efficient Noncing
- Obfuscated Length
- Lossless Compression

(NOTE: This is in beta, and further backwards-compatibility-breaking changes will be made to the protocol.)

A dictionary-compression and symmetric-key encryption algorithm for compressing and encrypting English text, written originally in JavaScript. Its purpose is for use in applications where storage is a constraint, such as blockchain-based social media (e.g. memo.cash), and also where an optional feature to encrypt the contents to only show them to certain peers may be desired.

This protocol optionally encrypts the compressed text only sacrificing 2 bytes of data by default. The encryption algorithm uses a cipher that rotates each character on a cipherwheel containing all 96 single-byte UTF-8 compatible characters, rotating each substring of a message differently and repeated times based on your password, in addition to shuffling it. The encryption algorithm shines best due to the fact that a brute-force-attacker cannot know with certainty if a message is valid, because all password attempts produce self-consistent garbage data, and will decompress to English text even if its garbage text. An attacker therefore must have ample human context to the extent of already almost knowing the entire message and also must go through every brute-force attempt and analyze them for their likelihood of being valid, which is in theory, impossible.

The ciphertext will almost always be smaller than the plaintext, and preliminary tests show an average of 50% plaintext compression even with encryption, sometimes more. It can also be less however, and there are certain characters not currently allowed, such as multi-byte characters and emojis.
