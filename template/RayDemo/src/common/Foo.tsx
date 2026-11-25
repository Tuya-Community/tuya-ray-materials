import React from "react";
import { View, Text } from "@ray-js/ray-next";
import { withPageLifecycle, router } from "@ray-js/ray-next";

import { getApp } from "@ray-js/ray-next";

const CustomContext = React.createContext({
	foo: "bar",
});

class Foo extends React.Component {
	componentName = "Hoc Component keep ref!!!";

	componentDidMount() {
		console.info("component: Foo did mount", getApp());
	}

	onShow() {
		console.info("component: Foo onShow");
	}

	render() {
		return (
			<React.Fragment>
				<View>
					<Text>Foo Children </Text>
				</View>
				<View onClick={() => router.push(`/?v=${Date.now()}`)}>
					<Text>{I18n.t('backToHome')}</Text>
				</View>
			</React.Fragment>
		);
	}
}

Foo.contextType = CustomContext;

export default withPageLifecycle(Foo);
