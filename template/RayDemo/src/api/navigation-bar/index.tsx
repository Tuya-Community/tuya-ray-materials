import React from "react";

import { Button } from "@ray-js/ray-next";
import DemoWrapper from "@/common/DemoWrapper";

import { setNavigationBarTitle, setNavigationBarColor } from "@ray-js/ray-next";
import { randomColor } from "@/utils/randomColor";

const PagePreviewer = () => {
	return (
		<DemoWrapper align="center">
			<Button
				onClick={() => {
					setNavigationBarColor({
						backgroundColor: randomColor(),
						frontColor: "#ffffff",
					});
				}}
			>
				setNavigationBarColor
			</Button>
			<Button
				onClick={() => {
					setNavigationBarTitle({
						title: I18n.t('newTitle') + ' ' + Math.floor(Math.random() * 100),
					});
				}}
			>
				setNavigationBarTitle
			</Button>
		</DemoWrapper>
	);
};

export default PagePreviewer;
