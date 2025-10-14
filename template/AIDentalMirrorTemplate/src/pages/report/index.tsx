import React, { useState } from 'react';
import { View, Image, navigateBack, Text, ScrollView } from '@ray-js/ray';
import { NavBar, ConfigProvider } from '@ray-js/smart-ui';
import { Icon } from '@ray-js/icons';
import { useSelector } from 'react-redux';
import { withUIConfig } from '@/hooks/withUIConfig';
import { selectSystemInfoByKey } from '@/redux/modules/systemInfoSlice';
import { selectUiState } from '@/redux/modules/uiStateSlice';
import Strings from '@/i18n';
import res from '@/res';
import styles from './index.module.less';

const DiseaseTypeImgMap = {
  Calculus: res.imgIconCalculus,
  Caries: res.imgIconCaries,
  Gingivitis: res.imgIconGingivitis,
  Hypodontia: res.imgIconHypodontia,
  Discoloration: res.imgIconDiscoloration,
  Ulcers: res.imgIconUlcers,
};

// 口腔疾病类型列表
const DISEASE_TYPE_LIST = [
  'Calculus', // 结石
  'Caries', // 龋齿
  'Gingivitis', // 牙龈炎
  'Hypodontia', // 牙齿发育不全
  'Discoloration', // 牙齿变色
  'Ulcers', // 溃疡
] as const;

// 图片类型列表
const IMG_TYPE_LIST = ['sunlight', 'chroma', 'grayscale', 'heatMap'] as const;

export function Report() {
  const windowWidth = useSelector(selectSystemInfoByKey('windowWidth'));
  const {
    aiReport: { diseaseType = [], heatMapPath, sunlightPath, chromaPath, grayscalePath },
  } = useSelector(selectUiState);

  const getImgPath = (key: string) => {
    let res = '';
    switch (key) {
      case 'sunlight':
        res = sunlightPath;
        break;
      case 'chroma':
        res = chromaPath;
        break;
      case 'grayscale':
        res = grayscalePath;
        break;
      case 'heatMap':
        res = heatMapPath;
        break;
      default:
        break;
    }
    return res;
  };

  // 图片提示
  const [showTipData, setShowTipData] = useState<{
    key: (typeof IMG_TYPE_LIST)[number];
    detail: any;
  } | null>(null);
  const handleClickImg = (key: (typeof IMG_TYPE_LIST)[number], e: any) => {
    if (showTipData?.key === key) {
      setShowTipData(null);
    } else {
      setShowTipData({ key, detail: e.detail });
    }
  };

  // 疾病类型提示
  const [showDetailKey, setShowDetailKey] = useState<(typeof DISEASE_TYPE_LIST)[number] | ''>('');
  const handleClickResult = (type: (typeof DISEASE_TYPE_LIST)[number]) => {
    if (!diseaseType.includes(type)) return;
    if (showDetailKey === type) {
      setShowDetailKey('');
    } else {
      setShowDetailKey(type);
    }
  };

  const isNormal = diseaseType.every(type => !DISEASE_TYPE_LIST.includes(type));

  return (
    <>
      <View className={styles.view}>
        <ConfigProvider>
          <NavBar
            title={Strings.getLang('title_report')}
            leftArrow
            customStyle={{ width: '100vw', background: 'transparent' }}
            border={false}
            onClickLeft={() => {
              navigateBack();
            }}
          />
        </ConfigProvider>
        {/* 图片提示 */}
        {showTipData?.key && (
          <View className={styles.mask} onClick={() => setShowTipData(null)}>
            <View
              className={styles.arrowBox}
              style={{
                left: `${showTipData?.detail?.x - 5}px`,
                top: `${showTipData?.detail?.y - 15}px`,
              }}
            >
              <View
                className={styles.tipContent}
                style={{
                  left: showTipData?.detail?.x > windowWidth / 2 ? '-180px' : '-100px',
                }}
              >
                <View className={styles.tipText}>
                  {Strings.getLang(`report_img_tip_${showTipData?.key}`)}
                </View>
              </View>
            </View>
          </View>
        )}
        <View className={styles.container}>
          <Image src={res.imgReportBg} className={styles.reportBg} mode="aspectFill" />
          <ScrollView scrollY>
            <View className={styles.titleBox}>
              <Text className={styles.title}>{Strings.getLang('report_main_title')}</Text>
              <View className={styles.titleBar} />
            </View>
            <Text className={styles.mainTips}>{Strings.getLang('report_main_tips')}</Text>
            {isNormal ? (
              <View className={styles.normalBox}>
                <Image src={res.imgNormal} className={styles.normalIcon} mode="aspectFill" />
                <Text className={styles.normalText}>{Strings.getLang('report_normal_text')}</Text>
              </View>
            ) : (
              <View className={styles.imgBox}>
                {IMG_TYPE_LIST.map(key => (
                  <View key={key} className={styles.imgItem}>
                    <Image
                      src={res.imgTipIcon}
                      className={styles.tipIcon}
                      mode="aspectFill"
                      onClick={e => handleClickImg(key, e)}
                    />
                    <Image src={getImgPath(key)} className={styles.img} mode="aspectFill" />
                    <View className={styles.imgLabelBox}>
                      <Text className={styles.imgLabel}>
                        {Strings.getLang(`report_img_label_${key}`)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            {DISEASE_TYPE_LIST.map(type => (
              <View key={type} className={styles.resultBox} onClick={() => handleClickResult(type)}>
                <View className={styles.resultMainInfo}>
                  <View className={styles.resultMainInfoLeft}>
                    <Image
                      src={DiseaseTypeImgMap[type]}
                      className={styles.resultIcon}
                      mode="aspectFill"
                    />
                    <Text className={styles.resultTitle}>
                      {Strings.getLang(`report_dental_condition_label_${type}`)}：
                    </Text>
                    {diseaseType.includes(type) ? (
                      <Text className={styles.resultError}>
                        {Strings.getLang('report_dental_condition_abnormal')}
                      </Text>
                    ) : (
                      <Text className={styles.resultNormal}>
                        {Strings.getLang('report_dental_condition_normal')}
                      </Text>
                    )}
                  </View>
                  {diseaseType.includes(type) && (
                    <Icon
                      type={showDetailKey === type ? 'icon-up' : 'icon-down'}
                      size={20}
                      color="#b2b2b2"
                    />
                  )}
                </View>
                {showDetailKey === type && (
                  <View className={styles.resultDetailBox}>
                    <View className={styles.resultDetailItem}>
                      <Text className={styles.resultDetailItemTitle}>
                        {Strings.getLang('report_dental_condition_title_1')}
                      </Text>
                      <Text className={styles.resultDetailItemDesc}>
                        {Strings.getLang(`report_dental_condition_desc_${type}_1`)}
                      </Text>
                    </View>
                    <View className={styles.resultDetailItem}>
                      <Text className={styles.resultDetailItemTitle}>
                        {Strings.getLang('report_dental_condition_title_2')}
                      </Text>
                      <Text className={styles.resultDetailItemDesc}>
                        {Strings.getLang(`report_dental_condition_desc_${type}_2`)}
                      </Text>
                    </View>
                    <View className={styles.resultDetailItem}>
                      <Text className={styles.resultDetailItemTitle}>
                        {Strings.getLang('report_dental_condition_title_3')}
                      </Text>
                      <Text className={styles.resultDetailItemDesc}>
                        {Strings.getLang(`report_dental_condition_desc_${type}_3`)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
            <View style={{ height: '24px' }} />
          </ScrollView>
        </View>
      </View>
    </>
  );
}

export default withUIConfig(Report);
