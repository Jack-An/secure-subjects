<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			
			// #ifdef MP-WEIXIN
			if (uni.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
									if (res.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(function() {
							// 新的版本下载失败
							wx.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							})
						})
					}
				})
			}
			// #endif
			// this.sjpt = uni.getSystemInfoSync().platform;
			// if(uni.getSystemInfoSync().platform == 'android'){
			// 	this.sjpt = true;
			// }else if(uni.getSystemInfoSync().platform == 'ios'){
			// 	this.sjpt = false;
			// }
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif

					// #ifdef MP-WEIXIN
					if (e.platform == 'android') {
						Vue.prototype.platform='android';
					} else if(e.platform == 'ios') {
						Vue.prototype.platform="ios";
					};
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					Vue.prototype.thisWindowHeight=e.windowHeight;
					Vue.prototype.thisWindowWidth=e.windowWidth;
					Vue.prototype.styleColor="#097CC8";//全局统一色调
					// #endif		

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			})

		},
		onShow: function() {
		},
		onHide: function() {
		}

	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "common/demo.scss";
</style>