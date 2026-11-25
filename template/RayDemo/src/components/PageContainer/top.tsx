import React from "react";

import { PageContainer, Button, View } from "@ray-js/ray-next";

export default function Demo() {
	const [isShow, setIsShow] = React.useState(false);
	const toggleIsShow = () => {
		setIsShow(!isShow);
	};
	return (
		<React.Fragment>
			<Button onClick={toggleIsShow}>{I18n.t('openTop')}</Button>
			<PageContainer
				show={isShow}
				position="top"
				onClickOverlay={toggleIsShow}
				overlay={false}
			>
				<View style={{ height: "200px" }}>
					<Button onClick={toggleIsShow}>{I18n.t('close')}</Button>
				</View>
			</PageContainer>
		</React.Fragment>
	);
}
