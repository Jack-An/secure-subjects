<!-- 在线练习页面 -->
<template>
	<view class="page_big" :style="{height:screenheight+'px'}">
		<u-navbar title="模拟考试" safeAreaInsetTop fixed placeholder :autoBack="true" :background="top_bgCl"
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
								<view :class="[changeAnswer(item2.status)]"
									v-for="(item2,i2) in item.questionAnswerList" :key="i2" @click="changeOptions(i2)">
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
								<view :class="[changeAnswer(item2.status)]"
									v-for="(item2,i2) in item.questionAnswerList" :key="i2" @click="changeOptions(i2)">
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

						<view class="analysis"
							v-if="(item.isAnswered&&item.type!=4)||(is_exerciseSubmit&&item.type!=4)">
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
									<view class="correct_answer_num"
										:style="{'color':item.isCorrect==1?'#10C600':'#E50000'}">
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
							<view class="short_analysis_text" v-if="item.isAnswered||is_exerciseSubmit">
								<view class="short_analysis_title">
									答案解析
								</view>
								<view class="short_analysis_detail" ref="htmlText" v-html="item.analysis"></view>
								<!-- <rich-text :nodes="textHtml">
									
								</rich-text> -->
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
						<view class="time btnbox_left_item">
							<image src="../../static/countDown.png" mode=""></image>
							<view class="time_text">
								{{remaining}}
							</view>
						</view>
						<view class="answer_card btnbox_left_item" @click="cardShow">
							<image src="../../static/answerCard.png" mode=""></image>
							<view class="answer_card_text">
								答题卡
							</view>
						</view>
					</view>
					<view class="btnbox_right" v-if="!is_exerciseSubmit">
						<view class="success_exam" @tap="dialogChangeshow">
							交卷
						</view>
					</view>
					<view class="btnbox_right" v-if="is_exerciseSubmit">
						<view class="success_exam" @tap="toExerciseResult">
							查看结果
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-modal v-model="dialogshow" :content="content" :show-title="false" @confirm="runRes"></u-modal>
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
							{{(i+1)+"、"+item.text}}
						</view>
						<view class="hide_exam_content">
							<view class="hide_exam_content_item" v-for="(item2,i2) in item.data" :key="i2"
								@tap="toAnswerIndex(item2.num)">
								<view :class="['hide_exam_content_num',Changestate(item2.state)]">
									{{item2.num}}
								</view>
							</view>
						</view>
						<view style="height: 60px;" v-if="(i+1)==examNumData.length"></view>
						<view class="hide_exam_tips" v-if="(i+1)==examNumData.length">
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
							<view class="hide_exam_tips_item">
								<view class="current_tip">

								</view>
								<view class="current_tip_text">
									当前
								</view>
							</view>
							<view class="hide_exam_tips_item">
								<view class="correct_tip">

								</view>
								<view class="correct_tip_text">
									正确
								</view>
							</view>
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
				is_exerciseSubmit: false, //是否已经交卷
				textHtml: '',
				//练习类型
				type: 'exercise',
				//倒计时开始时间
				startTime: 0,
				//倒计时时间
				remaining: '',
				remainingTrue: true,
				// 滑动后的x坐标
				lastX: 0,
				//滑动过程中翻页函数只能执行一次
				isOne: true,
				//简答题解析是否显示
				shortAnswerShow: false,
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
				//题库数据
				questionbankData: [],
				practiceId: '', //当前练习记录生成的id
				//答题卡数据
				examNumData: [],
				isIntervalCount: '',
				userId: uni.getStorageSync('userId'),
				questionbankId: '',
				isResultShow: false
			}
		},
		mounted() {
			this.screenheight = uni.getSystemInfoSync().windowHeight;
			this.getTime();
		},
		onLoad(option) {
			this.answerData = [];
			this.getQuestionList(option.questionbankId);
			// if (option.questionbankId) {
			// 	this.questionbankId=option.questionbankId;
			// 	this.getQuestionList(option.questionbankId);
			// } else {
			// 	uni.showToast({
			// 		title: '数据加载失败！',
			// 		icon: 'error'
			// 	})
			// 	setTimeout(() => {
			// 		uni.navigateBack({})
			// 	}, 800);
			// }
		},
		onShow() {
			// if(this.is_exerciseSubmit){
			// 	this.answerData[i].isCorrect=2;
			// 	this.answerData[i].isAnswered = true;
			// }
		},
		onBackPress() {
			console.log("我是返回>>>>>>>", this.isResultShow);
			if (this.isResultShow) {
				console.log("66666");
				this.toExerciseResult();
				return true;
			}
			return false;
		},
		methods: {
			toAnswerIndex: function(index) {
				let answerObj = this.answerData[this.exampagenum];
				if (answerObj.type == 2 && !this.is_exerciseSubmit) {
					let checkCount = 0;
					for (let i = 0; i < answerObj.questionAnswerList.length; i++) {
						if (answerObj.questionAnswerList[i].isCheck) {
							checkCount++;
						}
					}
					if (checkCount < 2 && checkCount > 0) {
						this.show = false;
						uni.showModal({
							title: '多选题最少选择两个答案！'
						})
						return false;
					} else {
						if (checkCount > 0) {
							this.checkboxChangeOptions(this.exampagenum);
						}
					}
				}
				this.exampagenum = (index - 1);
				if (this.answerData[this.exampagenum].isCollect > 0) {
					this.collect = true;
				} else {
					this.collect = false;
				}
				this.show = false;
			},
			initExamNumData: function(questionbank) {
				uni.showLoading({
					title: '加载中....'
				});

				this.setExamNumData(1, '单项选择题');
				this.setExamNumData(2, '多项选择题');
				this.setExamNumData(3, '判断题');
				this.setExamNumData(4, '简答题');


				uni.hideLoading();
			},
			setExamNumData(type, title, num) {
					let data = [];
					for (var r = 0; r < this.answerData.length; r++) {
						if (this.answerData[r].type == type) {
							let state = 0;
							if (r == 0) {
								state = 2;
							}
							let obj = {
								num: (r + 1),
								state: state
							};
							data.push(obj);
							// data.splice(r,0,obj)
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
			selectExamNumData() {
				// this.exampagenum
				//this.examNumData
				for (var i = 0; i < this.answerData.length; i++) {
					if (this.answerData[i].isCorrect == 1) {
						for (var j = 0; j < this.examNumData.length; j++) {
							if (this.examNumData[j].type == this.answerData[i].type) {
								for (var k = 0; k < this.examNumData[j].data.length; k++) {
									if (this.examNumData[j].data[k].num == (i + 1)) {
										this.examNumData[j].data[k].state = 3;
										if (i == this.exampagenum) {
											this.examNumData[j].data[k].state = 2;
										}
									}
								}
							}
						}
					} else if (this.answerData[i].isCorrect == 2) {
						for (var j = 0; j < this.examNumData.length; j++) {
							if (this.examNumData[j].type == this.answerData[i].type) {
								for (var k = 0; k < this.examNumData[j].data.length; k++) {
									if (this.examNumData[j].data[k].num == (i + 1)) {
										this.examNumData[j].data[k].state = 4;
										if (i == this.exampagenum) {
											this.examNumData[j].data[k].state = 2;
										}
									}
								}
							}
						}
					} else { //简答题的处理
						for (var j = 0; j < this.examNumData.length; j++) {
							if (this.examNumData[j].type == this.answerData[i].type) {
								for (var k = 0; k < this.examNumData[j].data.length; k++) {
									if (this.examNumData[j].data[k].num == (i + 1)) {
										//this.examNumData[j].data[k].state=4;
										if (i == this.exampagenum) {
											this.examNumData[j].data[k].state = 2;
										} else {
											if (this.answerData[i].type == 4 && this.answerData[i].myAnswer) {
												this.examNumData[j].data[k].state = 1;
											} else {
												this.examNumData[j].data[k].state = 0;
											}

										}
									}
								}
							}
						}
					}

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

			getQuestionList: function(questionbankId) {

				this.answerData = [{
					'id': 100001, //主键
					'title': "测试单选题哦1", //题目标题
					'type': 1, //题目类型( 1.单选题  2.多选题  3.判断题  4.简答题 )
					'isCollect': 1, //判断是否有收藏
					'isAnswered': false, //是否作答
					'rightkey': 'A', //正确答案
					'analysis': '我是题目的解析11111111111', //解析
					'questionAnswerList': [{ //选项列表
							'id': 110001,
							'answerTitle': 'A', //选项标题
							'content': 'content--->AAAAAAAA', //选项内容
							'isCorrect': 1, //是否是正确答案( 1是   2否 )
							'status': 0 //选择状态
						},
						{
							'id': 110002,
							'answerTitle': 'B',
							'content': 'content--->BBBBBBBB',
							'isCorrect': 2,
							'status': 0
						},
						{
							'id': 110003,
							'answerTitle': 'C',
							'content': 'content--->CCCCCCC',
							'isCorrect': 2,
							'status': 0
						},
						{
							'id': 110004,
							'answerTitle': 'D',
							'content': 'content--->DDDDDDD',
							'isCorrect': 2,
							'status': 0
						}
					]
				}, {
					'id': 100002,
					'title': "测试多选题哦1",
					'type': 2,
					'isCollect': 0, //判断是否有收藏
					'isAnswered': false, //是否作答
					'rightkey': 'A,B',
					'analysis': '我是题目的解析11111111111',
					'questionAnswerList': [{
							'id': 110001,
							'answerTitle': 'A',
							'content': 'content--->AAAAAAAA',
							'isCorrect': 1,
							'status': 0
						},
						{
							'id': 110002,
							'answerTitle': 'B',
							'content': 'content--->BBBBBBBB',
							'isCorrect': 1,
							'status': 0
						},
						{
							'id': 110003,
							'answerTitle': 'C',
							'content': 'content--->CCCCCCC',
							'isCorrect': 2,
							'status': 0
						},
						{
							'id': 110004,
							'answerTitle': 'D',
							'content': 'content--->DDDDDDD',
							'isCorrect': 2,
							'status': 0
						}
					]
				}, {
					'id': 100003,
					'title': "测试判断题哦2",
					'type': 3,
					'isCollect': 0, //判断是否有收藏
					'isAnswered': false, //是否作答
					'rightkey': 'A', //判断的正确答案( A正确  B错误 )
					'analysis': '我是题目的解析11111111111',
					'questionAnswerList': [{
							'id': 110001,
							'answerTitle': 'A',
							'isCorrect': 1,
							'status': 0
						},
						{
							'id': 110001,
							'answerTitle': 'B',
							'isCorrect': 2,
							'status': 0
						},
					]
				}, {
					'id': 100004,
					'title': "简答题哦~",
					'type': 4,
					'isCollect': 0, //判断是否有收藏
					'isAnswered': false, //是否作答
					'analysis': '我是题目的解析11111111111',
				}];
				this.initExamNumData();
				// uni.showLoading({
				// 	title: '加载中....'
				// });
				// this.$Request.post('xxxxx', {
				// 	'questionbankId': questionbankId,
				// 	'userId':this.userId
				// }).then(
				// 	res => {
				// 		uni.hideLoading();
				// 		if (res.success) {
				// 		}
				// 	}).catch(err => {
				// 	console.error(err);
				// 	uni.hideLoading();
				// 	uni.showToast({
				// 		title: '网络繁忙!',
				// 		icon: 'error'
				// 	})
				// });
			},
			//题目轮播切换
			changeQues(event) {
				console.log(event.detail)
				this.exampagenum = event.detail.current;

				if (this.answerData[this.exampagenum].isCollect > 0) {
					this.collect = true;
				} else {
					this.collect = false;
				}
			},
			//显示简答题解析
			shortShow(item, index) {
				//this.shortAnswerShow = !this.shortAnswerShow;
				item.isAnswered = true;
			},
			//交卷跳转
			runRes() {
				// if (this.type == 'exam') {
				// 	uni.navigateTo({
				// 		url: '../result/result'
				// 	})
				// } else {
				// 	uni.navigateTo({
				// 		url: '../exercise/exercise_result'
				// 	})
				// }
				this.exerciseSubmit();
			},
			//获取考试时间
			getTime() {
				let that = this;
				this.isIntervalCount = setInterval(function() {
					that.countDown()
				}, 1000)
			},
			//倒计时
			countDown() {
				//uni.hideLoading();
				if (!this.is_exerciseSubmit) {
					var dj = this.startTime;
					let that = this
					that.remaining = that.djs(that.startTime)
					// if (dj <= 0) {
					// 	this.remaining = "已结束";
					// 	this.remainingTrue=false;
					// } else {
					var ddf = this.djs(dj); //格式化过后的时间
					this.remaining = ddf;
					//当前时间减去时间
					dj = dj + 1;
					this.startTime = dj;
					// }
				} else {
					clearInterval(this.isIntervalCount)
				}

			},

			//得到的秒换算成时分秒
			djs: function(ms) {
				var h = parseInt(ms / (60 * 60));
				var m = parseInt((ms % (60 * 60)) / 60);
				var s = (ms % (60 * 60)) % 60;
				if (h < 10) {
					h = "0" + h
				}
				if (m < 10) {
					m = "0" + m
				}
				if (s < 10) {
					s = "0" + s
				}
				return h + ":" + m + ":" + s;
			},

			//上一题
			lastQue() {
				let answerObj = this.answerData[this.exampagenum];
				if (answerObj.type == 2 && !this.is_exerciseSubmit) {
					let checkCount = 0;
					for (let i = 0; i < answerObj.questionAnswerList.length; i++) {
						if (answerObj.questionAnswerList[i].isCheck) {
							checkCount++;
						}
					}
					if (checkCount < 2 && checkCount > 0) {
						uni.showModal({
							title: '多选题最少选择两个答案！'
						})
						return false;
					} else {
						if (checkCount > 0) {
							this.checkboxChangeOptions(this.exampagenum);
						}
					}
				}
				if (this.exampagenum > 0) {
					this.exampagenum--
				}

				if (this.answerData[this.exampagenum].isCollect > 0) {
					this.collect = true;
				} else {
					this.collect = false;
				}
				this.isOne = false
			},
			//下一题
			nextQue() {
				let answerObj = this.answerData[this.exampagenum];
				if (answerObj.type == 2 && !this.is_exerciseSubmit) {
					let checkCount = 0;
					for (let i = 0; i < answerObj.questionAnswerList.length; i++) {
						if (answerObj.questionAnswerList[i].isCheck) {
							checkCount++;
						}
					}
					if (checkCount < 2 && checkCount > 0) {
						uni.showModal({
							title: '多选题最少选择两个答案！'
						})
						return false;
					} else {
						if (checkCount > 0) {
							this.checkboxChangeOptions(this.exampagenum);
						}
					}
				}
				if (this.exampagenum < this.answerData.length - 1) {
					this.exampagenum++
				}
				if (this.answerData[this.exampagenum].isCollect > 0) {
					this.collect = true;
				} else {
					this.collect = false;
				}
				this.isOne = false
			},
			// 答案选项初始样式
			changeAnswer(state) {
				if (state == 1) {
					return 'answer_options_active'
				} else if (state == 2) {
					return 'answer_options_error'
				} else {
					return 'answer_options'
				}
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
				if (!this.is_exerciseSubmit) {
					this.isAnswerAll();
				}
				//this.dialogshow = true;
			},
			//判断是否全部题目已经答题
			isAnswerAll() {
				//this.answerData
				let isFalse = false;
				for (var i = 0; i < this.answerData.length; i++) {
					if (!this.answerData[i].myAnswer) {
						isFalse = true;
					}
				}
				if (isFalse) {
					this.dialogshow = true;
				} else {
					console.log("已经全部答题>>>>>>>");
					this.exerciseSubmit();
				}
			},
			//交卷
			exerciseSubmit() {
				this.is_exerciseSubmit = true;
				// this.practiceId;
				//this.startTime;
				let answerStr = "";
				let correctNum = 0; //正确的数量
				let errorNum = 0; //错误的数量
				let answerArr = [];
				for (var i = 0; i < this.answerData.length; i++) {
					let ansId = this.answerData[i].id;
					let ansTitle = this.answerData[i].title;
					let ansType = this.answerData[i].type;
					let ansMyAnswer = this.answerData[i].myAnswer == undefined ? '' : this.answerData[i].myAnswer;
					let answerObj = {
						'ansId': ansId,
						'ansTitle': ansTitle,
						'ansType': ansType,
						'ansMyAnswer': ansMyAnswer,
						'isCorrect': ''
					};
					if (this.answerData[i].isCorrect == 1) {
						correctNum++;
						answerObj.isCorrect = 1;
						//answerStr+=ansId+"_"+ansType+"_"+ansMyAnswer+"_1";
					} else if (this.answerData[i].isCorrect == 2) {
						errorNum++;
						answerObj.isCorrect = 2;
					} else if (this.answerData[i].type == 4) { //简答题的处理
						if (this.answerData[i].myAnswer) {
							correctNum++;
							answerObj.isCorrect = 1;
						} else {
							errorNum++;
							answerObj.isCorrect = 2;
						}
					} else {
						errorNum++;
						answerObj.isCorrect = 2;
					}
					answerArr.push(answerObj);
				}
				answerStr = JSON.stringify(answerArr);
				this.setPracticeRecord(answerStr, correctNum, errorNum);
			},
			setPracticeRecord(answerStr, correctNum, errorNum) {
				this.is_exerciseSubmit = true;
				uni.showToast({
					title: '交卷成功！'
				})
				this.toExerciseResult();

			},
			toExerciseResult() {
				this.$eventHub.$on('cktccp', (data) => {
					if (data) {
						this.exampagenum = data - 1;
					}
					this.isResultShow = true;
					this.$eventHub.$off('cktccp');
				});
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				nowPage.options.answerData = this.answerData;
				// setTimeout(()=>{

				uni.navigateTo({
					url: '../exercise/exercise_result?practiceId=' + this.practiceId
				})
				// },800);
			},
			// 关闭答题卡
			close() {
				this.show = false
			},
			//答题卡显示
			cardShow() {
				this.show = !this.show
				console.log(this.show)
				if (this.show) {
					this.selectExamNumData();
				}
			},
			//收藏功能
			collectChange() {
				let answerObj = this.answerData[this.exampagenum];
				this.collect = !this.collect;
				if (this.collect) {
					this.answerData[this.exampagenum].isCollect = 1;
				} else {
					this.answerData[this.exampagenum].isCollect = 0;
				}
				// uni.showLoading({
				// 	title: '加载中....'
				// });
				// this.$Request.post('xxxxxxx', {
				// 	'questionId': answerObj.id,
				// 	'userId':this.userId,
				// 	'questionType':answerObj.type,
				// 	'questionTitle':answerObj.title,
				// 	'questionbankId':this.questionbankId
				// }).then(
				// 	res => {
				// 		uni.hideLoading();
				// 		if (res.success) {
				// 			this.collect = !this.collect;
				// 			if(this.collect){
				// 				this.answerData[this.exampagenum].isCollect=1;
				// 			}else{
				// 				this.answerData[this.exampagenum].isCollect=0;
				// 			}
				// 		}
				// 	}).catch(err => {
				// 	console.error(err);
				// 	uni.hideLoading();
				// 	uni.showToast({
				// 		title: '网络繁忙!',
				// 		icon: 'error'
				// 	})
				// });
			},
			//选择题答案改变样式
			changeOptions(index) {
				if (this.is_exerciseSubmit) {
					return;
				}
				let answerObj = this.answerData[this.exampagenum];
				if (!answerObj.isAnswered && answerObj.type == 1) {
					this.answerData[this.exampagenum].isAnswered = true;
					this.answerData[this.exampagenum].myAnswer = answerObj.questionAnswerList[index].answerTitle;
					for (let i = 0; i < answerObj.questionAnswerList.length; i++) {
						//answerObj.questionAnswerList[i].state = 0;
						if (answerObj.questionAnswerList[i].answerTitle == answerObj.rightkey) {
							answerObj.questionAnswerList[i].status = 1;
						}
					}
					if (answerObj.questionAnswerList[index].isCorrect == 1) {
						answerObj.questionAnswerList[index].status = 1;
					} else {
						answerObj.questionAnswerList[index].status = 2;
					}
					if (answerObj.myAnswer == answerObj.rightkey) {
						this.answerData[this.exampagenum].isCorrect = 1;
					} else {
						this.answerData[this.exampagenum].isCorrect = 2;
					}

				} else if (!answerObj.isAnswered && answerObj.type == 2) {
					if (answerObj.questionAnswerList[index].status == undefined || answerObj.questionAnswerList[index]
						.status == '') {
						answerObj.questionAnswerList[index].status = 1;
						answerObj.questionAnswerList[index].isCheck = true;
						//answerObj.myCheckboxAnswerList.push();
					} else if (answerObj.questionAnswerList[index].status == 1) {
						answerObj.questionAnswerList[index].status = undefined;
						answerObj.questionAnswerList[index].isCheck = false;
					}
				} else if (!answerObj.isAnswered && answerObj.type == 3) {
					this.answerData[this.exampagenum].isAnswered = true;
					this.answerData[this.exampagenum].myAnswer = index == 0 ? 'A' : 'B';
					for (let i = 0; i < answerObj.questionAnswerList.length; i++) {
						answerObj.questionAnswerList[i].status = 0;
						if (answerObj.questionAnswerList[i].answerTitle == answerObj.rightkey) {
							answerObj.questionAnswerList[i].status = 1;
						}
					}
					if (answerObj.questionAnswerList[index].answerTitle == answerObj.rightkey) {
						answerObj.questionAnswerList[index].status = 1;
					} else {
						answerObj.questionAnswerList[index].status = 2;
					}
					if (answerObj.myAnswer == answerObj.rightkey) {
						this.answerData[this.exampagenum].isCorrect = 1;
					} else {
						this.answerData[this.exampagenum].isCorrect = 2;
					}
				}
				//clearInterval(isIntervalCount_changeOptions);
			},
			//多选题提交
			checkboxChangeOptions: function(index) {
				if (this.is_exerciseSubmit) {
					return;
				}
				let answerObj = this.answerData[this.exampagenum];
				if (!answerObj.isAnswered) {
					let checkCount = 0;
					let myAnswer = "";
					let checkboxAnswerArr = answerObj.rightkey.split(',');
					for (let i = 0; i < answerObj.questionAnswerList.length; i++) {
						if (answerObj.questionAnswerList[i].isCorrect == 1) {
							answerObj.questionAnswerList[i].status = 1;
						}
						if (answerObj.questionAnswerList[i].isCheck) {
							checkCount++;
							if (myAnswer) {
								myAnswer += "," + answerObj.questionAnswerList[i].answerTitle;
							} else {
								myAnswer = answerObj.questionAnswerList[i].answerTitle;
							}
							//answerObj.questionAnswerList[i].status=1;
						}
					}
					if (checkCount == 0) {
						return false;
					}
					if (checkCount < 2 && checkCount > 0) {
						uni.showModal({
							title: '多选题最少选择两个答案！'
						})
						for (let i = 0; i < answerObj.questionAnswerList.length; i++) {
							answerObj.questionAnswerList[i].status = 0;
						}
						return false;
					}
					if (answerObj.rightkey != myAnswer) {
						for (let i = 0; i < answerObj.questionAnswerList.length; i++) {
							if (answerObj.questionAnswerList[i].isCheck && answerObj.questionAnswerList[i].isCorrect ==
								2) {
								answerObj.questionAnswerList[i].status = 2;
							}

						}
					}
					this.answerData[this.exampagenum].isAnswered = true;
					this.answerData[this.exampagenum].myAnswer = myAnswer;
					if (answerObj.myAnswer == answerObj.rightkey) {
						this.answerData[this.exampagenum].isCorrect = 1;
					} else {
						this.answerData[this.exampagenum].isCorrect = 2;
					}
				}

			},

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
