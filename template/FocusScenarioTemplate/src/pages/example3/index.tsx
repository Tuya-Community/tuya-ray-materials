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
      <NavBar title={I18n.t('nav_overlay_form')} leftArrow onClickLeft={() => navigateBack()} />
      <Button type="primary" onClick={() => setShowPopup(true)}>
        {I18n.t('btn_show_popup')}
      </Button>
      <Popup position="bottom" round show={showPopup} closeable onClose={() => setShowPopup(false)}>
        <View className={styles.popupContainer} onTouchMove={() => focus && setFocus(false)}>
          <View className={styles.popupHeader}>{I18n.t('popup_header_contact')}</View>
          <ScrollView scrollY className={styles.popupContent}>
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
              {I18n.t('btn_save')}
            </Button>
          </View>
        </View>
      </Popup>
    </View>
  )
}
