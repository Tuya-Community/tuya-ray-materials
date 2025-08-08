import { darkTheme, lightTheme } from '../shared/themeColor';
import { getColors } from '../shared/getColors';
import { merge } from '../shared/utils';
export function getOptions(options) {
    const option = options.option;
    const isDark = 'dark' === options.theme;
    option.color = getColors(option.color);
    option.darkMode = isDark || 'auto';
    option.backgroundColor = option.backgroundColor || "transparent";

    option.tooltip = merge({
        borderColor: "transparent",
        trigger: 'item',
        renderMode: 'richText',
        backgroundColor: (isDark ? darkTheme : lightTheme).tooltipBackgroundColor,
        valueFormatter: (value)=>`${value} ${options.unit}`,
        padding: 5,
        textStyle: {
            fontSize: 12,
            lineHeight: 20,
            fontWeight: 'bolder'
        },
        hideDelay: 100
    }, option.tooltip);

    option.legend = merge({
        top: 'center',
        left: '70%',
        orient: 'vertical',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10
    }, option.legend);

    option.grid = merge({
        top: 20,
        bottom: 10,
        right: 20,
        left: 10,
        containLabel: !0
    }, option.grid);

    option.series = option.series.map((serie, idx) => {
        return merge({
            right: option.legend.show ? '25%' : void 0,
            label: {
                show: false,
                fontSize: 10,
                formatter: (params)=>`${params.percent}%`
            },
            labelLine: {
                show: false
            }
        }, serie);
    })

    return option;
}
