<template>
  <view class="content">
    <view class="logo">
      <image src="../../static/logo.png" mode=""></image>
    </view>
    <view class="form_wrapper">
      <view class="uni-form-item uni-column">
        <input v-model="model.phone" type="tel" class="uni-input" name="" placeholder="请输入手机号"/>
      </view>
      <view class="uni-form-item uni-column">
        <input v-model="model.password" type="password" class="uni-input" name="" placeholder="请输入密码"/>
      </view>
      <button type="primary" @click="login">登陆</button>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      model: {
        phone: "",
        password: ""
      }
    }
  },
  onLoad() {
    if(uni.getStorageSync("userId")) {
      console.log("logged")
      uni.navigateTo({
          url: "/views/index/index"
        })
    }

  },
  methods: {
    login: function () {
      if (this.model.phone && this.model.password) {
        uni.setStorageSync("userId", 111)
        uni.navigateTo({
          url: "/views/index/index"
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
$color-primary: #0e8afd;
.content {
  padding: 100rpx;
}

.logo {
  text-align: center;

  image {
    height: 200rpx;
    width: 200rpx;
    margin: 0 0 60rpx 0;
  }
}

.uni-form-item {
  margin-bottom: 40rpx;
  padding: 0;
  border-bottom: 1px solid #e3e3e3;

  .uni-input {
    font-size: 30rpx;
    padding: 7px 0;
  }
}

button[type="primary"] {
  background-color: $color-primary;
  border-radius: 0;
  font-size: 34rpx;
  margin-top: 60rpx;
}

</style>
