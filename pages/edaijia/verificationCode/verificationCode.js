var md5 = require('../../../utils/md5.js');
var util = require('../../../utils/eutil.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendMessage:true,
    inputLen:4,
    iptValue: "",
    isFocus: false,
  },


  onFocus: function (e) {
    var that = this;
    that.setData({ isFocus: true });
  },
  setValue: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({ iptValue: e.detail.value });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    wx.getSystemInfo({
      success:function(res){

        console.log("fff",res);

        if ((res.system).substring(0, 3) =='iOS'){

          that.data.model='ios';
        }else{

          that.data.model ='android'
        }
      },
      fail:function(res){
        console.log("res"+JSON.stringify(res));
      }
    })

    var phone = options.phone;

    app.globalData.ephone = phone;

    that.setData({
      phone:phone
    })

    sendSMS(that).then(function (that) {


      wx.showToast({
        title: '短信已发送',
      })

    }, function (reason, data){

      //处理短信发送失败
      wx.showToast({
        title: '短信发送失败',
      })

    });
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

  codeinput:function(e) {
    
    var that = this;

    if(e.detail.value.length == 1){
      
      if (e.currentTarget.id == 'num1'){

        that.setData({
          code1: false,
          code2:true
        })

      } else if (e.currentTarget.id == 'num2'){

        that.setData({
          code2: false,
          code3: true
        })

      } else if (e.currentTarget.id == 'num3') {

        that.setData({
          code3: false,
          code4: true
        })

      } else if (e.currentTarget.id == 'num4') {

        that.setData({
          code4: false
        })
      }
      
    }
    
  },

  sendMessage:function(){

    var that = this;
    sendSMS(that).then(function(){

      that.setData({
        sendMessage:true
      })
    });

  },

  verificationCode:function(e){

    var that = this;

    // wx.navigateTo({
    //   url: 'waitOrder/waitOrder',
    // })

    // var smsCode = e.detail.value.num1 + e.detail.value.num2 + e.detail.value.num3 + e.detail.value.num4;

    var smsCode = that.data.iptValue;

    console.log("手机号" + app.globalData.ephone + smsCode);
    
    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'Os' + that.data.model + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom +'passwd' + smsCode + 'phone' + app.globalData.ephone + 'timestamp' + currenttime + 'type' + 1 + 'udid' + app.globalData.appkey + 'ver3.4.2' + app.globalData.secret);  
    var hash = md5.create();    
    hash.update(app.globalData.secret + 'Os' + that.data.model + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'passwd' + smsCode + 'phone' + app.globalData.ephone + 'timestamp' + currenttime + 'type' + 1 + 'udid' + app.globalData.appkey + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);
    
    wx.request({
      url: app.globalData.httpurl+'/customer/login',
      method: 'GET',
      data: {
        udid: app.globalData.appkey,
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        phone: app.globalData.ephone,
        type: 1,
        timestamp: currenttime,
        ver: '3.4.2',
        passwd: smsCode,
        Os: that.data.model,
        sig: hash
      },
      success: function (res) {

        console.log('成功' + JSON.stringify(res));

        if(res.data.code == "0"){

          that.data.token = res.data.token;
          app.globalData.etoken = res.data.token;

          wx.setStorage({
            key: 'token',
            data: res.data.token,
          })

    
          order(that).then(function(that){

            if(that.data.code == '0'){

              app.globalData.bookingId = that.data.data.bookingId;
              app.globalData.bookingType = that.data.data.bookingType;
              app.globalData.timeout = that.data.data.timeout;
              app.globalData.orderTime = that.data.data.orderTime;

              wx.navigateTo({
                url: 'waitOrder/waitOrder',
              })

            }else{
              wx.showToast({
                title: '下单失败!',
              })
            }

          },function(reason,data){
            wx.showToast({
              title: '下单失败!',
            })
          })

        }else{

          wx.showToast({
            title: '验证码不正确!',
          })

        } 

      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));

        wx.showToast({
          title: '验证码不正确!',
        })
        
      }
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

  }
})

