import {
  Bean
} from '../../../common/models/bean.js';

var beanModel = new Bean();

var app = getApp();

// 积分兑换
Page({
  data: {

  },
  onLoad: function (options) {
    var that = this


    beanModel.getBeanNum(app.globalData.userInfo.id, 1, (res) => {

      if (res.status == 1){
        that.setData({
          mybean:res.bean
        })
      }else{
        that.setData({
          mybean: 0
        })
      }
    })

  },
  // 去选择地址
  goAddressTap: function(e) {
    wx.navigateTo({
      url: './address/address',
    })
  },
  // 积分兑换详情
  toExchangeDetail: function(e) {
    wx.navigateTo({
      url: './exchange-detail/exchange',
    })
  }
})