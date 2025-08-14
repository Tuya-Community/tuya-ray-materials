import md, { generateId } from './md';

export interface RenderBlock {
  id: string;
  type: string;
  children: string;
}

function splitHtmlBySelfClosingTags(html: string, tags: string[]) {
  const tagPattern = new RegExp(`<(${tags.join('|')})\\s*/?>`, 'gi');
  const result: string[] = [];
  let lastIndex = 0;

  let match;
  while ((match = tagPattern.exec(html)) !== null) {
    if (match.index > lastIndex) {
      result.push(html.slice(lastIndex, match.index));
    }

    result.push(match[0]);
    lastIndex = tagPattern.lastIndex;
  }

  if (lastIndex < html.length) {
    result.push(html.slice(lastIndex));
  }

  return result;
}

export function parse(input: string, types: string[] = [], prefix: string): RenderBlock[] {
  const _input = input
    .replace(/\\n/g, '<br>')
    .replace(/\\<br>/g, '<br>')
    .replace(/\\"/g, '"');

  const customBlock = {
    prefix,
    list: [] as RenderBlock[],
    types,
  };

  const html = md.render(_input, {
    customBlock,
  });

  const map = new Map<string, RenderBlock>();
  const ids: string[] = [];
  customBlock.list.forEach(item => {
    map.set(`<${item.id} />`, item);
    ids.push(item.id);
  });

  const parts = splitHtmlBySelfClosingTags(html, ids);

  const blocks: RenderBlock[] = [];
  parts.forEach(part => {
    if (map.has(part)) {
      const block = map.get(part);
      if (block) {
        blocks.push(block);
      }
    } else {
      blocks.push({
        id: generateId(8),
        type: 'rich-text',
        children: `<div class="ray_miniapp_markdown__main">${part}</div>`,
      });
    }
  });

  return blocks;
}
