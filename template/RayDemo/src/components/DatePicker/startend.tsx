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
			start={"2021-8-5"}
			end={"2024-11-12"}
		>
			<View>{I18n.t('selectDateRange')}</View>
		</DatePicker>
	);
}
