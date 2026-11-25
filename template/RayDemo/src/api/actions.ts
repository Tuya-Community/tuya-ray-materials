import {
	showTabBar,
	hideTabBar,
	getCurrentPages,
	getSystemInfoSync,
	getSystemInfo,
	switchTab,
	navigateTo,
	redirectTo,
	reLaunch,
	showToast,
	showLoading,
	hideLoading,
	setStorage,
	getStorage,
	setClipboardData,
	getClipboardData,
	getLangKey,
	getLangContent,
	getNetworkType,
} from "@ray-js/ray-next";

/**
 * API Actions 映射表
 * 将字符串标识符映射到实际的执行函数
 */
export const API_ACTIONS: Record<string, () => void | Promise<void>> = {
	// TabBar
	showTabBar: () => {
		showTabBar({ animation: true });
	},
	hideTabBar: () => {
		hideTabBar({ animation: true });
	},

	// App
	getCurrentPages: () => {
		console.log(getCurrentPages());
	},
	getSystemInfoSync: () => {
		console.log("getSystemInfoSync 返回结果", getSystemInfoSync());
	},
	getSystemInfo: async () => {
		console.log("getSystemInfo 返回结果", await getSystemInfo());
	},

	// 导航
	switchTab: () => {
		switchTab({ url: "/pages/home/index" });
	},
	navigateTo: () => {
		navigateTo({
			url: "/api/navigation-back/index",
		});
	},
	redirectTo: () => {
		navigateTo({
			url: "/api/navigation-back/index",
		});
	},
	reLaunch: () => {
		reLaunch({ url: "/api/reLaunch/index" });
	},

	// 视图
	showToast: () => {
		showToast({
			title: I18n.t('success'),
			duration: 2000,
		});
	},
	showLoading: () => {
		showLoading({
			title: "loading",
			success() {
				console.log("showLoading success");
			},
			fail() {
				console.log("showLoading fail");
			},
		});
	},
	hideLoading: () => {
		hideLoading({
			success() {
				console.log("hideLoading success");
			},
			fail(e) {
				console.log("hideLoading fail", e);
			},
		});
	},

	// 缓存
	setStorage: () => {
		setStorage({
			key: "key",
			data: "value",
			success() {
				console.log("setStorage success");
			},
			fail(e) {
				console.log("setStorage fail", e);
			},
		});
	},
	getStorage: () => {
		getStorage({
			key: "key",
			success(res) {
				showToast({
					title: res.data,
				});
				console.log("getStorage success");
			},
			fail(e) {
				console.log("getStorage fail", e);
			},
		});
	},

	// 剪贴板
	setClipboardData: () => {
		setClipboardData({
			data: "data",
			success(res) {
				console.log("setClipboardData success");
			},
			fail(e) {
				console.log("setClipboardData fail", e);
			},
		});
	},
	getClipboardData: () => {
		getClipboardData({
			success(res) {
				showToast({
					title: res.data,
				});
				console.log("getClipboardData success");
			},
			fail(e) {
				console.log("getClipboardData fail", e);
			},
		});
	},

	// 多语言
	getLangKey: () => {
		getLangKey({
			success(res) {
				showToast({
					title: res.langKey,
				});
				console.log("getLangKey success");
			},
			fail(e) {
				console.log("getLangKey fail", e);
			},
		});
	},
	getLangContent: () => {
		getLangContent({
			success(res) {
				showToast({
					title: JSON.stringify(res.langContent),
				});
				console.log("getLangContent success");
			},
			fail(e) {
				console.log("getLangContent fail", e);
			},
		});
	},

	// 网络
	getNetworkType: () => {
		getNetworkType({
			success(res) {
				showToast({
					title: `${I18n.t('networkType')} ${res.networkType} ${I18n.t('signalStrength')} ${res.signalStrength}`,
				});
				console.log("getNetworkType success");
			},
			fail(e) {
				console.log("getNetworkType fail", e);
			},
		});
	},

	// 下拉刷新
	startPullDownRefresh: () => {
		navigateTo({
			url: "/api/pulldown/index",
		});
	},
};

/**
 * 执行 API Action
 * @param actionName - action 标识符
 */
export function executeAction(actionName: string) {
	const action = API_ACTIONS[actionName];
	if (action) {
		try {
			action();
		} catch (error) {
			console.error(`执行 action "${actionName}" 时出错:`, error);
		}
	} else {
		console.warn(`Action "${actionName}" 未找到`);
		console.warn('可用的 actions:', Object.keys(API_ACTIONS));
	}
}

