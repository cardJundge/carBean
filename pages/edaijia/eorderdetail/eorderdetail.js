var redis = require('../../../utils/redis.js');
var md5 = require('../../../utils/md5.js');
var util = require('../../../utils/eutil.js');

var app = getApp();

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

    that.data.orderId = options.orderid;
    that.data.token = redis.getkey("chedoutoken");

    that.toDetail();

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

  //跳转费用详情
  detailsofcharges:function(e){
    
    app.globalData.fee = e.currentTarget.dataset.orderdetails
    wx.navigateTo({
      url: '../fee/fee',
    })
  },

  toDetail:function(){

    var that = this;
    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom +'needAll' + 1 + 'orderId' + that.data.orderId  + 'timestamp' + currenttime  +'token'+that.data.token + 'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'needAll' + 1 + 'orderId' + that.data.orderId + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl + '/order/detail',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        needAll:1,
        orderId: that.data.orderId,
        timestamp: currenttime,
        token:that.data.token,
        sig: hash,
        ver: '3.4.2'
      },
      success: function (res) {
        console.log('成功' + JSON.stringify(res));

        app.globalData.orderId = res.data.data.orderId;

        that.setData({
          orderdetails:res.data.data
        })
        
      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));
      }
    })

  }

  
})