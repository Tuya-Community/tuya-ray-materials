import React from "react";
import { Picker, View } from "@ray-js/ray-next";

export default function () {
	const [current, setCurrent] = React.useState(0);

	const handlePickerChange = (e) => {
		setCurrent(+e.value);
	};

	const range = [I18n.t('usa'), I18n.t('china'), I18n.t('brazil'), I18n.t('japan')];

	return (
		<Picker
			onChange={handlePickerChange}
			range={range}
			value={current}
			mode="selector"
		>
			<View style={{ flexDirection: "row" }}>{I18n.t('currentSelection')}{range[current]}
			</View>
		</Picker>
	);
}
