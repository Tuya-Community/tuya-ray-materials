import { getAbility } from '@/api/atop';

let loaded = false;
let enabled = false;
export const getAstronomicalEnabled = async (devId: string) => {
  if (loaded) {
    return enabled;
  }
  const res = await getAbility(devId, 'tyabindesg');
  console.log('=====getAstronomicalEnabled', res);
  loaded = true;
  enabled = !!res.isOpen;
  return enabled;
};
