import React from "react";
import { Switch } from "@ray-js/ray-next";
import { showToast } from "@ray-js/ray-next";

export default function () {
	return (
		<Switch
			checked
			type="checkbox"
			onChange={(event) => {
				showToast({ title: JSON.stringify(event), icon: "none" });
			}}
		/>
	);
}
