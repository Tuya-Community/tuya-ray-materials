/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Text } from '@ray-js/components';
// @ts-ignore
import styles from './index.module.less';

const parseMarkdown = (text: string) => {
  const lines = text?.split('\n');
  const elements = lines.map((line, index) => {
    if (line.startsWith('# ')) {
      return (
        <Text key={index} className={styles.h1}>
          {line.replace('# ', '')}
        </Text>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <Text key={index} className={styles.h2}>
          {line.replace('## ', '')}
        </Text>
      );
    }
    if (line.startsWith('- ')) {
      return (
        <Text key={index} className={styles.li}>
          {`• ${line.replace('- ', '')}`}
        </Text>
      );
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <Text key={index} className={styles.bold}>
          {line.replace(/\*\*/g, '')}
        </Text>
      );
    }
    if (line.startsWith('*') && line.endsWith('*')) {
      return (
        <Text key={index} className={styles.italic}>
          {line.replace(/\*/g, '')}
        </Text>
      );
    }
    return (
      <Text key={index} className={styles.text}>
        {line}
      </Text>
    );
  });
  return elements;
};

export default parseMarkdown;
