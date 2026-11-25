import React from "react";

import DemoWrapper from "@/common/DemoWrapper";

import { usePageEvent } from "@ray-js/ray-next";
import { Button } from "@ray-js/ray-next";
import {
	stopPullDownRefresh,
	showToast,
	startPullDownRefresh,
} from "@ray-js/ray-next";

const PagePreviewer = () => {
	usePageEvent("onPullDownRefresh", () => {
		setTimeout(() => {
			showToast({
				title: I18n.t('refreshSuccess'),
			});
			stopPullDownRefresh();
		});
	});

	return (
		<DemoWrapper align="center">
			<Button onClick={startPullDownRefresh}>{I18n.t('pullDownRefresh')}</Button>
		</DemoWrapper>
	);
};

export default PagePreviewer;
