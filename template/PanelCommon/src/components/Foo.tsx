import React from 'react'
import { View, Text, router } from '@ray-js/ray'
import styles from './Foo.module.less'

const Foo = () => {
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
