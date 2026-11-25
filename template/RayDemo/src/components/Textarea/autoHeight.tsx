import React from "react";

import { Textarea } from "@ray-js/ray-next";

export default function TextareaDemo() {
	return (
		<React.Fragment>
			<Textarea
				autoHeight
				style={{ fontSize: 24, color: "#89aaff" }}
				placeholder={I18n.t('autoHeightPlaceholder')}
				placeholderStyle={{ color: "#999" }}
			/>
		</React.Fragment>
	);
}
