import React from "react";

import { Input } from "@ray-js/ray-next";
import { showToast } from "@ray-js/ray-next";

export default function () {
	function handleConfirm(event: any) {
		showToast({ title: "confirm click" });
	}

	// @ts-ignore
	return (
		<Input placeholder="ID Number" type="idcard" onConfirm={handleConfirm} />
	);
}
