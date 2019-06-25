// 积分兑换支付页面
Page({
  data: {
    showPayModal: false
  },
  onLoad: function (options) {

  },
  toPayProduct: function(e) {
    this.setData({
      showPayModal: true
    })
  },
  toAddress: function(e) {
    wx.navigateTo({
      url: ' ../address/address',
    })
  },
  // 确认支付
  toConfirmPay: function(e) {
    wx.redirectTo({
      url: '../payment-success/success',
    })
  }
})