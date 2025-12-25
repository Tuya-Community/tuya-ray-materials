/* eslint-disable */
const BW = {
  index: 3, // 0~7
  hue: 10, // 0~1023
  saturation: 6, // 0~63
  value: 6, // 0~63
  temperature: 7, // 0~127
};

function scaleToBits(value, maxValue, bits) {
  const maxBitsValue = (1 << bits) - 1;
  return Math.round((value / maxValue) * maxBitsValue);
}

function scaleFromBits(bitsValue, maxValue, bits) {
  const maxBitsValue = (1 << bits) - 1;
  return (bitsValue / maxBitsValue) * maxValue;
}

function packLightData(index, hue, saturation, value, temperature) {
  let packed = 0;
  let offset = 32;

  const push = (val, bits) => {
    offset -= bits;
    packed |= (val & ((1 << bits) - 1)) << offset;
  };

  push(scaleToBits(index, 7, BW.index), BW.index);
  push(scaleToBits(hue, 360, BW.hue), BW.hue);
  push(scaleToBits(saturation, 100, BW.saturation), BW.saturation);
  push(scaleToBits(value, 100, BW.value), BW.value);
  push(scaleToBits(temperature, 100, BW.temperature), BW.temperature);

  return packed >>> 0;
}

function unpackLightData(packed) {
  let offset = 0;

  const pull = bits => {
    const mask = (1 << bits) - 1;
    const val = (packed >>> (32 - offset - bits)) & mask;
    offset += bits;
    return val;
  };

  return {
    index: scaleFromBits(pull(BW.index), 7, BW.index),
    hue: scaleFromBits(pull(BW.hue), 360, BW.hue),
    saturation: scaleFromBits(pull(BW.saturation), 100, BW.saturation),
    value: scaleFromBits(pull(BW.value), 100, BW.value), // 同时代表亮度
    temperature: scaleFromBits(pull(BW.temperature), 100, BW.temperature),
  };
}
