<template>
	<view class="big" :style="{height:b_height-280+'px'}">
		<view class="hide_answercard">
			<!-- 			<view class="hide_answercard_title">
				答题卡
				<view class="clear_answer">
					<view class="clear_answer_text">
						清空重做
					</view>
					<image src="../../static/del2.png" mode=""></image>
				</view>
			</view> -->
			<view class="hide_exam_type" v-for="(item,i) in examNumData" :key="i">
				<view class="hide_exam_type_title">
					{{item.text}}
				</view>
				<view class="hide_exam_content">

					<view class="hide_exam_content_item" v-for="(item2,i2) in item.data" :key="i2" @click="runReview(item2.num)">
						<view :class="['hide_exam_content_num',Changestate(item2.state)]">
							{{item2.num}}
						</view>
					</view>
					<!-- 						<view class="hide_exam_content_item">
									<view class="hide_exam_content_num done">
										2
									</view>
								</view>
								<view class="hide_exam_content_item">
									<view class="hide_exam_content_num correct">
										3
									</view>
								</view>
								<view class="hide_exam_content_item">
									<view class="hide_exam_content_num current">
										4
									</view>
								</view>
								<view class="hide_exam_content_item">
									<view class="hide_exam_content_num error">
										5
									</view>
								</view>
								<view class="hide_exam_content_item">
									<view class="hide_exam_content_num not_done">
										6
									</view>
								</view>
								<view class="hide_exam_content_item">
									<view class="hide_exam_content_num not_done">
										7
									</view>
								</view> -->
				</view>

			</view>
			<view class="hide_exam_tips">
				<view class="hide_exam_tips_item">
					<view class="not_done_tip">

					</view>
					<view class="not_done_tip_text">
						未做
					</view>
				</view>
				<view class="hide_exam_tips_item">
					<view class="done_tip">

					</view>
					<view class="done_tip_text">
						已做
					</view>
				</view>
				<!-- 				<view class="hide_exam_tips_item">
					<view class="current_tip">
			
					</view>
					<view class="current_tip_text">
						当前
					</view>
				</view> -->
				<view class="hide_exam_tips_item" v-if="analysisshow">
					<view class="correct_tip">

					</view>
					<view class="correct_tip_text">
						正确
					</view>
				</view>
				<view class="hide_exam_tips_item" v-if="analysisshow">
					<view class="error_tip">

					</view>
					<view class="error_tip_text">
						错误
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "answersheet",
		props: {
			//父组件传来的答题卡数据
			examNumData: {
				type: Array
			},
			analysisshow: {
				type: Boolean
			},
			result: {
				type: Boolean
			},
			b_height: {
				type: Number,
				default:0
			},
			goReview:{
				type:Function,
				default:null
			}
		},
		data() {
			return {

			};
		},
		onLoad() {
			console.log(this.b_height)
		},
		methods: {
			//答题卡样式类型
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
			runReview(indexs){
				if (typeof this.goReview === 'function') {
					// 在微信，支付宝等环境(H5正常)，会导致父组件定义的customBack()函数体中的this变成子组件的this
					// 通过bind()方法，绑定父组件的this，让this.customBack()的this为父组件的上下文
					this.goReview.bind(this.$u.$parent.call(this))(indexs);
				}
			}
		}
	}
</script>

<style lang="scss">
	.big {
		background: #FFFFFF;
		border-radius: 20rpx;
		margin-top: 20rpx;
		box-shadow: 0rpx 0rpx 10rpx 2rpx rgba(0, 0, 0, .2);
		overflow: scroll;
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
			margin-top: 10rpx;

			.hide_exam_type_title {
				padding-left: 20rpx;
			}

			.hide_exam_content {
				padding: 0rpx 0rpx 30rpx 0rpx;
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
			// border: 1px solid;
			display: flex;
			justify-content: space-around;
			padding: 20rpx 40rpx 20rpx 40rpx;
			position: sticky;
			z-index: 999;
			bottom: 0;
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
</style>
