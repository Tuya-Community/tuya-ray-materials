import React from 'react'
import { View, Text, location } from '@ray-js/ray'

export default function Detail() {
  return (
    <View>
      {Object.keys(location).map((key) => {
        return (
          <View key={key}>
            <Text>
              {key}: {JSON.stringify(location[key])}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
