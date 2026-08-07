export function stringToTokens(source, markdownIt) {
  let result = [];
  try {
    result = markdownIt.parse(source, {});
  } catch {}

  return result;
}
