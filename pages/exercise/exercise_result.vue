<!-- 在线练习交卷展示 -->
<template>
	<view class="page_big">
		<view class="top_bg">
			<image src="../../static/top_bg.png" mode=""></image>
		</view>
		<u-navbar title="本次考试成绩" :customBack="ifGoBack" :backNum="backNum" safeAreaInsetTop fixed placeholder :autoBack="true" :background="top_bgCl"
			titleColor="#ffffff" :borderBottom="false" backIconColor="#ffffff" titleBold>
		</u-navbar>
		<view class="page_content">
			<view class="score_box">
				<view class="score_bg">
					<image src="../../static/score_bg.png" mode=""></image>
					<view class="score_text">
						<view class="score_num">
							{{correcLvNum}}
						</view>
						<view class="score_type">
							选择题、判断题
						</view>
					</view>
				</view>
				<view class="wrong">
					<view class="wrong_text">
						未答题：{{noneNum}}
					</view>
					<view class="wrong_text"  @click="runWrong()">
						本次错题：{{errorNum}} <text class="wrong_icon">›</text>
					</view>
					<view class="wrong_text" @click="runReview()">
						练习回顾 <text class="wrong_icon">›</text>
					</view>
				</view>
			</view>

			<answersheet :examNumData="examNumData" :goReview="goReview" :analysisshow="true" :b_height="screenheight"></answersheet>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				backNum:2,
				screenheight: 0,
				//导航栏背景色
				top_bgCl: {
					background: "#0E8AFD"
				},
				//答题卡数据
				examNumData: [],
				answerData: [],
				errorNum:0,
				noneNum:0,
				correctNum:0,
				correcLvNum:'0%',
			};
		},
		mounted() {
			this.screenheight = uni.getSystemInfoSync().windowHeight;
		},
		onLoad(option) {
			let pages = getCurrentPages(); //获取所有页面栈实例列表
			let prevPage = pages[pages.length - 2]; //上一个页面实例
			this.answerData = prevPage.options.answerData;
			this.setExamNumData();
		},
		onBackPress() {
			console.log(">>>>>>>>>返回???");
			// uni.showModal({
			// 	title:'退出后当前练习结果不保留，是否退出？',
			// 	success: (res) => {
			// 		if(res.confirm){
			// 			return false;
			// 		}else{
			// 			return true;
			// 		}
			// 	}
			// })
			
		},
		methods: {
			ifGoBack(res){
				uni.showModal({
					title:'退出后当前练习结果不保留，是否继续退出？',
					success: (res) => {
						if(res.confirm){
							uni.navigateBack({delta:this.backNum});
						}else{
							
						}
					}
				})
			},
			setExamNumData() {
				let radioData = [];
				let checkboxData = [];
				let judgeData = [];
				let jdtData = [];
				//console.log("++++++++++",this.answerData);
				for (var r = 0; r < this.answerData.length; r++) {
					if (this.answerData[r].type == 1) {
						let state = this.answerIsCorrect(this.answerData[r]);
						let obj = {
							num: (r + 1),
							state: state
						};
						radioData.push(obj);
					}
					if (this.answerData[r].type == 2) {
						let state = this.answerIsCorrect(this.answerData[r]);
						let obj = {
							num: (r + 1),
							state: state
						};
						checkboxData.push(obj);
					}
					if (this.answerData[r].type == 3) {
						let state = this.answerIsCorrect(this.answerData[r]);
						let obj = {
							num: (r + 1),
							state: state
						};
						judgeData.push(obj);
					}
					if (this.answerData[r].type == 4) {
						let state = this.answerIsCorrect(this.answerData[r]);
						let obj = {
							num: (r + 1),
							state: state
						};
						jdtData.push(obj);
					}
				}
				if (radioData.length > 0) {
					let objData = {
						text: "1、单项选择题",
						type: '1',
						data: radioData
					};
					this.examNumData.push(objData);
				}
				if (checkboxData.length > 0) {
					let objData = {
						text: "2、多项选择题",
						type: '2',
						data: checkboxData
					};
					this.examNumData.push(objData);
				}
				if (judgeData.length > 0) {
					let objData = {
						text: "3、判断题",
						type: '3',
						data: judgeData
					};
					this.examNumData.push(objData);
				}
				if (jdtData.length > 0) {
					let objData = {
						text: "4、简答题",
						type: '4',
						data: jdtData
					};
					this.examNumData.push(objData);
				}
				//console.log(">>>>>this.examNumData ",this.examNumData);
				this.initInfo();
			},
			answerIsCorrect:function(answerObj){
				if(answerObj.isCorrect==1){
					this.correctNum++;
					return 3;
				}else if(answerObj.isCorrect==2){
					this.errorNum++;
					return 4;
				}else{
					if(answerObj.type==4&&answerObj.myAnswer){
						return 1;
					}else{
						this.noneNum++;
						return 0;
					}
				}
				
			},
			initInfo(){
				this.correcLvNum=parseFloat(((this.correctNum/this.answerData.length)*100)).toFixed(0)+"%";
			},
			// 跳转练习错题
			runWrong() {
				if(this.errorNum==0){
					return false;
				}
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				nowPage.options.answerData=this.answerData;
				nowPage.options.examNumData=this.examNumData;
				uni.navigateTo({
					url: '/pages/exercise/exercise_wrong_question'
				})
			},
			//跳转练习回顾
			runReview() {
				// uni.navigateTo({
				// 	url: '/pages/exercise/exercise_review'
				// })
				this.$eventHub.$emit('cktccp',null);
				uni.navigateBack({});
			},
			goReview(i) {
				console.log("i>>>>",i);
				this.$eventHub.$emit('cktccp',i);
				uni.navigateBack({});
			}
		}
	}
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
						color: #FFFFFF;
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
						color: #FFFFFF;

						.wrong_icon {
							padding-left: 14rpx;
						}
					}

				}
			}

			.score_tips {
				font-size: 24rpx;
				color: rgba(255, 255, 255, .8);
				transform: scale(0.95);
				// border: 1px solid;
				white-space: nowrap;
				margin-top: 20rpx;
			}
		}
	}
</style>
