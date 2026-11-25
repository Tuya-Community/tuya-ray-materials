import React from "react";

import { Button, View } from "@ray-js/ray-next";
import { getElementById } from "@ray-js/ray-next";
import DemoWrapper from "@/common/DemoWrapper";

const PagePreviewer = () => {
	const getView = async () => {
		const node = await getElementById("#view1");
		console.log("view1节点信息", node);
	};
	return (
		<DemoWrapper>
			<View
				style={{ width: "30px", height: "30px", backgroundColor: "#007AFF" }}
				id="view1"
			></View>
			<Button onClick={getView}>{I18n.t('getNodeInfo')}</Button>
		</DemoWrapper>
	);
};

export default PagePreviewer;
