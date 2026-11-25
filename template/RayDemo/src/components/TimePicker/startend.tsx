import React from "react";
import { TimePicker } from "@ray-js/ray-next";
import { View } from "@ray-js/ray-next";

export default function () {
	const [currentTime, setCurrentTime] = React.useState("12:00");
	const handlePickerChange = (e) => {
		console.log("TimePicker changed", e);
		setCurrentTime(e.value);
	};

	return (
		<TimePicker
			onChange={handlePickerChange}
			start={"09:30"}
			end={"17:30"}
			value={currentTime}
		>
			<View>{I18n.t('selectWorkingTime')}</View>
		</TimePicker>
	);
}
