// 开通成功
Page({
  data: {

  },
  onLoad: function (options) {

  },
  toIndex: function(e) {
    wx.reLaunch({
      url: '../../index/index',
    })
  }
})