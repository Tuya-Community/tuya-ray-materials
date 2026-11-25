import React from "react";

import { View } from "@ray-js/ray-next";

import styles from "./index.module.less";

export default function () {
	let t = 0;
	return (
		<View
			hoverClassName={styles.hoverView}
			className={styles.view}
			onTouchStart={() => {
				t = Date.now();
			}}
			onClick={() => {
				// showToast({
				//   title: `${Date.now() - t}ms`,
				// });
				console.log(`${Date.now() - t}ms`);
			}}
		>{I18n.t('holdColor')}</View>
	);
}
