// 签到的组件模态框
import {
  Sign
} from '../models/sign.js';
var signModel = new Sign();
var app = getApp()
Component({
  properties: {
    show: Boolean,
    list: Object,
    count: String,
    time: Object
  },
  data: {
    btnName: "立即签到",
    status: "今日未",
    basicUserInfo: {}
  },
  methods: {
    toSignIn: function(e) {
      var that = this
      that.setData({
        basicUserInfo: app.globalData.userInfo
      })
      if (that.data.basicUserInfo) {
      //  去签到接口
        signModel.toSign(that.data.basicUserInfo.id, (res) => {
         if (res.status == 1) {
           that.setData({
             btnName: "今日已签到",
             status: that.properties.time.time
           })
          // 获取签到状态
           signModel.getSignStatus(that.data.basicUserInfo.id, (res)=> {
             console.log(res)
             if(res.status == 1) {
               that.setData({
                 list: res.data
               })
             }
           })
         }
       })
     }
    },
    hideModal: function(e) {
      this.setData({
        show: false,
      })
      this.triggerEvent('hide', {})
    }
  }
})
