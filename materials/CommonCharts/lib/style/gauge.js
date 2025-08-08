import { getColors } from '../shared/getColors';
import { merge } from '../shared/utils';
export function getOptions(options) {
    const option = options.option;
    const isDark = 'dark' === options.theme;
    option.color = getColors(option.color);
    option.darkMode = isDark || 'auto';
    option.backgroundColor = option.backgroundColor || "transparent";

    option.series = option.series.map((series, index)=> {
        return merge({
            type: 'gauge',
            startAngle: 180,
            center: [
                '50%',
                '90%'
            ],
            endAngle: 0,
            splitNumber: 6,
            radius: '130%',
            progress: {
                show: !0,
                width: 40,
                itemStyle: {
                    opacity: 0.8
                }
            },
            pointer: {
                show: !1
            },
            axisLine: {
                lineStyle: {
                    width: 40
                }
            },
            axisTick: {
                show: !1
            },
            splitLine: {
                distance: -30,
                length: 20,
                lineStyle: {
                    width: 2,
                    color: '#fff'
                }
            },
            axisLabel: {
                show: !1
            },
            anchor: {
                show: !1
            },
            title: {
                offsetCenter: [
                    0,
                    '-5%'
                ],
                fontSize: 12
            },
            detail: {
                valueAnimation: !0,
                width: '60%',
                borderRadius: 8,
                offsetCenter: [
                    0,
                    '-25%'
                ],
                formatter: (value)=>`{a|${value}}{b|${options.unit}}`,
                // color: 'inherit',
                rich: {
                    a: {
                        fontSize: 36,
                        fontWeight: 'bolder',
                        // verticalAlign: 'bottom',
                        color: isDark ? '#fff' : '#000'
                    },
                    b: {
                        fontSize: 14,
                        fontWeight: 'bolder',
                        // verticalAlign: 'bottom',
                        color: isDark ? '#fff' : '#000',
                        padding: [
                            15,
                            0,
                            0,
                            6
                        ]
                    }
                }
            }
        }, series)
    });

    return option;
}
