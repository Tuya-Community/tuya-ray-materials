import React from "react";

import { Button } from "@ray-js/ray-next";
import { navigateBack, redirectTo } from "@ray-js/ray-next";
import DemoWrapper from "@/common/DemoWrapper";
import { isWechat } from "@ray-js/env";

const PagePreviewer = () => {
	const back = () => {
		navigateBack();
	};
	const redirect = () => {
		redirectTo({
			url: isWechat ? "/api/redirect-to/index" : "api/redirect-to/index",
		});
	};
	return (
		<DemoWrapper>
			<Button onClick={redirect}>{I18n.t('redirectPage')}</Button>
			<Button onClick={back}>{I18n.t('navigateBack')}</Button>
		</DemoWrapper>
	);
};

export default PagePreviewer;
