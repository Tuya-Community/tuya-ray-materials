import React from "react";
import { Picker } from "@ray-js/ray-next";
import { View } from "@ray-js/ray-next";

export default function () {
	const [current, setCurrent] = React.useState([0, 0, 0]);

	const handlePickerChange = (e) => {
		setCurrent(e.value);
	};

	const handleColumnChange = (e) => {
		console.log("picker column change", e);
	};

	const range = [
		[I18n.t('invertebrates'), I18n.t('vertebrates')],
		[I18n.t('flatworms'), I18n.t('roundworms'), I18n.t('annelids'), I18n.t('mollusks'), I18n.t('arthropods')],
		[I18n.t('porkTapeworm'), I18n.t('bloodworm')],
	];
	return (
		<Picker
			onColumnChange={handleColumnChange}
			onChange={handlePickerChange}
			range={range}
			value={current}
			mode="multiSelector"
		>
			<View style={{ flexDirection: "row" }}>{I18n.t('currentSelection')}{range[0][+current[0]]}, {range[1][+current[1]]},{" "}
				{range[2][+current[2]]}
			</View>
		</Picker>
	);
}
