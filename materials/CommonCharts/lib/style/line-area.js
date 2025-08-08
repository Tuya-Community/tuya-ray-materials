import { darkTheme, lightTheme } from '../shared/themeColor';
import { getColors } from '../shared/getColors';
import { getInterval } from '../shared/getInterval';
import { getLegend } from '../shared/getLegend';
import { merge } from '../shared/utils';

export function getOptions(options) {
    const option = options.option;
    const xAxisData = option.xAxis?.data || option.xAxis?.[0]?.data || [];
    const isDark = 'dark' === options.theme;
    const colors = isDark ? darkTheme : lightTheme;
    const { interval, showMaxLabel, showMinLabel } = getInterval(option, xAxisData);
    const { legend, grid } = getLegend(option, colors);
    option.color = getColors(option.color);
    option.darkMode = isDark || 'auto';
    option.backgroundColor = option.backgroundColor || "transparent";


    option.tooltip = merge({
        position: "top",
        textStyle: {
            color: colors.tooltipTextColor
        },
        renderMode: 'richText',
        trigger: 'axis',
        backgroundColor: colors.tooltipBackgroundColor,
        formatter: (params) => {
            // 如果 unit 是个数组，那么根据索引从数组中取，否则直接取 unit
            let getUnit = (idx) => {
                var _options_unit, _options_unit_idx;
                return Array.isArray(options.unit) ? null !== (_options_unit_idx = null === (_options_unit = options.unit) || void 0 === _options_unit ? void 0 : _options_unit[idx]) && void 0 !== _options_unit_idx ? _options_unit_idx : '' : options.unit;
            }, allText = params.reduce((acc, cur, idx) => {
                let lineText = `${cur.marker}${cur.seriesName}: ${cur.value} ${getUnit(idx)}`;
                return 0 === idx ? `${acc}${lineText}` : `${acc}\n${lineText}`;
            }, '');
            return `${params[0].name}\n${allText}`;
        }
    }, option.tooltip);

    option.legend = merge(legend, option.legend);
    option.grid = merge(grid, option.grid);

    option.xAxis = merge({
        type: 'category',
        boundaryGap: false,
        axisTick: {
            show: false
        },
        axisLabel: {
            show: true,
            interval: interval,
            showMinLabel,
            showMaxLabel,
            fontSize: 10,
            margin: 10,
            color: colors.axisTextColor,
            formatter: (value, index) => value.length < 4 ? value : 0 === index ? `{left|${value}}` : index === xAxisData.length - 1 ? `{right|${value}}` : value,
            rich: {
                left: {
                    align: 'left',
                    padding: [
                        0,
                        0,
                        0,
                        20
                    ],
                    color: colors.axisTextColor,
                    fontSize: 10
                },
                right: {
                    align: 'right',
                    padding: [
                        0,
                        20,
                        0,
                        0
                    ],
                    color: colors.axisTextColor,
                    fontSize: 10
                }
            }
        },
        axisLine: {
            lineStyle: {
                color: colors.axisLineColor
            }
        }
    }, option.xAxis)

    option.yAxis = merge({
        type: 'value',
        nameLocation: 'start',
        position: 'left',
        axisLabel: {
            fontSize: 10,
            color: colors.axisTextColor,
            formatter: (value) =>// 存在多个单位则不在左下角显示单位了，因为会很长
                Array.isArray(options.unit) ? '' : 0 === value ? options.unit || '0' : String(value)
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                color: colors.splitLineColor
            }
        }
    }, option.yAxis);

    option.series = option.series.map((series, index) => {
        return merge({
            showSymbol: false,
            markLine: 0 === index && series.markLine ? {
                silent: true,
                symbol: 'none',
                label: {
                    position: 'insideEnd',
                    formatter: (params) => series.markLine.name
                },
                lineStyle: {
                    color: series.markLine.color || (isDark ? '#808080' : '#8C8C8C'),
                    type: 'dashed'
                },
                data: [
                    {
                        yAxis: series.markLine.value
                    }
                ]
            } : null
        }, series)
    });

    return option;
}
