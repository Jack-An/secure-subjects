<!-- 考试加载页 -->
<template>
	<view class="page_big" :style="{height:screenheight+'px'}">
		<u-navbar title="模拟考试" safeAreaInsetTop fixed placeholder :autoBack="true" :background="top_bgCl"
			titleColor="#ffffff" :borderBottom="false" backIconColor="#ffffff" titleBold>
		</u-navbar>
		<view class="page_content">
			<view class="exam_title">
				{{examInfo.exam_title}}
			</view>
			<view class="exam_bg">
				<image src="../../static/exam_bg.png" mode=""></image>
			</view>
			<view class="start_answer" @click="runExam()">
				开始答题
			</view>
			<view class="exam_detail">
				<view class="question_num">
					共<text>{{examInfo.examNum}}</text>道题
				</view>
				<view class="exam_score">
					<text>{{examInfo.qualified}}</text>分及格(满分<text>{{examInfo.score}}</text>分)
				</view>
				<view class="exam_time">
					{{examInfo.examTime}}分钟
				</view>
			</view>
			<view class="rules">
				{{examInfo.rule}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//当前屏幕高度
				screenheight: '',
				//导航栏背景色
				top_bgCl: {
					background: "#0E8AFD"
				},
				examInfo:{}
			};
		},
		mounted() {
			this.screenheight = uni.getSystemInfoSync().windowHeight
		},
		onLoad(option) {
			this.initExamInfo();
		},
		methods: {
			//跳转考试页
			runExam(){
				uni.navigateTo({
					url:'/pages/exam/exam'
				})
			},
			initExamInfo:function(){
				this.examInfo.exam_title="我是试卷一哦";
				this.examInfo.examNum=50;
				this.examInfo.qualified=60;
				this.examInfo.score=100;
				this.examInfo.examTime=60;
				this.examInfo.rule="每道题两分，答对得两分，不答和答错不得分。";
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #0E8AFD
	}

	.page_big {
		width: 100%;
		background: #0E8AFD;
		padding: 0 40rpx 20rpx 40rpx;

		.page_content {
			width: 100%;
			// height: 1000rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			box-shadow: 18rpx 18rpx 0px 0rpx rgba(138, 197, 245, 1);
			display: flex;
			flex-direction: column;
			align-items: center;
      margin-top: 20rpx;
			padding: 60rpx 60rpx 60rpx 60rpx;
			.exam_title {
				font-size: 34rpx;
				font-weight: 700;
			}
			.exam_bg{
				width: 90%;
				margin-top: 40rpx;
				image{
					width: 100%;
					height: 380rpx;
				}
			}
			.start_answer{
				font-size: 60rpx;
				color:#0E8AFD ;
				font-weight: bold;
				margin-top: 40rpx;
			}
			.exam_detail{
				text-align: center;
				font-size: 32rpx;
				margin-top: 20rpx;
				.question_num{
					margin-top: 15rpx;
				}
				.exam_score{
					margin-top: 15rpx;
				}
				.exam_time{
					margin-top: 15rpx;
				}
			}
			.rules{
				margin-top: 40rpx;
				font-size: 24rpx;
				color: #b0b1b0;
			}
		}
	}
</style>
