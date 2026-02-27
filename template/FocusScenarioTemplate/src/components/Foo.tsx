import React from 'react'
import { View, Text } from '@ray-js/components'
import { usePageEvent, router } from 'ray'
import styles from './Foo.module.less'

const Foo = () => {
  usePageEvent('onShow', () => {
    console.log('Foo => page onShow')
  })
  return (
    <View className={styles.container}>
      <Text className={styles.text}>Foo Component</Text>
      <View onClick={() => router.push(`/?v=${Date.now()}`)} className={styles.link}>
        <Text>Back to Home</Text>
      </View>
    </View>
  )
}

export default Foo
