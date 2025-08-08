import { homeLineOption } from "../../shared/demoOptions"


Page({
    data: {
        option: homeLineOption,
        injectVars: {
            highlightIndex: -1
        },
        bindEvent: {
            showTip(params) {
                const pageInsts = getCurrentPages();
                const that = pageInsts[pageInsts.length - 1];
                that.setData({
                    injectVars: {
                        highlightIndex: params.dataIndexInside
                    }
                })
            },
            hideTip() {
                const pageInsts = getCurrentPages();
                const that = pageInsts[pageInsts.length - 1];
                that.setData({
                    highlightIndex: -1
                })
            }
        }
    },
    onLoad() {
    },
    navTo(e) {
        const path = e.currentTarget.dataset.path;
        ty.navigateTo({
            url: path
        })
    },
    methods: {
        onFocus() {
            console.log("onFocus");
        },
        onBlur() {
            console.log("onBlur");
        },
        async onInit(e) {
            const echartsProxy = e.detail;
            const width = await echartsProxy.getWidth();
            console.log("promise get width", width);
        }
    }

})