English | [简体中文](./README-zh_CN.md)

# @ray-js/mini-app-mark-down

[![latest](https://img.shields.io/npm/v/@ray-js/mini-app-mark-down/latest.svg)](https://www.npmjs.com/package/@ray-js/mini-app-mark-down) [![download](https://img.shields.io/npm/dt/@ray-js/mini-app-mark-down.svg)](https://www.npmjs.com/package/@ray-js/mini-app-mark-down)

> Mini Program Markdown Component

Display content based on the input `markdown` string, supports custom component rendering, compatible with both native Mini Programs and Ray Mini Programs

## install

```sh
$ npm install @ray-js/mini-app-mark-down
// or
$ yarn add @ray-js/mini-app-mark-down
```

## develop

```sh
# watch the file change
yarn watch
# watch compile demo
yarn start:tuya
```

## usage

### basic usage

`input` is required, `types` is the list of custom component types, `theme` is the theme style, and `onUpdateBlocks` is the callback function to update the `blocks`

The `types` property accepts a list of custom component names. In Markdown syntax, you can write code blocks with custom component names as headers and specify the property parameters to be passed to the custom rendering components in the code block content. Then use the `onUpdateBlocks` callback function to customize the rendering of these components in Markdown.

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
  # h1 8-)

\`\`\`custom-card
{
  "title": "custom-card-title",
  "content": "custom-card-content"
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

### passing children usage

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
  # h1 8-)

\`\`\`custom-card
{
  "title": "custom-card-title",
  "content": "custom-card-content"
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
