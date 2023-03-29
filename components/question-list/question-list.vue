<template>
	<view>
		<view class="exam_progress">
			<view class="slider">
				<u-slider height="12" inactiveColor="#75BDF8" activeColor="#fff" disabled
					:value="((exampagenum + 1) / answerData.length) * 100"></u-slider>
			</view>
			<view class="subject_num">
				<text>第{{ exampagenum + 1 }}题</text>
				<text>/{{ answerData.length }}题</text>
			</view>
		</view>
		<view class="page_content">
			<swiper style="height: 80%;" :indicator-dots="false" :circular="false" :autoplay="false" interval="5000"
				duration="500" @change="changeQues" :current="exampagenum">
				<swiper-item v-for="(item, index) in answerData" :key="index">
					<view class="" style="height: 100%; overflow: scroll;">
						<view class="subject_title" v-html="showTitleHtml(index + 1, item)">
							<!-- {{index}}.{{item.title}} -->
						</view>
						<view class="answer">
							<view class="" v-if="item.type == 1">
								<view :class="[changeAnswer(item2.status)]"
									v-for="(item2, i2) in item.questionAnswerList" :key="i2" @click="changeOptions(i2)">
									<view class="order">{{ item2.answerTitle }}.</view>
									<view class="answer_detail" v-html="item2.content"></view>
								</view>
							</view>
							<view class="" v-if="item.type == 2">
								<view :class="[changeAnswer(item2.status)]"
									v-for="(item2, i2) in item.questionAnswerList" :key="i2"
									@click="checkboxChangeOptions(i2)">
									<view class="order">{{ item2.answerTitle }}.</view>
									<view class="answer_detail" v-html="item2.content"></view>
								</view>
							</view>
							<view class="" v-if="item.type == 3">
								<view :class="changeAnswer(item2.status)" v-for="(item2, i2) in item.questionAnswerList"
									:key="i2" @click="changeOptions(i2)">
									<view class="order" style="float: left;">{{ i2 == 0 ? 'A' : 'B' }}.</view>
									<view class="answer_detail">{{ i2 == 0 ? '正确' : '错误' }}</view>
								</view>
							</view>
							<textarea v-if="item.type == 4" class="short_answer_questions" v-model="item.myAnswer"
								placeholder="请输入答案..." maxlength="-1" @input="handleInput(item)" />
						</view>
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
						<view class="time btnbox_left_item" v-if="isRemaining">
							<image src="../../static/countDown.png" mode=""></image>
							<view class="time_text">{{ remaining }}</view>
						</view>
						<view class="answer_card btnbox_left_item" @click="cardShow">
							<image src="../../static/answerCard.png" mode=""></image>
							<view class="answer_card_text">答题卡</view>
						</view>
					</view>
					<view class="btnbox_right"><view class="success_exam" @click="dialogChangeshow">交卷</view></view>
				</view>
			</view>
		</view>
		<u-popup @close="close" v-model="show" mode="bottom" border-radius="14" height="60%">
			<view class="hide_answercard">
				<view class="hide_answercard_title">
					答题卡
					<!-- <view class="clear_answer">
						<view class="clear_answer_text">清空重做</view>
						<image src="../../static/del2.png" mode=""></image>
					</view> -->
				</view>
				<view class="hide_question">
					<view class="hide_exam_type" v-for="(item, i) in examNumData" :key="i">
						<view class="hide_exam_type_title">{{ i + 1 + '、' + item.text }}</view>
						<view class="hide_exam_content">
							<view class="hide_exam_content_item" v-for="(item2, i2) in item.data" :key="i2" @tap="toAnswerIndex(item2.num)">
								<view :class="['hide_exam_content_num', Changestate(item2.state)]">{{ item2.num }}</view>
							</view>
						</view>
						<view style="height: 60px;" v-if="i + 1 == examNumData.length"></view>
					</view>
		
					<view class="hide_exam_tips">
						<view class="hide_exam_tips_item">
							<view class="not_done_tip"></view>
							<view class="not_done_tip_text">未做</view>
						</view>
						<view class="hide_exam_tips_item">
							<view class="done_tip"></view>
							<view class="done_tip_text">已做</view>
						</view>
						<view class="hide_exam_tips_item">
							<view class="current_tip"></view>
							<view class="current_tip_text">当前</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	/**
	 * question-list 题库列表
	 * @description 模拟考试练习题列表
	 * @property {Boolean} exType 类型 ：exam考试 ,exercise在线练习 , 默认值exam
	 * @property {Boolean} isRemaining 是否显示倒计时(默认 true)
	 * @property {Number} exampagenum 当前为第几题标识(默认 0 )
	 * @property {Array} answerData 题目列表数据  
	 * @property {Number} startTime 倒计时 (单位秒 , 如 60 秒 , 默认0 ,isRemaining=true时生效)
	 * @event {Function()} changeQues 题目轮播切换，返回参数未当前题目的下标 index
	 * @event {Function()} runRes 点击交卷按钮
	 * @event {Function()} collectChange 点击收藏  返回当前题目信息和下标
	 * @event {Function()} changeOptions 监听题目选择和题目作答   返回对象 indexs当前下标  answerData.myAnswer当前题目的作答  answerData.isRight当前题目是否回答正确
	 */
	export default {
		name: "question-list",
		props: {
			//类型  exam考试   exercise在线练习
			exType:{
				type:String,
				default:'exam'
			},
			//当前为第几题标识
			exampagenum: {
				type: Number,
				default: 0
			},
			// 题目选项数据
			answerData: {
				type: Array
			},
			// 倒计时
			startTime:{
				type:Number,
				default:0
			},
			//是否显示倒计时
			isRemaining:{
				type:Boolean,
				default:true
			}
		},
		data() {
			return {
				// 答题卡是否显示
				show: false,
				//答题卡数据
				examNumData: [],
				//交卷提示词
				content: '是否确认交卷？',
				//交卷对话框是否显示
				dialogshow: false,
				// 收藏功能状态
				collect: false,
				//倒计时时间
				remaining: '',
				thisStartTime:this.startTime
			};
		},
		mounted() {
			if(this.isRemaining){
				this.getTime();
			}
		},
		created() {
			this.init();
		},
		methods:{
			init(){
				this.setExamNumData(1, '单项选择题');
				this.setExamNumData(2, '多项选择题');
				this.setExamNumData(3, '判断题');
				this.setExamNumData(4, '简答题');
				if(this.exampagenum==0){
					this.isQuestionCollect(0);
				}
			},
			setExamNumData(type, title) {
				let data = [];
				for (var r = 0; r < this.answerData.length; r++) {
					if (this.answerData[r].type == type) {
						let state = 0;
						if (r == 0) {
							state = 2;
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
				var dj = this.thisStartTime;
				let that = this;
				that.remaining = that.djs(that.thisStartTime);
				if (dj <= 0) {
					this.remaining = '已结束';
				} else {
					var ddf = this.djs(dj); //格式化过后的时间
					this.remaining = ddf;
					//当前时间减去时间
					dj = dj - 1;
					this.timeRange++;
					this.thisStartTime = dj;
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
			//单选题选择答案改变样式
			changeOptions(index) {
				console.log(">>>>>",index);
				let answerObj = this.answerData[this.exampagenum];
				for (let i = 0; i < answerObj.questionAnswerList.length; i++) {
					this.answerData[this.exampagenum].questionAnswerList[i].status = 0;
				}
				this.answerData[this.exampagenum].questionAnswerList[index].status = 1;
				this.answerData[this.exampagenum].isAnswered = true; //添加当前题目是否已答题
				this.answerData[this.exampagenum].myAnswer = answerObj.questionAnswerList[index].answerTitle;
				if (this.answerData[this.exampagenum].myAnswer == this.answerData[this.exampagenum].rightkey) {
					this.answerData[this.exampagenum].isRight = 1;
				} else {
					this.answerData[this.exampagenum].isRight = 2;
				}
				// let obj={
				// 	'answerData':
				// }
				let obj={
					'answerData':this.answerData[this.exampagenum],
					'indexs':this.exampagenum
				};
				this.$emit('changeOptions', obj);
			},
			//多选
			checkboxChangeOptions: function(index) {
				let answerObj = this.answerData[this.exampagenum];
				if (this.answerData[this.exampagenum].questionAnswerList[index].status == 1) {
					this.answerData[this.exampagenum].questionAnswerList[index].status = 0;
				} else {
					this.answerData[this.exampagenum].questionAnswerList[index].status = 1;
				}
				//正确答案集合
				let checkboxAnswerArr = this.answerData[this.exampagenum].rightkey.split(',');
				let myAnswer = '';
				let checkNum = 0; //多选题已经选择的答案数量
				for (var i = 0; i < this.answerData[this.exampagenum].questionAnswerList.length; i++) {
					if (this.answerData[this.exampagenum].questionAnswerList[i].status == 1) {
						checkNum++;
						if (myAnswer) {
							myAnswer += ',' + this.answerData[this.exampagenum].questionAnswerList[i].answerTitle;
						} else {
							myAnswer = this.answerData[this.exampagenum].questionAnswerList[i].answerTitle;
						}
					}
				}
				if (checkNum > 0) {
					this.answerData[this.exampagenum].isAnswered = true;
				} else {
					this.answerData[this.exampagenum].isAnswered = false;
				}
				this.answerData[this.exampagenum].myAnswer = myAnswer;
				if (this.answerData[this.exampagenum].myAnswer == this.answerData[this.exampagenum].rightkey) {
					this.answerData[this.exampagenum].isRight = 1;
				} else {
					this.answerData[this.exampagenum].isRight = 2;
				}
				let obj={
					'answerData':this.answerData[this.exampagenum],
					'indexs':this.exampagenum
				};
				this.$emit('changeOptions', obj);
			},
			handleInput: function(item) {
				if (item.myAnswer != null && item.myAnswer != undefined && item.myAnswer != '') {
					item.isAnswered = true;
					item.isRight = 1;
				} else {
					item.isAnswered = false;
					item.isRight = 2;
				}
				let obj={
					'answerData':item,
					'indexs':this.exampagenum
				};
				this.$emit('changeOptions', obj);
			},
			//题目轮播切换
			changeQues(event) {
				// this.exampagenum = event.detail.current;
				// if (this.answerData[this.exampagenum].isCollect > 0) {
				// 	this.collect = true;
				// } else {
				// 	this.collect = false;
				// }
				this.$emit('changeQues', event.detail.current);
				this.isQuestionCollect(event.detail.current);
			},
			//上一题
			lastQue() {
				// if (this.exampagenum > 0) {
				// 	this.exampagenum--;
				// }
				if(this.exampagenum>0){
					this.$emit('changeQues', this.exampagenum-1);
					this.isQuestionCollect(this.exampagenum-1);
				}
				
			},
			//下一题
			nextQue() {
				if(this.exampagenum < this.answerData.length - 1){
					this.$emit('changeQues', this.exampagenum+1);
					this.isQuestionCollect(this.exampagenum+1);
				}
				this.isOne = false;
			},
			toAnswerIndex: function(index) {
				this.$emit('changeQues', index-1);
				this.show = false;
				this.isQuestionCollect(index-1);
			},
			isQuestionCollect(index){
				if (this.answerData[index].isCollect > 0) {
					this.collect = true;
				} else {
					this.collect = false;
				}
			},
			//答题卡显示
			cardShow() {
				this.show = !this.show;
				if (this.show) {
					this.selectExamNumData();
				}
			},
			selectExamNumData() {
				// this.exampagenum
				//this.examNumData
				for (var i = 0; i < this.answerData.length; i++) {
					for (var j = 0; j < this.examNumData.length; j++) {
						if (this.examNumData[j].type == this.answerData[i].type) {
							for (var k = 0; k < this.examNumData[j].data.length; k++) {
								if (this.examNumData[j].data[k].num == i + 1) {
									this.examNumData[j].data[k].state = 0; //未做
									if (this.answerData[i].isAnswered) {
										this.examNumData[j].data[k].state = 1; //已做
									}
									if (this.answerData[i].type == 4 && this.answerData[i].myAnswer) {
										this.examNumData[j].data[k].state = 1; //简答题的有输入的答案视为已做
									}
									if (i == this.exampagenum) {
										this.examNumData[j].data[k].state = 2; //当前
									}
								}
							}
						}
					}
				}
			},
			// 关闭答题卡
			close() {
				this.show = false;
			},
			//收藏
			collectChange() {
				let obj={
					'answerData':this.answerData[this.exampagenum],
					'indexs':this.exampagenum
				};
				this.collect=!this.collect;
				this.$emit('collectChange', obj);
			},
			//交卷对话框显示
			dialogChangeshow() {
				this.$emit('runRes');
			},
			
		}
	}
</script>

<style lang="scss">


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
		height: 100%;
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
