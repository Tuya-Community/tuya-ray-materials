export const getLegend = (options, colors)=>{
    let { legendPosition = 'top' } = options, legend = {
        show: options?.legend?.show && 'none' !== legendPosition,
        // 默认可滚动, 多语言图例可能很长
        type: 'scroll',
        left: 10,
        itemStyle: {
            borderType: 'solid',
            borderWidth: 0
        },
        textStyle: {
            color: colors.legendTextColor,
            fontSize: 12,
            lineHeight: 16
        },
        icon: 'circle',
        lineStyle: {
            color: 'transparent',
            inactiveColor: 'transparent'
        },
        itemGap: 5,
        itemWidth: 8,
        itemHeight: 8,
        pageIconSize: 11,
        pageButtonItemGap: 5,
        pageButtonGap: 10
    };

    // 图例属性中包含bottom信息时，图例位置为底部
    if ('bottom' in legend) {
        legendPosition = 'bottom';
    }

    'bottom' === legendPosition ? legend.bottom = 0 : legend.top = 0;
    let gridTop = legend.show ? 32 : 20, gridBottom = 10;
    'bottom' === legendPosition && (gridTop = 10, gridBottom = 30);
    let grid = {
        top: gridTop,
        bottom: gridBottom,
        right: 10,
        left: 10,
        containLabel: !0
    };
    return {
        legend,
        grid
    };
};
