<template>
	<view class="page_big" :style="{ height: screenheight + 'px' }">
		<u-navbar
			title="专项练习"
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
		<questionlist :style="{ height: screenheight-navbarHeight-75 + 'px' }"
		:exampagenum="exampagenum" :answerData="answerData" :startTime="60" :isRemaining="false" 
		@changeQues="changeQues" @changeOptions="changeOptions" @collectChange="collectChange" 
		@runRes="runRes" class="question-content-wrapper"></questionlist>
		
	</view>
</template>

<script>
import questionlist from '../../components/question-list/question-list.vue';
import {SubjectLib} from "../../common/subject-lib";
export default {
	//声明组件   实例化组件
	components:{
		questionlist
	},
	data() {
		return {
			//练习类型
			type: 'exam',
			//倒计时开始时间
			startTime: 3600,
			//倒计时时间
			remaining: '',
			// 屏幕高度
			screenheight: '',
			// 导航栏背景色
			top_bgCl: {
				background: '#0E8AFD'
			},
			// 答案选项数据
			answerData: [],
			//答题卡数据
			examNumData: [],
			//当前为第几题标识
			exampagenum: 0,
		};
	},
	computed:{
		// 转换字符数值为真正的数值
		navbarHeight() {
			// #ifdef APP-PLUS || H5
			return this.height ? this.height : 44;
			// #endif
			// #ifdef MP
			// 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
			// 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
			// return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
			let height = uni.getSystemInfoSync().platform == 'ios' ? 44 : 48;
			return this.height ? this.height : height;
			// #endif
		}
	},
	mounted() {
		this.screenheight = uni.getSystemInfoSync().windowHeight;
    console.log(this.screenheight, this.navbarHeight);
		this.getTime();
	},
	onLoad(option) {
		this.initExam(option);
	},
	methods: {
		initExam(option) {
      let lib = new SubjectLib();
      lib.loadSubjectLib(option.type);
      let subjects = lib.lib;
      for(let i=0; i< subjects.length; i++){
        subjects[i].isCollect = 0;
        for(let j=0; j< subjects[i].options.length; j++) {
          subjects[i].options[j].status = 0;
        }
      }
      this.answerData = subjects;
      console.log("*****", );
      uni.request({
        url: "https://service-0pbcc59q-1254422925.gz.apigw.tencentcs.com/release/users",
        method: "GET",
        success: (res)=> {console.log(res)}
      })
      // this.answerData = [
      //   {
      //     id: 11,
      //     title: '1111',
      //     answer: 'A',
      //     type: 'single',
      //     options: [
      //       {
      //         key: 'A',
      //         option: '11111',
      //         status: 0,
      //       },
      //       {
      //         key: 'B',
      //         option: '11111',
      //         status: 0,
      //       },
      //                     {
      //         key: 'C',
      //         option: '11111',
      //                       status: 0,
      //       },
      //         {
      //         key: 'D',
      //         option: '11111',
      //           status: 0,
      //       }
      //     ]
      //   }
      // ]
      // for(let i=0; i< this.answerData.length; i++) {
      //   for(let j=0; j< this.answerData[i].options.length; j++){
      //     this.answerData[i].options[j].status = 0;
      //   }
      // }
			// this.answerData = [{
			// 	'id':100001,//主键
			// 	'title':"测试单选题哦1",//题目标题
			// 	'type':1,//题目类型( 1.单选题  2.多选题  3.判断题  4.简答题 )
			// 	'isCollect':1,//判断是否有收藏
			// 	'isAnswered':false,//是否作答
			// 	'rightkey':'A',//正确答案
			// 	'analysis':'我是题目的解析11111111111',//解析
			// 	'questionAnswerList':[{//选项列表
			// 		'id':110001,
			// 		'answerTitle':'A',//选项标题
			// 		'content':'content--->AAAAAAAA',//选项内容
			// 		'isCorrect':1,//是否是正确答案( 1是   2否 )
			// 		'status':0//选择状态
			// 	},
			// 	{
			// 		'id':110002,
			// 		'answerTitle':'B',
			// 		'content':'content--->BBBBBBBB',
			// 		'isCorrect':2,
			// 		'status':0
			// 	},
			// 	{
			// 		'id':110003,
			// 		'answerTitle':'C',
			// 		'content':'content--->CCCCCCC',
			// 		'isCorrect':2,
			// 		'status':0
			// 	},
			// 	{
			// 		'id':110004,
			// 		'answerTitle':'D',
			// 		'content':'content--->DDDDDDD',
			// 		'isCorrect':2,
			// 		'status':0
			// 	}]
			// },{
			// 	'id':100002,
			// 	'title':"测试多选题哦1",
			// 	'type':2,
			// 	'isCollect':0,//判断是否有收藏
			// 	'isAnswered':false,//是否作答
			// 	'rightkey':'A,B',
			// 	'analysis':'我是题目的解析11111111111',
			// 	'questionAnswerList':[{
			// 		'id':110001,
			// 		'answerTitle':'A',
			// 		'content':'content--->AAAAAAAA',
			// 		'isCorrect':1,
			// 		'status':0
			// 	},
			// 	{
			// 		'id':110002,
			// 		'answerTitle':'B',
			// 		'content':'content--->BBBBBBBB',
			// 		'isCorrect':1,
			// 		'status':0
			// 	},
			// 	{
			// 		'id':110003,
			// 		'answerTitle':'C',
			// 		'content':'content--->CCCCCCC',
			// 		'isCorrect':2,
			// 		'status':0
			// 	},
			// 	{
			// 		'id':110004,
			// 		'answerTitle':'D',
			// 		'content':'content--->DDDDDDD',
			// 		'isCorrect':2,
			// 		'status':0
			// 	}]
			// },{
			// 	'id':100003,
			// 	'title':"测试判断题哦2",
			// 	'type':3,
			// 	'isCollect':0,//判断是否有收藏
			// 	'isAnswered':false,//是否作答
			// 	'rightkey':'A',//判断的正确答案( A正确  B错误 )
			// 	'analysis':'我是题目的解析11111111111',
			// 	'questionAnswerList':[{
			// 		'id':110001,
			// 		'answerTitle':'A',
			// 		'isCorrect':1,
			// 		'status':0
			// 	},
			// 	{
			// 		'id':110001,
			// 		'answerTitle':'B',
			// 		'isCorrect':2,
			// 		'status':0
			// 	},]
			// },{
			// 	'id':100004,
			// 	'title':"简答题哦~",
			// 	'type':4,
			// 	'isCollect':0,//判断是否有收藏
			// 	'isAnswered':false,//是否作答
			// 	'analysis':'我是题目的解析11111111111',
			// }];
			
			//this.initExamNumData();
				
		},
		
		//获取考试时间
		getTime() {
			let that = this;
			setInterval(function() {
				that.countDown();
			}, 1000);
		},
		//倒计时
		countDown() {
			var dj = this.startTime;
			let that = this;
			that.remaining = that.djs(that.startTime);
			if (dj <= 0) {
				this.remaining = '已结束';
			} else {
				var ddf = this.djs(dj); //格式化过后的时间
				this.remaining = ddf;
				//当前时间减去时间
				dj = dj - 1;
				this.timeRange++;
				this.startTime = dj;
			}
		},

		//得到的秒换算成时分秒
		djs: function(ms) {
			var h = parseInt(ms / (60 * 60));
			var m = parseInt((ms % (60 * 60)) / 60);
			var s = (ms % (60 * 60)) % 60;
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			if (s < 10) {
				s = '0' + s;
			}
			return h + ':' + m + ':' + s;
		},
		getCurrentTime() {
			let yy = new Date().getFullYear();
			let mm = new Date().getMonth() + 1;
			let dd = new Date().getDate();
			let hh = new Date().getHours();
			let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
			let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
			return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
		},
		//题目轮播切换
		changeQues(event) {
			console.log("题目轮播切换>>>>>>>>>",event);
			this.exampagenum = event;
		},
		//题目选择
		changeOptions(event){
			console.log("题目选择>>>>>>>>>",event);
		},
		//点击收藏
		collectChange(event){
			console.log("点击收藏>>>>>>>>>",event);
			if(this.answerData[event.indexs].isCollect>0){
				this.answerData[event.indexs].isCollect=0;
			}else{
				this.answerData[event.indexs].isCollect=1;
			}
		},
		//交卷
		runRes(){
			uni.showModal({
				title:'是否交卷？',
				success: (res) => {
					if(res.confirm){
						console.log("我是交卷.....");
						uni.navigateTo({
							url:'../result/result'
						})
					}
				}
			})
		}
	}
};
</script>

<style lang="scss">
page {
	background: #0e8afd;
}

.hide_answercard {
	.hide_answercard_title {
		width: 100%;
		text-align: center;
		font-weight: bold;
		position: fixed;
		z-index: 999;
		top: 0;
		background: #ffffff;
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
	.hide_question {
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
			background: #ffffff;

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
					justify-content: space-around;
					padding: 30rpx 0 30rpx 0;

					.btnbox_left_item {
						text-align: center;
						color: #bbbbbb;

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
