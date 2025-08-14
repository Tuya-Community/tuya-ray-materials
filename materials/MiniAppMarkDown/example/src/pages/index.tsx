import React, { useState } from 'react';
import Markdown from '@ray-js/mini-app-mark-down';
import { View } from '@ray-js/ray';
import Strings from '../i18n';
import { DemoBlock } from '../components';
import styles from './index.module.less';

function CustomCard(props) {
  const { title, content } = props;
  return (
    <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 12 }}>
      <View style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>{title}</View>
      <View style={{ fontSize: 14, color: '#666' }}>{content}</View>
    </View>
  );
}

export default function Home() {
  const [blocks, setBlocks] = useState([]);
  const [blocks2, setBlocks2] = useState([]);
  const mockInput = Strings.getLang('mockInput');

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
    <View>
      <DemoBlock title={Strings.getLang('basicUsage')}>
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
      </DemoBlock>

      <DemoBlock title={Strings.getLang('childrenUsage')}>
        <Markdown
          input={mockInput}
          types={['custom-card']}
          theme="light"
          onUpdateBlocks={e => {
            const { blocks } = e.detail;
            setBlocks2(blocks);
          }}
        >
          {blocks2.map(block => {
            if (block.type === 'custom-card') {
              try {
                const { title, content } = JSON.parse(block.children);
                return (
                  // @ts-ignore
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
      </DemoBlock>
    </View>
  );
}
