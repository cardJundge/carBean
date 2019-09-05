var md5 = require('../../../utils/md5.js');
var common = require('../../../utils/common.js');
import location from '../../../utils/area.js';
var util = require('../../../utils/eutil.js');
var redis = require('../../../utils/redis.js');
var CryptoJS = require('../../../utils/aes.js');

var app = getApp();

var test1 = getApp().globalData.hostName;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_agree:true,
    projectName:{
      num:''
    },
    orderstate:true,
    phonenumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.policyId){
      app.globalData.policyId = options.policyId;
    }
    

    console.log("222222",app.globalData.policyId);
    var that = this;

    that.setData({
      phonenumber: options.policyphone
    })

    app.globalData.phonenumber = that.data.phonenumber;

    that.data.policy_id = options.policy;

    that.data.userId = app.globalData.userInfo.id
    that.data.sessionId = app.globalData.userInfo.session_id


    // getpolicephone(that);

    // that.getToken();

    wx.getSystemInfo({
      success: function (res) {
        if ((res.system).substring(0, 3) == 'iOS') {
          that.data.model = 'ios';
        } else {
          that.data.model = 'android'
        }

        if (redis.getkey("chedoutoken")) {
          that.data.token = redis.getkey('chedoutoken');
          app.globalData.etoken = that.data.token

          that.getInfoCommon();
          // that.getHistorylist();
        } else {
          that.orderlist();
        }
      },
      fail: function (res) {
        console.log("res" + JSON.stringify(res));
      }
    })

    if (app.globalData.add!= null ){
      that.setData({
        address: app.globalData.add,
        etitle: app.globalData.add,
        drivernum: app.globalData.drivernum
      })
    }




    that.data.projectName.num = options.card_length;

    app.globalData.num = that.data.projectName.num;

    that.setData({
      num: that.data.projectName.num
    })

    
    if(options.title ==''){

      that.getlocation();

    }else{


      driverlist().then(function (res) {

        var driverList = res.data.driverList;

        var idleList = [];

        for (var i = 0; i < driverList.length; i++) {

          var itemdriver = driverList[i];
          if (itemdriver.state == "0") {  //空闲

            if (itemdriver.distance.substring(itemdriver.distance.length - 2) == '公里' || itemdriver.distance.substring(itemdriver.distance.length - 2) == '千米') {

              var distance = itemdriver.distance.replace(/(千米|米|公里)/g, "");
              var distance = distance + "000";
              idleList.push(distance);

            } else {

              var distance = itemdriver.distance.replace(/(千米|米|公里)/g, "");
              idleList.push(distance)
            }
          }
        }

        app.globalData.drivernum = idleList.length;
        if (idleList.length > 0) {

          //取最小值
          var min = Math.min.apply(null, idleList);

          //获取小数点的位置
          var y = String(min).indexOf(".");

          if (y == -1) {

            that.setData({
              drivernum: idleList.length,
              isdistance: false,
              distance: min,
              unit: '米'
            })

          } else {
            that.setData({
              drivernum: idleList.length,
              isdistance: false,
              distance: min,
              unit: '千米'
            })

          }

        } else {


          that.setData({
            drivernum: idleList.length,
            isdistance: true
          })
        }
      });

      that.setData({
        address:options.address,
        etitle: options.title
        // phonenumber:options.phone
      })

    }

  },


  getInfoCommon:function(){

    var that = this;

    getInfo(data => {
      console.log("fff" + JSON.stringify(data));
      if (data.status == 1) {

        app.globalData.orderId = data.data.order_id;

        //status订单状态0：已下单，1：已完成，2：已取消
        if (data.data.status == 0) {

          that.drivers();

          // if (data.data.bookingId != null && data.data.order_id != null &&
          //   data.data.driverId != null && data.data.token != null) {

          //   app.globalData.bookingId = data.data.bookingId;
          //   app.globalData.driverId = data.data.driverId;
          //   app.globalData.orderId = data.data.order_id;
          //   app.globalData.pollingCount = "1";
          //   app.globalData.etoken = data.data.token;
          //   app.globalData.etel = data.data.driver_phone;

          //   wx.navigateTo({
          //     url: '../driverstate/driverstate',
          //   })

          // }

        }
        // else{

        //   // wx.showModal({
        //   //   title: '提示',
        //   //   content: '有未完成的订单，请联系e代驾客服',
        //   // })
        //   that.drivers();

        // }

      }
    })
  },


  //获取为我服务的司机(此接口获取用户进行中的订单)
  drivers: function () {

    var that = this;
    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'gpsTypebaidu' + 'pollingCount1'  + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'gpsTypebaidu' + 'pollingCount1' + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl + '/customer/info/drivers',
      method: 'GET',
      data: {
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        gpsType: 'baidu',
        pollingCount: 1,
        timestamp: currenttime,
        token: that.data.token,
        ver: '3.4.2',
        sig: hash
      },
      success: function (res) {
        
        if(res.data.code == 0){

          //订单未完成
          if (res.data.data.drivers.length > 0){

            if (res.data.data.drivers[0].orders[0].orderStateCode == "101"){
              
              app.globalData.end_address = res.data.data.drivers[0].locationEnd;
              app.globalData.bookingId = res.data.data.drivers[0].bookingId;
              app.globalData.driverId = res.data.data.drivers[0].orders[0].driverId;
              app.globalData.orderId = res.data.data.drivers[0].orders[0].orderId;
              app.globalData.etel = res.data.data.drivers[0].orders[0].phone;

              app.globalData.pollingCount = res.data.data.pollingCount;

              //下单时间
              app.globalData.eordertime = wx.getStorageSync("eordertime")

              wx.navigateTo({
                url: '../verificationCode/waitOrder/waitOrder?phone=' + that.data.phonenumber,
              })

            } else if (res.data.data.drivers[0].orders[0].orderStateCode == "301" || res.data.data.drivers[0].orders[0].orderStateCode == "302" || res.data.data.drivers[0].orders[0].orderStateCode == "303"){

              app.globalData.end_address = res.data.data.drivers[0].locationEnd;
              app.globalData.bookingId = res.data.data.drivers[0].bookingId;
              app.globalData.driverId = res.data.data.drivers[0].orders[0].driverId;
              app.globalData.orderId = res.data.data.drivers[0].orders[0].orderId;
              app.globalData.etel = res.data.data.drivers[0].orders[0].phone;

              app.globalData.pollingCount = res.data.data.pollingCount;

              //下单时间
              app.globalData.eordertime = wx.getStorageSync("eordertime")

              console.log("&&&&&&&&");

              wx.navigateTo({
                url: '../driverstate/driverstate',
              })
            }
            
          // 订单已完成
          } else {

            that.toDetail();

          }
        }
        
      },
      fail: function (res) {
        console.log("失败" + res)

        // wx.navigateTo({
        //   url: '../driverstate/driverstate',
        // })
      }

    })

  },

  //订单详情
  toDetail: function () {

    var that = this;
    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'needAll' + 1 + 'orderId' + app.globalData.orderId + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'needAll' + 1 + 'orderId' + app.globalData.orderId + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);
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
        needAll: 1,
        orderId: app.globalData.orderId,
        timestamp: currenttime,
        token: that.data.token,
        sig: hash,
        ver: '3.4.2'
      },
      success: function (res) {

        if(res.code == "0"){
          app.globalData.income = res.data.data.income;
          app.globalData.totalDistance = res.data.data.distance;
          app.globalData.end_address = res.data.data.locationEnd;

          completegetInfo(res => {
            console.log("上传结果", res)
          })
        }

      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));
      }
    })

  },

  //我的订单
  orderlist1:function(){
    wx.navigateTo({
      url: '../orderlist/orderlist?phone=' + this.data.phonenumber,
    })
  },


  

  //获取地理位置和调用e代驾获取周边空闲司机
  getlocation:function(){

    var that = this;
    location.getLocetion(that).then(function () {

      console.log("*****" + app.globalData.location.latLong.long + app.globalData.location.latLong.lat);

      driverlist().then(function (res) {

        var driverList = res.data.driverList;

        var idleList = [];

        for (var i = 0; i < driverList.length; i++) {

          var itemdriver = driverList[i];
          if (itemdriver.state == "0") {  //空闲

            if (itemdriver.distance.substring(itemdriver.distance.length - 2) == '公里' || itemdriver.distance.substring(itemdriver.distance.length - 2) == '千米') {

              var distance = itemdriver.distance.replace(/(千米|米|公里)/g, "");
              var distance = distance + "000";
              idleList.push(distance);

            } else {

              var distance = itemdriver.distance.replace(/(千米|米|公里)/g, "");
              idleList.push(distance)
            }
          }
        }

        app.globalData.drivernum = idleList.length;
        if (idleList.length > 0) {

          //取最小值
          var min = Math.min.apply(null, idleList);

          //获取小数点的位置
          var y = String(min).indexOf(".");

          if (y == -1) {

            that.setData({
              drivernum: idleList.length,
              isdistance: false,
              distance: min,
              unit: '米'
            })

          } else {
            that.setData({
              drivernum: idleList.length,
              isdistance: false,
              distance: min,
              unit: '千米'
            })

          }

        } else {


          that.setData({
            drivernum: idleList.length,
            isdistance: true
          })
        }
      });


      if (app.globalData.location.poistitle) {
        that.setData({
          address: app.globalData.location.address,
          // phonenumber: app.globalData.userAllInfor.mobile,
          etitle: app.globalData.location.poistitle,
        })
      }else{

      }
    })
  },

  orderstate:function(){
    wx.navigateTo({
      url: '../driverstate/driverstate',
    })
  },


  bindblur:function(e){
    
    var that = this;
    that.data.phonenumber = e.detail.value;
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (option) {
    var that = this;
    that.setData({
      num:app.globalData.num
    })
  },

  drivingmap:function(e){

    var that = this;

    wx.getSetting({
      success:res=>{
        if (!res.authSetting['scope.userLocation']){
          wx.openSetting({
            success:res=>{
              console.log("ddddd",res)
              if (res.authSetting['scope.userLocation']){
                  that.getlocation();
              }             
            }
          })
        }else{
          wx.navigateTo({
            url: '../drivingmap/drivingmap?phone=' + this.data.phonenumber + '&project=' + this.data.projectName.num,
          })
        }
      }
    })

    
    
    // wx.redirectTo({
    //   url: '../drivingmap/drivingmap?phone=' + this.data.phonenumber + '&project=' + this.data.projectName.num,
    // })
  },

  isAgree:function(){
    var that = this;

    if (that.data.is_agree){
      that.setData({
        is_agree:false
      })
    }else{
      that.setData({
        is_agree: true
      })
    }
  },

  callcar:function(){

    var that = this;

    app.globalData.add = this.data.address;

    console.log("%%%%%%", app.globalData.add);
    
    
    // wx.navigateTo({
    //   url: '../verificationCode/verificationCode?phone=' + this.data.phonenumber,
    // })

    that.placeorder();

  },

  //下单
  placeorder:function(){

    var that = this;

    console.log("dayin",that.data.token);

    order(that).then(function (res) {

      if (res.data.code == '0') {

        app.globalData.bookingId = res.data.data.bookingId;
        app.globalData.bookingType = res.data.data.bookingType;
        app.globalData.timeout = res.data.data.timeout;
        app.globalData.orderTime = res.data.data.orderTime;

        console.log("打印", that.data);

        wx.navigateTo({
          url: '../verificationCode/waitOrder/waitOrder?phone=' + that.data.phonenumber,
        })

      } else {
        wx.showToast({
          title: res.data.message,
        })
      }

    }, function (reason, data) {
      wx.showToast({
        title: '下单失败!',
      })
    })
  },



  //h5免登获取token
  orderlist: function () {
    var that = this;
    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'os' + that.data.model + 'phone' + that.data.phonenumber + 'randomkeyABCDEFG123456789timestamp' + currenttime + 'udid' + app.globalData.appkey + 'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'os' + that.data.model + 'phone' + that.data.phonenumber + 'randomkeyABCDEFG123456789timestamp' + currenttime + 'udid' + app.globalData.appkey + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl + '/customer/getAuthenToken',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        os: that.data.model,
        phone: that.data.phonenumber,
        randomkey: 'ABCDEFG123456789',
        timestamp: currenttime,
        sig: hash,
        udid: app.globalData.appkey,
        ver: '3.4.2'
      },
      success: function (res) {
        console.log('成功' + JSON.stringify(res));

        var key = CryptoJS.enc.Utf8.parse("ABCDEFG123456789");
        var decryptData = CryptoJS.AES.decrypt(res.data.data, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });
        //对数据进行Utf-8设置,便成功解密了数据,生成result
        var result = decryptData.toString(CryptoJS.enc.Utf8);

        console.log("解密" + result);
        that.data.token = result.substring(6);

        app.globalData.etoken = that.data.token

        redis.put("chedoutoken", that.data.token, 24 * 60 * 60)

        that.getInfoCommon();

      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));
      }
    })


  },

  //获取用户token免登
  // getToken: function () {
  //   var that = this;
  //   var currenttime = util.formatTime(new Date());

  //   md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'os' + that.data.model + 'phone' + that.data.phone + 'randomkeyABCDEFG123456789timestamp' + currenttime + 'udid' + app.globalData.appkey + 'ver3.4.2' + app.globalData.secret);
  //   var hash = md5.create();
  //   hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'os' + that.data.model + 'phone' + that.data.phone + 'randomkeyABCDEFG123456789timestamp' + currenttime + 'udid' + app.globalData.appkey + 'ver3.4.2' + app.globalData.secret);
  //   hash = hash.hex().substring(0, 30);

  //   wx.request({
  //     url: app.globalData.httpurl + '/customer/getAuthenToken',
  //     method: 'GET',
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     data: {
  //       appkey: app.globalData.appkey,
  //       from: app.globalData.efrom,
  //       os: that.data.model,
  //       phone: that.data.phone,
  //       randomkey: 'ABCDEFG123456789',
  //       timestamp: currenttime,
  //       sig: hash,
  //       udid: app.globalData.appkey,
  //       ver: '3.4.2'
  //     },
  //     success: function (res) {
  //       console.log('成功' + JSON.stringify(res));

  //       var key = CryptoJS.enc.Utf8.parse("ABCDEFG123456789");
  //       var decryptData = CryptoJS.AES.decrypt(res.data.data, key, {
  //         mode: CryptoJS.mode.ECB,
  //         padding: CryptoJS.pad.Pkcs7
  //       });
  //       //对数据进行Utf-8设置,便成功解密了数据,生成result
  //       var result = decryptData.toString(CryptoJS.enc.Utf8);

  //       console.log("解密" + result);
  //       that.data.token = result.substring(6);

  //       redis.put("token", that.data.token, 24 * 60 * 60)

  //     },
  //     fail: function (res) {
  //       console.log('失败' + JSON.stringify(res));
  //     }
  //   })

  // },



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

  onUnload:function(){
    // var pages = getCurrentPages();
    
    // console.log("FFFFf",pages.length);
    // wx.navigateBack({
    //   delta: pages.length-1
    // })

  }
})

