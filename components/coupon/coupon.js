// 弹出领取优惠券
import {
  Coupon
} from '../../pages/mine/models/couponmodel.js'
var coupon = new Coupon()

Component({
  properties: {
    show: Boolean,
    couponId: Number
  },
  data: {

  },
  methods: {
    hideModal: function(e) {
      this.setData({
        show: false
      })
    },
    getCoupon: function(e) {
      coupon.getCoupon(this.data.couponId, res => {
        console.log(res)
        if (res.status == 1) {
          wx.showToast({
            title: '领取成功，快去个人中心查看并使用吧...',
            duration: 2000,
            icon: 'none'
          })
          this.setData({
            show: false
          })
        } else {
          wx.showToast({
            title: '您已经领过优惠券了',
            duration: 2000,
            icon: 'none'
          })
          this.setData({
            show: false
          })
        }
      })

    }
  }
})