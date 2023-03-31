<!-- 考试错题 -->
<template>
	<view class="page_big" :style="{ height: screenheight + 'px' }">
		<u-navbar
			title="错题集"
			safeAreaInsetTop
			fixed
			placeholder
			:autoBack="true"
			:background="top_bgCl"
			titleColor="#ffffff"
			:borderBottom="false"
			backIconColor="#ffffff"
			titleBold
		></u-navbar>
		<view class="exam_progress">
			<view class="slider"><u-slider height="12" inactiveColor="#75BDF8" activeColor="#fff" disabled :value="((exampagenum + 1) / answerData.length) * 100"></u-slider></view>
			<view class="subject_num">
				<text>第{{ exampagenum + 1 }}题</text>
				<text>/{{ answerData.length }}题</text>
			</view>
		</view>
		<view class="page_content">
			<swiper style="height: 80%;" :indicator-dots="false" :circular="false" :autoplay="false" interval="5000" duration="500" @change="changeQues" :current="exampagenum">
				<swiper-item v-for="(item, index) in answerData" :key="index">
					<view class="" style="height: 100%; overflow: scroll;">
						<view class="subject_title" v-html="showTitleHtml(index + 1, item)"><!-- {{item.quenum}}.{{item.title}} --></view>
						<view class="answer">
							<view class="" v-if="true">
								<view :class="[changeAnswer(item2.state)]" v-for="(item2, i2) in item.data" :key="i2">
									<view class="order">{{ item2.order }}.</view>
									<view class="answer_detail">{{ item2.detail }}</view>
								</view>
							</view>
							<textarea v-else class="short_answer_questions" value="" placeholder="请输入答案..." maxlength="-1" />
						</view>
						<view class="analysis" v-if="analysisshow">
							<view class="analysis_answer">
								<view class="correct_answer">
									<view class="correct_answer_title">正确答案</view>
									<view class="correct_answer_num" style="color:#0E8AFD;">{{ item.rightkey }}</view>
								</view>
								<view class="my_answer">
									<view class="correct_answer_title">我的答案</view>
									<view class="correct_answer_num" :style="item.myAnswer == item.rightkey ? 'color:#0E8AFD;' : 'color:#E50000;'">{{ item.myAnswer }}</view>
								</view>
							</view>
							<view class="analysis_detail">
								<view class="analysis_title">解析：</view>
								<view class="analysis_text" v-html="item.analysis"></view>
							</view>
						</view>
						<!-- <view class="short_analysis" v-if="false">
							<view class="short_analysis_btn">解析</view>
							<view class="short_analysis_text">
								<view class="short_analysis_title">答案解析</view>
								<view class="short_analysis_detail">答案解析asddddddddddddddddddddddadsssssssssssssssssssssdasssssssssssssssssssss</view>
							</view>
						</view> -->
					</view>
				</swiper-item>
			</swiper>
			<view class="page_bottom">
				<view class="subject_change">
					<view class="last_subject" @click="lastQue">上一题</view>
					<view class="next_subject" @click="nextQue">下一题</view>
				</view>
				<view class="bottom_btnbox">
					<view class="btnbox_left">
						<view class="collect btnbox_left_item" @click="collectChange">
							<image src="../../static/collect_icon_one.png" mode="" v-if="!collect"></image>
							<image src="../../static/collecr_icon_two.png" mode="" v-if="collect"></image>
							<view class="collect_text">收藏</view>
						</view>
						<!-- 						<view class="time btnbox_left_item">
							<image src="../../static/countDown.png" mode=""></image>
							<view class="time_text">
								02:24:34
							</view>
						</view> -->
						<view class="answer_card btnbox_left_item" @click="cardShow">
							<image src="../../static/answerCard.png" mode=""></image>
							<view class="answer_card_text">答题卡</view>
						</view>
					</view>
					<!-- 					<view class="btnbox_right">
						<view class="success_exam" @click="dialogChangeshow">
							交卷
						</view>
					</view> -->
				</view>
			</view>
		</view>
		<u-modal v-model="dialogshow" :content="content" :show-title="false"></u-modal>
		<u-popup @close="close" v-model="show" mode="bottom" border-radius="14">
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
				<view class="hide_exam_type">
					<!-- 					<view class="hide_exam_type_title">
						一、 单选选择题
					</view> -->
					<view class="hide_exam_content">
						<view class="hide_exam_content_item" v-for="(item, i) in examNumData" :key="i" @tap="toAnswerIndex(item.num)" >
							<view :class="['hide_exam_content_num', Changestate(item.state)]">{{ item.num }}</view>
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
				background: '#0E8AFD'
			},
			//是否显示解析
			analysisshow: true,
			// 收藏功能状态
			collect: false,
			// 答案选项数据
			answerData: [],
			//答题卡数据
			examNumData: [],
			//用户id
			userId: uni.getStorageSync('userId'),
			//题库id
			questionbankId: uni.getStorageSync('questionbankId')
		};
	},
	mounted() {
		this.screenheight = uni.getSystemInfoSync().windowHeight;
	},
	onLoad() {
		let pages = getCurrentPages();
		let nowPage = pages[pages.length - 2];
		this.answerData = nowPage.options.errorData;
		this.examNumData = nowPage.options.errorData;
		for (var i = 0; i < this.examNumData.length; i++) {
			this.examNumData[i].state = 4;
			this.examNumData[i].num = i + 1;
		}
	},
	methods: {
		//题目轮播切换
		changeQues(event) {
			console.log(event.detail);
			this.exampagenum = event.detail.current;
		},

		//上一题
		lastQue() {
			if (this.exampagenum > 0) {
				this.exampagenum--;
			}
			this.isOne = false;
			if (this.answerData[this.exampagenum].isCollect > 0) {
				this.collect = true;
			} else {
				this.collect = false;
			}
		},
		//下一题
		nextQue() {
			console.log(111);
			if (this.exampagenum < this.answerData.length - 1) {
				this.exampagenum++;
			}
			this.isOne = false;
			if (this.answerData[this.exampagenum].isCollect > 0) {
				this.collect = true;
			} else {
				this.collect = false;
			}
		},
		// 答题卡控制选项样式
		Changestate(state) {
			if (state == 0) {
				return 'not_done';
			} else if (state == 1) {
				return 'done';
			} else if (state == 2) {
				return 'current';
			} else if (state == 3) {
				return 'correct';
			} else if (state == 4) {
				return 'error';
			}
		},
		//交卷对话框显示
		dialogChangeshow() {
			this.dialogshow = true;
		},
		// 关闭答题卡
		close() {
			this.show = false;
		},
		//答题卡显示
		cardShow() {
			this.show = !this.show;
		},
		//收藏功能
		collectChange() {
			// this.collect = !this.collect;
			let answerObj = this.answerData[this.exampagenum];
			uni.showLoading({
				title: '加载中....'
			});
			this.$Request
				.post('mainPath/appWebQuestion/favorites/insetFavorites', {
					questionId: answerObj.id,
					userId: this.userId,
					questionType: answerObj.type,
					questionTitle: answerObj.title,
					questionbankId: this.questionbankId
				})
				.then(res => {
					uni.hideLoading();
					if (res.success) {
						this.collect = !this.collect;
						if (this.collect) {
							this.answerData[this.exampagenum].isCollect = 1;
						} else {
							this.answerData[this.exampagenum].isCollect = 0;
						}
					}
				})
				.catch(err => {
					uni.hideLoading();
					uni.showToast({
						title: '网络繁忙!',
						icon: 'error'
					});
				});
		},
		// 答案选项初始样式
		changeAnswer(state) {
			if (state == 0) {
				return 'answer_options';
			} else if (state == 1) {
				return 'answer_options_active';
			} else if (state == 2) {
				return 'answer_options_error';
			}
		},
		showTitleHtml(index, item) {
			// return '<p style="float: left;">' + index + '：</p >' + value;

			let typeText = '：';
			if (item.type == 1) {
				typeText = '：（单选题）';
			} else if (item.type == 2) {
				typeText = '：（多选题）';
			} else if (item.type == 3) {
				typeText = '：（判断题）';
			} else if (item.type == 4) {
				typeText = '：（简答题）';
			}
			return '<p style="float: left;">' + index + typeText + '</p>' + item.title;
		},
		toAnswerIndex: function(index) {
			let answerObj = this.answerData[this.exampagenum];
			this.exampagenum = index - 1;
			if (this.answerData[this.exampagenum].isCollect > 0) {
				this.collect = true;
			} else {
				this.collect = false;
			}
			this.show = false;
		},
	}
};
</script>

