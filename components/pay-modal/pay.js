// 支付豆子弹出框
Component({
  properties: {
    show: Boolean
  },
  data: {

  },
  methods: {
    hideModal: function(e) {
      this.setData({
        show: false
      })
    },
    toConfirm: function(e) {
      this.triggerEvent('confirm')
    }
  }
})