/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-25 13:46:43
 * @Description:
 */
import React, { useState } from 'react'
import { getSystemInfoSync, Input, navigateBack, ScrollView, View } from '@ray-js/ray'
import { NavBar, Button } from '@ray-js/smart-ui'
import styles from './index.module.less'

export default function Demo() {
  const [focus, setFocus] = useState(false)
  const [height, setHeight] = useState('100vh')

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
    <View
      className={styles.container}
      style={{ height }}
      onTouchMove={() => focus && setFocus(false)}
    >
      <NavBar
        background="transparent"
        title={I18n.t('nav_add_message')}
        leftArrow
        onClickLeft={() => navigateBack()}
      />
      <ScrollView scrollY className={styles.content}>
        <View className={styles.split} />
        <View className={styles.card}>
          <View className={styles.title}>{I18n.t('label_name')}</View>
          <Input
            // @ts-ignore
            focus={focus}
            value={I18n.t('label_name') + I18n.t('label_name') + I18n.t('label_name')}
            className={styles.input}
            onFocus={onInputFocus}
            onBlur={() => setFocus(false)}
            placeholder={I18n.t('placeholder_input')}
          />
        </View>
        {new Array(7).fill(0).map((item, index) => (
          <View
            className={styles.card}
            key={`${item}-${index}`}
            style={{
              height: 200,
            }}
          />
        ))}
      </ScrollView>
      <View className={styles.buttonContainer}>
        <Button type="primary" customClass={styles.button}>
          {I18n.t('btn_save')}
        </Button>
      </View>
    </View>
  )
}
