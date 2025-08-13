/* eslint-disable prettier/prettier */
import Render from './index.rjs';
// eslint-disable-next-line no-undef
Component({
  properties: {
    containerStyle: String,
    ringStyle: String,
    thumbBorderColor: String,
    hollowRadius: {
      type: Number,
      value: 21,
    },
    centerRingRadius: {
      type: Number,
      value: 17,
    },
    ringRadius: {
      type: Number,
      value: 300,
    },
    paddingWidth: {
      type: Number,
      value: 5,
    },
    hsColor: {
      type: Object,
      value: {
        h: 0,
        s: 100,
      },
    },
    thumbBorderWidth: {
      type: Number,
      value: 5,
    },
  },
  data: {
    canvasId: `lampColorCard_${String(+new Date()).slice(-3)}_${String(Math.random()).slice(-3)}`,
  },
  observers: {
    'hsColor.**'(value) {
      this.data.canvasId && this.render.updateThumbPosition(value);
    },
  },

  lifetimes: {
    created() {
      this.render = new Render(this);
    },
    ready() {
      const {
        canvasId,
        hollowRadius,
        centerRingRadius,
        ringRadius,
        paddingWidth,
        thumbBorderColor,
        thumbBorderWidth,
        hsColor,
      } = this.data;

      canvasId &&
        this.render.renderColorWheel(
          canvasId,
          hollowRadius,
          ringRadius,
          paddingWidth,
          centerRingRadius,
          thumbBorderColor,
          thumbBorderWidth
        );
      
      this.data.canvasId && this.render.updateThumbPosition(hsColor);
    },
    detached() {
      this.render?.removeEventListeners();
    },
  },
  methods: {
    _getColor(dataRes) {
      this.triggerEvent('onTouchEnd', dataRes);
    },
  },
});
