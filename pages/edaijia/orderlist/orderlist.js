// pages/edaijia/orderlist/orderlist.js
var md5 = require('../../../utils/md5.js');
var util = require('../../../utils/eutil.js');
var redis = require('../../../utils/redis.js');
var CryptoJS = require('../../../utils/aes.js')


var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    eorder:[],
    pageNo:0,
    orderlist1:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.data.phone = options.phone;
    // wx.getSystemInfo({
    //   success: function (res) {
    //     if ((res.system).substring(0, 3) == 'iOS') {
    //       that.data.model = 'ios';
    //     } else {
    //       that.data.model = 'android'
    //     }

        
    //   },
    //   fail: function (res) {
    //     console.log("res" + JSON.stringify(res));
    //   }
    // })

    if (redis.getkey("chedoutoken")) {
      that.data.token = redis.getkey('chedoutoken');
      that.getHistorylist();
    }
   
  },




  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onPullDownRefresh:function(){

    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    if (redis.getkey("chedoutoken")) {
      that.data.token = redis.getkey('chedoutoken');
      that.data.pageNo++;
      that.getHistorylist();
    }
  },

  orderlist:function(){
    var that = this;
    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'os' + that.data.model + 'phone' + that.data.phone + 'randomkeyABCDEFG123456789timestamp'+ currenttime + 'udid' + app.globalData.appkey + 'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'os' + that.data.model+ 'phone' + that.data.phone +'randomkeyABCDEFG123456789timestamp'+ currenttime + 'udid' + app.globalData.appkey  + 'ver3.4.2' + app.globalData.secret);
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
        phone: that.data.phone,
        randomkey:'ABCDEFG123456789',
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

        redis.put("token", that.data.token, 24*60*60)

        that.getHistorylist();

      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));
      }
    })

  },

  //获取历史订单列表
  getHistorylist:function(){

    var that = this;

    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'pageNo' + that.data.pageNo + 'pageSize' + 10 + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'pageNo' + that.data.pageNo + 'pageSize' + 10 + 'timestamp' + currenttime + 'token' + that.data.token + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl + '/order/list',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        pageNo:that.data.pageNo,
        pageSize:10,
        timestamp: currenttime,
        token:that.data.token,
        sig: hash,
        ver: '3.4.2'
      },
      success: function (res) {

        wx.hideNavigationBarLoading()

        if(res.data.code == 0){
          that.data.orderlist1 = that.data.orderlist1.concat(res.data.data.orderList)

          that.setData({
            eorder: that.data.orderlist1
          })

          if (res.data.data.orderList.length == 0) {
            wx.showToast({
              title: '暂无数据了!',
            })
          }

        }
          
      },
      fail: function (res) {
        console.log('失败' + JSON.stringify(res));
      }
    })

  }
})

//解密方法
function Decrypt(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, "ABCDEFG123456789", { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);

  console.log("解密"+decryptedStr);
  return decryptedStr.toString();
}

/**
   * AES解密(ECB,NoPadding)
   */
function Decrypt_ecb(word) {
  var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypt = CryptoJS.AES.decrypt(srcs, "ABCDEFG123456789", { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.NoPadding });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Hex);
  return decryptedStr.toString();
}


