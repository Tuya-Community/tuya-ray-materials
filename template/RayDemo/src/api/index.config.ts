/**
 * API 组件配置 - esbuild 友好版本
 * 使用 action 字符串代替 onClick 函数，避免构建时的依赖解析
 */

export const COMPONENTS = [
	{
		title: "TabBar",
		list: [
			{
				name: "showTabBar",
				action: "showTabBar",  // 使用字符串标识符
			},
			{
				name: "hideTabBar",
				action: "hideTabBar",
			},
		],
	},
	{
		title: "App",
		list: [
			{
				name: "getCurrentPages",
				action: "getCurrentPages",
			},
			{
				name: "getSystemInfoSync",
				action: "getSystemInfoSync",
			},
			{
				name: "getSystemInfo",
				action: "getSystemInfo",
			},
		],
	},
	{
		title: 'navigation',
		list: [
			{ name: "setNavigationBarTitle", path: "/navigation-bar" },
			{ name: "setNavigationBarColor", path: "/navigation-bar" },
			{
				name: "switchTab",
				path: "/redirect-to",
				action: "switchTab",
			},
			{
				name: "navigateTo",
				path: "/redirect-to",
				action: "navigateTo",
			},
			{
				name: "redirectTo",
				path: "/navigation-back",
				action: "redirectTo",
			},
			{
				name: "reLaunch",
				path: "/reLaunch",
				action: "reLaunch",
			},
		],
	},
	{
		title: 'views',
		list: [
			{ name: "getElementById", path: "/get-element-by-id" },
			{
				name: "showToast",
				action: "showToast",
			},
			{
				name: "showLoading",
				action: "showLoading",
			},
			{
				name: "hideLoading",
				action: "hideLoading",
			},
		],
	},
	{
		title: 'storage',
		list: [
			{
				name: "setStorage",
				action: "setStorage",
			},
			{
				name: "getStorage",
				action: "getStorage",
			},
		],
	},
	{
		title: 'clipboard',
		list: [
			{
				name: "setClipboardData",
				action: "setClipboardData",
			},
			{
				name: "getClipboardData",
				action: "getClipboardData",
			},
		],
	},
	{
		title: 'languages',
		list: [
			{
				name: "getLangKey",
				action: "getLangKey",
			},
			{
				name: "getLangContent",
				action: "getLangContent",
			},
		],
	},
	{
		title: 'network',
		list: [
			{
				name: "getNetworkType",
				action: "getNetworkType",
			},
		],
	},
	{
		title: 'pullDownRefresh',
		list: [
			{
				name: "startPullDownRefresh",
				path: "/pulldown",
				action: "startPullDownRefresh",
			},
		],
	},
];
