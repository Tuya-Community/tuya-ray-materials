export function formatJSONStringDpToObject<T = any>(json: string): T {
  let ret = null;

  try {
    ret = JSON.parse(json);
  } catch (err) {
    //
  }

  return ret as T;
}
