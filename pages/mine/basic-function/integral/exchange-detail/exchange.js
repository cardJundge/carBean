// 商品兑换详情
Page({
  data: {
    exchangeNull: true
  },
  onLoad: function (options) {

  },
  onNavigate:function(e) {
    wx.navigateTo({
      url: '../integral',
    })
  }
})