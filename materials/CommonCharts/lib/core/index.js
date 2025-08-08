import Render from './index.rjs';
import { isEqual } from 'lodash-es';
import { validateOption, uuid } from '../shared/utils';
import * as icons from '../shared/icons';

Component({
  properties: {
    unit: { type: null, value: '' },
    theme: { type: String, value: 'light' },
    option: { type: Object, value: null },
    notMerge: { type: Boolean, value: false },
    loadingText: { type: String, value: 'Loading...' },
    on: { type: Object, value: {} },
    blurAutoHideTooltip: { type: Boolean, value: true },
    onLoad: { type: String, value: '' },
    onRender: { type: String, value: '' },
    supportFullScreen: { type: Boolean, value: false },
    customStyle: { type: String, value: "" },
    customClass: { type: String, value: "" },
    getEchartsProxy: { type: Function, value: null },
    usingPlugin: { type: Boolean, value: false },
    injectVars: { type: Object, value: {} },
    opts: {
      type: Object,
      value: {
        notMerge: true,
        replaceMerge: [],
        lazyUpdate: false,
      }
    },
    errMsg: {
      type: String,
      value: ''
    },
    iconError: {
      type: String,
      value: icons['error']
    },
    iconFullScreen: {
      type: String,
      value: icons['fullscreen']
    },
    iconExitFullScreen: {
      type: String,
      value: icons['exitFullscreen']
    },
    iconLoading: {
      type: String,
      value: icons['loading']
    },
    loading: {
      type: Boolean,
      value: false
    }
  },
  options: {
    styleIsolation: 'apply-shared',
    pureDataPattern: /(opts)|(getEchartsProxy)|(on)/
  },
  data: {
    canvasId: "",
    isLoading: true,
    isFullScreen: false,
    defaultIcons: icons,
  },
  observers: {
    'option, unit, theme, injectVars'() {
      this.doRender();
    },
    'on': function () {
      this.bindEvent();
    },
    'getEchartsProxy': function () {
      if (this.isReady) {
        if (typeof this.data.getEchartsProxy === 'function') {
          this.data.getEchartsProxy(this.createEchartsProxy());
        } else {
          this.triggerEvent('Init', this.createEchartsProxy());
        }
      }
    }
  },
  methods: {
    doRender() {
      try {
        // 校验传入的参数
        if (!validateOption(this.data.option)) {
          this.setData({
            isLoading: true
          });
          return;
        }
        if (this.data.option.series.length > 0 || typeof this.data.option.series === 'object') {
          this.setData({
            isLoading: false
          })
        }
        const { option, unit, theme } = this.data;
        const renderData = { option, unit, theme, injectVars: this.properties.injectVars };
        if (!this.isReady) return;
        if (this.renderData && isEqual(renderData, this.renderData)) return;
        this.renderData = renderData;
        this.render.render(renderData, this.properties.opts, this.properties.injectVars, this.properties.onLoad, this.properties.onRender, this.properties.blurAutoHideTooltip);
      } catch (error) {
        // 渲染异常文案
        this.setData({
          isLoading: false
        })
        console.log(error);
      }

    },
    bindEvent() {
      if (!this.isReady) return;
      const { on } = this.data;
      // on 类型校验
      if (!on || typeof on !== 'object') return;
      this.render.bindEvent(Object.entries(on).map(([key, value]) => {
        let result = {
          eventName: key,
        };
        if (typeof value !== 'function' && value.query) {
          result.query = value.query;
        }
        return result;
      }));
    },
    onEvent(eventName, params) {
      if (this.data.on?.[eventName]) {
        const func = this.data.on[eventName]?.callback || this.data.on[eventName];
        if (typeof func === 'function') {
          func(params);
        } else {
          this.triggerEvent('event', { eventName, params });
        }
      }
    },
    onBlur() {
      this.triggerEvent("blur");
    },
    onFocus() {
      this.triggerEvent("focus");
    },
    exitFullScreen() {
      const that = this;
      ty.showStatusBar();
      ty.showMenuButton();
      ty.setPageOrientation({
        pageOrientation: 'portrait',
        success() {
          that.setData({
            isFullScreen: false
          })
        }
      })
    },
    requestFullScreen() {
      const that = this;
      ty.hideStatusBar();
      ty.hideMenuButton();
      ty.setPageOrientation({
        pageOrientation: 'landscape',
        success() {
          that.setData({
            isFullScreen: true
          })
          console.log('横屏成功');
        }
      })
    },
    createEchartsProxy() {
      if (this.echartsProxy) return this.echartsProxy;
      const cacheMap = new Map();
      this.echartsProxy = new Proxy({}, {
        get: (target, key, receiver) => {
          if (cacheMap.has(key)) return cacheMap.get(key);
          const functionProxy = new Proxy(function () { }, {
            apply: async (target, thisArg, argumentsList) => {
              return this.render.handleEchartsMethod(key, ...argumentsList);
            }
          });
          cacheMap.set(key, functionProxy);
          return functionProxy;
        }
      });
      return this.echartsProxy;
    }

  },
  lifetimes: {
    created() {
      this.render = new Render(this);
    },
    ready() {
      this.setData({
        canvasId: uuid()
      })
      this.render.init(this.data.canvasId, this.properties.notMerge, this.properties.usingPlugin);
      this.isReady = true;
      this.doRender();
      this.bindEvent();
      if (typeof this.data.getEchartsProxy === 'function') {
        this.data.getEchartsProxy(this.createEchartsProxy());
      } else {
        this.triggerEvent('Init', this.createEchartsProxy());
      }
    },
    detached() {
      this.render.destroy();
    },
  },
  pageLifetimes: {
    resize() {
      this.render.resize();
    }
  }
});
