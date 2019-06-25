// 二手车评估、年审代办、代办服务、车务咨询
import {
  Member
} from '../../models/member.js'
var memberModel = new Member()
var app = getApp()
Page({
  data: {

  },
  onLoad: function(options) {
    this.setData({
      itemFlag: options.content
    })
    this.modifyTitle(options.content)
  },

  onShow: function(options) {
    
  },

  modifyTitle: function(flag) {
    if (flag == '车务咨询') {
      wx.setNavigationBarTitle({
        title: '车务咨询'
      })
    } else if (flag == '二手车评估') {
      wx.setNavigationBarTitle({
        title: '二手车评估'
      })
    } else if (flag == '年审代办') {
      wx.setNavigationBarTitle({
        title: '年审代办'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '代办服务'
      })
    }
  },

  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.num,
    })
  },
  //补全信息
  onConfirm: function (e) {
    wx.redirectTo({
      url: '../../../services/completeinformation/completeinformation?agent=agent',
    })
  },
  toOrder: function(e) {
    wx.setStorageSync("agentType", e.currentTarget.dataset.ordertype)
    if(app.globalData.userInfo.mobile) {
      memberModel.toAgentOrder(app.globalData.userInfo.id, e.currentTarget.dataset.ordertype, (res) => {
        if (res.status == 1) {
          wx.redirectTo({
            url: './order/order',
          })
        }
      })
    } else {
      this.setData({
        usertelshow: true
      })
    }
    
  }
})