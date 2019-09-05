// pages/edaijia/fee/fee.js
var app = getApp();

var util = require('../../../utils/eutil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    var fee = app.globalData.fee;

    const endTime = fee.endTime;
    const startTime = fee.startTime;

    var cash = parseInt(fee.collectionFeeParse.totalMileageFee.amount) - parseInt(fee.vip)

    that.setData({
      fee: fee,
      endTime:util.formatTime(new Date(parseInt(endTime)*1000)),
      cash: cash,
      startTime: util.formatTime(new Date(parseInt(startTime) * 1000))
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

 
})