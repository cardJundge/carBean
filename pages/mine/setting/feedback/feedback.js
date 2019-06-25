// 意见反馈
import {
  Mine
} from '../../models/minemodel.js';
var mineModel = new Mine()
var app = getApp()
Page({
  data: {
    basicUserInfo: {}
  },
  onLoad: function(options) {
    this.setData({
      basicUserInfo: app.globalData.userInfo
    })
  },

  // 获取输入框内容
  getContent: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 意见反馈
  submitFeedback: function(e) {
    var that = this
    mineModel.postFeedBack(that.data.basicUserInfo.id, that.data.content, (res)=> {
      if(res.status == 1) {
        wx.showToast({
          title: '感谢您的反馈，我们会努力做得更好',
          duration: 1500,
          icon: 'none',
          success: res => {
          }
        })
        setTimeout(function () {
          //要延时执行的代码
          wx.reLaunch({
            url: '../../mine',
          })
        }, 1500)
      }
    })
  }
})