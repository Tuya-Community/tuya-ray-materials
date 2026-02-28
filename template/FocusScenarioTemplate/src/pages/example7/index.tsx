/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-28 15:50:57
 * @Description:
 */
import React, { useEffect, useState } from 'react'
import { getSystemInfoSync, navigateBack, ScrollView, View } from '@ray-js/ray'
import { NavBar, Button, Field } from '@ray-js/smart-ui'
import styles from './index.module.less'

export default function Demo() {
  const [height, setHeight] = useState('100vh')
  const onTextareaFocus = () => {
    if (height === '100vh') {
      // @ts-ignore
      const { useableWindowHeight } = getSystemInfoSync()
      if (!useableWindowHeight) return
      setHeight(`${useableWindowHeight}px`)
    }
  }
  return (
    <View className={styles.container} style={{ height }}>
      <NavBar
        background="transparent"
        title={I18n.t('nav_add_message')}
        leftArrow
        onClickLeft={() => navigateBack()}
      />
      <ScrollView scrollY className={styles.content}>
        <View className={styles.split} />
        <View
          className={styles.card}
          style={{
            height: 360,
          }}
        />
        <View className={styles.card}>
          <View className={styles.title}>{I18n.t('label_opening')}</View>
          <Field
            inputClass={styles.textarea}
            type="textarea"
            hiddenLabel
            value={new Array(20).fill(I18n.t('test')).join(' ')}
            autosize={{
              maxHeight: '436rpx',
              minHeight: '80rpx',
            }}
            onFocus={onTextareaFocus}
            placeholder={I18n.t('placeholder_message')}
          />
        </View>
        <View className={styles.card}>
          <View className={styles.title}>{I18n.t('label_opening')}</View>
          <Field
            inputClass={styles.textarea}
            type="textarea"
            hiddenLabel
            value={new Array(200).fill(I18n.t('test')).join(' ')}
            autosize={{
              maxHeight: '436rpx',
              minHeight: '80rpx',
            }}
            placeholder={I18n.t('placeholder_message')}
          />
        </View>
        <View
          className={styles.card}
          style={{
            height: 360,
          }}
        />
      </ScrollView>
      <View className={styles.buttonContainer}>
        <Button type="primary" customClass={styles.button}>
          {I18n.t('btn_save')}
        </Button>
      </View>
    </View>
  )
}
