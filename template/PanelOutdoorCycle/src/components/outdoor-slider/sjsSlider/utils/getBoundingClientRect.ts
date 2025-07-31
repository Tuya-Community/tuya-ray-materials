import { getBoundingClientRect as rayGetBoundingClientRect } from '@ray-js/api';
import { isTuya } from '@ray-js/env';

const wxGetBoundingClientRect = id => {
  return new Promise<void>((resolve, reject) => {
    // @ts-ignore
    ty.createSelectorQuery()
      .select(`#${id}`)
      .fields(
        {
          node: true,
          rect: true,

          size: true,
        },
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        }
      )
      .exec();
  });
};

const getBoundingClientRect = async (ref, id) => {
  let result = null;
  if (isTuya) {
    result = await wxGetBoundingClientRect(id);
  } else {
    result = await rayGetBoundingClientRect(ref);
  }
  return result;
};

export default getBoundingClientRect;
