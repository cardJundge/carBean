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
  onLoad: function(options) {
   this.getCouponRecord()
  },
  getCouponRecord: function() {
    couponModel.couponRecord(res => {
      console.log(res)
      if(res.status == 1) {
        res.data.forEach((item) => {
          item.use_time = item.use_time.substring(0, 16)
        })
        this.setData({
          detailList: res.data,
          noCunqon: false
        })
      } else {
        this.setData({
          noCunqon: true
        })
      }
    })
  }
})