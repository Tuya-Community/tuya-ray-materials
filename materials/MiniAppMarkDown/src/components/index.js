// eslint-disable-next-line import/no-unresolved
import { parse } from './util';
// eslint-disable-next-line import/no-unresolved
import { generateId } from './md';

// eslint-disable-next-line no-undef
Component({
  options: {
    styleIsolation: 'shared',
    multipleSlots: true,
  },

  properties: {
    // Markdown 输入文本
    input: {
      type: String,
      value: '',
    },
    // 主题样式
    theme: {
      type: String,
      value: 'light',
    },
    // 自定义解析类型
    types: {
      type: Array,
      value: [],
    },
    containerStyle: {
      type: String,
      value: '',
    },
  },

  data: {
    blocks: [],
    _lastTypes: [],
  },

  lifetimes: {
    created() {
      this.setData({
        prefix: generateId(8),
      });
    },
  },

  observers: {
    input: function inputChanged(input) {
      this._parseAndUpdate(input);
    },

    types: function typesChanged(newTypes) {
      try {
        if (JSON.stringify(newTypes) === JSON.stringify(this.data._lastTypes)) {
          return;
        }
      } catch (err) {
        console.error('types parse error');
      }

      this.setData({ _lastTypes: newTypes });

      if (this.data.input?.trim()) {
        this._parseAndUpdate(this.data.input);
      }
    },
  },

  methods: {
    _parseAndUpdate(input) {
      try {
        if (!input?.trim()) {
          this.setData({ blocks: [] });
          return;
        }

        const { types } = this.data;
        const blocks = parse(input, types, this.data.prefix);

        this.setData({ blocks });

        // 过滤掉富文本块,只传递其他类型的块给父组件
        const nonRichTextBlocks = blocks.filter(block => block.type !== 'rich-text');
        this.triggerEventToParent(nonRichTextBlocks);
      } catch (err) {
        console.error('markdown parse error');
      }
    },

    /**
     * 触发解析完成事件
     * @param blocks 解析后的块列表
     */
    triggerEventToParent(blocks) {
      this.triggerEvent('updateBlocks', { blocks });
    },
  },
});
