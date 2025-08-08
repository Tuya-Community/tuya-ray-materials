import { barOption, gaugeOption, lineAreaOption, lineOption, pieOption } from "../../shared/demoOptions"

Page({
    echarts: null,
    timer: null,
    data: {
        chartOption: {},
        errorMsg: '',
        loading: false,
        onLoad: `
            function() {
                console.log("onLoad");
                console.log(Echarts, myChart, option)
            }
        `,
        onRender: `
            function() {
                console.log("onRender");
                console.log(Echarts, myChart, option)
            }
        `,
        on: {
            showTip: {
                callback(e) {
                    console.log(e);
                }
            },
            click: {
                callback(e) {
                    console.log(e);

                }
            },
            dataZoom(params) {
                console.log("dataZoom", params);
            }

        },
        getEchartsProxy(echarts) {
            const pageInsts = getCurrentPages();
            const currentPage = pageInsts[pageInsts.length - 1];
            currentPage.echarts = echarts;
        }
    },
    onLoad() {
        console.log("onload");
    },
    loadError() {
        this.setData({
            errorMsg: "加载失败"
        })
        console.log("loadError", this);
    },
    loadLine() {
        console.log("loadLine");
        this.setData({
            errorMsg: '',
            chartOption: { ...lineOption }
        })
    },
    changeBar() {
        this.setData({
            chartOption: {
                ...barOption,
                series: [{
                    type: 'bar',
                    data: barOption.series[0].data.map(() => Math.random() * 100)
                }]
            }
        })
    },
    changeBarBySetOption() {
        console.log("this.echarts", this.echarts);
        this.echarts?.setOption({
            ...barOption,
            series: [{
                type: 'bar',
                data: barOption.series[0].data.map(() => Math.random() * 100)
            }]
        })
    },
    autoChangeBar(e) {
        console.log("autoChangeBar", this.timer, e);
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.changeBar();
        }, (e?.detail?.value || 10) * 100);
    },
    autoChangeBarBySetOption(e) {
        console.log("autoChangeBarBySetOption", this.option_timer, e);
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.changeBarBySetOption();
        }, (e?.detail?.value || 10) * 100);
    },
    loadPie() {
        console.log("loadPie");
        this.setData({
            errorMsg: '',
            chartOption: { ...pieOption }
        })
    },
    toggleLoading() {
        this.setData({
            loading: !this.data.loading,
            errorMsg: ''
        })
    }
})