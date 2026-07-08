import React from 'react'
import { Button, View, Text, router } from '@ray-js/ray'
import styles from './index.module.less'

export default function My() {
  return (
    <View className={styles.view}>
      <Text>My Center</Text>
      <Button
        onClick={() => {
          router.back()
        }}
      >
        Back to Home
      </Button>
    </View>
  )
}
