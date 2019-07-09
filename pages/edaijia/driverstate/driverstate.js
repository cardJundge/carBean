var md5 = require('../../../utils/md5.js');
import location from '../../../utils/area.js';
var util = require('../../../utils/eutil.js');
import commond from '../../../utils/common.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    driverstate:[
    // {
    //   content:'西安电子科技大学',
    //   time:'2019-04-09 12:21:30'
    // },{
    //   content: '西安电子科技大学科技园',
    //   time: '2019-04-09 12:27:30'
    // }
    ],
    is_callphone:false,
    
    isDistance:false,
    lng:'',
    lat:'',
    driverposition:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    that.setData({
      etel: app.globalData.etel
    })

    getInfo(data => {
      console.log("GGG"+JSON.stringify(data))
      
    })

    that.data.driverstate = [{
      content: '司机已接单',
      time: app.globalData.eordertime
    }]

    that.driverPosition();

    // var currenttime = util.formatTime(new Date());

    // md5(app.globalData.secret + 'appkey' + app.globalData.appkey+'from01012345gpsTypebaidupollingCount1timestamp' + currenttime + 'token'+app.globalData.etoken+'ver3.4.2'+app.globalData.secret);
    // var hash = md5.create();
    // hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from01012345gpsTypebaidupollingCount1timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);
    // hash = hash.hex().substring(0, 30);

    // wx.request({
    //   url: 'http://open.d.api.edaijia.cn/customer/info/drivers',
    //   method: 'GET',
    //   data: {
    //     appkey: app.globalData.appkey,
    //     from: '01012345',
    //     gpsType: 'baidu',
    //     pollingCount:'1',
    //     timestamp: currenttime,
    //     token:app.globalData.etoken,
    //     ver: '3.4.2',
    //     sig: hash
    //   },
    //   success: function (res) {

    //     console.log("成功"+JSON.stringify(res));
    //     that.driverPosition();
      
    //   },
    //   fail: function (res) {
    //     console.log("失败" + res)
    //   }

    // })
    
    // that.setData({
    //   driverstate: this.data.driverstate
    // })
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

  callphone:function(){

    this.setData({
      is_callphone:true
    })
  },

  bgcancel:function(){

    this.setData({
      is_callphone: false
    })
  },

  surecall:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.etel,
    })
  },

  cancelorder:function(){
    wx.navigateTo({
      url: '../cancelOrder/cancelOrder',
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

  driverPosition:function(){
    var that = this;

    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'bookingId' + app.globalData.bookingId + 'driverId' + app.globalData.driverId + 'from' + app.globalData.efrom+'gpsTypebaiduorderId' + app.globalData.orderId + 'pollingCount' + app.globalData.pollingCount+'timestamp' + currenttime + 'token'+app.globalData.etoken+'ver3.4.2'+app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'bookingId' + app.globalData.bookingId + 'driverId' + app.globalData.driverId + 'from' + app.globalData.efrom + 'gpsTypebaiduorderId' + app.globalData.orderId + 'pollingCount' + app.globalData.pollingCount + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);
   
    wx.request({
      url: app.globalData.httpurl+'/driver/position',
      method: 'GET',
      data: {
        appkey: app.globalData.appkey,
        bookingId: app.globalData.bookingId,
        driverId: app.globalData.driverId,
        from: app.globalData.efrom,
        gpsType: 'baidu',
        orderId: app.globalData.orderId,
        pollingCount: app.globalData.pollingCount,
        timestamp: currenttime,
        token: app.globalData.etoken,
        ver: '3.4.2',
        sig: hash
      },
      success: function (res) {

        console.log("成功" + JSON.stringify(res));
        var orderAllStates = res.data.data.driver.orderAllStates;

        app.globalData.pictureSmall = res.data.data.driver.pictureSmall;
        app.globalData.drivername = res.data.data.driver.name;
        app.globalData.driverId = res.data.data.driver.driverId;

        that.setData({
          driverimgurl: res.data.data.driver.pictureSmall,
          drivername: res.data.data.driver.name,
          driverId: res.data.data.driver.driverId
        })

        //已接单
        if (res.data.data.driver.orderStateCode == '301'){

          // for (var item of orderAllStates){
          //   that.data.driverposition = item;
          //   var timestamps = item.orderStateTimestamp;
          //   var timestamp = util.formatTime(new Date(parseInt(timestamps)*1000))

          //   var temp2 = 'driverposition.orderStateTimestamp'
           
          //   that.setData({
          //     [temp2]: timestamp
          //   })

          //   that.data.driverstate.push(that.data.driverposition);

            // that.setData({
            //   driverimgurl: res.data.data.driver.pictureSmall,
            //   driverstate: that.data.driverstate,
            //   realtimeDistance: res.data.data.driver.realtimeDistance,
            //   drivername:res.data.data.driver.name,
            //   driverId: res.data.data.driver.driverId
            // })
          //}
          // that.time(parseInt(res.data.data.next));

          if (that.data.lng != res.data.data.driver.longitude || that.data.lat != res.data.data.driver.latitude){
          that.data.lng = res.data.data.driver.longitude;
          that.data.lat = res.data.data.driver.latitude;
            location.reverseGeocoder(that).then(function(data){
              that.data.driverposition = {
              content: data[0].title,
              time: currenttime
            }
            that.data.driverstate.push(that.data.driverposition);
            that.setData({
              driverstate: that.data.driverstate,
              realtimeDistance: res.data.data.driver.realtimeDistance,
            })    
          
              
              console.log("UUU" + JSON.stringify(that.data.driverstate) + that.data.driverstate.length);
          }) 
       }

          that.time(parseInt(res.data.data.next));
          //已就位
        } else if (res.data.data.driver.orderStateCode == '302'){

          that.setData({
            isDistance: true
          })

          // for (var item of orderAllStates) {
          //   that.data.driverposition = item;
          //   var timestamps = item.orderStateTimestamp;
          //   var timestamp = util.formatTime(new Date(parseInt(timestamps) * 1000))

          //   var temp2 = 'driverposition.orderStateTimestamp'

          //   that.setData({
          //     [temp2]: timestamp
          //   })

          //   that.data.driverstate.push(that.data.driverposition);

          //   that.setData({
          //     driverstate: that.data.driverstate
          //   })
          // }

          // that.time(parseInt(res.data.data.next));

         

          if (that.data.lng != res.data.longitude || that.data.lat != res.data.latitude) {
          that.data.lng = res.data.data.driver.longitude;
          that.data.lat = res.data.data.driver.latitude;
            location.reverseGeocoder(that).then(function (data) {
              that.data.driverposition = {
                content: data[0].title,
                time: currenttime
              }
              that.data.driverstate.push(that.data.driverposition);
              that.setData({
                driverstate: that.data.driverstate,
                realtimeDistance: res.data.data.driver.realtimeDistance,
              })

             
              console.log("UUU" + JSON.stringify(that.data.driverstate));
            })
          }

          that.time(parseInt(res.data.data.next));

          //已开车
        } else if (res.data.data.driver.orderStateCode == '303') {

          that.setData({
            isDistance: true
          })

          // for (var item of orderAllStates) {
          //   that.data.driverposition = item;
          //   var timestamps = item.orderStateTimestamp;
          //   var timestamp = util.formatTime(new Date(parseInt(timestamps) * 1000))

          //   var temp2 = 'driverposition.orderStateTimestamp'

          //   that.setData({
          //     [temp2]: timestamp
          //   })

          //   that.data.driverstate.push(that.data.driverposition);

          //   that.setData({
          //     driverstate: that.data.driverstate
          //   })
          // }
          //that.time(parseInt(res.data.data.next));

         if (that.data.lng != res.data.longitude || that.data.lat != res.data.latitude) {

          that.data.lng = res.data.data.driver.longitude;
          that.data.lat = res.data.data.driver.latitude;

            location.reverseGeocoder(that).then(function (data) {

              that.data.driverposition = {
                content: data[0].title,
                time: currenttime
              }

              that.data.driverstate.push(that.data.driverposition);

              that.setData({
                driverstate: that.data.driverstate,
                realtimeDistance: res.data.data.driver.realtimeDistance,
              })

             
              console.log("UUU" + JSON.stringify(that.data.driverstate));
            })
          }

          that.time(parseInt(res.data.data.next));

          //304: 代驾结束 403: 用户取消 404: 司机销单 501: 司机报单
        } else if (res.data.data.driver.orderStateCode == '304') {

          that.setData({
            isDistance: true
          })

          // for (var item of orderAllStates) {
          //   that.data.driverposition = item;
          //   var timestamps = item.orderStateTimestamp;
          //   var timestamp = util.formatTime(new Date(parseInt(timestamps) * 1000))

          //   var temp2 = 'driverposition.orderStateTimestamp'

          //   that.setData({
          //     [temp2]: timestamp
          //   })

          //   that.data.driverstate.push(that.data.driverposition);

          //   that.setData({
          //     driverstate: that.data.driverstate
          //   })
          // }

          // that.time(parseInt(res.data.data.next));

          if (that.data.lng != res.data.longitude || that.data.lat != res.data.latitude) {

          that.data.lng = res.data.data.driver.longitude;
          that.data.lat = res.data.data.driver.latitude;

            location.reverseGeocoder(that).then(function (data) {

              that.data.driverposition = {
                content: data[0].title,
                time: currenttime
              }

              that.data.driverstate.push(that.data.driverposition);

              that.setData({
                driverstate: that.data.driverstate,
                realtimeDistance: res.data.data.driver.realtimeDistance
              })

              
              console.log("UUU" + JSON.stringify(that.data.driverstate));
            })
          }

          that.time(parseInt(res.data.data.next));

        } else if (res.data.data.driver.orderStateCode == '403'){

          clearTimeout(that.data.time)

        }else if (res.data.data.driver.orderStateCode == '501'){

          app.globalData.getofftime = currenttime;

          wx.navigateTo({
            url: '../epay/epay',
          })
          
        }else{

          that.time(parseInt(res.data.data.next));
        }

      },
      fail: function (res) {
        console.log("失败" + res)
      }

    })

  },

  // drivers:function(){
  //   var that = this;
  //   var currenttime = util.formatTime(new Date());
  //   md5(app.globalData.secret + 'appkey' + app.globalData.appkey +  'from01012345gpsTypebaidu' + 'pollingCount' + app.globalData.pollingCount + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);
  //   var hash = md5.create();
  //   hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from01012345gpsTypebaidu' + 'pollingCount' + app.globalData.pollingCount + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);
  //   hash = hash.hex().substring(0, 30);

  //   wx.request({
  //     url: 'https://open.d.api.edaijia.cn/customer/info/drivers',
  //     method: 'GET',
  //     data: {
  //       appkey: app.globalData.appkey,
  //       from: '01012345',
  //       gpsType: 'baidu',
  //       pollingCount: app.globalData.pollingCount,
  //       timestamp: currenttime,
  //       token: app.globalData.etoken,
  //       ver: '3.4.2',
  //       sig: hash
  //     },
  //     success: function (res) {
        
  //       console.log("ddddddddd"+JSON.stringify(res));
  //       app.globalData.end_address = res.data.data.drivers[0].locationEnd;

  //     },
  //     fail: function (res) {
  //       console.log("失败" + res)
  //     }

  //   })

  // },

  time: function (t) {

    var that = this;

    that.data.time = setTimeout(function () {

      that.driverPosition();
     
    }, t * 1000)
  },
})


function getInfo(callback) {
  var param = {
    url: '/user/user/order_repair',
    data: {
      token: app.globalData.etoken,
      bookingId: app.globalData.bookingId,
      driverId: app.globalData.driverId,
      order_id: app.globalData.orderId,
      driver_phone: app.globalData.etel
    },
    type: 'POST',
    sCallback: function (data) {
      callback && callback(data);
    }
  };

  commond.requestInfor(param);
}