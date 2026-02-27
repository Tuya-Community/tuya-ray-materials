/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-12 14:57:22
 * @Description:
 */
import React, { useEffect, useState } from 'react'
import { View, getSystemInfoSync, navigateBack } from '@ray-js/ray'
import { NavBar, Tab, Tabs, Field, Button } from '@ray-js/smart-ui'
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
    // @ts-ignore
    ty.enablePageScroll?.({
      scrollEnable: false,
    })
  }

  return (
    <View
      className={styles.container}
      style={{
        height,
      }}
    >
      <NavBar
        background="transparent"
        leftArrow
        title="留言内容设置"
        onClickLeft={() => {
          navigateBack()
        }}
      />
      <View className={styles.bodyContent}>
        <Tabs type="card" active="4" className={styles.tabs}>
          <Tab name="1" title="原声录制" />
          <Tab name="2" title="文字转语音" />
        </Tabs>
        <Field
          inputClass={styles.textarea}
          type="textarea"
          hiddenLabel
          value={new Array(110).fill('测试').join('')}
          maxlength={400}
          onFocus={onTextareaFocus}
          showWordLimit
          placeholder="请输入留言内容"
        />
        <Button customClass={styles.button}>生成</Button>
      </View>
    </View>
  )
}
