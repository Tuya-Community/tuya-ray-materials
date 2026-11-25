import React from "react";
import { PickerView, PickerViewColumn, View } from "@ray-js/ray-next";

export default function () {
	const [current, setCurrent] = React.useState([0, 1]);

	const handlePickerChange = (e) => {
		console.log(e);
		setCurrent(e.value);
	};

	const range = [
		[I18n.t('brazil'), I18n.t('china'), I18n.t('japan'), I18n.t('usa')],
		[I18n.t('orange'), I18n.t('apple'), I18n.t('banana'), I18n.t('watermelon')],
	];

	return (
		<PickerView onChange={handlePickerChange} value={current}>
			{range.map((column, columnIndex) => (
				<PickerViewColumn key={columnIndex}>
					{(column as string[]).map((item: string, index: number) => (
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
			))}
		</PickerView>
	);
}
