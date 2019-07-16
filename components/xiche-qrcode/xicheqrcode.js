// 洗车优惠券

Component({
  properties: {
    show: Boolean,
    imgCouponUrl: String,
    couponNum: Number
  },
  data: {

  },
  methods: {
    hideModal: function (e) {
      this.setData({
        show: false,
      })
      // this.triggerEvent('hide', {})
    }
  }
})
