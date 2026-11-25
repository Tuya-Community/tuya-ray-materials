import React from "react";

import { Button } from "@ray-js/ray-next";
import { navigateBack } from "@ray-js/ray-next";
import DemoWrapper from "@/common/DemoWrapper";

const PagePreviewer = () => {
	const back = () => {
		navigateBack();
	};
	return (
		<DemoWrapper>
			<Button onClick={back}>{I18n.t('navigateBack')}</Button>
		</DemoWrapper>
	);
};

export default PagePreviewer;
