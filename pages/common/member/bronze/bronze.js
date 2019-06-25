// 会员详情展示
import {
  Member
} from '../../models/member.js';
var memberModel = new Member();
const app = getApp();
Page({
  data: {
    basicUserInfo: {},
    tag: false
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      basicUserInfo: app.globalData.userInfo
    })
    // 成为铜牌会员后调登录
    // memberModel.toLogin(that.data.basicUserInfo.unionId, that.data.basicUserInfo.source, (res)=> {
    //   if(res.status == 1) {

    //     app.globalData.userInfo = res.data
    //     that.setData({
    //       basicUserInfo: res.data
    //     })
    //   }
    // })

  },
  toSilver: function(e) {
    // wx.navigateTo({
    //   url: '../member',
    // })
    this.setData({
      tag: true
    })
    wx.redirectTo({
      url: '../member',
    })
  },

  onUnload:function(){
    if(!this.data.tag) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
    
  }
})