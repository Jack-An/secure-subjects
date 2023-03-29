<template>
	<view class="page_big" :style="{height:screenheight+'px'}">
		<view class="top_bg">
			<image src="../../static/top_bg.png" mode=""></image>
		</view>
		<u-navbar :title="title" safeAreaInsetTop fixed placeholder :autoBack="true" :background="top_bgCl"
			titleColor="#ffffff" :borderBottom="false" :select="true" backIconColor="#ffffff" :changedata="changedata" @changetitle="changetitle">
		</u-navbar>
		<view class="page_content">
			<view class="modular">
				<view class="modular_item" @click="runExam">
					<image src="../../static/examination_paper.png" mode=""></image>
					<text>模拟考卷</text>
				</view>
				<view class="modular_item" @click="runExercise">
					<image src="../../static/practice.png" mode=""></image>
					<text>在线练习</text>
				</view>
				<view class="modular_item" @click="runFav">
					<image src="../../static/favorites.png" mode=""></image>
					<text>收藏夹</text>
				</view>
			</view>
			<view class="history_results">
				<view class="history_title">
					历史成绩
				</view>
				<view class="history_detail">
					<view class="history_detail_item" v-for="(item,i) in history" :key="i">
						<view class="score">
							{{item.score}}
						</view>
						<view class="time">
							{{item.time}}
						</view>
						<view class="date">
							{{item.date}}
						</view>
						<view class="project">
							{{item.project}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//导航栏背景色
				top_bgCl: {
					background: "#0E8AFD"
				},
				screenheight: '',
				//历史数据
				history: [{
					score: "56分",
					time: "16分14秒",
					date: '12月11日',
					project: "科目A"
				}, {
					score: "56分",
					time: "16分14秒",
					date: '12月11日',
					project: "科目A"
				}, {
					score: "56分",
					time: "16分14秒",
					date: '12月11日',
					project: "科目A"
				}, {
					score: "56分",
					time: "16分14秒",
					date: '12月11日',
					project: "科目A"
				}, {
					score: "56分",
					time: "16分14秒",
					date: '12月11日',
					project: "科目A"
				}, ],
				//当前科目
				title: '电工理论',
				//科目切换数据
				changedata: [{
					changetitle: '电工理论'
				}, {
					changetitle: '财商学法'
				}]
			}
		},
		mounted() {
			this.screenheight = uni.getSystemInfoSync().windowHeight
		},
		methods: {
			//更改当前科目
      changetitle(data){
				console.log(data)
				this.title=data
			},
			//跳转模拟考卷列表
			runExam(){
				uni.navigateTo({
					url:"../exam/exam_list"
				})
			},
			//跳转练习列表
			runExercise(){
				uni.navigateTo({
					url:'../exam/exam_loading'
				})
			},
			//跳转收藏夹
			runFav(){
				uni.navigateTo({
					url:"../favorites/favorites"
				})
			}
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
