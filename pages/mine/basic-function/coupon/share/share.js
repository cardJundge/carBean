// 优惠券分享页面
import {
  Coupon
} from '../../../models/couponmodel.js'
var couponModel = new Coupon()
var app = getApp()
Page({
  data: {
    showLoginModal: false
  },

  onLoad: function (options) {
    this.data.userId = options.userId
    this.data.couponId = options.couponId
    this.getWindowHeight()
  },
  onShow: function () {
    wx.showLoading({
      title: '洗车券加载中...',
    })
    if (app.globalData.userInfo) {
      this.setData({
        isLogin: true
      })
      this.isYourSelf()
    } else {
      // 判断是否授权
      app.getAuth((data) => {

        // 没有授权
        if (!data) {
          wx.hideLoading()
          this.setData({
            showLoginModal: true,
            ifOther: true,
            status: 0,
            isLogin: false
          })
        } else {
          app.getUserLogin(data, response => {
            this.setData({
              isLogin: true
            })
            app.globalData.userInfo = response.data.data
            this.isYourSelf()
          })
        }
      })
    }
  },

  hideLoginModal: function () {
    wx.showLoading({
      title: '洗车券加载中...',
    })
    this.onShow()
  },

  // 判断优惠券的前置信息
  checkCoupon: function () {

  },

  // 判断是自己还是自己的小伙伴打开这个页面
  isYourSelf: function () {
    // 如果是自己打开
    if (app.globalData.userInfo.id == this.data.userId) {
      couponModel.checkCoupon(this.data.couponId, res => {
        console.log('我自己打开', res)
        wx.hideLoading()
        res.data.start_date = res.data.start_date.split('-').join('/')
        res.data.end_date = res.data.end_date.split('-').join('/')
        this.setData({
          ifOther: false,
          status: res.status,
          receiveMy: res.data
        })
        // 等待被领取
        if (res.status == 0) {

          // 已经被领取
        } else if (res.status == -1) {

          // 超时未领取
        } else if (res.status == -2) {

        }
      })
      // 如果是小伙伴打开
    } else {
      couponModel.checkCoupon(this.data.couponId, res => {
        console.log('小伙伴打开', res)
        wx.hideLoading()
        res.data.start_date = res.data.start_date.split('-').join('/')
        res.data.end_date = res.data.end_date.split('-').join('/')
        this.setData({
          ifOther: true,
          status: res.status,
          receiveUser: res.data
        })
        // 等待被领取
        if (res.status == 0) {

          // 已经被领取
        } else if (res.status == -1) {
          // 已经被领取后，是其他小伙伴打开还是领取的小伙伴打开
          if (app.globalData.userInfo.id == res.data.get_uid) {
            this.setData({
              status: -1
            })
          } else {
            this.setData({
              status: -2,
              isBuddy: '您来晚了，免费洗车券已经被抢走了!'
            })
          }
          // 超时未领取
        } else if (res.status == -2) {
          this.setData({
            isBuddy: '领取免费洗车券已超时'
          })
        }
      })
    }
  },
  // 小伙伴点击领取
  toReceive: function () {
    wx.showLoading({
      title: '领取中...',
    })
    app.getAuth((data) => {
      // 没有授权
      if (!data) {
        this.setData({
          showLoginModal: true
        })
      } else {
        couponModel.toReceiveCoupon(this.data.couponId, this.data.userId, res => {
          wx.hideLoading()
          console.log('小伙伴点击领取', res)
          if (res.status == 1) {
            this.setData({
              status: -1
            })
            wx.showToast({
              title: '领取成功',
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 3000
            })
          }
        })
      }
    })
  },
  // 点击返回首页
  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 获得屏幕可视区域高度
  getWindowHeight: function () {
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.setData({
          windowHeight: res.windowHeight
        })
      },
    })
  }
})