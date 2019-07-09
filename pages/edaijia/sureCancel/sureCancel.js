// pages/index/service/sureCancel/sureCancel.js

var util = require('../../../utils/eutil.js');
var md5 = require('../../../utils/md5.js');
var app = getApp();
var common = require('../../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    reason:[
      { name: '1', value: '司机到位太慢,等不急' },
      { name: '2', value: '代驾收费很贵', checked: 'true' },
      { name: '3', value: '司机要求取消订单' },
      { name: '4', value: '找到了其他代驾' },
      { name: '5', value: '暂时不需要代驾' }
    ],
    auto:true,
    num:5,
    cancelreason:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  cancelorder:function(e){

    console.log(JSON.stringify(e));

    var that = this;

    that._orderCancel();

    getInfo(data => {

      console.log("data"+JSON.stringify(data));
    })

    var num = that.data.num;
    var time = setInterval(function(){

      that.setData({
        num:num--
      })

      if (that.data.num == -1) {
        clearInterval(time);

        // wx.redirectTo({
        //   url: '../../driving_/driving_',
        // })

        let pages = getCurrentPages();    //获取当前页面信息栈
        let prevPage = pages[pages.length - 2]     //获取上一个页面信息栈

        wx.navigateBack({
          delta: pages.length - 3
        })

        that.setData({
          auto: true,
          num:5
        })
      }

    },1000)




  
    that.setData({
      auto:false
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

  checkboxChange:function(e){
    console.log(JSON.stringify(e));
    var that = this

    that.data.cancelreason=[];

    that.data.checkbox = e.detail.value;
    for (var item of that.data.checkbox){
        
      for (var i of that.data.reason){

        if(i.name == item ){

          that.data.cancelreason.push(i.value); 
        }
      }
    }

    console.log(JSON.stringify(that.data.cancelreason))
  },

  _orderCancel:function(){

    var that = this;
    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'bookingId' + app.globalData.bookingId + 'from' + app.globalData.efrom+'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2'+app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'bookingId' + app.globalData.bookingId + 'from' + app.globalData.efrom + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl+'/order/cancel',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        
        appkey: app.globalData.appkey,
        bookingId: app.globalData.bookingId,
        from: app.globalData.efrom,
        timestamp: currenttime,
        token: app.globalData.etoken,
        ver: '3.4.2',
        sig: hash

      },
      success: function (res) {
        console.log('成功' + JSON.stringify(res));

        // resolve(that);
      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));
        // reject(res)
      }
      
    })
  }
})

function getInfo(callback) {
  var param = {
    url: '/user/user/driving_cancel',
    data: {
      order_id: app.globalData.orderId
    },
    type: 'GET',
    sCallback: function (data) {
      callback && callback(data);
    }
  };

  common.requestInfor(param);
}