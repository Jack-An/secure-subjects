<template>
  <view class="question-list-wrapper">
    <view class="exam_progress">
      <view class="slider">
        <u-slider height="12" inactiveColor="#75BDF8" activeColor="#fff" disabled
                  :value="((subjectIndex + 1) / subjects.length) * 100"></u-slider>
      </view>
      <view class="subject_num">
        <text>第{{ subjectIndex + 1 }}题</text>
        <text>/{{ subjects.length }}题</text>
      </view>
    </view>
    <view class="page_content" v-if="curSubject">
      <view class="subject_wrapper">
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
        <view class="right-answer-area" v-if="curSubject.isAnswered && curSubjectType !== 'sample'">
          <view class="content">
            <view class="title">正确答案</view>
            <view class="option-1">{{ curSubject.answer }}</view>
          </view>
          <view class="content">
            <view class="title">您的回答</view>
            <view class="option-2">{{ curSubject.myAnswer }}</view>
          </view>
        </view>
        <view class="right-answer-area" v-if="curSubject.isAnswered && curSubjectType === 'sample'">
          <view class="content">
            <view class="title">正确答案</view>
            <view class="option-1" v-for="(sub, idx) in curSubject.subs" :key="idx">{{ sub.answer }}</view>
          </view>
          <view class="content">
            <view class="title">您的回答</view>
            <view class="option-2" v-for="(sub, idx) in curSubject.subs" :key="idx">{{ sub.myAnswer }}</view>
          </view>
        </view>

      </view>
      <view class="page_bottom">
        <view class="subject_change">
          <view class="answer_tag" v-if="curSubject.isAnswered">
            <view v-if="curSubject.isRight" class="right">正确</view>
            <view v-else class="wrong">错误</view>
            <view v-if="curSubjectType==='sample'" class="rate">
              <view class="right">{{ sampleCorrectRate }}</view>
              /
              <view>{{ curSubject.subs.length }}</view>
            </view>
          </view>
          <view class="last_subject" @click="toPrev">上一题</view>
          <view class="next_subject" @click="toNext">下一题</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * question-list 题库列表
 * @property {Number} subjectIndex 当前为第几题标识(默认 0 )
 * @property {Array} subjects 题目列表数据
 */
export default {
  name: "question-list",
  props: {
    //当前为第几题标识
    // 题目选项数据
    subjects: {
      type: Array,
      required: true
    },
  },
  data() {
    return {
      //答题卡数据
      subjectIndex: 0,
      examNumData: []
    };
  },
  computed: {
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
    sampleCorrectRate() {
      if (this.curSubjectType !== 'sample') {
        return ''
      }
      return this.curSubject.subs.filter((item) => item.isRight).length;

    },
    curSubjectType() {
      return this.subjects.length ? this.subjects[this.subjectIndex].type : null;
    },
    curSubject() {
      return this.subjects.length ? this.subjects[this.subjectIndex] : null;
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
    }

  },
  methods: {
    enterSubject() {
      const subject = this.subjects[this.subjectIndex];
      subject.isAnswered = true;
      subject.myAnswer = subject.options.filter((item) => item.selected).map((item) => item.key);
      subject.isRight = (subject.myAnswer === subject.answer);
    },
    selectOptions(index) {
      if (this.curSubject.isAnswered) {
        return;
      }
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
      if(subSubject.type !== "multiple"){
        for (let i = 0; i <subSubject.options.length ; i++) {
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
    //上一题
    toPrev() {
      if (this.subjectIndex > 0) {
        this.subjectIndex--;
      }
    },
    //下一题
    toNext() {
      if (this.subjectIndex < this.subjects.length - 1) {
        this.subjectIndex++;
      }
    },
  }
}
</script>

<style lang="scss">
.question-list-wrapper {
  height: 85%;

  .option_wrapper {
    margin-top: 20rpx;
  }

  .rate {
    display: flex;
  }

  .multiple_option_button {
    padding: 10rpx 0;
    text-align: center;
    background: rgb(14, 138, 253);
    color: #fff;
    margin-left: auto;
    margin-right: auto;
    border-radius: 100rpx;
    font-size: 35rpx;
  }

  .subject_wrapper {
    padding: 0 20rpx;
    height: 95%;
    overflow: auto;

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

    .subject_title {
      display: flex;
      flex-direction: column;
    }
  }

  .subject_wrapper {
    .active {
      color: rgb(14, 138, 253);
      border: 4rpx solid #0e8afd;
    }

    .subject_option {
      width: 100%;
      display: flex;
      margin-bottom: 25rpx;
      background: #f0f5fb;
      border: 4rpx solid #f0f5fb;
      border-radius: 10rpx;

      .option_text {
        margin-left: 15rpx;
      }
    }
  }

  .answer_tag {
    margin-right: auto;
    margin-left: 50rpx;
    font-size: 35rpx;

    .right {
      color: #00C777;
    }

    .wrong {
      color: #e50000;
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
    box-shadow: 0 5rpx 20rpx 1rpx rgba(0, 0, 0, 0.1);
    margin-top: 20rpx;
    padding: 40rpx 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;


    .page_bottom {
      width: 100%;

      .subject_change {
        display: flex;
        justify-content: flex-end;
        padding-right: 30rpx;
        color: #878887;
        padding-bottom: 20rpx;
        align-items: center;

        .next_subject {
          padding-left: 60rpx;
        }
      }
    }
  }
}

.right-answer-area {
  display: flex;
  padding: 30rpx;
  justify-content: space-around;

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      font-size: 35rpx;
      margin-bottom: 30rpx;
    }

    .option-1 {
      font-size: 35rpx;
      color: rgb(14, 138, 253);
    }

    .option-2 {
      font-size: 35rpx;
      color: rgb(16, 198, 0);
    }
  }
}
</style>
