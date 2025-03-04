import { ChatCardObject } from '@ray-js/t-agent';
import { View } from '@ray-js/components';
import React from 'react';
import {useSendAction, useTileProps} from '@ray-js/t-agent-ui-ray';
import { Button } from '@ray-js/ray';
import styles from './MyCard.module.less';

export default function MyCard(props: { card: ChatCardObject }) {
  const { tile } = useTileProps();

  const sendAction = useSendAction()

  return (
    <View className={styles.myCard}>
      <View className={styles.title}>{props.card.cardData.title}</View>
      <View className={styles.content}>{JSON.stringify(props.card)}</View>
      <Button
        type="primary"
        onClick={() => {
          sendAction({
            type: 'sendMessage',
            blocks: [{ type: 'text', text: 'Hello, world! ' + props.card.cardData.title }],
          })
        }}
      >
        Fill message input
      </Button>
    </View>
  );
}
