import Strings from '@/i18n';
import { RECORD_DATA_TYPE } from '@/constant';
import { imgDefaultPet } from '@/res';

export const mockData = [
  {
    id: 1,
    type: RECORD_DATA_TYPE.feed,
    time: '15:23',
    desc: Strings.formatValue('dsc_feed_eating', Strings.getLang('pet_name1')),
    img: imgDefaultPet,
  },
  {
    id: 2,
    type: RECORD_DATA_TYPE.feed,
    time: '14:23',
    desc: Strings.formatValue('dsc_feed_eating', Strings.getLang('pet_name2')),
    img: imgDefaultPet,
  },
  {
    id: 3,
    type: RECORD_DATA_TYPE.feed,
    time: '12:23',
    desc: Strings.formatValue('dsc_feed_eating', Strings.getLang('pet_name3')),
    img: imgDefaultPet,
  },
  {
    id: 4,
    type: RECORD_DATA_TYPE.feed,
    time: '11:23',
    desc: Strings.formatValue('dsc_feed_eating', Strings.getLang('pet_name4')),
    img: imgDefaultPet,
  },
  {
    id: 5,
    type: RECORD_DATA_TYPE.feed,
    time: '10:23',
    desc: Strings.formatValue('dsc_feed_eating', Strings.getLang('pet_name5')),
    img: imgDefaultPet,
  },
  {
    id: 6,
    type: RECORD_DATA_TYPE.feed,
    time: '09:23',
    desc: Strings.formatValue('dsc_feed_eating', Strings.getLang('pet_name6')),
    img: imgDefaultPet,
  },
];
