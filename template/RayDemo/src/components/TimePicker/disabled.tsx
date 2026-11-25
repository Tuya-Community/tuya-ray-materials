import React from "react";
import { TimePicker } from "@ray-js/ray-next";
import { View } from "@ray-js/ray-next";

export default function () {
	const handlePickerChange = (e) => {
		console.log("TimePicker changed", e);
	};

	return (
		<TimePicker
			onChange={handlePickerChange}
			start={"09:00"}
			end={"17:00"}
			disabled
		>
			<View>{I18n.t('selectTimeDisabled')}</View>
		</TimePicker>
	);
}
