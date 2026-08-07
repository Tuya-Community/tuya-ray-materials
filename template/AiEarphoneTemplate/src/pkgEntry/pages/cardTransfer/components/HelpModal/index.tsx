/*
 * @Author: hkc
 * @Date: 2026-01-28 10:22:59
 * @Description: 帮助弹窗
 * @LastEditTime: 2026-01-28 17:07:04
 * @LastEditors: hkc
 */
import React from 'react'
import { View } from '@ray-js/ray'
import { Button, Dialog } from '@ray-js/smart-ui'
import Strings from '@/i18n'

import styles from './index.module.less'

interface IProps {
  show: boolean
  onClose: () => void
}

const Index: React.FC<IProps> = ({ show, onClose }) => {
  const helpList = [
    {
      title: Strings.getLang('cardTransfer.help_modal_title1'),
      tip: Strings.getLang('cardTransfer.help_modal_tip1'),
    },
    {
      title: Strings.getLang('cardTransfer.help_modal_title2'),
      tip: Strings.getLang('cardTransfer.help_modal_tip2'),
    },
  ]

  return (
    <Dialog useSlot show={show} onClose={onClose} customClass={styles.container} showConfirmButton={false}>
      {
        helpList.map(item => (
          <View key={item.title} className={styles.item}>
            <View className={styles.title}>{item.title}</View>
            <View className={styles.tip}>{item.tip}</View>
          </View>
        ))
      }
      <Button customClass={styles.close} onClick={onClose}>{Strings.getLang('close')}</Button>
    </Dialog>
  )
}

export default Index
