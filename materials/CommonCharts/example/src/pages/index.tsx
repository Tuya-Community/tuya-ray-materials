import { EChartsOption } from 'echarts';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, showToast } from '@ray-js/ray';
// @ts-ignore
import Charts from '@ray-js/common-charts';
import styles from './index.module.less';
import { barOption, gaugeOption, lineAreaOption, lineOption, pieOption } from './demoOptions';
import { useSystemInfo } from '../hooks/useSystemInfo';
import Strings from '../i18n';

const DemoBlock = ({ title, children }) => (
  <View className={styles.demoBlock}>
    <View className={styles.demoBlockTitle}>
      <Text className={styles.demoBlockTitleText}>{title}</Text>
    </View>
    {children}
  </View>
);

export default function Home() {
  const systemInfo = useSystemInfo();
  const [option, setOption] = useState<any>(null);
  const echartRef = React.useRef<any>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [updatedOption, setUpdatedOption] = useState(lineOption);

  const showLoading = () => {
    echartRef.current.showLoading();
  };

  const hideLoading = () => {
    echartRef.current.hideLoading();
  };

  const clear = () => {
    echartRef.current.clear();
  };

  const setOptionToBar = () => {
    echartRef.current.setOption(barOption);
  };

  const setOptionToLine = () => {
    echartRef.current.setOption(lineOption);
  };

  const loadOption = useCallback(() => {
    setOption(gaugeOption);
  }, []);

  useEffect(() => {
    setInterval(() => {
      setUpdatedOption({
        ...lineOption,
        series: [
          {
            type: 'line',
            data: lineOption.series[0].data.map(item => Math.random() * 100),
          },
        ],
      });
    }, 3000);
  }, []);
  return (
    <View className={styles.view}>
      <DemoBlock title={Strings.getLang('basicUsage')}>
        <Charts
          option={{
            xAxis: {
              type: 'category',
              data: ['06-11', '06-12', '06-13', '06-14', '06-15'],
              axisLabel: {
                fontSize: 14,
                color: '#8e9091',
                showMinLabel: true,
                showMaxLabel: true,
                formatter: `{a|{value}}`,
                rich: {
                  a: {
                    fontSize: 14,
                    color: '#8e9091',
                  },
                },
              },
            },
            yAxis: {
              axisLabel: {
                fontSize: 14,
                color: '#8e9091',
              },
            },
            series: [
              {
                name: Strings.getLang('chart_ele'),
                data: ['3', '9', '5', '7', '8'],
                type: 'line',
                showSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 4,
                label: {
                  show: true,
                  fontSize: 14,
                  color: '#FF6B4D',
                },
                itemStyle: {
                  color: '#FF6B4D',
                  borderColor: '#FF6B4D',
                },
                lineStyle: {
                  color: '#FF6B4D',
                  fontSize: 14,
                },
                areaStyle: {
                  color: 'rgba(255, 107, 77, 0.15)',
                },
              },
            ],
          }}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('customClass')}>
        <Charts
          option={{ backgroundColor: 'transparent', ...lineOption } as EChartsOption}
          customClass={styles['my-chart']}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('notMergeTips')}>
        <Charts
          notMerge
          option={{
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true,
            },
            backgroundColor: '#212644',
            tooltip: {
              // show: false,
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
              },
            },
            toolbox: {
              show: false,
              feature: {
                saveAsImage: {},
              },
            },
            xAxis: {
              axisLine: {
                lineStyle: {
                  color: 'rgba(255,255,255,0.3)',
                  type: 'solid',
                },
              },
              type: 'category',
              boundaryGap: false,
              // prettier-ignore
              data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15',
                '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45'],
            },
            yAxis: {
              type: 'value',
              max: 100,
              axisLabel: {
                show: true,
                formatter: '{value}',
              },
              axisPointer: {
                snap: true,
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(255,255,255,0.1)',
                },
              },
            },
            series: [
              {
                name: '强度',
                type: 'line',
                smooth: true,
                areaStyle: {
                  color: '#5270EC',
                },
                lineStyle: {
                  width: 0,
                },
                symbol: 'none',
                markArea: {
                  data: [
                    [
                      {
                        //   name: 'Morning Peak',
                        xAxis: '07:30',
                        itemStyle: {
                          color: 'rgb(84,176,161)',
                        },
                      },
                      {
                        xAxis: '10:00',
                      },
                    ],
                    [
                      {
                        //   name: 'Evening Peak',
                        xAxis: '17:30',
                        itemStyle: {
                          color: 'rgb(233,110,102)',
                        },
                      },
                      {
                        xAxis: '21:15',
                      },
                    ],
                  ],
                },
                // prettier-ignore
                data: [300, 280, 250, 260, 270, 300, 280, 270, 0, 0, 380, 390, 400, 500, 600,
                  750, 700, 700, 600, 400].map(item => item / 10),
              },
            ],
          }}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('themeTips')}>
        <Charts
          theme={systemInfo.theme}
          option={lineAreaOption as EChartsOption}
          customStyle={{
            width: '100%',
            height: '300px',
          }}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('notMergeTips')}>
        <Charts
          opts={{ notMerge: true }}
          option={updatedOption as EChartsOption}
          customStyle={{
            width: '100%',
            height: '300px',
          }}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('fullScreenTips')}>
        <Charts
          supportFullScreen
          option={pieOption as EChartsOption}
          customStyle={{
            background: '#fff',
            width: '100%',
            height: '200px',
          }}
        />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('errorTips')}>
        <Charts option={{} as EChartsOption} errMsg={Strings.getLang('errorMsg')} />
      </DemoBlock>
      <DemoBlock title={Strings.getLang('customLoadingTitle')}>
        <Charts
          option={option}
          theme={systemInfo.theme}
          customStyle={{
            width: '100%',
            height: '200px',
          }}
          loadingText={Strings.getLang('customLoading')}
        />
        <Button onClick={loadOption}>{Strings.getLang('loadEcharts')}</Button>
      </DemoBlock>
      <DemoBlock title={Strings.getLang('setUnit')}>
        <Charts option={barOption as EChartsOption} unit={Strings.getLang('meter')} />
      </DemoBlock>

      <DemoBlock title={Strings.getLang('tooltipUseHtml')}>
        <Charts
          option={{
            ...lineOption,
            tooltip: {
              formatter: `function (params) {
                var text = _.reduce(params, function (acc, cur, idx) {
                  var lineText = "<div style='font-size: 10px;'>" + cur.marker + cur.seriesName + ": " + cur.value + "</div>";
                  return acc + lineText;
                }, "");

                return "<div style='color: red;text-align: center;'>" + dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss") + "</div>" + text;
              }`,
              renderMode: 'html',
              confine: true,
            },
          }}
        />
      </DemoBlock>

      <DemoBlock title={Strings.getLang('listenEvent')}>
        <Charts
          option={pieOption as EChartsOption}
          unit="米"
          on={{
            click: {
              query: { name: 'Search Engine' },
              callback(params) {
                showToast({
                  title: `click ${params.name}`,
                });
              },
            },
            legendselectchanged(params) {
              showToast({
                title: `legendselectchanged${params.name}`,
              });
            },
          }}
          customStyle={{
            width: '100%',
            height: '300px',
          }}
        />
      </DemoBlock>

      <DemoBlock title={Strings.getLang('getEchartsInstance')}>
        <Charts
          option={lineOption as EChartsOption}
          getEchartsProxy={echartsInstance => {
            echartRef.current = echartsInstance;
          }}
          customStyle={{
            width: '100%',
            height: '300px',
          }}
        />
        <Button onClick={showLoading}>{Strings.getLang('showLoading')}</Button>
        <Button onClick={hideLoading}>{Strings.getLang('hideLoading')}</Button>
        <Button onClick={clear}>{Strings.getLang('clear')}</Button>
        <Button onClick={setOptionToBar}>{Strings.getLang('setOptionToBar')}</Button>
        <Button onClick={setOptionToLine}>{Strings.getLang('setOptionToLine')}</Button>
      </DemoBlock>

      <DemoBlock title={Strings.getLang('lifecycle')}>
        <Charts
          option={lineOption as EChartsOption}
          onLoad={`
            function() {
              console.log("echarts onload");
              console.log("Echarts", Echarts);
              console.log("myChart", myChart);
              console.log("option", option);
            }
            `}
          onRender={`
              function() {
                console.log("echarts onload");
                console.log("Echarts", Echarts);
                console.log("myChart", myChart);
                console.log("option", option);
              }
              `}
          customStyle={{
            width: '100%',
            height: '300px',
          }}
        />
      </DemoBlock>

      <DemoBlock title={Strings.getLang('focusBlur')}>
        <Charts
          option={lineOption as EChartsOption}
          customStyle={{
            width: '100%',
            height: '300px',
            outline: isFocus ? '1px solid black' : 'none',
          }}
          onBlur={() => {
            console.log('onblur');
            setIsFocus(false);
          }}
          onFocus={() => {
            console.log('onfocus');
            setIsFocus(true);
          }}
        />
      </DemoBlock>
    </View>
  );
}
