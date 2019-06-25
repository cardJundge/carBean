// 成为会员
import {
  Member
} from '../models/member.js';
var memberModel = new Member();
const app = getApp();
Page({
  data: {
    showModal: false,
    basicUserInfo: {},
    openId: '',
    showLoginModal: false
  },
  onLoad: function(options) {
    this.setData({
      basicUserInfo: app.globalData.userInfo,
      openId: app.globalData.openId,
      hasUserInfo: wx.getStorageSync("hasUserInfo")
    })
  },
  // 关闭登录模态框
  hideLoginModal: function () {
    var that = this
    app.getAuth((data) => {
      if (!data) {
        wx.setStorageSync("hasUserInfo", false)
      } else {
        app.getUserLogin(data, response => {
          app.globalData.userInfo = response.data.data
          that.setData({
            basicUserInfo: response.data.data
          })
          wx.setStorageSync("hasUserInfo", true)
          wx.reLaunch({
            url: '../../mine/mine',
          })
        })
      }
    })
  },
  // 金牌
  onGoldRegister: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.redirectTo({
          url: './gold/gold',
        })
      }
    })
  },

  // 银牌
  onSilverRegister: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.redirectTo({
          url: './silver/silver',
        })
      }
    })
  },
  // 铜牌
  onBronzeRegister: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        // that.setData({
        //   showModal: true,
        //   title: '成为铜牌会员'
        // })
        wx.navigateTo({
          // url: './registered/registered',
          url:'../../services/completeinformation/completeinformation'
        })
      }
    })
  },
  // 模态框确定按钮传入input值
  onConfirm: function(e) {
    let appData = app.globalData.userAllInfor;
    console.log(appData,e.detail)
    var params = {
      mobile: e.detail.telphone,
      trueName: e.detail.name
    }
    // 成为铜牌会员
    memberModel.postUserInfo(params, (res)=> {
      if(res.status == 1) {
        wx.redirectTo({
          url: 'bronze/bronze',
        })
      } else {
        wx:wx.showToast({
          title: '请重新核对信息',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})