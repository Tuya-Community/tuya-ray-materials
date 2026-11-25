import React from "react";

import { Button } from "@ray-js/ray-next";
import DemoWrapper from "@/common/DemoWrapper";

import { setNavigationBarTitle, setNavigationBarColor } from "@ray-js/ray-next";
import { randomColor } from "@/utils/randomColor";

const PagePreviewer = () => {
	return (
		<DemoWrapper align="center">{I18n.t('relaunchPage')}</DemoWrapper>
	);
};

export default PagePreviewer;
