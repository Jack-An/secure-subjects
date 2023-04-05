<!-- 题库页 -->
<template>
	<view class="page_big" :style="{height:screenheight+'px'}">
		<view class="top_bg">
			<image src="../../static/top_bg.png" mode=""></image>
		</view>
		<u-navbar :title="title" safeAreaInsetTop fixed placeholder :is-back="false" :autoBack="true"
			:background="top_bgCl" titleColor="#ffffff" :borderBottom="false" :select="true" backIconColor="#ffffff"
			:changedata="changedata" @pickershow="pickershow">
		</u-navbar>
		<view class="page_content">
			<view class="modular">
        <view class="modular_item" @click="runSequenceExam">
					<image src="../../static/examination_paper.png" mode=""></image>
					<text>顺序练习</text>
				</view>
				<view class="modular_item" @click="runExercise">
					<image src="../../static/practice.png" mode=""></image>
					<text>模拟考试</text>
				</view>
				<view class="modular_item" @click="runFav">
					<image src="../../static/favorites.png" mode=""></image>
					<text>错题练习</text>
				</view>
			</view>
			<view class="history_results">
				<view class="history_title">
					模拟考试历史
				</view>
				<view class="history_detail">
					<view class="history_detail_item" v-for="(item,i) in history" :key="i">
						<view class="score" :style="{'color':item.isQualified==1?'#10C600':''}">
							{{item.score + "分"}}
						</view>
						<view class="time">
							{{item.time|getMinuteValue}}
						</view>
						<view class="date">
							{{item.startTime|getDateTime}}
						</view>
						<view class="project">
							{{item.testpaperName}}
						</view>
					</view>
					<view style="text-align: center;font-size: 16px;" v-if="history.length==0">
						<text>暂无数据~</text>
					</view>
				</view>
			</view>
			<u-picker v-model="pickShow" mode="selector" rangeKey="label" :range="selectorObj" @confirm="getChangeInfo">
			</u-picker>
		</view>
	</view>
</template>

<script>
	export default {
		filters: {
			getMinuteValue(value) {
				let result = parseInt(value)
				let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
				let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result /
					60 % 60));
				let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
				let res = '';
				if (h !== '00') res += `${h}时`;
				if (m !== '00') res += `${m}分`;
				res += `${s}秒`;
				return res;
			},
			getDateTime(value) {
				let date = new Date(value)
				let fmt = "mm月dd日";
				let ret;
				const opt = {
					"Y+": date.getFullYear().toString(), // 年
					"m+": (date.getMonth() + 1).toString(), // 月
					"d+": date.getDate().toString(), // 日
					"H+": date.getHours().toString(), // 时
					"M+": date.getMinutes().toString(), // 分
					"S+": date.getSeconds().toString() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				for (let k in opt) {
					ret = new RegExp("(" + k + ")").exec(fmt);
					if (ret) {
						fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
					};
				};
				return fmt;
			}
		},
		data() {
			return {
				//导航栏背景色
				top_bgCl: {
					background: "#0E8AFD"
				},
				screenheight: '',
				//历史数据
				history: [{
					'score':80,
					'startTime':"2022-03-04 10:19:10",
					'time':600,
					'testpaperName':'随机抽题100120',
					'isQualified':1
				},{
					'score':59,
					'startTime':"2022-03-06 10:19:10",
					'time':500,
					'testpaperName':'随机抽题102030',
					'isQualified':0
				},],
				//当前科目
				title: '',
				//科目切换数据
				changedata: [],
				subjectId: '',
				questionbankId: '',
				pickShow: false,
				selectorObj: [],
			}
		},
		mounted() {
			this.screenheight = uni.getSystemInfoSync().windowHeight
		},
		created() {

		},
		onLoad(option) {
			
			this.init();
		},
		methods: {
			init() {
				this.selectorObj = [
					{
						id: 1,
						label: "建设工程安全生产技术"
					},
					{
						id: 2,
						label: "建设工程安全生产法律法规"
					},
					{
						id: 3,
						label: "建设工程安全生产管理"
					}
				]
				this.title  = this.selectorObj[0].label;
			},
			pickershow(e) {
				this.pickShow = true;
			},
			getChangeInfo(e) {
				console.log(">>>>>>>>>>",this.selectorObj[e[0]]);
				this.title = this.selectorObj[e[0]].label;
			},

			//跳转模拟考卷列表
			runSequenceExam() {
				uni.navigateTo({
					url: "../exam/exam_list"
				})
			},
			//跳转练习列表
			runExercise() {
				uni.navigateTo({
					url: '../exercise/exercise'
				})
				// uni.showModal({
				// 	title:'正在更新中...'
				// })
			},
			//跳转收藏夹
			runFav() {
				// uni.navigateTo({
				// 	url: '../favorites/favorites'
				// })
				uni.showModal({
					title:'正在更新中...'
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.page_big {
		position: relative;
		width: 100%;



		.top_bg {
			width: 100%;
			position: absolute;
			z-index: -999;

			image {
				width: 100%;
				height: 550rpx;
			}
		}

		.page_content {
			width: 100%;
			// height: 100%;
			padding: 30rpx 30rpx 30rpx 30rpx;

			.modular {
				display: flex;
				justify-content: space-around;

				.modular_item {
					width: 30%;
					height: 240rpx;
					background: #FFFFFF;
					border-radius: 20rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					image {
						width: 100rpx;
						height: 100rpx;
					}

					text {
						margin-top: 20rpx;
					}
				}
			}

			.history_results {
				width: 100%;
				height: 1050rpx;
				background: #FFFFFF;
				margin-top: 30rpx;
				border-radius: 20rpx;
				box-shadow: 0px 6rpx 10rpx 3rpx rgba(0, 0, 0, 0.2);
				padding-top: 40rpx;

				.history_title {
					font-size: 32rpx;
					font-weight: 700;
					margin-left: 40rpx;
				}

				.history_detail {
					margin-top: 30rpx;
					height: 900rpx;
					overflow: scroll;

					.history_detail_item {
						padding: 20rpx 40rpx 20rpx 40rpx;
						display: flex;
						justify-content: space-between;
						border-bottom: 1rpx solid #e7e7e1;

						.score {
							color: red;
						}

						.time {
							color: #C1C1BB;
						}

						.date {
							color: #BBBBBB;
						}

						.project {
							color: #333;
						}
					}
				}
			}
		}

	}
</style>
