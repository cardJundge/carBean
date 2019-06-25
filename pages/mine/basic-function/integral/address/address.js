// 收货地址
Page({
  data: {
    addressNull: false
  },
  onLoad: function (options) {

  },
  // 跳转到添加地址信息
  onNavigate: function(e) {
    wx.navigateTo({
      url: '../add-address/add',
    })
  },
  editAddressInfo: function(e) {
    wx.navigateTo({
      url: '../add-address/add',
    })
  },
  toPay: function(e) {
    wx.navigateTo({
      url: '../payment/payment',
    })
  }
})