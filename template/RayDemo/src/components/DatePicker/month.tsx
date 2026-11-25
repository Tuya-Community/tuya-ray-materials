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
			start={"2021-8-1"}
			end={"2024-10-12"}
			fields="month"
		>
			<View>{I18n.t('selectMonth')}</View>
		</DatePicker>
	);
}
