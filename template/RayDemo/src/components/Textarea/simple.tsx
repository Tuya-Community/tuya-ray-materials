import React from "react";

import { Textarea, Button } from "@ray-js/ray-next";

export default function TextareaDemo() {
	const [focus, setFocus] = React.useState(false);

	return (
		<React.Fragment>
			<Textarea
				focus={focus}
				style={{ fontSize: 40, color: "#89aaff" }}
				value={I18n.t('defaultText')}
				placeholder={I18n.t('inputPlaceholder')}
				placeholderStyle={{
					color: "#999",
				}}
				onConfirm={(event) => {
					console.log("onConfirm", event);
				}}
				onBlur={(event) => {
					console.log("onBlur", event);
					setFocus(false);
				}}
				onFocus={(event) => {
					console.log("onFocus", event);
				}}
				onInput={(event) => {
					console.log("onInput", event);
				}}
			/>
		</React.Fragment>
	);
}