function getInfo(callback) {
  var param = {
    url: '/user/user/order_status',
    data: {
      user_id: app.globalData.userInfo.id
    },
    type: 'GET',
    sCallback: function (data) {
      callback && callback(data);
    }
  };

  common.requestInfor(param);
}

function driverlist(){

  return new Promise(function (resolve, reject){

    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from'+app.globalData.efrom+'gpsTypebaidulatitude' + app.globalData.location.latLong.lat + 'longitude' + app.globalData.location.latLong.long+'timestamp' + currenttime + 'udid'+app.globalData.appkey+'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'gpsTypebaidulatitude' + app.globalData.location.latLong.lat + 'longitude' + app.globalData.location.latLong.long + 'timestamp' + currenttime + 'udid' + app.globalData.appkey + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl+'/driver/idle/list',
      method: 'GET',
      data: {
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        longitude: app.globalData.location.latLong.long,
        gpsType: 'baidu',
        latitude: app.globalData.location.latLong.lat,
        udid: app.globalData.appkey,
        timestamp: currenttime,
        ver: '3.4.2',
        sig: hash
      },
      success: function (res) {

        resolve(res);
        


      },
      fail: function (res) {
        console.log("失败" + res)
      }

    })

  })

}

//服务端完成order
function completegetInfo(callback) {
  var param = {
    url: '/user/user/orderUpdate',
    data: {
      order_id: app.globalData.orderId,
      status: 1,
      price: app.globalData.income,
      end_time: util.formatTime(new Date()),
      mileage: app.globalData.totalDistance,
      end_address: app.globalData.end_address,
      id:app.globalData.eid
    },
    type: 'POST',
    sCallback: function (data) {
      callback && callback(data);
    }
  };

  common.requestInfor(param);
}