<style lang="scss">
page {
	background: #0e8afd;
}

.hide_answercard {
	padding: 40rpx 0rpx 0rpx 0rpx;

	.hide_answercard_title {
		width: 100%;
		text-align: center;
		font-weight: bold;
		// border: 1px solid;
		position: relative;

		.clear_answer {
			display: flex;
			position: absolute;
			top: 0;
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
					background: #f4f4f4;
					border: 1rpx solid #f4f4f4;
				}

				.done {
					background: #ffffff;
					border: 1rpx solid #0e8afd;
					color: #0e8afd;
				}

				.current {
					border: 1rpx solid #0e8afd;
					background: #0e8afd;
					color: #ffffff;
				}

				.correct {
					background: #ffffff;
					border: 1rpx solid #10c600;
					color: #10c600;
				}

				.error {
					background: #ffffff;
					border: 1rpx solid #e50000;
					color: #e50000;
				}
			}
		}

		.hide_exam_tips {
			width: 100%;
			// border: 1px solid;
			display: flex;
			justify-content: space-around;
			padding: 0 40rpx 20rpx 40rpx;

			.hide_exam_tips_item {
				display: flex;
				font-size: 24rpx;
				align-items: center;

				.not_done_tip {
					width: 24rpx;
					height: 24rpx;
					background: #f4f4f4;
					border-radius: 50%;
				}

				.not_done_tip_text {
					padding-left: 10rpx;
				}

				.done_tip {
					width: 23rpx;
					height: 23rpx;
					background: #ffffff;
					border-radius: 50%;
					border: 1rpx solid #0e8afd;
				}

				.done_tip_text {
					padding-left: 10rpx;
					color: #0e8afd;
				}

				.current_tip {
					width: 24rpx;
					height: 24rpx;
					background: #0e8afd;
					border-radius: 50%;
				}

				.current_tip_text {
					padding-left: 10rpx;
					color: #0e8afd;
				}

				.correct_tip {
					width: 23rpx;
					height: 23rpx;
					background: #ffffff;
					border-radius: 50%;
					border: 1rpx solid #10c600;
				}

				.correct_tip_text {
					padding-left: 10rpx;
					color: #10c600;
				}

				.error_tip {
					width: 23rpx;
					height: 23rpx;
					background: #ffffff;
					border-radius: 50%;
					border: 1rpx solid #e50000;
				}

				.error_tip_text {
					padding-left: 10rpx;
					color: #e50000;
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
			color: #ffffff;
			padding-left: 10rpx;
			white-space: nowrap;
		}
	}

	.page_content {
		width: 100%;
		height: 88%;
		background: #ffffff;
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
				background: #f0f5fb;
				border: 4rpx solid #f0f5fb;
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
				background: #ffffff;
				border: 4rpx solid #0e8afd;
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
				background: #ffffff;
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
				border: 1rpx solid #bbbbbb;
				color: #bbbbbb;
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
				color: #e50000;
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
					border-top: 1rpx dashed #0e8afd;
					display: flex;
					justify-content: flex-start;
					padding: 30rpx 0 30rpx 0;

					.btnbox_left_item {
						text-align: center;
						color: #bbbbbb;
						margin-left: 40rpx;
						margin-right: 40rpx;

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
						background: #0e8afd;
						color: #ffffff;
						border-radius: 10rpx;
						padding: 10rpx 0 10rpx 0;
					}
				}
			}
		}
	}
}
</style>
