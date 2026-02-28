/*
 * @Author: mjh
 * @Date: 2026-02-25 19:34:50
 * @LastEditors: mjh
 * @LastEditTime: 2026-02-28 16:39:44
 * @Description:
 */
import React from 'react'
import { Button, navigateTo, View } from '@ray-js/ray'
import styles from './index.module.less'

export default function Demo() {
  return (
    <View className={styles.container}>
      <Button onClick={() => navigateTo({ url: '/pages/example1/index' })}>
        1. {I18n.t('btn_form_single_auto')}
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example2/index' })}>
        2. {I18n.t('btn_form_multi_fixed')}
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example3/index' })}>
        3. {I18n.t('btn_popup_single_auto')}
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example4/index' })}>
        4. {I18n.t('btn_popup_multi_fixed')}
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example5/index' })}>
        5. {I18n.t('btn_popup_focus')}
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example6/index' })}>
        6. {I18n.t('btn_card_fixed')}
      </Button>
      <Button onClick={() => navigateTo({ url: '/pages/example7/index' })}>
        7. {I18n.t('btn_card_scroll')}
      </Button>
    </View>
  )
}
