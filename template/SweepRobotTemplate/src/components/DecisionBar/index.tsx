import Strings from '@/i18n';
import { View } from '@ray-js/ray';
import { Button, Col, Row } from '@ray-js/smart-ui';
import React from 'react';
import styles from './index.module.less';

type Props = {
  activeConfirm: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const DecisionBar: React.FC<Props> = ({ onConfirm, onCancel, activeConfirm = false }) => {
  return (
    <View className={styles.controlBar}>
      <Row gutter={40}>
        <Col span={12}>
          <Button block round onClick={onCancel} plain type="primary">
            {Strings.getLang('dsc_cancel')}
          </Button>
        </Col>
        <Col span={12}>
          <Button block round disabled={!activeConfirm} onClick={onConfirm} type="primary">
            {Strings.getLang('dsc_confirm')}
          </Button>
        </Col>
      </Row>
    </View>
  );
};

export default DecisionBar;
