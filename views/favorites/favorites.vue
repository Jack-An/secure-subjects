<!-- 收藏夹 -->
<template>
	<view class="page_big">
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userId:uni.getStorageSync('userId'),
				top_bgCl: {
					background: "#F5F7F6"
				},
				favoritesData: [],
				questionTitle:'',
				questionbankId:'',
				dialogshow: false,
				content:'是否全部清空收藏？',
			};
		},
		filters:{
			getType(n){
				switch(n){
					case 1:
						return '【单项选择题】';
					case 2:
						return '【多项选择题】';
					case 3:
						return '【判断题】';
					case 4:
						return '【简答题】';
					default:
						return "";
					
				}
			}
		},
		mounted() {

		},
		onLoad(option) {
			this.questionTitle="";
			if (option.questionbankId) {
				this.questionbankId=option.questionbankId;
				this.initInfo();
			} else {
				uni.showToast({
					title: '数据加载失败！',
					icon: 'error'
				})
				setTimeout(() => {
					uni.navigateBack({})
				}, 800);
			}
			
		},
		methods: {
			initInfo(){
				
			},
			search(value){
				console.log(value);
				this.questionTitle=value;
				this.initInfo();
			},
			clear(){
				console.log('??');
				this.questionTitle="";
				this.initInfo();
			},
			runRev(index) {
				
			},
			delAllQuestion:function(){
				if(this.favoritesData.length>0){
					uni.showModal({
						title:this.content,
						success: (res) => {
							if(res.confirm){//确定
								this.runRes();
							}
						}
					})
				}
				
			},
			runRes() {
				
			},
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

		// padding: 0 20rpx 20rpx 20rpx;
		.search {
			width: 100%;
			position: fixed;
			z-index: 999;
			// top: 84rpx;
			background: #F5F7F6;
			padding: 20rpx 20rpx 20rpx 20rpx;
		}

		.del {
			width: 30rpx;
			height: 34rpx;
			margin-right: 20rpx;
		}

		.page_content {
			width: 100%;
			height: 100%;
			padding: 0 20rpx 0 20rpx;
			margin-top: 120rpx;

			.favorites_detail {
				width: 100%;
				background: white;
				border-radius: 20rpx;
				box-shadow: 0px 0px 20rpx 1rpx rgba(0, 0, 0, 0.1);
				padding: 20rpx 20rpx 20rpx 20rpx;
				margin-top: 20rpx;

				.detail_top {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.detail_title{
						font-weight: bold;
					}
					.detail_time {
						font-size: 20rpx;
						color: #b0b1b0;
					}
				}

				.detail_middle {
					margin-top: 30rpx;

					.detail_question {
						font-size: 26rpx;
					}
				}

				.detail_bottom {
					margin-top: 30rpx;
					display: flex;
					font-size: 26rpx;
					color: #b0b1b0;

					.detail_lose {
						.lose_num {
							color: red;
							padding-left: 10rpx;
						}
					}

					.detail_sum {
						margin-left: 20rpx;

						.sum_num {
							padding-left: 10rpx;
						}
					}
					.detail_time {
						justify-content: space-between;
						float: right;
					}
				}
			}
		}
	}
</style>
