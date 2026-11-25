import React from "react";

import { Text, View } from "@ray-js/ray-next";
import clsx from "clsx";

import styles from "./index.module.less";

export default function DemoWrapper(props: {
	style?: React.CSSProperties;
	children?: React.ReactNode;
	title?: string;
	align?: "left" | "center";
}) {
	const { children, style, title, align } = props;
	return (
		<View className={styles.wrapper}>
			{title && <Text className={styles.title}>{title}</Text>}
			<View
				style={style}
				className={clsx(styles.demo, {
					[styles.demoCenter]: align === "center",
				})}
			>
				{children}
			</View>
		</View>
	);
}
