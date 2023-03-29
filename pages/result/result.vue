<!-- 考试结束展示页 -->
<template>
	<view class="page_big">
		<view class="top_bg"><image src="../../static/top_bg.png" mode=""></image></view>
		<u-navbar
			title="本次考试成绩"
			safeAreaInsetTop
			fixed
			placeholder
			:autoBack="true"
			:background="top_bgCl"
			:backNum="backNum"
			titleColor="#ffffff"
			:borderBottom="false"
			backIconColor="#ffffff"
			titleBold
		></u-navbar>
		<view class="page_content">
			<view class="score_box">
				<view class="score_bg">
					<image src="../../static/score_bg.png" mode=""></image>
					<view class="score_text">
						<view class="score_num">{{ total }}分</view>
						<view class="score_type">选择题、判断题</view>
					</view>
				</view>
				<view class="wrong">
					<view class="wrong_text">未答题：{{ noAnswer }}</view>
					<view class="wrong_text" @click="runWrong">
						本次错题：{{ errorNum }}
						<text class="wrong_icon">›</text>
					</view>
					<view class="wrong_text" @click="runReview">
						试卷回顾
						<text class="wrong_icon">›</text>
					</view>
				</view>
			</view>
			
			<view class="score_tips">
				选择题和判断题总分为{{numscore}}分，已去除简答题分值，试卷总分为{{examInfo.score}}分
			</view>
			<answersheet :examNumData="examNumData" :goReview="goReview" :analysisshow="true" :b_height="screenheight"></answersheet>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			backNum:4,
			screenheight: 0,
			//导航栏背景色
			top_bgCl: {
				background: '#0E8AFD'
			},
			correctNum: 0,
			errorNum: 0,
			total: 0,
			noAnswer: 0,
			examData: [],
			// 题目数据
			examNumData: [],
			errorData: [],
			achievementId: '',
			testpaperId: '',
			examInfo:{
				'score':60
			},
			numscore:0
		};
	},
	mounted() {
		this.screenheight = uni.getSystemInfoSync().windowHeight;
	},
	onLoad() {
		
		this.initExamNumData();
	},
	onBackPress() {
		//this.$eventHub.$emit('initTestpaperAchievementList',null);
	},
	methods: {
		//跳转错题页
		runWrong() {
			let pages = getCurrentPages();
			let nowPage = pages[pages.length - 1];
			// nowPage.options.errorData = this.errorData;
			// uni.navigateTo({
			// 	url: '/pages/result/exam_wrong_question'
			// });
		},
		//跳转回顾页
		runReview() {
			
		},
		goReview(i) {
			console.log("i>>>>",i);
		},
		initExamNumData: function() {
			uni.showLoading({
				title: '加载中....'
			});
			this.examData=[{
				type:1,//类型
				isAnswered:true,//是否答题
				myAnswer:'A',//我的作答
				rightkey:'A',//正确答案
				
			},
			{
				type:1,//类型
				isAnswered:false,//是否答题
				myAnswer:'',//我的作答
				rightkey:'A',//正确答案
				
			},
			{
				type:1,//类型
				isAnswered:true,//是否答题
				myAnswer:'B',//我的作答
				rightkey:'A',//正确答案
				
			}];
			this.setExamNumData(1, '单项选择题');
			this.errorNum=this.errorData.length;
			uni.hideLoading();
		},
		setExamNumData(type, title) {
			let data = [];
			for (var r = 0; r < this.examData.length; r++) {
				if (this.examData[r].type == type) {
					let state = 0;
					if (this.examData[r].isAnswered) {
						if (type == 4) {
							state = 1;
						} else {
							if (this.examData[r].myAnswer == this.examData[r].rightkey) {
								state = 3;
							} else {
								this.errorData.push(this.examData[r]);
								state = 4;
							}
						}
					} else {
						state = 0;
					}

					let obj = {
						num: r + 1,
						state: state
					};
					data.push(obj);
				}
			}
			if (data.length > 0) {
				let objData = {
					text: title,
					type: type,
					data: data
				};
				this.examNumData.push(objData);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page_big {
	position: relative;
	width: 100%;
	padding-bottom: 40rpx;

	.top_bg {
		width: 100%;
		position: absolute;
		z-index: -999;

		image {
			width: 100%;
			height: 580rpx;
		}
	}

	.page_content {
		width: 100%;
		// border: 1px solid;
		padding: 0 20rpx 0 20rpx;

		.score_box {
			display: flex;
			// border: 1px solid;
			padding: 20rpx 0 0 40rpx;

			.score_bg {
				// border: 1px solid;
				position: relative;

				image {
					width: 300rpx;
					height: 300rpx;
				}

				.score_text {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					text-align: center;
					// border: 1px solid;
					color: #ffffff;
					width: 280rpx;

					.score_num {
						font-size: 60rpx;
						font-weight: bold;
					}

					.score_type {
						margin-top: 10rpx;
					}
				}
			}

			.wrong {
				width: 100%;
				height: 300rpx;
				// border: 1px solid;
				padding-left: 60rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				.wrong_text {
					font-size: 32rpx;
					color: #ffffff;

					.wrong_icon {
						padding-left: 14rpx;
					}
				}
			}
		}

		.score_tips {
			font-size: 24rpx;
			color: rgba(255, 255, 255, 0.8);
			transform: scale(0.95);
			// border: 1px solid;
			white-space: nowrap;
			margin-top: 20rpx;
		}
	}
}
</style>