//获取保单手机号
function getpolicephone(that){
  return new Promise(function (resolve, reject) {

    wx.request({
      url: test1 + '/user/user/policyMobile',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      data:{
        policy_id: that.data.policy_id
      },
      success:function(res){
        console.log("kkk",res)
        if (res.data.status==1){
          that.setData({
            phonenumber:res.data.data
          })
        }
      }
      
    })

  })
}


//下单接口
function order(that) {

  return new Promise(function (resolve, reject) {

    var currenttime = util.formatTime(new Date());
    var address = app.globalData.add;
    

    //address = encodeURI(address);

    console.log(address);
    console.log(currenttime);
    console.log(that.data.token);
    console.log("app.globalData.location.latLong.long", app.globalData.location.latLong.long);

    // 116.920432,40.523288 密云水库

    // lng: 116.467941, lat: 40.012249 （纬度） 叶青大厦

  // 密云古北口站  40.7  lng 117.15

    // md5(app.globalData.secret + 'address北京叶青大厦appkey' + app.globalData.appkey + 'channel' + app.globalData.appkey + 'contactPhone' + that.data.phonenumber + 'from' + app.globalData.efrom +'gpsTypebaidulatitude40.012249longitude116.467941number1phone' + that.data.phonenumber + 'strategyId1000052strategyServiceSign7894a0136ff94096a4a9timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);

    md5(app.globalData.secret + 'address' + address + 'appkey' + app.globalData.appkey + 'channel' + app.globalData.appkey + 'contactPhone' + that.data.phonenumber + 'from' + app.globalData.efrom + 'gpsTypebaidulatitude' + app.globalData.location.latLong.lat + 'longitude' + app.globalData.location.latLong.long + 'number1phone' + that.data.phonenumber + 'strategyId1000123strategyServiceSign38aca56816beb721907etimestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);

    // md5(app.globalData.secret + 'address大杨山国家森林公园' + 'appkey' + app.globalData.appkey + 'channel' + app.globalData.appkey + 'contactPhone' + app.globalData.ephone + 'from' + app.globalData.efrom + 'gpsTypebaidulatitude40.28323' + 'longitude116.466056' + 'number1phone' + app.globalData.ephone + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);


    var hash = md5.create();
    hash.update(app.globalData.secret + 'address' + address + 'appkey' + app.globalData.appkey + 'channel' + app.globalData.appkey + 'contactPhone' + that.data.phonenumber + 'from' + app.globalData.efrom + 'gpsTypebaidulatitude' + app.globalData.location.latLong.lat + 'longitude' + app.globalData.location.latLong.long + 'number1phone' + that.data.phonenumber + 'strategyId1000123strategyServiceSign38aca56816beb721907etimestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);


    // hash.update(app.globalData.secret + 'address北京叶青大厦appkey' + app.globalData.appkey + 'channel' + app.globalData.appkey + 'contactPhone' + that.data.phonenumber + 'from' + app.globalData.efrom + 'gpsTypebaidulatitude40.012249longitude116.467941number1phone' + that.data.phonenumber + 'strategyId1000052strategyServiceSign7894a0136ff94096a4a9timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret); 

    hash = hash.hex().substring(0, 30);

    console.log("hash" + hash);

    wx.request({
      url: app.globalData.httpurl + '/order/commit',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        address: address,
        // address:"北京叶青大厦",
        appkey: app.globalData.appkey,
        channel: app.globalData.appkey,
        contactPhone: that.data.phonenumber,
        from: app.globalData.efrom,
        gpsType: 'baidu',
        latitude: app.globalData.location.latLong.lat,
        longitude: app.globalData.location.latLong.long,
        // latitude:"40.012249",
        // longitude:"116.467941",
        number: "1",
        phone: that.data.phonenumber,
        // strategyId: '1000052',
        // strategyServiceSign: '7894a0136ff94096a4a9',

        strategyId: '1000123',
        strategyServiceSign: '38aca56816beb721907e',
        timestamp: currenttime,
        token: that.data.token,
        sig: hash,
        ver: '3.4.2'
      },
      success: function (res) {
        console.log('成功' + JSON.stringify(res));

        resolve(res);
      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));
        reject(res)
      }
    })
  })
}