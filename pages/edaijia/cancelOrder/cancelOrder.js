// pages/index/service/cancelOrder/cancelOrder.js


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

    var num = 180;
    
    that.data.time = setInterval(function(){

      var minutes = Math.floor(num / 60);
      var seconds = Math.floor(num % 60);

      if (seconds<10){
        seconds = '0' + seconds;
      }

      var countdown = "00:0" + minutes +':'+ seconds;

      num--;

      if(num<0){
        clearInterval(that.data.time)
      }

      that.setData({
        countdown: countdown
      })

    },1000)
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

  suretemporarily:function(){

    clearInterval(this.data.time);
    wx.navigateTo({
      url: '../sureCancel/sureCancel',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  canceltemporarily: function() {

    wx.navigateBack({
      delta: 1,
    })
  }
})