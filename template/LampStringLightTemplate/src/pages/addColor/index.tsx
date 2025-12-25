import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { TopBar } from '@/components';
import { BrightSlider } from '@/components/bright-slider';
import { ColorsProps } from '@/components/colors';
import { MyColors } from '@/components/my-colors';
import { useColorList } from '@/hooks/useColorList';
import Strings from '@/i18n';
import { actions, useSelector } from '@/redux';
import res from '@/res';
import { getDataId, isDataId } from '@/utils/getDataId';
import { getToggleAppendColor } from '@/utils/getToggleAppendColor';
import { getArray } from '@/utils/kit';
import { showConfirmBackModal } from '@/utils/showConfirmModal';
import ColorPicker from '@ray-js/lamp-circle-picker-color';
import ColorWheel from '@ray-js/lamp-color-wheel';
import { Image, router, showToast, Text, useQuery, View } from '@ray-js/ray';
import { maxSelectedColorNum } from '@/constant';

import { generateUUID } from '@/utils/utils';
import { isInIDE } from '@/utils/isIde';
import styles from './index.module.less';

export interface AddColorPageProps {}

const AddColorPage: React.FC<AddColorPageProps> = ({}) => {
  const [type, setType] = useState('picker');
  const query = useQuery();
  const isDiyColor = !!query?.isDiy;
  const dataId = getDataId(query?.dataId);

  const [hs, setHs] = useState<{ h: number; s: number; v: number; id: number }>({
    h: 0,
    s: 1000,
    v: 1000,
    id: -1,
  });
  const { list, storage, updateItem } = useColorList();
  const diyEditColors = useSelector(state => state?.common?.diyEditColors);

  useEffect(() => {
    if (isDiyColor) {
      if (isDataId(dataId)) {
        const item = diyEditColors[+dataId];
        const data = {
          ...item,
          id: dataId,
        };
        setHs(data as any);
      }
    } else {
      const item = getArray(list).find(item => +item.id === +dataId);
      if (item) {
        const data = {
          ...item,
          id: dataId,
        };
        setHs(data as any);
      }
    }
  }, [list, dataId, isDiyColor, diyEditColors]);

  const isMax = isDataId(dataId)
    ? false
    : isDiyColor
    ? getArray(diyEditColors).length >= 20
    : getArray(storage?.list).length >= 20;

  const [colors, setColors] = useState<ColorsProps['colors']>([]);
  const existColorsRef = useRef([]);
  useEffect(() => {
    // 缓存 diy 存在的颜色，切换类型后需要恢复
    existColorsRef.current = diyEditColors;
    setColors(diyEditColors);
  }, [diyEditColors]);

  const [collectedColorList, setCollectedColorList] = useState([]);

  const dispatch = useDispatch();
  const modes = [
    isDiyColor &&
      getArray(storage.list).length > 0 && {
        icon: res.icon_colors,
        type: 'colors',
        content: (
          // 从我的颜色中选择，添加到 diy 颜色
          <MyColors
            // 只有diy场景会从我的颜色中选
            currentSelect={collectedColorList}
            onClick={(_hs, id) => {
              setCollectedColorList([{ ...hs, ..._hs, id }]);
            }}
            style={{
              paddingLeft: '64rpx',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
            isRead
            onAdd={() => {
              setType('picker');
            }}
          />
        ),
      },
    {
      icon: res.color_picker_btn,
      type: 'picker',
      content: (
        <ColorPicker
          thumbBorderWidth={8}
          hs={hs}
          radius={isInIDE ? 100 : 160}
          onTouchEnd={_hs => setHs({ ...hs, ..._hs })}
          thumbRadius={21}
          whiteRange={0.15}
        />
      ),
    },
    {
      icon: res.rect_color_picker_btn,
      type: 'card',
      content: (
        <ColorWheel ringRadius={154} hsColor={hs} onTouchEnd={_hs => setHs({ ...hs, ..._hs })} />
      ),
    },
  ].filter(i => !!i);

  const content = modes.find(item => item.type === type)?.content;

  return (
    <View className={styles.contain}>
      <TopBar
        isShowMenu={false}
        isShowLeft
        titleClassName={styles.title}
        cancelClassName={styles.cancel}
        title={Strings.getLang('add_color')}
        leftText={Strings.getLang('cancel')}
        disableLeftBack
        onLeftClick={showConfirmBackModal}
      />
      <View className={styles.content}>
        {/* picker */}
        <View className={styles.pickerWrap}>{content}</View>
        {/* brightness slider */}
        <View className={styles.brightnessWrap}>
          <BrightSlider
            eventName="addColorBrightness"
            value={hs.v}
            valueScale={1 / 10}
            onAfterChange={v => {
              setHs({ ...hs, v });
            }}
          />
        </View>
        {/* mode */}
        <View className={styles.modeWrap}>
          {modes.map(item => (
            <View
              className={styles.modeItem}
              style={{
                borderColor: item.type === type ? '#0D84FF' : 'transparent',
              }}
              key={item.type}
              onClick={() => {
                if (item.type !== 'colors') {
                  // 恢复 diy 存在的颜色， 防止重复添加
                  const colors = existColorsRef.current;
                  setColors(colors);
                }
                setType(item.type);
              }}
            >
              <Image mode="aspectFit" className={styles.modeItemImg} src={item.icon} />
            </View>
          ))}
        </View>
        {/* save */}
        <View className={styles.bottom}>
          <View
            className={styles.bottomBtn}
            style={{
              opacity: isMax ? 0.5 : 1,
            }}
            onClick={() => {
              if (isMax) {
                return;
              }

              if (isDiyColor) {
                if (isDataId(dataId)) {
                  const nextColors = getArray(colors).map((item, i) =>
                    i === +dataId
                      ? {
                          ...hs,
                          v: hs.v,
                          id: dataId,
                        }
                      : item
                  );
                  dispatch(actions.common.updateDiyEditColors(nextColors));
                } else {
                  // 如果在“收藏色” type 中，不保存其他 type 中的颜色
                  if (type === 'colors') {
                    if (colors.length > maxSelectedColorNum) {
                      showToast({
                        title: Strings.getLang('add_color_max'),
                        icon: 'error',
                      });
                      return;
                    }
                    dispatch(
                      actions.common.updateDiyEditColors(
                        getArray(colors.concat(collectedColorList))
                      )
                    );
                    router.back();
                    return;
                  }
                  let { id } = hs || {};
                  if (id === -1 || id === undefined) {
                    id = generateUUID(colors.map(i => i.id));
                  }

                  const colorList = hs
                    ? getToggleAppendColor(getArray(colors), {
                        ...hs,
                        v: hs.v,
                        id,
                      })
                    : getArray(colors);

                  if (colors.length > maxSelectedColorNum) {
                    showToast({
                      title: Strings.getLang('add_color_max'),
                      icon: 'error',
                    });
                    return;
                  }

                  dispatch(actions.common.updateDiyEditColors(colorList));
                }

                router.back();
                return;
              }

              if (isDataId(dataId)) {
                updateItem(dataId, hs);
                router.back();
                return;
              }
              if (hs) {
                storage.addItem(`${hs.h}_${hs.s}_${hs.v}`);
                router.back();
              }
            }}
          >
            <Image src={res.save_icon} className={styles.bottomImg} />
            <Text className={styles.bottomText}>{Strings.getLang('save')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AddColorPage;
