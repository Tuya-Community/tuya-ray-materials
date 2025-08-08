export const getInterval = (options, xAxisData)=>{
    let interval = -1 !== options.interval ? options.interval : 'auto', showMinLabel = 'auto' === interval || void 0, showMaxLabel = 'auto' === interval || void 0;
    return 'auto' === interval && (interval = Math.floor((xAxisData.length - 2) / 2)), interval > xAxisData.length - 2 && (interval = 'auto'), {
        interval,
        showMaxLabel,
        showMinLabel
    };
};
