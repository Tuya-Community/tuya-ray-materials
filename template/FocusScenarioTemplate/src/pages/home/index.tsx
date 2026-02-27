/*
 * @Author: mjh
 * @Date: 2026-02-25 19:34:50
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-26 09:55:25
 * @Description:
 */
import React from 'react'
import { Button, navigateTo, View } from '@ray-js/ray'
import styles from './index.module.less'

export default function Demo() {
  return (
    <View className={styles.container}>
      <Button onClick={() => navigateTo({ url: '/pages/example1/index' })}>
        1. Browse / Lightweight Input Box Form + Keyboard Auto-Collapse
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example2/index' })}>
        2. Multiple input box form type + fixed keyboard
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example3/index' })}>
        3. Lightweight input box form type + keyboard automatically hides
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example4/index' })}>
        4. Popup with multiple input fields form + keyboard fixed
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example5/index' })}>5. Popup Focus</Button>
      <Button onClick={() => navigateTo({ url: '/pages/example6/index' })}>
        6. Fixed card height + fixed one screen + fixed keyboard
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example7/index' })}>
        7. Card height auto-adjusts + Scrolls beyond one screen + Keyboard fixed
      </Button>
    </View>
  )
}
