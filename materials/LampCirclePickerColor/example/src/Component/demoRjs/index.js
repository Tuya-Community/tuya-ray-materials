/* eslint-disable no-undef */
import Render from './index.rjs';

Component({
  lifetimes: {
    created() {
      this.render = new Render(this);
    },
    ready() {
      this.render.renderChannel();
    },
  },
});
