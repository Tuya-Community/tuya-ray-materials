import React, { useRef, useState, useEffect } from 'react';
import { View, Image, Text } from '@ray-js/ray';
import { Card } from '@/components/card';
import { Switch } from '@ray-js/smart-ui';
import Strings from '@/i18n';
import CommonCharts from '@ray-js/common-charts';
import Layout from '@/components/layout';
import { useDevice } from '@ray-js/panel-sdk';
import clsx from 'clsx';
import moment from 'moment';
import { getDpHistoryDataListApi, getLCDataListApi } from '../../api/chart';
import { timeIsNext, tabsTimeChange } from '../../utils';
import {
  TIME_FORMAT_TEMPLATE_MAP,
  DATETYPE_API_CONFIG,
  INITIAL_LC_DATA_LIST,
  PRODUCE,
  DATA_TABS,
  DateTag,
  ELE_PRODUCE_GRIDCN,
  ELE_SELFUSE_CAL,
  DateAction,
} from '../../constants';
import Styles from './index.module.less';

const _DEFAULT_OPTIONS_ = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'solid',
      },
    },
  },
  grid: {
    left: '0',
    right: '0',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  ],
  yAxis: [
    {
      type: 'value',
    },
  ],
  series: [],
};

export default function Chart() {
  const chartRef = useRef(null);
  const devName = useDevice(d => d.devInfo.name);
  const [options, setOptions] = useState<any>(_DEFAULT_OPTIONS_);
  const [type, setType] = useState(PRODUCE);
  const [beginTime, setBeginTime] = useState(moment().startOf('day'));
  const [endTime, setEndTime] = useState(moment().endOf('day'));
  const [dateType, setDateType] = useState(DateTag.DAY);
  const [canNext, setCanNext] = useState(false);
  const [timeString, setTimeString] = useState('');
  const [chartList, setChartList] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [lcDataList, setLcDataList] = useState([]);
  const [indicatorCodes, setIndicatorCodes] = useState([
    {
      code: ELE_SELFUSE_CAL,
      label: Strings.getLang(ELE_SELFUSE_CAL),
      color: '#0AC185',
      checked: true,
    },
    {
      code: ELE_PRODUCE_GRIDCN,
      label: Strings.getLang(ELE_PRODUCE_GRIDCN),
      color: '#CBD857',
      checked: true,
    },
  ]);

  useEffect(() => {
    const {
      query: { deviceId },
    } = ty.getLaunchOptionsSync();

    getLCDataListApi({
      devId: deviceId,
      phoneCode: '49',
      types: '1,2,3,4',
    }).then(list => {
      const newLCDataList = INITIAL_LC_DATA_LIST.map((item, index) => ({
        ...item,
        value: list[index].value,
      }));

      setLcDataList(newLCDataList);
    });
  }, []);

  useEffect(() => {
    let xAxisData = [];
    const seriesDataMap = {};
    if (chartList[0] && chartList[0].list) {
      xAxisData = chartList[0].list.map(item => item.date);

      chartList.map(item => {
        const { indicator, list } = item;
        seriesDataMap[indicator] = list.map(item => item.value);
      });
    }
    setOptions({
      ..._DEFAULT_OPTIONS_,
      ...{
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
          },
        ],
        series:
          indicatorCodes.filter(item => item.checked).length > 0
            ? indicatorCodes
                .filter(item => item.checked)
                .map(item => ({
                  name: item.label,
                  type: 'line',
                  stack: 'Total',
                  smooth: true,
                  areaStyle: {
                    color: item.color,
                    opacity: 0.5,
                  },
                  lineStyle: {
                    color: item.color,
                    width: 2,
                  },
                  itemStyle: {
                    color: item.color,
                  },
                  data: seriesDataMap[item.code] || [],
                }))
            : [
                {
                  name: '',
                  type: 'line',
                  stack: 'Total',
                  smooth: true,
                  data: [],
                },
              ],
      },
    });
  }, [indicatorCodes, chartList, dateType, beginTime, endTime]);

  useEffect(() => {
    let _timeString = '';
    const timeFormatTemplate = TIME_FORMAT_TEMPLATE_MAP[dateType];
    if (dateType === DateTag.WEEK) {
      _timeString = `${beginTime.format(timeFormatTemplate)} ~ ${endTime.format(
        timeFormatTemplate
      )}`;
    } else {
      _timeString = beginTime.format(timeFormatTemplate);
    }

    setTimeString(_timeString);
    setCanNext(timeIsNext(beginTime, dateType));
  }, [dateType, beginTime, endTime]);

  useEffect(() => {
    getChartList();
  }, [dateType, beginTime, endTime]);

  const changeDateType = e => {
    const { type } = e.origin.currentTarget.dataset;
    if (type === dateType) return;
    setDateType(type);
    const curTime = moment();
    updateDateAction(curTime, type);
  };

  const preClick = () => {
    const { beginMomentTime } = tabsTimeChange(
      moment(beginTime),
      moment(endTime),
      dateType,
      DateAction.SUBTRACT
    );
    updateDateAction(beginMomentTime, dateType);
  };

  const nextClick = () => {
    const { beginMomentTime } = tabsTimeChange(
      moment(beginTime),
      moment(endTime),
      dateType,
      DateAction.ADD
    );
    updateDateAction(beginMomentTime, dateType);
  };

  const updateDateAction = (curTime, type) => {
    if (type === DateTag.DAY) {
      setBeginTime(moment(curTime.startOf('day')));
      setEndTime(moment(curTime.endOf('day')));
    } else if (type === DateTag.WEEK) {
      setBeginTime(moment(curTime.startOf('day').subtract(curTime.isoWeekday() - 1, 'days')));
      setEndTime(moment(curTime.endOf('day').add(6, 'day')));
    } else if (type === DateTag.MONTH) {
      setBeginTime(moment(curTime.startOf('day').subtract(curTime.date() - 1, 'days')));
      setEndTime(moment(curTime.endOf('day').add(1, 'months').subtract(1, 'days')));
    } else {
      setBeginTime(moment(curTime.startOf('year')));
      setEndTime(moment(curTime.endOf('year')));
    }
  };

  // 切换tab
  const changeTab = e => {
    const { type } = e.origin.currentTarget.dataset;
    setType(type);
  };

  const getChartList = async () => {
    ty.showLoading({ title: '' });
    const {
      query: { deviceId },
    } = ty.getLaunchOptionsSync();
    const { dateType: _dateType, timeFormatTemplate } = DATETYPE_API_CONFIG[dateType];
    const params = { indicatorCodes: indicatorCodes.map(item => item.code).join(',') };
    const args: {
      devId: string; // 设备id
      dateType: 'day' | 'week' | 'month' | 'year'; // 日期类型
      beginDate: string; // 开始日期
      endDate: string; // 结束日期
      aggregationType: 'SUM' | 'AVG' | 'MAX' | 'MIN' | 'NUM';
      indicatorCodes: string; // 指标code
    } = {
      devId: deviceId,
      dateType: _dateType,
      beginDate: beginTime.format(timeFormatTemplate),
      endDate: endTime.format(timeFormatTemplate),
      aggregationType: 'SUM',
      ...params,
    };

    const res = await getDpHistoryDataListApi(args);
    let _totalValue = 0;
    if (res && Array.isArray(res)) {
      res.forEach(ele => {
        _totalValue += ele.total;
      });
    }

    setChartList(res || []);
    setTotalValue(_totalValue);

    ty.hideLoading();
  };

  const changeSwitch = e => {
    const { code } = e.currentTarget.dataset;
    const _indicatorCodes = [];
    indicatorCodes.map(item => {
      if (item.code === code) {
        _indicatorCodes.push({ ...item, checked: !item.checked });
      } else {
        _indicatorCodes.push(item);
      }
    });
    setIndicatorCodes(_indicatorCodes);
  };

  return (
    <Layout title={devName}>
      <View className={Styles.wrap}>
        <Card className={Styles.card} hoverClassName={Styles.hover}>
          <View className={Styles.titleWrap}>
            {DATA_TABS.map((item, index) => (
              <View
                key={index}
                className={clsx(Styles.unit, type === item.type ? Styles.active : '')}
                data-type={item.type}
                onClick={changeTab}
              >
                <View>{item.title}</View>
              </View>
            ))}
          </View>
          <View className={Styles.chartWrap}>
            {type === PRODUCE ? (
              <>
                <View>
                  <View className={Styles.font1}>{Strings.getLang('totalOutput')}</View>
                  <View className={clsx(Styles.font2, Styles.mt6)}>
                    {totalValue} <Text className={clsx(Styles.font3, Styles.ml3)}>kWh</Text>
                  </View>
                </View>

                <CommonCharts
                  getEchartsProxy={echart => {
                    chartRef.current = echart;
                  }}
                  option={options}
                  opts={{ notMerge: true }}
                  unit="kWh"
                />

                <View className={Styles.legendWrap}>
                  {indicatorCodes.map((item, index) => (
                    <View key={index}>
                      <View>
                        <Switch
                          checked={item.checked}
                          activeColor={item.color}
                          size="20px"
                          data-code={item.code}
                          onChange={changeSwitch}
                        />
                      </View>
                      <View className={Styles.font1}>{item.label}</View>
                    </View>
                  ))}
                </View>

                <View className={Styles.dateTimeWrap}>
                  <View className={Styles.timeWrap}>
                    <View onClick={preClick}>
                      <Image
                        src="/images/common/icon_left_arrow.png"
                        className={Styles.iconLeftArrow}
                      />
                    </View>
                    <View className={Styles.font4}>{timeString}</View>
                    {canNext ? (
                      <View onClick={nextClick}>
                        <Image
                          src="/images/common/icon_left_arrow.png"
                          className={Styles.iconRightArrow}
                        />
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>
                  <View className={Styles.dateWrap}>
                    <View
                      className={clsx(Styles.unit, dateType === DateTag.DAY ? Styles.active : '')}
                      data-type={DateTag.DAY}
                      onClick={changeDateType}
                    >
                      {Strings.getLang('day')}
                    </View>
                    <View
                      className={clsx(Styles.unit, dateType === DateTag.WEEK ? Styles.active : '')}
                      data-type={DateTag.WEEK}
                      onClick={changeDateType}
                    >
                      {Strings.getLang('week')}
                    </View>
                    <View
                      className={clsx(Styles.unit, dateType === DateTag.MONTH ? Styles.active : '')}
                      data-type={DateTag.MONTH}
                      onClick={changeDateType}
                    >
                      {Strings.getLang('month')}
                    </View>
                    <View
                      className={clsx(Styles.unit, dateType === DateTag.YEAR ? Styles.active : '')}
                      data-type={DateTag.YEAR}
                      onClick={changeDateType}
                    >
                      {Strings.getLang('year')}
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <View className={Styles.noWrap}>
                <Text>TODOs...</Text>
              </View>
            )}
          </View>
        </Card>

        {/* 四图片展示 */}
        <View className={Styles.picsWrap}>
          <View className={clsx(Styles.unit, Styles.co2)}>
            <View className={Styles.font1}>{Strings.getLang('co2Title')}</View>
            <View className={clsx(Styles.font2, Styles.mt6)}>
              {lcDataList[0] && lcDataList[0].value}
              <Text className={clsx(Styles.font3, Styles.ml3)}>{Strings.getLang('co2Unit')}</Text>
            </View>
          </View>
          <View className={clsx(Styles.unit, Styles.tree)}>
            <View className={Styles.font1}>{Strings.getLang('treeTitle')}</View>
            <View className={clsx(Styles.font2, Styles.mt6)}>
              {lcDataList[1] && lcDataList[1].value}
              <Text className={clsx(Styles.font3, Styles.ml3)}>{Strings.getLang('treeUnit')}</Text>
            </View>
          </View>
          <View className={clsx(Styles.unit, Styles.coal)}>
            <View className={Styles.font1}>{Strings.getLang('coalTitle')}</View>
            <View className={clsx(Styles.font2, Styles.mt6)}>
              {lcDataList[2] && lcDataList[2].value}
              <Text className={clsx(Styles.font3, Styles.ml3)}>{Strings.getLang('coalUnit')}</Text>
            </View>
          </View>
          <View className={clsx(Styles.unit, Styles.electricity)}>
            <View className={Styles.font1}>{Strings.getLang('electricityTitle')}</View>
            <View className={clsx(Styles.font2, Styles.mt6)}>
              {lcDataList[3] && lcDataList[3].value}
              <Text className={clsx(Styles.font3, Styles.ml3)}>
                {Strings.getLang('electricityUnit')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
}
