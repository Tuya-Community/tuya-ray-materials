import React from "react";

import { Text } from "@ray-js/ray-next";

export default function Demo() {
	return (
		<Text style={{ fontSize: 40, color: "darkcyan" }}>{I18n.t('reactSyntax')}</Text>
	);
}
