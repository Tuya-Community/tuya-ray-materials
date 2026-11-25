import React from "react";

import { PageContainer, Button, View } from "@ray-js/ray-next";

export default function Demo() {
	const [isShow, setIsShow] = React.useState(false);
	const toggleIsShow = () => {
		setIsShow(!isShow);
	};
	return (
		<React.Fragment>
			<Button onClick={toggleIsShow}>{I18n.t('openBottom')}</Button>
			<PageContainer
				show={isShow}
				position="bottom"
				onClickOverlay={toggleIsShow}
			>
				<View
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: "300px",
					}}
				>{I18n.t('rayDevelopment')}</View>
			</PageContainer>
		</React.Fragment>
	);
}
