/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-25 11:25:35
 * @Description:
 */
import React, { useEffect, useState } from 'react'
import { Input, ScrollView, View, hideMenuButton, navigateBack, showMenuButton } from '@ray-js/ray'
import { Button, NavBar, Popup } from '@ray-js/smart-ui'
import styles from './index.module.less'

export default function Demo() {
  const [showPopup, setShowPopup] = useState(true)

  useEffect(() => {
    hideMenuButton()
    return () => {
      showMenuButton()
    }
  }, [])

  return (
    <View className={styles.container}>
      <NavBar title={I18n.t('nav_overlay_form')} leftArrow onClickLeft={() => navigateBack()} />
      <Button type="primary" onClick={() => setShowPopup(true)}>
        {I18n.t('btn_show_popup')}
      </Button>
      <Popup
        lockScroll={false}
        position="bottom"
        round
        show={showPopup}
        closeable
        onClose={() => setShowPopup(false)}
      >
        <View className={styles.popupContainer}>
          <View className={styles.popupHeader}>{I18n.t('popup_header_contact')}</View>
          <ScrollView scrollY className={styles.popupContent}>
            {new Array(7).fill(0).map((item, index) => (
              <View className={styles.card} key={`${item}-${index}`}>
                <View className={styles.title}>{I18n.t('label_name')}</View>
                <Input placeholder={I18n.t('placeholder_input')} className={styles.input} />
              </View>
            ))}
            <View className={styles.split} style={{ height: 192 }} />
          </ScrollView>
          <View className={styles.buttonContainer}>
            <Button type="primary" customClass={styles.button}>
              {I18n.t('btn_save')}
            </Button>
          </View>
        </View>
      </Popup>
    </View>
  )
}
