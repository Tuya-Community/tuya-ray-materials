import Render from './index.rjs';
import { getSystemInfoSync } from '@ray-js/ray';

const CANVAS_ID_PREFIX = 'canvasImagePreview';
const TAP_MOVE_THRESHOLD = 8;

function getTouches(event) {
  const touches = event?.touches || event?.changedTouches || [];
  return Array.prototype.slice.call(touches).map(touch => ({
    pageX: touch.pageX,
    pageY: touch.pageY,
  }));
}

const REDRAW_DELAY = 350;

function schedule(callback) {
  // eslint-disable-next-line no-undef
  if (typeof ty !== 'undefined' && ty.nextTick) {
    // eslint-disable-next-line no-undef
    ty.nextTick(callback);
    return;
  }
  setTimeout(callback, 0);
}

// eslint-disable-next-line no-undef
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer() {
        this.syncRender();
      },
    },
    src: {
      type: String,
      value: '',
      observer() {
        this.syncRender();
      },
    },
    canvasEnabled: {
      type: Boolean,
      value: true,
      observer() {
        this.syncRender();
      },
    },
  },

  data: {
    canvasId: CANVAS_ID_PREFIX,
    canvasWidth: 375,
    canvasHeight: 667,
    canvasReady: false,
  },

  lifetimes: {
    attached() {
      this.rjs = new Render(this);
      this.canvasId = `${CANVAS_ID_PREFIX}_${Math.random().toString(36).slice(2, 10)}`;
      this.touchMoveLogCount = 0;
      this.tapState = null;
      this.updateCanvasSize();
    },
    ready() {
      this.syncRender();
    },
    detached() {
      this.destroyRender();
    },
  },

  methods: {
    updateCanvasSize() {
      const systemInfo = getSystemInfoSync();
      const canvasWidth = systemInfo?.windowWidth || systemInfo?.screenWidth || 375;
      const canvasHeight =
        systemInfo?.useableWindowHeight ||
        systemInfo?.windowHeight ||
        systemInfo?.screenHeight ||
        667;

      this.setData({
        canvasId: this.canvasId || CANVAS_ID_PREFIX,
        canvasWidth,
        canvasHeight,
      });
    },

    syncRender() {
      if (!this.rjs) return;

      const { visible, src, canvasEnabled, canvasWidth, canvasHeight } = this.data;
      if (!visible || !src) {
        this.destroyRender();
        return;
      }

      if (!canvasEnabled) {
        return;
      }

      this._clearRedrawTimer();
      this.setData({ canvasReady: false });
      schedule(() => {
        const dpr = getSystemInfoSync().pixelRatio || 1;
        this.rjs.init(this.data.canvasId, src, canvasWidth, canvasHeight, dpr);

        this._redrawTimer = setTimeout(() => {
          this._redrawTimer = null;
          if (!this.data.canvasEnabled || !this.data.visible || !this.rjs) return;
          this.rjs.redraw(this.data.canvasId);
        }, REDRAW_DELAY);
      });
    },

    _clearRedrawTimer() {
      if (this._redrawTimer) {
        clearTimeout(this._redrawTimer);
        this._redrawTimer = null;
      }
    },

    destroyRender() {
      this._clearRedrawTimer();
      if (this.rjs) {
        this.rjs.destroy(this.data.canvasId);
      }
      this.setData({ canvasReady: false });
    },

    handleCanvasReady() {
      this.setData({ canvasReady: true });
    },

    handleCanvasFailed() {
      this.setData({ canvasReady: false });
    },

    handleTouchStart(event) {
      if (!this.rjs || !this.data.visible) return;
      const touches = getTouches(event);
      this.touchMoveLogCount = 0;
      this.tapState =
        touches.length === 1
          ? {
              startX: touches[0].pageX,
              startY: touches[0].pageY,
              moved: false,
              maxTouchCount: 1,
            }
          : {
              startX: 0,
              startY: 0,
              moved: true,
              maxTouchCount: touches.length,
            };
      this.rjs.touchStart(this.data.canvasId, touches);
    },

    handleTouchMove(event) {
      if (!this.rjs || !this.data.visible) return;
      const touches = getTouches(event);
      if (this.tapState) {
        this.tapState.maxTouchCount = Math.max(this.tapState.maxTouchCount, touches.length);
        if (touches.length !== 1) {
          this.tapState.moved = true;
        } else {
          const dx = touches[0].pageX - this.tapState.startX;
          const dy = touches[0].pageY - this.tapState.startY;
          if (Math.abs(dx) > TAP_MOVE_THRESHOLD || Math.abs(dy) > TAP_MOVE_THRESHOLD) {
            this.tapState.moved = true;
          }
        }
      }
      this.touchMoveLogCount = (this.touchMoveLogCount || 0) + 1;
      this.rjs.touchMove(this.data.canvasId, touches);
    },

    handleTouchEnd(event) {
      if (!this.rjs || !this.data.visible) return;
      const touches = getTouches(event);
      const { tapState } = this;
      this.tapState = null;
      if (
        event?.type !== 'touchcancel' &&
        tapState &&
        tapState.maxTouchCount === 1 &&
        !tapState.moved
      ) {
        this.handleClose();
        return;
      }
      this.rjs.touchEnd(this.data.canvasId, touches);
    },

    handleClose() {
      this.triggerEvent('close');
    },
  },
});
