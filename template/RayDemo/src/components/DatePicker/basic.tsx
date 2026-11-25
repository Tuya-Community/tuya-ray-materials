import React from "react";
import { DatePicker } from "@ray-js/ray-next";
import { View } from "@ray-js/ray-next";

export default function () {
	const handlePickerChange = (e) => {
		console.log("DatePicker changed", e);
	};

	return (
		<DatePicker onChange={handlePickerChange}>
			<View>{I18n.t('datePicker')}</View>
		</DatePicker>
	);
}
