/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-25 13:44:25
 * @Description:
 */
import React, { useEffect, useState } from 'react'
import {
  Input,
  ScrollView,
  View,
  getSystemInfoSync,
  hideMenuButton,
  navigateBack,
  showMenuButton,
} from '@ray-js/ray'
import { Button, NavBar, Popup } from '@ray-js/smart-ui'
import styles from './index.module.less'

export default function Demo() {
  const [showPopup, setShowPopup] = useState(true)
  const [focus, setFocus] = useState(true)
  const [height, setHeight] = useState<string | number>('100vh')

  useEffect(() => {
    hideMenuButton()
    return () => {
      showMenuButton()
    }
  }, [])

  const onInputFocus = () => {
    if (height === '100vh') {
      // @ts-ignore
      const { useableWindowHeight } = getSystemInfoSync()
      if (!useableWindowHeight) return
      setHeight(`${useableWindowHeight}px`)
    }
    setFocus(true)
  }
  return (
    <View className={styles.container}>
      <NavBar title="浮层表单聚焦" leftArrow onClickLeft={() => navigateBack()} />
      <Button type="primary" onClick={() => setShowPopup(true)}>
        显示弹窗
      </Button>
      <Popup position="bottom" round show={showPopup} closeable onClose={() => setShowPopup(false)}>
        <View className={styles.popupContainer} onTouchMove={() => focus && setFocus(false)}>
          <View className={styles.popupHeader}>创建联系人</View>
          <ScrollView scrollY className={styles.popupContent}>
            <View className={styles.card}>
              <View className={styles.title}>名称</View>
              <Input
                // @ts-ignore
                focus={focus}
                value="名称名称名称"
                className={styles.input}
                onFocus={onInputFocus}
                onBlur={() => setFocus(false)}
                placeholder="请输入内容"
              />
            </View>
            {new Array(6).fill(0).map((item, index) => (
              <View
                className={styles.card}
                key={`${item}-${index}`}
                style={{
                  height: 200,
                }}
              />
            ))}
            <View className={styles.split} style={{ height: 192 }} />
          </ScrollView>
          <View
            className={styles.buttonContainer}
            style={{
              top: `calc(${height} - 192rpx - 50px)`,
            }}
          >
            <Button type="primary" customClass={styles.button}>
              保存
            </Button>
          </View>
        </View>
      </Popup>
    </View>
  )
}
