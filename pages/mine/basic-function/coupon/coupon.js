// 我的优惠券

import {
  Coupon
} from '../../models/couponmodel.js'
var couponModel = new Coupon()
var app = getApp()

Page({
  data: {
    noCunqon: false,
    couponarray: []
  },
  onLoad: function (options) {
    this.data.userId = app.globalData.userInfo.id
    this.data.sessionId = app.globalData.userInfo.session_id
    this.getCouponList()
  },
  getCouponList: function () {
    couponModel.couponList(res => {
      if (res.status == 1) {
        this.setData({
          noCunqon: false
        })
        var couponArr = []
        var couponArray = []
        res.data.forEach((item) => {
          item.start_date = item.start_date.split('-').join('/')
          item.end_date = item.end_date.split('-').join('/')
          if (item.status == 2) {
            couponArray.push(item)
            this.setData({
              couponArray: couponArray
            })
          } else {
            couponArr.push(item)
            this.setData({
              couponArr: couponArr
            })
          }
        })

        console.log(this.data.couponArray)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000,
        })
        this.setData({
          noCunqon: true
        })
      }

    })
  },
  // 立即使用的二维码
  showQrCode: function (e) {
    var that = this
    wx.request({
      url: app.globalData.hostName + '/user/coupon/setCoupon',
      type: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        coupon_id: e.target.dataset.coupon
      },
      responseType: 'arraybuffer',
      success: (res) => {
        that.setData({
          imgUrl: wx.arrayBufferToBase64(res.data),
          couponNumber: e.target.dataset.num
        })
      }
    })

    this.setData({
      couponId: e.target.dataset.coupon,
      showCouponModal: true
    })
  },
  // 使用记录
  toUseDetail: function () {
    wx.navigateTo({
      url: './coupon-details/details',
    })
  },
  // 分享
  toShareCoupon: function () {

  },
  // 赠送给好友
  onShareAppMessage: function (res) {
    this.data.couponId = res.target.dataset.coupon
    if (res.from === 'button') {
      // 来自页面内转发按钮
      couponModel.shareCoupon(this.data.couponId, response => {
        console.log(response)
      })
    } else { }
    console.log('couponId', this.data.couponId)
    return {
      title: '送给你一张免费洗车券',
      path: 'pages/mine/basic-function/coupon/share/share?userId=' + this.data.userId + '&&couponId=' + this.data.couponId,
      imageUrl: '/images/xiche.jpg',
      // 成功的回调
      success: (res) => { },
      // 失败的回调
      fail: (res) => { },
      // 无论成功与否的回调
      complete: (res) => { }
    }
  },
  // 下拉加载更多
  onPullDownRefresh() {
    this.getCouponList()
  }
})