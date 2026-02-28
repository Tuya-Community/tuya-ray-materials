/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-28 15:50:31
 * @Description:
 */
import React, { useEffect, useState } from 'react'
import { View, navigateBack } from '@ray-js/ray'
import { Button, Dialog, DialogInstance, NavBar } from '@ray-js/smart-ui'
import styles from './index.module.less'

export default function Demo() {
  const showDialog = () => {
    // // @ts-ignore
    // ty.enablePageScroll?.({
    //   scrollEnable: false,
    // });
    DialogInstance.input({
      title: I18n.t('dialog_title'),
      value: '123',
      placeholder: I18n.t('placeholder_enter'),
      selector: '#custom',
      cancelButtonText: I18n.t('cancel'),
      confirmButtonText: I18n.t('confirm'),
    })
      .then((res) => {
        console.log(res, '--res')
        // // @ts-ignore
        // ty.enablePageScroll?.({
        //   scrollEnable: true,
        // });
      })
      .catch((err) => {
        console.log(err, '--err')
        // // @ts-ignore
        // ty.enablePageScroll?.({
        //   scrollEnable: true,
        // });
      })
  }

  useEffect(() => {
    showDialog()
  }, [])
  return (
    <View className={styles.container}>
      <NavBar leftArrow title={I18n.t('nav_home')} onClickLeft={() => navigateBack()} />
      <Button onClick={showDialog}>{I18n.t('btn_show_dialog')}</Button>
      <Dialog id="custom" />
    </View>
  )
}
