import { Routes, TabBar } from "@ray-js/types-next";

import { BASIC_ROUTES } from "./basic/index.config";
import { API_ROUTES } from "./api/routes.config";

export const routes: Routes = [
	{
		id: "home",
		route: "/",
		path: "/pages/home/index",
	},
	{
		route: "/api",
		path: "/pages/api/index",
	},
	{
		id: "detail",
		route: "/detail/:uid",
		path: "/pages/detail/index",
	},
	// 基础组件路由
	...BASIC_ROUTES,
	// API 页面路由
	...API_ROUTES,
];

export const tabBar: TabBar = {
	textColor: "@tabFontColor",
	selectedColor: "@tabSelectedColor",
	backgroundColor: "@tabBgColor",
	list: [
		{
			id: "home",
			text: "@I18n.t('components')",
			icon: "/tabBar/home.png",
			activeIcon: "/tabBar/home-active.png",
			pagePath: "/pages/home/index",
		},
		{
			route: "/api",
			text: "API",
			icon: "/tabBar/api.png",
			activeIcon: "/tabBar/api-active.png",
			pagePath: "/pages/api/index",
		},
	],
};
