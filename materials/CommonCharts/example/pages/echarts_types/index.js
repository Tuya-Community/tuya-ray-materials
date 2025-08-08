import { barOption, gaugeOption, lineAreaOption, lineOption, pieOption, functionalOption } from "../../shared/demoOptions"

Page({
    echarts: null,
    data: {
        lineOption,
        line2Option: lineOption,
        lineAreaOption,
        pieOption,
        barOption,
        gaugeOption,
        functionalOption,
        chartOption: {},
        errorMsg: '',
    },
    onLoad() {
        console.log("onload");
    },
    onInit(e) {
        // console.log("echartsProxy", e);
    }
})