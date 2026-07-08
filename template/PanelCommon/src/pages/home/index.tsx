import React from 'react'
import { Button, View, Text, usePageEvent, router } from '@ray-js/ray'
import Foo from '@/components/Foo'
import styles from './index.module.less'

export default function Home() {
  usePageEvent('onShow', () => {
    console.info('home onShow')
  })

  usePageEvent('onHide', () => {
    console.info('home onHide')
  })

  usePageEvent('onPageScroll', (event) => {
    console.info('onPageScroll', event)
  })

  usePageEvent('onReachBottom', () => {
    console.info('onReachBottom')
  })

  usePageEvent('onResize', (event) => {
    console.info('onResize', event)
  })

  return (
    <View className={styles.view}>
      <Text className={styles.title}>{I18n.t('title')}</Text>

      <View className={styles.button}>
        <Button
          onClick={() => {
            router.push(`/my?v=${Date.now()}`)
          }}
        >
          Personal Page
        </Button>
      </View>

      <View className={styles.button}>
        <Button
          onClick={() => {
            router.push(`/detail/${Date.now()}?v=${Date.now()}`)
          }}
        >
          Detail Page
        </Button>
      </View>
      <Foo />
    </View>
  )
}
