/*
 * @Author: mjh
 * @Date: 2025-04-29 16:06:11
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-25 15:13:17
 * @Description:
 */
import React from 'react'
import { Input, ScrollView, View, navigateBack } from '@ray-js/ray'
import { Button, NavBar } from '@ray-js/smart-ui'
import styles from './index.module.less'

export default function Demo() {
  return (
    <View className={styles.container}>
      <NavBar
        className={styles.navBar}
        background="#F8F8F8"
        title="添加留言"
        leftArrow
        onClickLeft={() => navigateBack()}
      />
      <View className={styles.content}>
        {new Array(7).fill(0).map((item, index) => (
          <View className={styles.card} key={`${item}-${index}`}>
            <View className={styles.title}>名称</View>
            <Input placeholder="请输入内容" value="名称名称名称" className={styles.input} />
          </View>
        ))}
      </View>
      <View className={styles.buttonContainer}>
        <Button type="primary" customClass={styles.button}>
          保存
        </Button>
      </View>
    </View>
  )
}
