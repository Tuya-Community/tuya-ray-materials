/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-25 13:54:23
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
        title="添加留言"
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
          <View className={styles.title}>开场白</View>
          <Field
            inputClass={styles.textarea}
            type="textarea"
            hiddenLabel
            value={new Array(20).fill('测试').join('')}
            autosize={{
              maxHeight: '436rpx',
              minHeight: '80rpx',
            }}
            onFocus={onTextareaFocus}
            placeholder="请输入留言内容"
          />
        </View>
        <View className={styles.card}>
          <View className={styles.title}>开场白</View>
          <Field
            inputClass={styles.textarea}
            type="textarea"
            hiddenLabel
            value={new Array(200).fill('测试').join('')}
            autosize={{
              maxHeight: '436rpx',
              minHeight: '80rpx',
            }}
            placeholder="请输入留言内容"
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
          保存
        </Button>
      </View>
    </View>
  )
}
