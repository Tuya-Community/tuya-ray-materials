import React, { FC, useRef, useState } from 'react';
import { CoverView, Image, Text, View } from '@ray-js/ray';
import { GAME_BTN_MAP } from '@/constant';
import { useImmer } from 'use-immer';
import { useActions } from '@ray-js/panel-sdk';
import dpCodes from '@/config/dpCodes';
import { getCdnPath } from '@/utils';
import clsx from 'clsx';

import styles from './index.module.less';

type Props = {
  visible: boolean;
};

const Game: FC<Props> = ({ visible }) => {
  const actions = useActions();
  const [btn, setBtn] = useImmer({
    top: GAME_BTN_MAP.top.img,
    right: GAME_BTN_MAP.right.img,
    bottom: GAME_BTN_MAP.bottom.img,
    left: GAME_BTN_MAP.left.img,
    play: GAME_BTN_MAP.play.img,
  });
  const [playCount, setPlayCount] = useState(0);
  const [chargeCount, setChargeCount] = useState(0);
  const [play, setPlay] = useState(false);
  const [playDisabled, setPlayDisabled] = useState(false);
  const [charging, setCharging] = useState(false);
  const chargeIntervalRef = useRef(null);

  const handleBtnTouchStart = (direction: keyof typeof GAME_BTN_MAP) => {
    const { imgPressed } = GAME_BTN_MAP[direction];
    setBtn(draft => {
      draft[direction] = imgPressed;
    });
  };

  const handleBtnTouchEnd = async (direction: keyof Omit<typeof GAME_BTN_MAP, 'play'>) => {
    actions[dpCodes.ptzControl].set(GAME_BTN_MAP[direction].value);

    setTimeout(() => {
      const { img } = GAME_BTN_MAP[direction];
      setBtn(draft => {
        draft[direction] = img;
      });
    }, 100);
  };

  const handlePlayTouchStart = () => {
    if (playDisabled) return;

    const { imgPressed } = GAME_BTN_MAP.play;
    setBtn(draft => {
      draft.play = imgPressed;
    });

    setChargeCount(0);
    chargeIntervalRef.current = setInterval(() => {
      setCharging(true);
      setChargeCount(prevCount => {
        const newCount = prevCount + 1;
        return Math.min(newCount, 5);
      });
    }, 1500);
  };

  const launchOnce = () => {
    return new Promise(resolve => {
      setPlayCount(count => count + 1);
      setPlay(true);
      setTimeout(() => {
        setPlay(false);
        resolve(true);
      }, 800);
    });
  };

  const handlePlayTouchEnd = async () => {
    if (playDisabled) return;

    clearInterval(chargeIntervalRef.current);

    if (chargeCount === 0) {
      setTimeout(() => {
        const { img } = GAME_BTN_MAP.play;
        setBtn(draft => {
          draft.play = img;
        });
      }, 100);
      // 单次
      actions[dpCodes.ejectionNumber].set('1times');

      setPlayDisabled(true);
      await launchOnce();
      setPlayDisabled(false);
    } else {
      setCharging(false);
      actions[dpCodes.ejectionNumber].set(`${chargeCount}times`);

      // 蓄力
      let i = chargeCount;

      setPlayDisabled(true);

      const launch = async () => {
        if (i === 0) {
          return Promise.resolve(true);
        }

        await launchOnce();
        return new Promise(resolve => {
          setTimeout(async () => {
            i--;
            await launch();
            resolve(true);
          }, 600);
        });
      };
      await launch();
      setPlayDisabled(false);

      const { img } = GAME_BTN_MAP.play;
      setBtn(draft => {
        draft.play = img;
      });
    }
  };

  return (
    <CoverView className={styles.cover}>
      <View className={clsx(styles.container, visible && styles.anim)}>
        <Image src={getCdnPath('gameTable.png')} className={styles.table} />
        <View className={styles['btn-top']}>
          <Image src={btn.top} className={styles.img} />
          <View
            className={styles.hotspot}
            onTouchStart={() => handleBtnTouchStart('top')}
            onTouchEnd={() => handleBtnTouchEnd('top')}
          />
        </View>

        <View className={styles['btn-right']}>
          <Image src={btn.right} className={styles.img} />
          <View
            className={styles.hotspot}
            onTouchStart={() => handleBtnTouchStart('right')}
            onTouchEnd={() => handleBtnTouchEnd('right')}
          />
        </View>

        <View className={styles['btn-bottom']}>
          <Image src={btn.bottom} className={styles.img} />
          <View
            className={styles.hotspot}
            onTouchStart={() => handleBtnTouchStart('bottom')}
            onTouchEnd={() => handleBtnTouchEnd('bottom')}
          />
        </View>

        <View className={styles['btn-left']}>
          <Image src={btn.left} className={styles.img} />
          <View
            className={styles.hotspot}
            onTouchStart={() => handleBtnTouchStart('left')}
            onTouchEnd={() => handleBtnTouchEnd('left')}
          />
        </View>

        <View className={styles['btn-play']}>
          <Image src={btn.play} className={styles.img} />
          <View
            className={styles.hotspot}
            onTouchStart={handlePlayTouchStart}
            onTouchEnd={handlePlayTouchEnd}
          />
        </View>
        {/* 发射计数 */}
        <View className={clsx(styles['play-count-wrapper'], play && styles.anim)}>
          <Text className={styles['text-stroke']}>X{playCount}</Text>
          <Text className={styles.text}>X{playCount}</Text>
        </View>

        {/* 发射枪口火焰动画 */}
        <View
          className={clsx(styles.fire, play && styles.anim)}
          style={{ backgroundImage: `url(${getCdnPath('fireAnim.png')})` }}
        />

        {/* 发射动画 */}
        <View className={clsx(styles.foodWrapper, play && styles.anim)}>
          <Image src={getCdnPath('gameFood.png')} className={styles.food} />
          <Image src={getCdnPath('gameFoodTail.png')} className={styles.tail} />
        </View>

        {/* 蓄力光环 */}
        <Image
          src={getCdnPath('chargingHalo.png')}
          className={clsx(styles.chargingHalo, charging && styles.anim)}
        />

        {/* 蓄力计数 */}
        <View
          key={`charge${chargeCount}`}
          className={clsx(styles.chargeCountWrapper, charging && styles.anim)}
          style={
            {
              '--shake-amplitude': `${chargeCount * 0.03}rem`,
              '--shake-rotate': `${chargeCount}deg`,
            } as any
          }
        >
          <Text className={styles['text-stroke']}>X{chargeCount}</Text>
          <Text className={styles.text}>X{chargeCount}</Text>
        </View>
      </View>
    </CoverView>
  );
};

export default Game;
