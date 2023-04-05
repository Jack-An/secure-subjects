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
                  :subjects="answerData"
                  class="question-content-wrapper">

    </questionlist>

  </view>
</template>

<script>
import questionlist from '../../components/question-list/question-list.vue';
import {SubjectLib} from "../../common/subject-lib";

export default {
  //声明组件   实例化组件
  components: {
    questionlist
  },
  data() {
    return {
      // 屏幕高度
      screenheight: '',
      // 导航栏背景色
      top_bgCl: {
        background: '#0E8AFD'
      },
      // 答案选项数据
      answerData: [],
    };
  },
  computed: {
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
    // console.log(this.screenheight, this.navbarHeight);
    // this.getTime();
  },
  onLoad(option) {
    this.initExam(option);
  },
  methods: {
    initExam(option) {
      let lib = new SubjectLib();
      lib.loadSubjectLib(option.type);
      let subjects = lib.lib;
      if (option.type !== 'sample') {
        for (let i = 0; i < subjects.length; i++) {
          subjects[i].isAnswered = false;
          subjects[i].myAnswer = "";
          subjects[i].isRight = false;
          for (let j = 0; j < subjects[i].options.length; j++) {
            subjects[i].options[j].selected = false;
          }
        }
      } else {
        for (let i = 0; i < subjects.length; i++) {
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
      this.answerData = subjects;
    },

    //获取考试时间
    getTime() {
      let that = this;
      setInterval(function () {
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
    djs: function (ms) {
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
      console.log("题目轮播切换>>>>>>>>>", event);
      this.exampagenum = event;
    },
    //题目选择
    changeOptions(event) {
      console.log("题目选择>>>>>>>>>", event);
    },
    //点击收藏
    collectChange(event) {
      console.log("点击收藏>>>>>>>>>", event);
      if (this.answerData[event.indexs].isCollect > 0) {
        this.answerData[event.indexs].isCollect = 0;
      } else {
        this.answerData[event.indexs].isCollect = 1;
      }
    },
    //交卷
    runRes() {
      uni.showModal({
        title: '是否交卷？',
        success: (res) => {
          if (res.confirm) {
            console.log("我是交卷.....");
            uni.navigateTo({
              url: '../result/result'
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
      word-break: break-all;
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
