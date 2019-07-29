import {
  Base
} from '../../../utils/base.js';
var base = new Base()

class Coupon extends Base {
  // 领取优惠券
  getCoupon(couponId, callback) {
    var params = {
      url: '/user/coupon/getCoupon',
      type: 'POST',
      data: {
        coupon_id: couponId
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 优惠券列表
  couponList(callback) {
    var params = {
      url: '/user/coupon/couponList',
      type: 'POST',
      sCallback: callback
    }
    this.request(params)
  }

  // 优惠券使用记录
  couponRecord(callback) {
    var params = {
      url: '/user/coupon/couponRecord',
      type: 'POST',
      sCallback: callback
    }
    this.request(params)
  }

  // 使用优惠券
  // useCoupon(couponId, callback) {
  //   var params = {
  //     url: '/user/coupon/setCoupon',
  //     type: 'GET',
  //     data: {
  //       coupon_id: couponId
  //     },
  //     responseType: 'arraybuffer',
  //     sCallback: callback
  //   }
  //   this.request(params)
  // }

  // 分享优惠券
  shareCoupon(couponId, callback) {
    var params = {
      url: '/user/coupon/grant',
      type: 'GET',
      data: {
        coupon_id: couponId
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 获赠优惠券的前置操作
  checkCoupon(couponId, callback) {
    var params = {
      url: '/user/coupon/checkCoupon',
      type: 'GET',
      data: {
        coupon_id: couponId
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 小伙伴点击领取优惠券
  toReceiveCoupon(couponId, userId, callback) {
    var params = {
      url: '/user/coupon/given',
      type: 'POST',
      data: {
        coupon_id: couponId,
        user_id: userId
      },
      sCallback: callback
    }
    this.request(params)
  }
}

export {
  Coupon
}