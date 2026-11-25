import React from "react";
import { View, Button, Text } from "@ray-js/ray-next";
import { location, router } from "@ray-js/ray-next";

import DemoWrapper from "@/common/DemoWrapper";
import styles from "./index.module.less";

export default function Home() {
	return (
		<DemoWrapper>
			{Object.keys(location).map((key) => {
				return (
					<View key={key} className={styles.entry}>
						<Text className={styles.key}>{key}</Text>
						<Text className={styles.value}>{JSON.stringify(location[key])}</Text>
					</View>
				);
			})}

			<Button
				className={styles.button}
				onClick={() => {
					router.push(`/detail/${Date.now()}`);
				}}
			>
				<Text>{I18n.t('openDetail')}</Text>
			</Button>
		</DemoWrapper>
	);
}