function sendSMS(that){
  return new Promise(function (resolve, reject){

    var phone = app.globalData.mobile;

    console.log("shoujihao" + app.globalData.ephone);

    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'phone' + app.globalData.ephone + 'timestamp' + currenttime + 'type' + 1 + 'udid' + app.globalData.appkey+'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'phone' + app.globalData.ephone + 'timestamp' + currenttime + 'type' + 1 + 'udid' + app.globalData.appkey + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl+'/customer/loginpre',
      method: 'GET',
      data: {
        udid: app.globalData.appkey,
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        phone: app.globalData.ephone,
        type: 1,
        timestamp: currenttime,
        ver: '3.4.2',
        sig: hash
      },
      success: function (res) {
        console.log('成功' + JSON.stringify(res));

        if(res.data.code == "0"){

          var limit = res.data.data.limit;
          var time = setInterval(function () {

            that.setData({
              limit: limit
            })
            limit--
            if (limit < 0) {
              clearInterval(time)
              that.setData({
                sendMessage: false
              })
            }
          }, 1000)

          resolve(that)

        }else{
            
          reject("验证码发送失败")
        }

      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));
        reject(res)
      }
    })
  })
}

//下单接口
function order(that){

  return new Promise(function (resolve, reject){

    var currenttime = util.formatTime(new Date());
    var address = app.globalData.add;
    var latlng = app.globalData.elatlong;


    //address = encodeURI(address);

    console.log(address);
    console.log(latlng.lat);
    console.log(latlng.long);
    console.log(currenttime);
    console.log(that.data.token);

    // 116.920432,40.523288 密云水库

    // md5(app.globalData.secret + 'address北京古北口站appkey' + app.globalData.appkey + 'channel61000161contactPhone' + app.globalData.ephone + 'from01012345gpsTypebaidulatitude40.7longitude117.15number1phone' + app.globalData.ephone + 'strategyId1000030strategyServiceSign1d73af77d84b95d20b1atimestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);

    md5(app.globalData.secret + 'address' + address + 'appkey' + app.globalData.appkey + 'channel' + app.globalData.appkey + 'contactPhone' + app.globalData.ephone + 'from' + app.globalData.efrom + 'gpsTypebaidulatitude' + app.globalData.location.latLong.lat + 'longitude' + app.globalData.location.latLong.long + 'number1phone' + app.globalData.ephone + 'strategyId1000123strategyServiceSign38aca56816beb721907etimestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);

    // md5(app.globalData.secret + 'address大杨山国家森林公园' + 'appkey' + app.globalData.appkey + 'channel' + app.globalData.appkey + 'contactPhone' + app.globalData.ephone + 'from' + app.globalData.efrom + 'gpsTypebaidulatitude40.28323' + 'longitude116.466056' + 'number1phone' + app.globalData.ephone + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);

    
    var hash = md5.create();
    hash.update(app.globalData.secret + 'address' + address + 'appkey' + app.globalData.appkey + 'channel' + app.globalData.appkey + 'contactPhone' + app.globalData.ephone + 'from' + app.globalData.efrom + 'gpsTypebaidulatitude' + app.globalData.location.latLong.lat + 'longitude' + app.globalData.location.latLong.long + 'number1phone' + app.globalData.ephone + 'strategyId1000123strategyServiceSign38aca56816beb721907etimestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret); 


    // hash.update(app.globalData.secret + 'address大杨山国家森林公园' + 'appkey' + app.globalData.appkey + 'channel' + app.globalData.appkey + 'contactPhone' + app.globalData.ephone + 'from' + app.globalData.efrom + 'gpsTypebaidulatitude40.28323' + 'longitude116.466056' + 'number1phone' + app.globalData.ephone + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret); 
    
    hash = hash.hex().substring(0, 30);

    console.log("hash"+hash);

    wx.request({
      url: app.globalData.httpurl+'/order/commit',
      method: 'POST',
      header:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        address:address,
        // address:"大杨山国家森林公园",
        appkey: app.globalData.appkey,
        channel: app.globalData.appkey,
        contactPhone: app.globalData.ephone,
        from: app.globalData.efrom,
        gpsType:'baidu',
        latitude: app.globalData.location.latLong.lat,
        longitude: app.globalData.location.latLong.long, 
        // latitude:"40.28323",
        // longitude:"116.466056",
        number: "1",
        phone: app.globalData.ephone,
        strategyId: '1000123',
        strategyServiceSign:'38aca56816beb721907e',
        timestamp: currenttime,
        token:that.data.token,
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






