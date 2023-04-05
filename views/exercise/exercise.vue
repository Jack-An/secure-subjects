<template>
  <view class="page_big" :style="{height:screenheight+'px'}">
    <u-navbar title="模拟测试" safeAreaInsetTop fixed placeholder :autoBack="true" :background="top_bgCl"
              titleColor="#ffffff" :borderBottom="false" backIconColor="#ffffff" titleBold>
    </u-navbar>
    <view class="exam_progress">
      <view class="slider">
        <u-slider height="12" inactiveColor="#75BDF8" activeColor="#fff" disabled
                  :value="(subjectIndex+1)/subjects.length*100"></u-slider>
      </view>
      <view class="subject_num">
        <text>第{{ subjectIndex + 1 }}题</text>
        <text>/{{ subjects.length }}题</text>
      </view>
    </view>
    <view class="page_content">
      <view class="subject_wrapper" v-if="curSubject">
        <view class="subject_title">
          <view>{{ curSubject.title }}{{ curSubjectTypeText }}</view>
        </view>
        <view class="option_wrapper" v-if="curSubjectType !== 'sample'">
          <view class="subject_option"
                v-bind:class="{active: selectedOption.includes(idx)}"
                v-for="(option, idx) in curSubject.options"
                :key="idx"
                @click="selectOptions(idx)"
          >
            <view class="option_key">{{ option.key }}.</view>
            <view class="option_text">{{ option.option }}</view>
          </view>
          <view class="multiple_option_button"
                v-if="curSubjectType==='multiple' && !curSubject.isAnswered"
                @click="enterSubject"
          >
            确认答案
          </view>
        </view>
        <view v-else>
          <view class="sub_subject" v-for="(sub, idx) in curSubject.subs" :key="idx">
            <view class="subject_title">({{ idx + 1 }}). {{ sub.title }}</view>
            <view class="subject_option"
                  v-bind:class="{active: selectedSubOption[idx].includes(subIdx)}"
                  v-for="(subOption, subIdx) in sub.options"
                  :key="idx*1000+subIdx"
                  @click="changeSubOptions(idx, subIdx)">
              <view class="option_key">{{ subOption.key }}.</view>
              <view class="option_text">{{ subOption.option }}</view>
            </view>
          </view>
        </view>
      </view>

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
            <view class="time btnbox_left_item">
              <image src="../../static/countDown.png" mode=""></image>
              <view class="time_text">
                {{ remaining }}
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
              {{ (i + 1) + "、" + item.text }}
            </view>
            <view class="hide_exam_content">
              <view class="hide_exam_content_item" v-for="(item2,i2) in item.data" :key="i2"
                    @tap="toAnswerIndex(item2.num)">
                <view :class="['hide_exam_content_num',Changestate(item2.state)]">
                  {{ item2.num }}
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
import {SubjectLib} from "@/common/subject-lib";

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
      // 收藏功能状态
      collect: false,
      // 答案选项数据
      subjects: [],
      subjectIndex: 0,
      //题库数据
      // questionbankData: [],
      examId: null, //当前练习记录生成的id
      //答题卡数据
      examNumData: [],
      isIntervalCount: '',
      userId: uni.getStorageSync('userId'),
      questionbankId: '',
      isResultShow: false
    }
  },
  computed: {
    curSubject() {
      return this.subjects.length ? this.subjects[this.subjectIndex] : null;
    },
    selectedOption() {
      if (!this.subjects.length || this.curSubjectType === 'sample') {
        return []
      }
      let idx = [];
      for (let i = 0; i < this.subjects[this.subjectIndex].options.length; i++) {
        if (this.subjects[this.subjectIndex].options[i].selected) {
          idx.push(i);
        }
      }
      return idx;
    },
    selectedSubOption() {
      if (!this.subjects.length || this.curSubjectType !== 'sample') {
        return {};
      }
      let map = {};
      for (let i = 0; i < this.curSubject.subs.length; i++) {
        let ids = [];
        for (let j = 0; j < this.curSubject.subs[i].options.length; j++) {
          if (this.curSubject.subs[i].options[j].selected) {
            ids.push(j);
          }
        }
        map[i] = ids;
      }
      return map;
    },
    curSubjectTypeText() {
      if (!this.curSubject) {
        return ''
      }
      if (this.curSubject.type === 'single') {
        return '【单选】'
      } else if (this.curSubject.type === 'multiple') {
        return '【多选】'
      } else if (this.curSubject.type === 'judge') {
        return '【判断】'
      } else {
        return '【案例】'
      }
    },
    curSubjectType() {
      return this.subjects.length ? this.subjects[this.subjectIndex].type : null;
    },
  },
  mounted() {
    this.screenheight = uni.getSystemInfoSync().windowHeight;
    this.getTime();
  },
  onLoad() {
    this.getExamPaper();
  },
  onBackPress() {
    if (this.isResultShow) {
      this.toExerciseResult();
      return true;
    }
    return false;
  },
  methods: {
    initSubjectStatus(subjects) {
      if(!subjects){
        return;
      }
      for (let i = 0; i < subjects.length; i++) {
        if (subjects[i].type !== "sample") {
          subjects[i].isAnswered = false;
          subjects[i].myAnswer = "";
          subjects[i].isRight = false;
          for (let j = 0; j < subjects[i].options.length; j++) {
            subjects[i].options[j].selected = false;
          }
        } else {
          for (let j = 0; j < subjects[i].subs.length; j++) {
            subjects[i].subs[j].isAnswered = false;
            subjects[i].subs[j].myAnswer = "";
            subjects[i].subs[j].isRight = false;
            for (let k = 0; k < subjects[i].subs[j].options.length; k++) {
              subjects[i].subs[j].options[k].selected = false;
            }
          }
        }
      }
      return subjects;
    },
    toAnswerIndex(index) {
    },
    selectOptions(index) {
      const subject = this.subjects[this.subjectIndex];
      if (subject.type !== "multiple") {
        for (let i = 0; i < subject.options.length; i++) {
          subject.options[i].selected = false;
        }
        subject.options[index].selected = true;
        subject.isAnswered = true;
        subject.myAnswer = subject.options[index].key;
        subject.isRight = (subject.answer === subject.myAnswer);
      } else {
        subject.options[index].selected = true;
      }
    },
    changeSubOptions: function (subIndex, subOptionIndex) {
      let curSubject = this.subjects[this.subjectIndex];
      let subSubject = curSubject.subs[subIndex];
      if (subSubject.type !== "multiple") {
        for (let i = 0; i < subSubject.options.length; i++) {
          subSubject.options[i].selected = false;
        }
        subSubject.options[subOptionIndex].selected = true;
      }

      subSubject.isAnswered = true;
      subSubject.myAnswer = subSubject.options[subOptionIndex].key;
      subSubject.isRight = (subSubject.myAnswer === subSubject.answer);
      let answeredNum = 0;
      for (let i = 0; i < curSubject.subs.length; i++) {
        if (curSubject.subs[i].isAnswered) {
          answeredNum++;
        }
      }
      curSubject.isAnswered = (answeredNum === curSubject.subs.length);
    },
    enterSubject() {
      const subject = this.subjects[this.subjectIndex];
      subject.isAnswered = true;
      subject.myAnswer = subject.options.filter((item) => item.selected).map((item) => item.key);
      subject.isRight = (subject.myAnswer === subject.answer);
    },


    getExamPaper: function () {
      // uni.showLoading({
      //   title: '加载中....'
      // });
      //
      // uni.hideLoading();
      let lib = new SubjectLib();
      lib.loadSubjectLib("single");
      const singleSubjects = lib.lib;
      lib.loadSubjectLib("multiple")
      const multipleSubjects = lib.lib;
      lib.loadSubjectLib("judge")
      const judgeSubjects = lib.lib;
      lib.loadSubjectLib("sample")
      const sampleSubjects = lib.lib;
      const subs = [].concat(singleSubjects.slice(0, 40), multipleSubjects.slice(0, 10), judgeSubjects.slice(0, 10), sampleSubjects.slice(0, 10));
      this.subjects = this.initSubjectStatus(subs);
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
      this.isIntervalCount = setInterval(function () {
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
    djs: function (ms) {
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
      if (this.subjectIndex > 0) {
        this.subjectIndex--;
      }
    },
    //下一题
    nextQue() {
      if (this.subjectIndex < this.subjects.length - 1) {
        this.subjectIndex++;
      }
    },

    //交卷对话框显示
    dialogChangeshow() {
      if (!this.is_exerciseSubmit) {
        this.isAnswerAll();
      }
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
    height: 80%;
    background: #FFFFFF;
    border-radius: 20rpx;
    box-shadow: 0rpx 5rpx 20rpx 1rpx rgba(0, 0, 0, 0.1);
    margin-top: 20rpx;
    padding: 40rpx 0rpx 0rpx 0rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .subject_wrapper {
      padding: 0 20rpx;
      height: 95%;
      overflow: auto;

      .active {
        color: rgb(14, 138, 253);
        border: 4rpx solid #0e8afd;
      }

      .sub_subject {
        margin-top: 30rpx;

        .subject_title {
          font-size: 22rpx;
          margin-bottom: 15rpx;
        }

        .subject_option {
          font-size: 22rpx;
          margin-left: 20rpx;

          .option_text {
            margin-left: 15rpx;
          }
        }
      }

      .subject_option {
        width: 100%;
        display: flex;
        margin-bottom: 25rpx;
        background: #f0f5fb;
        border: 4rpx solid #f0f5fb;
        border-radius: 10rpx;
        margin-top: 25rpx;

        .option_text {
          margin-left: 15rpx;
        }
      }

      .subject_title {
        display: flex;
        flex-direction: column;
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
