import dpCodes from '@/config/dpCodes';
import { Buffer } from 'buffer';
import { toHexByte } from '@/utils';

export const protocols = {
  [dpCodes.newmealPlan]: {
    parser: (dpValue: string) => {
      if (!dpValue) return null;

      const list: FeedPlan[] = [];

      const version = parseInt(dpValue.slice(0, 2), 16);
      const sectionLength = version === 1 ? 44 : 10;

      let index = 0;

      for (let i = 2; i < dpValue.length; i += sectionLength) {
        const section = dpValue.slice(i, i + sectionLength);
        const loops = parseInt(section.slice(0, 2), 16);
        const hour = parseInt(section.slice(2, 4), 16);
        const minute = parseInt(section.slice(4, 6), 16);
        const amount = parseInt(section.slice(6, 8), 16);
        const status = parseInt(section.slice(8, 10), 16) === 1;

        let audioFileNo = '';

        if (version === 1) {
          const audioEnable = parseInt(section.slice(10, 12), 16) === 1;
          const audioFileNoStr = section.slice(12, 44);

          if (audioEnable) {
            const audioFileNoList =
              audioFileNoStr
                .match(/.{1,2}/g)
                ?.map(item => parseInt(item, 16))
                .filter(item => item >= 48) ?? [];

            const bytes = new Uint8Array(audioFileNoList);
            const buffer = Buffer.from(bytes);
            audioFileNo = buffer.toString('utf-8');
          } else {
            audioFileNo = '';
          }
        } else {
          audioFileNo = '';
        }

        list.push({
          id: index++,
          loops,
          hour,
          minute,
          amount,
          status,
          audioEnable: audioFileNo !== '',
          audioFileNo,
        });
      }

      return {
        version,
        list,
      };
    },
    formatter: (parsedDpValue: MealPlan) => {
      const { version, list } = parsedDpValue;
      let command = '';

      command += String(version).padStart(2, '0');

      for (let i = 0; i < list.length; i++) {
        const { loops, hour, minute, amount, status, audioEnable, audioFileNo } = list[i];
        command += toHexByte(loops);
        command += toHexByte(hour);
        command += toHexByte(minute);
        command += toHexByte(amount);
        command += toHexByte(status ? 1 : 0);
        command += toHexByte(audioEnable ? 1 : 0);

        if (version === 1) {
          if (audioEnable) {
            const buffer = Buffer.from(audioFileNo, 'utf-8');
            const byteStr = Array.from(buffer)
              .map(byte => byte.toString(16).padStart(2, '0'))
              .join('')
              .padStart(32, '0');
            command += byteStr;
          } else {
            command += '00000000000000000000000000000000';
          }
        }
      }

      return command;
    },
  },
};
