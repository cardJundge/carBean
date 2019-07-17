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
    this.data.sessionId = app.globalData.userInfo.session_id
    this.getCouponList()
  },
  getCouponList: function() {
    couponModel.couponList(res=> {
      if(res.status == 1) {
        this.setData({
          noCunqon: false
        })
        var couponArr = []
        var couponArray = []
        res.data.forEach((item) => {
          item.start_time = item.start_time.substring(0, 10).split('-').join('/')
          item.end_time = item.end_time.substring(0, 10).split('-').join('/')
          if (item.status == 2) {
            couponArray.push(item)
            this.setData({
              couponArray: couponArray
            })
            console.log
          } else {
            couponArr.push(item)
            this.setData({
              couponArr: couponArr
            })
          }
        })

        console.log(this.data.couponArray)
      } else {
        this.setData({
          noCunqon: true
        })
      }
      
    })
  },
  // 立即使用的二维码
  showQrCode: function(e) {
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
      success: (res)=> {
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
  toUseDetail: function() {
    wx.navigateTo({
      url: './coupon-details/details',
    })
  },
  // 下拉加载更多
  onPullDownRefresh() {
    this.getCouponList()
  },
})