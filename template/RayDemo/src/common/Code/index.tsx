import React from "react";

import { Text, View, ScrollView } from "@ray-js/ray-next";
import { isWeb } from "@ray-js/env";

import styles from "./index.module.less";

export interface CodeProps {
	title?: string;
}

export default function Code({
	children,
	title,
}: React.PropsWithChildren<CodeProps>) {
	const lines = (children as string).split("\n").filter((l) => l.trim() !== "");
	const code = (
		<View className={styles.code}>
			<Text>{lines.join("\n")}</Text>
		</View>
	);

	return (
		<View className={styles.wrapper}>
			<View className={styles.title}>
				<Text>{title ? title : "Basic"}</Text>
				<Text className={styles.titleExample}>example</Text>
			</View>
			{isWeb ? (
				<View className={styles.scroll}>{code}</View>
			) : (
				<ScrollView className={styles.scroll} scrollX>
					{code}
				</ScrollView>
			)}
		</View>
	);
}
