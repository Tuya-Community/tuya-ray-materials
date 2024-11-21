import { FC, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from '@ray-js/ray';

import { Filter, NoData, PageWrapper, SingleDataItem, Text, TouchableOpacity } from '@/components';
import RecordTopBar from '@/components/TopBar/RecordTopBar';
import Strings from '@/i18n';
import { useSelector } from '@/redux';
import { getFiltedDataList } from '@/redux/action';
import Res from '@/res';
import styles from './index.module.less';

const bpFiltrateList = ['WHO_LV0', 'WHO_LV1', 'WHO_LV2', 'WHO_LV3', 'WHO_LV4', 'WHO_LV5'] as const;
const remarkFiltrateList = ['noRemarks', 'haveRemarks'] as const;

interface Props {
  location: { query: Record<string, any> };
}

const Record: FC<Props> = props => {
  const [bpLevelsFilterShow, setBpLevelsFilterShow] = useState(false);
  const [remarkFilterShow, setRemarkFilterShow] = useState(false);
  const latestData = useSelector(({ uiState }) => uiState.latestData);
  const [bpLevels, setBpLevels] = useState('');
  const [isChangeClasify, setIsChangeClasify] = useState('');
  const [existRemark, setExistRemark] = useState('');
  const isChangeClasifyList = isChangeClasify.split(',');
  const existRemarkPreList = existRemark.split(',');
  const existRemarkList: string[] = [];

  existRemarkPreList.forEach(item => {
    if (item === 'true') {
      existRemarkList.push('haveRemarks');
    }
    if (item === 'false') {
      existRemarkList.push('noRemarks');
    }
  });
  const type = useSelector(({ uiState }) => uiState.type);
  const { datas, hasNext } = useSelector(({ uiState }) => uiState.filtedDataList);
  const pageNo = useRef(0);
  const showAll = props.location.query?.showAll;

  const getFiltedData = async (
    pageNum: number,
    isFirstLoad: boolean,
    bpLevelTypes: string,
    remarkType: string,
    typeCode: string
  ) => {
    await getFiltedDataList(pageNum, isFirstLoad, bpLevelTypes, remarkType, typeCode);
  };

  useEffect(() => {
    getFiltedData(0, true, bpLevels, existRemark, showAll ? 'year' : type);
    pageNo.current = 0;
  }, [type, bpLevels, existRemark, latestData]);

  const getMoreData = () => {
    if (!hasNext) return;

    getFiltedData(pageNo.current + 1, false, bpLevels, existRemark, showAll ? 'year' : type);
    pageNo.current += 1;
  };

  const handleBpLevels = (str: string) => {
    setBpLevels(str);
    setIsChangeClasify(str);
  };
  const handleExistRemark = (str: string) => {
    setExistRemark(str);
  };

  // 获取血压分类筛选标识
  const classificationTitle = Strings.getLang('dsc_classificationDefaultTitle');
  // 获取备注筛选表示
  const remarkTitle = Strings.getLang('dsc_remark');
  const isClick = false;

  const classificationText =
    bpLevels.length > 8
      ? `${Strings.getLang(`dsc_${bpLevels.slice(0, 7)}`)}、...`
      : Strings.getLang(`dsc_${bpLevels.slice(0, 7)}`);

  const remarkText =
    existRemark === 'true'
      ? Strings.getLang('dsc_haveRemarks')
      : existRemark === 'false'
      ? Strings.getLang('dsc_noRemarks')
      : Strings.getLang('dsc_remark');

  const renderList = () => {
    return (
      <ScrollView scrollY className={styles.scroll} onScrollToLower={getMoreData}>
        {datas.map(item => (
          <SingleDataItem item={item} key={item.id} />
        ))}
        {datas.length === 0 ? null : (
          <View className={styles.footerBox}>
            <Text className={styles.footerText}>
              {hasNext ? Strings.getLang('dsc_getMoreDta') : Strings.getLang('dsc_showAllData')}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <>
      <RecordTopBar />
      <PageWrapper>
        <View className={styles.selectorContainer}>
          <TouchableOpacity
            className={styles.selectorBox}
            onClick={() => setBpLevelsFilterShow(true)}
          >
            <Text
              className={styles.selectorText}
              style={{ opacity: isClick ? 1 : 0.8, fontWeight: isClick ? '600' : '400' }}
            >
              {isChangeClasify === '' ? classificationTitle : classificationText}
            </Text>
            <View
              className={styles.selectorPic}
              style={{ WebkitMaskImage: `url(${Res.recordDownArrow})` }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className={styles.selectorBox}
            onClick={() => setRemarkFilterShow(true)}
          >
            <Text
              className={styles.selectorText}
              style={{ opacity: isClick ? 1 : 0.8, fontWeight: isClick ? '600' : '400' }}
            >
              {remarkText}
            </Text>
            <View
              className={styles.selectorPic}
              style={{ WebkitMaskImage: `url(${Res.recordDownArrow})` }}
            />
          </TouchableOpacity>
        </View>
        {datas?.length > 0 ? renderList() : <NoData />}
      </PageWrapper>

      <Filter
        checkedList={isChangeClasifyList}
        selectorList={bpFiltrateList}
        show={bpLevelsFilterShow}
        onHide={() => setBpLevelsFilterShow(false)}
        onSelect={handleBpLevels}
      />
      <Filter
        checkedList={existRemarkList}
        selectorList={remarkFiltrateList}
        show={remarkFilterShow}
        onHide={() => setRemarkFilterShow(false)}
        onSelect={handleExistRemark}
      />
    </>
  );
};

export default Record;
