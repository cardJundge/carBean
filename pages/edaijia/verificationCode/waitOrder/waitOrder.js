var util = require('../../../../utils/eutil.js');
var app = getApp();
var md5 = require('../../../../utils/md5.js');
var test1 = getApp().globalData.hostName;

import commond from '../../../../utils/common.js';



Page({

  /**
   * 页面的初始数据
   */
  data: {

    timeout:90,
    bookingType: '01003',
    pollingCount:1,
    bookingId:'c5af16bd894a6b2aeb35e2ccde15b854'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var orderTime = parseInt(app.globalData.orderTime)*1000;

    //订单请求的时间
    that.data.pollingStart = util.formatTime(new Date(orderTime));


    var address = app.globalData.add;

    console.log("FFFFFFF", address);
    var phone = app.globalData.ephone;


    that.setData({
      currenttime: that.data.pollingStart,
      address:address,
      phone:phone,
      timeout:app.globalData.timeout
    })

    var time = setInterval(function () {
      that.data.timeout--
      that.setData({
        timeout: that.data.timeout
      })

      if (that.data.timeout <= 0) {
        clearInterval(time)
      }
    }, 1000);

    polling(that).then(function(res){

      
      wx.setStorage({
        key: 'pollingCount',
        data: res.data.data.pollingCount,
      })
      wx.setStorage({
        key: 'driverId',
        data: res.data.data.driverId,
      })

      if (res.data.code == "0") {

        //继续请求
        if (res.data.data.pollingState == '0') {

          that.time(parseInt(res.data.data.next));
          // app.globalData.orderId = res.data.data.orderId;
          // app.globalData.pollingCount = res.data.data.pollingCount;
          // wx.navigateTo({
          //   url: '../../driverstate/driverstate',
          // })
        
          //派单失败
        } else if (res.data.data.pollingState == '1') {
          wx.showToast({
            title: '派单失败!',
          }) 
          //接单
        } else if (res.data.data.pollingState == '2') {
          
          app.globalData.orderId = res.data.data.orderId;
          app.globalData.pollingCount = res.data.data.pollingCount;
          app.globalData.driverId = res.data.data.driverId;
          //下单时间
          app.globalData.eordertime = util.formatTime(new Date());

          wx.setStorageSync('eordertime', app.globalData.eordertime);

          app.globalData.num --;

          getInfo(data=>{
            console.log(JSON.stringify(data));
            that.drivers();

          })

        }

      } else {

        wx.showToast({
          title: '无法获取订单信息!',
        })

        console.log("异常的值"+res.data.message);
      }
    })
  },

  callback:function(data){
    console.log();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  drivers: function () {

    var that = this;

    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom +'gpsTypebaidu' + 'pollingCount' + app.globalData.pollingCount + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'gpsTypebaidu' + 'pollingCount' + app.globalData.pollingCount + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl+'/customer/info/drivers',
      method: 'GET',
      data: {
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        gpsType: 'baidu',
        pollingCount: app.globalData.pollingCount,
        timestamp: currenttime,
        token: app.globalData.etoken,
        ver: '3.4.2',
        sig: hash
      },
      success: function (res) {

        console.log("ddddddddd" + JSON.stringify(res));
        app.globalData.end_address = res.data.data.drivers[0].locationEnd;
        app.globalData.etel = res.data.data.drivers[0].phone;

        wx.navigateTo({
          url: '../../driverstate/driverstate',
        })

      },
      fail: function (res) {
        console.log("失败" + res)

        wx.navigateTo({
          url: '../../driverstate/driverstate',
        })
      }

    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  cancelorder:function(){
    wx.navigateTo({
      url: '../../cancelOrder/cancelOrder',
    })

  },

  driverstate:function(){
    wx.navigateTo({
      url: '../../driverstate/driverstate',
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

  time: function(t){

    var that = this;

    var time = setTimeout(function(){

      polling(that).then(function(res){

        console.log("SSSSSSS" + JSON.stringify(res));
        console.log("SSSSSSS" + res.data.data.orderId);

        wx.setStorage({
          key: 'orderId',
          data: res.data.data.orderId,
        })

        if (res.data.code == "0") {

          //继续请求
          if (res.data.data.pollingState == '0') {

            that.time(parseInt(res.data.data.next));

            //派单失败
          } else if (res.data.data.pollingState == '1') {

            wx.showToast({
              title: '派单失败!',
            })
            //接单
          } else if (res.data.data.pollingState == '2') {

            app.globalData.orderId = res.data.data.orderId;
            app.globalData.pollingCount = res.data.data.pollingCount;
            app.globalData.driverId = res.data.data.driverId;
            //下单时间
            app.globalData.eordertime = util.formatTime(new Date());

            getInfo(data => {
              console.log(JSON.stringify(data))
              that.drivers();
            })

            clearInterval();

            // wx.navigateTo({
            //   url: '../../driverstate/driverstate',
            // })

          }
        }

      });
    },t*1000)
  },

})
4008103939
//代驾下单
function getInfo(callback){
  var param = {
    url: '/user/user/placeOrder',
    data:{
      user_id: app.globalData.userInfo.id,
      order_id: app.globalData.orderId,
      status:0,
      service_id: app.globalData.service_no,
      start_address: app.globalData.add,
      start_time: app.globalData.eordertime,
      policy_no: app.globalData.policyId,
      phone: app.globalData.ephone
    },
    type:'POST',
    sCallback: function (data) {
      callback && callback(data);
    }
  };

  commond.requestInfor(param);
}

function polling(that){
  return new Promise(function (resolve, reject){

    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'bookingId' + app.globalData.bookingId + 'bookingType' + app.globalData.bookingType + 'from' + app.globalData.efrom+'pollingCount1' + 'pollingStart' + currenttime + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2'+app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'bookingId' + app.globalData.bookingId + 'bookingType' + app.globalData.bookingType + 'from' + app.globalData.efrom + 'pollingCount1' + 'pollingStart' + currenttime + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);

    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl+'/order/polling',
      method: 'GET',
      data: {
        appkey: app.globalData.appkey,
        bookingId: app.globalData.bookingId,
        bookingType: app.globalData.bookingType,
        from: app.globalData.efrom,
        pollingCount: "1",
        pollingStart: currenttime,
        timestamp: currenttime,
        token: app.globalData.etoken,
        ver: '3.4.2',
        sig: hash
      },
      success: function (res) {
        console.log('成功' + JSON.stringify(res));

        resolve(res)
        
      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));

      }
    })

  })
}