import React from "react";
import { PickerView, PickerViewColumn, View } from "@ray-js/ray-next";

export default function () {
	const [current, setCurrent] = React.useState([0]);

	const handlePickerChange = (e) => {
		setCurrent(e.value);
	};

	const range = [I18n.t('brazil'), I18n.t('china'), I18n.t('japan'), I18n.t('usa')];

	return (
		<PickerView onChange={handlePickerChange} value={current}>
			<PickerViewColumn>
				{(range as string[]).map((item: string, index: number) => (
					<View
						key={index}
						style={{
							textAlign: "center",
							lineHeight: "36px",
						}}
					>
						{item}
					</View>
				))}
			</PickerViewColumn>
		</PickerView>
	);
}
