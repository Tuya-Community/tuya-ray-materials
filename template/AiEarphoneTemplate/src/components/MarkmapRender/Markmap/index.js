import Render from './index.rjs';

// eslint-disable-next-line no-undef
Component({
  render: null,
  properties: {
    markdown: {
      type: String,
      value: '',
      observer(newVal) {
        if (this.render && newVal) {
          this._doRender();
        }
      },
    },
    theme: {
      type: String,
      value: 'light',
    },
  },
  lifetimes: {
    ready() {
      this.render = new Render(this);
      if (this.properties.markdown) {
        this._doRender();
      }
    },
  },
  methods: {
    _doRender() {
      const { markdown, theme } = this.properties;
      this.render.render({
        mount: '#markmap-container',
        markdown,
        theme,
        waitStable: true,
      });
    },
  },
});
