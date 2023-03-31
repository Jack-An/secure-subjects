<!-- 在线练习错题 -->
<template>
	<view class="page_big" :style="{height:screenheight+'px'}">
		<u-navbar title="练习错题" safeAreaInsetTop fixed placeholder :autoBack="true" :background="top_bgCl"
			titleColor="#ffffff" :borderBottom="false" backIconColor="#ffffff" titleBold>
		</u-navbar>
		<view class="exam_progress">
			<view class="slider">
				<u-slider height="12" inactiveColor="#75BDF8" activeColor="#fff" disabled
					:value="(exampagenum+1)/answerData.length*100"></u-slider>
			</view>
			<view class="subject_num">
				<text>第{{exampagenum+1}}题</text><text>/{{answerData.length}}题</text>
			</view>
		</view>
		<view class="page_content">
			<swiper style="height: 80%;" :indicator-dots="false" :circular="false" :autoplay="false" interval="5000"
				duration="500" @change="changeQues" :current="exampagenum">
				<swiper-item v-for="(item, index) in answerData" :key="index">
					<view class="" style="height: 100%; overflow: scroll;">
						<view class="subject_title" v-html="showTitleHtml(index+1,item)">
							<!-- {{index+1}}.{{item.title}} -->
						</view>
						<view class="answer">
							<view class="" v-if="item.type==1||item.type==2">
								<!-- answer_options_active -->
								<view :class="[changeAnswer(item2.state)]" v-for="(item2,i2) in item.questionAnswerList"
									:key="i2" @click="changeOptions(i2)">
									<view class="order" style="float: left;">
										{{item2.answerTitle}}.
									</view>
									<view class="answer_detail" v-html="item2.content"></view>
								</view>
								<view class="short_analysis" v-if="item.type==2">
									<view class="short_analysis_btn" style="font-size: 18px;color: #0E8AFD;"
										@click="checkboxChangeOptions()">
										确定
									</view>
								</view>
							</view>
							<view class="" v-if="item.type==3">
								<!-- answer_options_active -->
								<view :class="[changeAnswer(item2.state)]" v-for="(item2,i2) in item.questionAnswerList"
									:key="i2" @click="changeOptions(i2)">
									<view class="order" style="float: left;">
										{{i2==0?'A':'B'}}.
									</view>
									<view class="answer_detail">
										{{i2==0?'正确':'错误'}}
									</view>
								</view>
							</view>
							<textarea v-if="item.type==4" class="short_answer_questions" v-model="item.myAnswer"
								placeholder="请输入答案..." maxlength="-1" />
						</view>
		
						<view class="analysis" v-if="item.isAnswered&&item.type!=4">
							<view class="analysis_answer">
								<view class="correct_answer">
									<view class="correct_answer_title">
										正确答案
									</view>
									<view class="correct_answer_num" style="color:#0E8AFD;">
										{{item.rightkey}}
									</view>
								</view>
								<view class="my_answer">
									<view class="correct_answer_title">
										我的答案
									</view>
									<view class="correct_answer_num" style="color:#E50000">
										{{item.myAnswer}}
									</view>
								</view>
							</view>
							<view class="analysis_detail">
								<view class="analysis_title">
									解析：
								</view>
								<view class="analysis_text" v-html="item.analysis">
		
								</view>
							</view>
						</view>
						<view class="short_analysis" v-if="item.type==4">
							<view class="short_analysis_btn" @click="shortShow(item,index)">
								解析
							</view>
							<view class="short_analysis_text" v-if="item.isAnswered">
								<view class="short_analysis_title">
									答案解析
								</view>
								<view class="short_analysis_detail" ref="htmlText" v-html="item.analysis"></view>
								
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		
			<view class="page_bottom">
				<view class="subject_change">
					<view class="last_subject" @click="lastQue">
						上一题
					</view>
					<view class="next_subject" @click="nextQue">
						下一题
					</view>
				</view>
				<view class="bottom_btnbox">
					<view class="btnbox_left">
						<view class="collect btnbox_left_item" @click="collectChange">
							<image src="../../static/collect_icon_one.png" mode="" v-if="!collect"></image>
							<image src="../../static/collecr_icon_two.png" mode="" v-if="collect"></image>
							<view class="collect_text">
								收藏
							</view>
						</view>
						<view class="answer_card btnbox_left_item" @click="cardShow">
							<image src="../../static/answerCard.png" mode=""></image>
							<view class="answer_card_text">
								答题卡
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="dialogshow" :content="content" :show-title="false"></u-modal>
		<u-popup @close="close" v-model="show" mode="bottom" border-radius="14" height="60%">
			<view class="hide_answercard">
				<view class="hide_answercard_title">
					答题卡
					<!-- <view class="clear_answer">
						<view class="clear_answer_text">
							清空重做
						</view>
						<image src="../../static/del2.png" mode=""></image>
					</view> -->
				</view>
				<view class="hide_question">
					<view class="hide_exam_type" v-for="(item,i) in examNumData" :key="i">
						<view class="hide_exam_type_title">
							{{item.text}}
						</view>
						<view class="hide_exam_content">
							<view class="hide_exam_content_item" v-for="(item2,i2) in item.data" :key="i2" @tap="toAnswerIndex(item2.num)">
								<view :class="['hide_exam_content_num',Changestate(item2.state)]">
									{{item2.num}}
								</view>
							</view>
						</view>
						<view style="height: 60px;" v-if="(i+1)==examNumData.length"></view>
						<view class="hide_exam_tips" v-if="(i+1)==examNumData.length">
							
							<!-- <view class="hide_exam_tips_item">
								<view class="current_tip">
		
								</view>
								<view class="current_tip_text">
									当前
								</view>
							</view> -->
							<view class="hide_exam_tips_item">
								<view class="error_tip">
		
								</view>
								<view class="error_tip_text">
									错误
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 滑动后的x坐标
				lastX: 0,
				//滑动过程中翻页函数只能执行一次
				isOne: true,
				//当前为第几题标识
				exampagenum: 0,
				// 答题卡是否显示
				show: false,
				// 屏幕高度
				screenheight: '',
				//交卷对话框是否显示
				dialogshow: false,
				//交卷提示词
				content: '题目未完成,是否确认交卷？',
				// 导航栏背景色
				top_bgCl: {
					background: "#0E8AFD",
				},
				//是否显示解析
				analysisshow: true,
				// 收藏功能状态
				collect: false,
				// 答案选项数据
				answerData: [],
				//答题卡数据
				examNumData: []
			}
		},
		mounted() {
			this.screenheight = uni.getSystemInfoSync().windowHeight;

		},
		onLoad() {
			this.answerData=[];
			this.initInfo();
		},
		methods: {
			initInfo(){
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 2]; //
				let answerList=nowPage.options.answerData;
				//this.examNumData=nowPage.options.examNumData;
				
				for (var i = 0; i < answerList.length; i++) {
					console.log(i+">>>>>>>>>>",answerList[i].isCorrect);
					if(answerList[i].isCorrect==2){
						this.answerData.push(answerList[i]);
					}
				}
				
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
							state: 4
						};
						radioData.push(obj);
					}
					if (this.answerData[r].type == 2) {
						let state = this.answerIsCorrect(this.answerData[r]);
						let obj = {
							num: (r + 1),
							state: 4
						};
						checkboxData.push(obj);
					}
					if (this.answerData[r].type == 3) {
						let state = this.answerIsCorrect(this.answerData[r]);
						let obj = {
							num: (r + 1),
							state: 4
						};
						judgeData.push(obj);
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
			},
			toAnswerIndex:function(index){
				
				this.exampagenum=(index-1);
				this.show=false;
			},
			answerIsCorrect:function(answerObj){
				console.log("answerObj>>>>>>",answerObj.isCorrect);
				if(answerObj.isCorrect==1){
					return 3;
				}else if(answerObj.isCorrect==2){
					return 4;
				}
				
			},
			showTitleHtml(index, item) {
				let typeText = "：";
				if (item.type == 1) {
					typeText = "：（单选题）";
				} else if (item.type == 2) {
					typeText = "：（多选题）";
				} else if (item.type == 3) {
					typeText = "：（判断题）";
				} else if (item.type == 4) {
					typeText = "：（简答题）";
				}
				return '<p style="float: left;">' + index + typeText + '</p>' + item.title;
			},
			//题目轮播切换
			changeQues(event) {
				console.log(event.detail)
				this.exampagenum = event.detail.current;
			},

			//上一题
			lastQue() {
				if (this.exampagenum > 0) {
					this.exampagenum--
				}
				this.isOne = false
			},
			//下一题
			nextQue() {
				console.log(111)
				if (this.exampagenum < this.answerData.length - 1) {
					this.exampagenum++
				}
				this.isOne = false
			},
			// 答题卡控制选项样式
			Changestate(state) {
				if (state == 0) {
					return 'not_done'
				} else if (state == 1) {
					return 'done'
				} else if (state == 2) {
					return 'current'
				} else if (state == 3) {
					return 'correct'
				} else if (state == 4) {
					return 'error'
				}
			},
			//交卷对话框显示
			dialogChangeshow() {
				this.dialogshow = true
			},
			// 关闭答题卡
			close() {
				this.show = false
			},
			//答题卡显示
			cardShow() {
				this.show = !this.show
				console.log(this.show)
			},
			//收藏功能
			collectChange() {
				this.collect = !this.collect
			},
			// 答案选项初始样式
			changeAnswer(state) {
				if (state == 0) {
					return 'answer_options'
				} else if (state == 1) {
					return 'answer_options_active'
				} else if (state == 2) {
					return 'answer_options_error'
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #0E8AFD;
	}

	.hide_answercard {
		.hide_answercard_title {
			width: 100%;
			text-align: center;
			font-weight: bold;
			position: fixed;
			z-index: 999;
			top: 0;
			background: #FFFFFF;
			padding: 40rpx 0 20rpx 0;
			.clear_answer {
				display: flex;
				position: absolute;
				top: 40rpx;
				right: 20rpx;
				// border: 1px solid;
				font-weight: normal;
				color: #acacac;
				font-size: 24rpx;

				.clear_answer_text {
					padding-right: 10rpx;
				}

				image {
					width: 30rpx;
					height: 32rpx;
				}
			}
		}
    .hide_question{
			 margin-top: 100rpx;
			 .hide_exam_type {
			 	margin-top: 20rpx;
			 	.hide_exam_type_title {
			 		padding-left: 20rpx;
			 	}
			 
			 	.hide_exam_content {
			 		padding: 0rpx 0rpx 60rpx 0rpx;
			 		display: flex;
			 		// border: 1px solid;
			 		justify-content: flex-start;
			 		flex-wrap: wrap;
			 
			 		.hide_exam_content_item {
			 			width: 20%;
			 			// border: 1px solid;
			 			text-align: center;
			 			display: flex;
			 			justify-content: center;
			 			margin-top: 40rpx;
			 
			 			.hide_exam_content_num {
			 				width: 78rpx;
			 				height: 78rpx;
			 				border-radius: 10rpx;
			 				display: flex;
			 				align-items: center;
			 				justify-content: center;
			 			}
			 
			 			.not_done {
			 				background: #F4F4F4;
			 				border: 1rpx solid #F4F4F4;
			 			}
			 
			 			.done {
			 				background: #FFFFFF;
			 				border: 1rpx solid #0E8AFD;
			 				color: #0E8AFD;
			 			}
			 
			 			.current {
			 				border: 1rpx solid #0E8AFD;
			 				background: #0E8AFD;
			 				color: #FFFFFF;
			 			}
			 
			 			.correct {
			 				background: #FFFFFF;
			 				border: 1rpx solid #10C600;
			 				color: #10C600;
			 			}
			 
			 			.error {
			 				background: #FFFFFF;
			 				border: 1rpx solid #E50000;
			 				color: #E50000;
			 			}
			 		}
			 	}
			 

			 }
			 .hide_exam_tips {
			 	width: 100%;
			 	display: flex;
			 	justify-content: space-around;
			 	//padding: 0 40rpx 20rpx 40rpx;
				padding: 20rpx 40rpx 60rpx 40rpx;
				position: fixed;
				bottom: 0;
				z-index: 999;
				background: #FFFFFF;
			 			 
			 	.hide_exam_tips_item {
			 		display: flex;
			 		font-size: 24rpx;
			 		align-items: center;
			 			 
			 		.not_done_tip {
			 			width: 24rpx;
			 			height: 24rpx;
			 			background: #F4F4F4;
			 			border-radius: 50%;
			 		}
			 			 
			 		.not_done_tip_text {
			 			padding-left: 10rpx;
			 		}
			 			 
			 		.done_tip {
			 			width: 23rpx;
			 			height: 23rpx;
			 			background: #FFFFFF;
			 			border-radius: 50%;
			 			border: 1rpx solid #0E8AFD;
			 		}
			 			 
			 		.done_tip_text {
			 			padding-left: 10rpx;
			 			color: #0E8AFD;
			 		}
			 			 
			 		.current_tip {
			 			width: 24rpx;
			 			height: 24rpx;
			 			background: #0E8AFD;
			 			border-radius: 50%;
			 		}
			 			 
			 		.current_tip_text {
			 			padding-left: 10rpx;
			 			color: #0E8AFD;
			 		}
			 			 
			 		.correct_tip {
			 			width: 23rpx;
			 			height: 23rpx;
			 			background: #FFFFFF;
			 			border-radius: 50%;
			 			border: 1rpx solid #10C600;
			 		}
			 			 
			 		.correct_tip_text {
			 			padding-left: 10rpx;
			 			color: #10C600;
			 		}
			 			 
			 		.error_tip {
			 			width: 23rpx;
			 			height: 23rpx;
			 			background: #FFFFFF;
			 			border-radius: 50%;
			 			border: 1rpx solid #E50000;
			 		}
			 			 
			 		.error_tip_text {
			 			padding-left: 10rpx;
			 			color: #E50000;
			 		}
			 	}
			 			 
			 }
		 }

	}

	.page_big {
		width: 100%;
		padding: 20rpx 30rpx 20rpx 30rpx;

		.exam_progress {
			padding-left: 10rpx;
			display: flex;

			.slider {
				width: 100%;
				display: flex;
				flex-direction: column;
				justify-content: center;
			}

			.subject_num {
				color: #FFFFFF;
				padding-left: 10rpx;
				white-space: nowrap;
			}
		}

		.page_content {
			width: 100%;
			height: 88%;
			background: #FFFFFF;
			border-radius: 20rpx;
			box-shadow: 0rpx 5rpx 20rpx 1rpx rgba(0, 0, 0, 0.1);
			margin-top: 20rpx;
			padding: 40rpx 0rpx 0rpx 0rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.subject_title {
				padding: 0 30rpx 0 30rpx;
				word-break: break-all;
			}

			.answer {
				width: 100%;
				margin-top: 60rpx;
				// border: 1rpx solid;
				padding: 0 30rpx 0 30rpx;

				.answer_options {
					width: 100%;
					padding: 10rpx 20rpx 10rpx 20rpx;
					background: #F0F5FB;
					border: 4rpx solid #F0F5FB;
					margin-top: 30rpx;
					display: flex;

					.answer_detail {
						padding-left: 20rpx;
						word-break: break-all;
					}
				}

				.answer_options_active {
					width: 100%;
					padding: 10rpx 20rpx 10rpx 20rpx;
					background: #FFFFFF;
					border: 4rpx solid #0E8AFD;
					margin-top: 30rpx;
					display: flex;

					.answer_detail {
						padding-left: 20rpx;
						word-break: break-all;
					}
				}
				.answer_options_error {
					width: 100%;
					padding: 10rpx 20rpx 10rpx 20rpx;
					background: #FFFFFF;
					border: 4rpx solid #eb0003;
					margin-top: 30rpx;
					display: flex;
				
					.answer_detail {
						padding-left: 20rpx;
						word-break: break-all;
					}
				}

				.short_answer_questions {
					width: 100%;
					padding: 20rpx 20rpx 20rpx 20rpx;
					border: 1rpx solid #BBBBBB;
					color: #BBBBBB;
					box-sizing: border-box;
					border-radius: 20rpx;
					font-size: 28rpx;
				}
			}

			.analysis {
				padding: 0 30rpx 0 30rpx;

				.analysis_answer {
					display: flex;
					margin-top: 30rpx;
					// border: 1px solid;
					justify-content: space-around;

					.correct_answer_title {
						font-size: 32rpx;
					}

					.correct_answer_num {
						font-size: 32rpx;
						font-weight: bold;
						text-align: center;
						padding-top: 30rpx;
					}
				}

				.analysis_detail {
					margin-top: 20rpx;

					.analysis_title {
						font-size: 32rpx;
					}

					.analysis_text {
						font-size: 28rpx;
						margin-top: 10rpx;
						word-break: break-all;
					}
				}
			}

			.short_analysis {
				// border: 1rpx solid;
				padding: 20rpx 30rpx 0 30rpx;
				width: 100%;
				// height: 200rpx;
				display: flex;
				flex-direction: column;
				align-items: flex-end;

				.short_analysis_btn {
					// border: 1rpx solid;
					color: #E50000;
				}

				.short_analysis_text {
					width: 100%;
					margin-top: 20rpx;

					.short_analysis_detail {
						margin-top: 20rpx;
						word-break: break-all;
					}
				}
			}

			.page_bottom {
				width: 100%;

				// border: 1px solid;
				.subject_change {
					display: flex;
					justify-content: flex-end;
					padding-right: 30rpx;
					color: #878887;
					padding-bottom: 20rpx;

					.next_subject {
						padding-left: 60rpx;
					}
				}

				.bottom_btnbox {
					display: flex;
					width: 100%;

					.btnbox_left {
						width: 75%;
						border-top: 1rpx dashed #0E8AFD;
						display: flex;
						justify-content: space-around;
						padding: 30rpx 0 30rpx 0;

						.btnbox_left_item {
							text-align: center;
							color: #BBBBBB;

							image {
								width: 40rpx;
								height: 40rpx;
							}
						}
					}

					.btnbox_right {
						width: 25%;
						display: flex;
						align-items: center;
						padding-right: 20rpx;
						padding-left: 10rpx;

						.success_exam {
							width: 100%;
							text-align: center;
							background: #0E8AFD;
							color: #FFFFFF;
							border-radius: 10rpx;
							padding: 10rpx 0 10rpx 0;
						}
					}
				}
			}
		}
	}
</style>
