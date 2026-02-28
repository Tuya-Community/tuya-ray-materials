/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-28 15:50:48
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
        title={I18n.t('nav_message_settings')}
        onClickLeft={() => {
          navigateBack()
        }}
      />
      <View className={styles.bodyContent}>
        <Tabs type="card" active="4" className={styles.tabs}>
          <Tab name="1" title={I18n.t('tab_record')} />
          <Tab name="2" title={I18n.t('tab_tts')} />
        </Tabs>
        <Field
          inputClass={styles.textarea}
          type="textarea"
          hiddenLabel
          value={new Array(110).fill(I18n.t('test')).join(' ')}
          maxlength={600}
          onFocus={onTextareaFocus}
          showWordLimit
          placeholder={I18n.t('placeholder_message')}
        />
        <Button customClass={styles.button}>{I18n.t('btn_generate')}</Button>
      </View>
    </View>
  )
}
