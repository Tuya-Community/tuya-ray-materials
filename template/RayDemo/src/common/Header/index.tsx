import React from "react";

import { Image, View, Text } from "@ray-js/ray-next";
import clsx from "clsx";

import styles from "./index.module.less";

const Header: React.FC<{
	title: string;
	description?: string;
	variant?: "catalog";
}> = ({ title, description, variant }) => {
	const isCatalog = variant === "catalog";

	return (
		<View className={clsx(styles.wrapper, isCatalog && styles.catalog)}>
			{isCatalog && (
				<>
					<View className={styles.orbit}>
						<View className={styles.orbitInner} />
					</View>
					<Image className={styles.logo} src="/ray-logo.png" mode="aspectFit" />
				</>
			)}
			<Text className={styles.title}>{title}</Text>
			{!!description && <Text className={styles.desc}>{description}</Text>}
		</View>
	);
};

export default Header;
