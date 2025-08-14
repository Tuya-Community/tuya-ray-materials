[English](./README.md) | 简体中文

# @ray-js/mini-app-mark-down

[![latest](https://img.shields.io/npm/v/@ray-js/mini-app-mark-down/latest.svg)](https://www.npmjs.com/package/@ray-js/mini-app-mark-down) [![download](https://img.shields.io/npm/dt/@ray-js/mini-app-mark-down.svg)](https://www.npmjs.com/package/@ray-js/mini-app-mark-down)

> 小程序 markdown 组件

根据传入的`markdown`字符串，展示对应的内容，支持自定义组件渲染，支持原生小程序和 Ray 小程序引入

## 安装

```sh
$ npm install @ray-js/mini-app-mark-down
// 或者
$ yarn add @ray-js/mini-app-mark-down
```

## 开发

```sh
# 实时编译组件代码
yarn watch
# 实时编译Demo代码
yarn start:tuya
```

## 使用

### 基础使用

`input`是必传项，`types`是自定义组件类型列表，`theme`是主题样式，`onUpdateBlocks`是更新`blocks`的回调函数

`types` 属性接收一个自定义组件名称的列表。在 Markdown 语法中，你可以通过编写以自定义组件名称为标题的代码块，并在代码块内容中指定要传递给自定义渲染组件的属性参数。然后通过 `onUpdateBlocks` 回调函数来自定义渲染这些 Markdown 中的组件。

```tsx
import Markdown from '@ray-js/mini-app-mark-down';

function CustomCard(props) {
  const { title, content } = props;
  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 12 }}>
      <View style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{title}</View>
      <View style={{ fontSize: 14, color: '#666' }}>{content}</View>
    </View>
  );
}

export default () => {
  const [blocks, setBlocks] = useState([]);
  const mockInput = `
  # 标题1 8-)

\`\`\`custom-card
{
  "title": "自定义卡片标题",
  "content": "自定义卡片内容"
}
\`\`\`
`;

  const slot = blocks.reduce((pre, cur) => {
    if (cur.type === 'custom-card') {
      try {
        const { title, content } = JSON.parse(cur.children);
        pre[cur.id] = (
          <View key={cur.id}>
            <CustomCard title={title} content={content} />
          </View>
        );
        return pre;
      } catch (e) {
        return pre;
      }
    }
    return null;
  }, {});

  return (
    <Markdown
      input={mockInput}
      types={['custom-card']}
      theme="light"
      containerStyle={{ color: 'orange' }}
      slot={slot}
      onUpdateBlocks={e => {
        const { blocks } = e.detail;
        setBlocks(blocks);
      }}
    />
  );
};
```

### 传递 Children 用法

```tsx
import Markdown from '@ray-js/mini-app-mark-down';

function CustomCard(props) {
  const { title, content } = props;
  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 12 }}>
      <View style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{title}</View>
      <View style={{ fontSize: 14, color: '#666' }}>{content}</View>
    </View>
  );
}

export default () => {
  const [blocks, setBlocks] = useState([]);
  const mockInput = `
  # 标题1 8-)

\`\`\`custom-card
{
  "title": "自定义卡片标题",
  "content": "自定义卡片内容"
}
\`\`\`
`;

  return (
    <Markdown
      input={mockInput}
      types={['custom-card']}
      theme="light"
      onUpdateBlocks={e => {
        const { blocks } = e.detail;
        setBlocks(blocks);
      }}
    >
      {blocks.map(block => {
        if (block.type === 'custom-card') {
          try {
            const { title, content } = JSON.parse(block.children);
            return (
              <View key={block.id} slot={block.id}>
                {block.type === 'custom-card' && <CustomCard title={title} content={content} />}
              </View>
            );
          } catch (e) {
            return null;
          }
        }
        return null;
      })}
    </Markdown>
  );
};
```
