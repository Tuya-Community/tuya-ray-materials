import MarkdownIt, { Token } from 'markdown-it';
import { full as emoji } from 'markdown-it-emoji';
import footnote from 'markdown-it-footnote';

export function generateId(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function addClassToTag(MD: MarkdownIt) {
  // 拦截所有的 token
  MD.core.ruler.push('_add_class_to_tags', state => {
    const addClass = (token: Token) => {
      if (token.tag === 'img') {
        token.attrPush(['class', `ray_miniapp_markdown__img`]);
        token.attrPush(['style', 'width:100%;height:auto;']);
        token.attrPush(['width', '100%']);
        token.attrPush(['height', 'auto']);
        return;
      }
      if (token.children && token.children.length) {
        token.children.forEach(addClass);
        return;
      }
      if (token.type.endsWith('_open')) {
        const classIndex = token.attrIndex('class');
        if (classIndex < 0) {
          token.attrPush(['class', `ray_miniapp_markdown__${token.tag}`]);
        }
      }
    };
    state.tokens.forEach(addClass);
  });
}

// 为 table 添加 wrapper，使其可以滚动
function tableWrapper(MD: MarkdownIt) {
  // 保存默认的 table_open 和 table_close 渲染规则
  const defaultTableOpenRender =
    MD.renderer.rules.table_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
  const defaultTableCloseRender =
    MD.renderer.rules.table_close ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  // 重写 table_open 渲染规则，添加 wrapper 的开始标签
  MD.renderer.rules.table_open = function (tokens, idx, options, env, self) {
    return (
      '<div class="ray_miniapp_markdown__tableParent">\n' +
      defaultTableOpenRender(tokens, idx, options, env, self)
    );
  };

  // 重写 table_close 渲染规则，添加 wrapper 的结束标签
  MD.renderer.rules.table_close = function (tokens, idx, options, env, self) {
    return defaultTableCloseRender(tokens, idx, options, env, self) + '</div>\n';
  };
}

function customBlockPlugin(MD: MarkdownIt) {
  MD.core.ruler.push('custom_block', function (state) {
    const { tokens } = state;
    const { env } = state;
    const { customBlock } = state.env;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // 查找代码块
      if (token.type === 'fence' && token.info) {
        const blockType = token.info.trim();
        const blockContent = token.content.trim();

        if (blockType && customBlock.types.includes(blockType)) {
          const extId = `${customBlock.prefix}-${blockType}-${i}`;
          // 将内容存入 env.customBlocks 中
          customBlock.list.push({
            id: extId,
            type: blockType,
            children: blockContent,
          });
          // 替换成 <ext-xxx /> 标签
          tokens[i].type = 'html_inline';
          tokens[i].content = `<${extId} />`;
          tokens[i].tag = '';
        }
      }
    }
  });
}

md.use(addClassToTag).use(tableWrapper).use(emoji).use(footnote).use(customBlockPlugin);

export default md;
