// 优惠券使用明细
import {
  Coupon
} from '../../../models/couponmodel.js'
var couponModel = new Coupon()
var app = getApp()
Page({
  data: {
    noCunqon: false
  },
  onLoad: function (options) {
    this.getCouponRecord()
  },
  getCouponRecord: function () {
    couponModel.couponRecord(res => {
      console.log(res)
      if (res.status == 1) {
        this.setData({
          detailList: res.data,
          noCunqon: false
        })
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
  }
})