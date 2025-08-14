/* eslint-disable no-undef */
import Render from './index.rjs';

Component({
  data: {
    eventChannelName: '',
  },
  lifetimes: {
    created() {
      this.render = new Render(this);
    },
    ready() {
      this.render.renderChannel({ eventChannelName: this.data.eventChannelName });
    },
  },
});
