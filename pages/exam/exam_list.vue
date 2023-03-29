<!-- 考试列表页 -->
<template>
	<view class="page_big" :style="{height:screenheight+'px'}">
		<u-navbar title="考卷列表" safeAreaInsetTop fixed placeholder :autoBack="true" :background="top_bgCl"
			titleColor="#333333" :borderBottom="false" backIconColor="#333333" titleBold>
		</u-navbar>
		<view class="page_content">
			<view class="exam_detail" v-for="(item,i) in examList" :key="i">
				<view class="detail_left">
					<image :src="img" mode=""></image>
				</view>
				<view class="detail_right">
					<view class="exam_title">
						{{item.testpaperName}}
					</view>
					<view class="pattern">
						共<text>{{item.questionSum}}</text>道题
					</view>
					<view class="exam_btn">
						<view class="start_exam" v-if="!item.exam" @click="runExam(item)">
							开始考试
						</view>
						<view class="analysis" v-if="item.exam" @click="runExamReview(item)">
							解析
						</view>
						<view class="retest" v-if="item.exam" @click="runExam(item)">
							重考
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
				//当前屏幕高度
				screenheight: '',
				//导航栏背景色
				top_bgCl: {
					background: "#F5F7F6"
				},
				img:"../../static/exam_bg.png",
				//题目列表数据
				examList:[{
					'testpaperName':"我是试卷一哦",
					'questionSum':10,
					'exam':1
				},{
					'testpaperName':"我是试卷二哦",
					'questionSum':15,
				}],
			}			
		},
		mounted() {
			this.screenheight = uni.getSystemInfoSync().windowHeight
		},
		onLoad(option) {
			
			this.init();
		},
		methods: {
			//调转考试加载页
			runExam(item){
				uni.navigateTo({
					url:'/pages/exam/exam_loading'
				})
			},
			runExamReview(item){
				uni.navigateTo({
					url:'/pages/result/exam_review'
				})
			},
			init: function(questionbankId,userid){
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #F5F7F6;
	}

	.page_big {
		width: 100%;
		background: #F5F7F6;
		padding: 0 20rpx 20rpx 20rpx;
		.page_content{
			width: 100%;
			height: 100%;
			.exam_detail{
				width: 100%;
				background: white;
				border-radius: 20rpx;
				box-shadow: 0px 0px 20rpx 1rpx rgba(0, 0, 0, 0.1);
				padding: 20rpx 20rpx 20rpx 20rpx;
				margin-top: 20rpx;
				display: flex;
				.detail_left{
					image{
						width: 200rpx;
						height: 140rpx;
					}
				}
				.detail_right{
					padding-left: 20rpx;
					width: 100%;
					.exam_title{
						text-align: justify;
					}
					.pattern{
						font-size: 24rpx;
						color: #b0b1b0;
						margin-top: 15rpx;
					}
					.exam_btn{
						display: flex;
						font-size: 24rpx;
						justify-content: flex-end;
						.start_exam{
							border-radius: 10rpx;
							background: #1991F3;
							color: #fff;
							padding: 10rpx 15rpx 10rpx 15rpx;
						}
						.analysis{
							border-radius: 10rpx;
							background: white;
							border: 1px solid red;
							color: red;
							padding: 10rpx 20rpx 10rpx 20rpx;
							margin-right: 10rpx;
						}
						.retest{
							border-radius: 10rpx;
							background: white;
							border: 1px solid #1991F3;
							color: #1991F3;
							padding: 10rpx 20rpx 10rpx 20rpx;
						}
					}
				}
			}
		}
	}
</style>
