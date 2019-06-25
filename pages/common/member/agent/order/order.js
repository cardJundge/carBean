// 订单详情
import {
  Member
} from '../../../models/member.js'
var memberModel = new Member()
var app = getApp()
Page({
  data: {
    type: wx.getStorageSync("agentType"),
    orderList: []
  },

  onLoad: function(options) {
    this.setData({
      type: wx.getStorageSync("agentType")
    })
  },

  onShow: function() {
    this.setData({
      type: wx.getStorageSync("agentType"),
      mobile: app.globalData.userInfo.mobile
    })
    this.toOrderDetail()
  },

  toOrderDetail: function() {
    var that = this
    memberModel.agentOrderDetail(app.globalData.userInfo.id, that.data.type, (res) => {
      // console.log(res)
      if (res.status == 1) {
        that.setData({
          orderData: res.data
        })
      }
    })
  },

  // 弹出修改手机号模态框
  toModifyTel: function() {
    this.setData({
      editMobile: true
    })
  },

  // 取消修改
  cancelModal: function() {
    this.setData({
      editMobile: false
    })
  },

  // 成功修改手机号
  updateMobile: function(e) {

    var that = this
    var reg = /^1[3456789]\d{9}$/;
    if (reg.test(e.detail.value.mobile)) {
      console.log('ok')
    } else {
      wx.showToast({
        title: '手机号格式错误',
        icon:'none'
      })
      return
    }
    memberModel.modifyTel(e.detail.value.mobile, (res)=> {
      console.log(res)
      if (res.status == 1) {
        wx.showToast({
          title: '修改成功',
        })
        app.globalData.userInfo.mobile = e.detail.value.mobile
        that.setData({
          mobile: e.detail.value.mobile,
          editMobile: false,
        })

      } else {
        wx.showToast({
          title: '操作超时',
          icon: 'none'
        })
      }
    })
  },
 
  // 取消订单
  toCancelOrder: function() {
    var that = this
    memberModel.cancelOrder(that.data.orderData.id, (res) => {
      // console.log(res)
      if (res.status == 1) {
        that.toOrderDetail()
        wx.showToast({
          title: '订单取消成功',
          duration: 1000,
          success: function() {
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        })
      }
    })
  }
})