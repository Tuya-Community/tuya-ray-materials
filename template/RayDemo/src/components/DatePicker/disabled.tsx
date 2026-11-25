import React from "react";
import { DatePicker } from "@ray-js/ray-next";
import { View } from "@ray-js/ray-next";

export default function () {
	const handlePickerChange = (e) => {
		console.log("DatePicker changed", e);
	};

	return (
		<DatePicker
			onChange={handlePickerChange}
			start={"2021-1-1"}
			end={"2021-12-12"}
			disabled
		>
			<View>{I18n.t('selectDateDisabled')}</View>
		</DatePicker>
	);
}
