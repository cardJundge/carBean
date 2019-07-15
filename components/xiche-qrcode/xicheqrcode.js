// 洗车优惠券

Component({
  properties: {
    show: Boolean,
    imgCouponUrl: String
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
