// 账户
Page({
  data: {

  },
  onLoad: function (options) {

  },
  toCash: function(e) {
    wx.showToast({
      title: '提现功能暂不开放!',
      icon: 'none'
    })
  },
  // 账户明细
  beanDetails: function(e) {
    wx.navigateTo({
      url: '../../common/bean-details/bean',
    })
  }
})