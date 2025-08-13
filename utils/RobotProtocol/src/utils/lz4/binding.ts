/* eslint-disable */

/**
	Javascript version of the key LZ4 C functions
 */

if (!Math.imul)
  Math.imul = function imul(a, b) {
    const ah = a >>> 16;
    const al = a & 0xffff;
    const bh = b >>> 16;
    const bl = b & 0xffff;
    return (al * bl + ((ah * bl + al * bh) << 16)) | 0;
  };

/**
 * Decode a block. Assumptions: input contains all sequences of a
 * chunk, output is large enough to receive the decoded data.
 * If the output buffer is too small, an error will be thrown.
 * If the returned value is negative, an error occured at the returned offset.
 *
 * @param input {Buffer} input data
 * @param output {Buffer} output data
 * @return {Number} number of decoded bytes
 * @private
 */
const uncompress = function (input, output, sIdx?: number, eIdx?: number) {
  sIdx = sIdx || 0;
  eIdx = eIdx || input.length - sIdx;
  // Process each sequence in the incoming data
  for (var i = sIdx, n = eIdx, j = 0; i < n; ) {
    const token = input[i++];

    // Literals
    let literals_length = token >> 4;
    if (literals_length > 0) {
      // length of literals
      var l = literals_length + 240;
      while (l === 255) {
        l = input[i++];
        literals_length += l;
      }

      // Copy the literals
      var end = i + literals_length;
      while (i < end) output[j++] = input[i++];

      // End of buffer?
      if (i === n) return j;
    }

    // Match copy
    // 2 bytes offset (little endian)
    const offset = input[i++] | (input[i++] << 8);

    // 0 is an invalid offset value
    if (offset === 0 || offset > j) return -(i - 2);

    // length of match copy
    let match_length = token & 0xf;
    var l = match_length + 240;
    while (l === 255) {
      l = input[i++];
      match_length += l;
    }

    // Copy the match
    let pos = j - offset; // position of the match copy in the current output
    var end = j + match_length + 4; // minmatch = 4
    while (j < end) output[j++] = output[pos++];
  }

  return j;
};

export { uncompress };
