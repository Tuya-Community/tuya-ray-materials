/* eslint-disable no-undef */
import Render from './index.rjs';

Component({
  lifetimes: {
    ready() {
      this.render = new Render(this);
      this.render.renderChannel();
    },
  },
});
