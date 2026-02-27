/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-26 09:56:20
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
      title: '标题',
      value: '123',
      placeholder: '请输入',
      selector: '#custom',
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
      <NavBar leftArrow title="home" onClickLeft={() => navigateBack()} />
      <Button onClick={showDialog}>出现弹框</Button>
      <Dialog id="custom" />
    </View>
  )
}
