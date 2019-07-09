var md5 = require('../../../utils/md5.js');
var common = require('../../../utils/common.js');
import location from '../../../utils/area.js';
var util = require('../../../utils/eutil.js');

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

    
    app.globalData.policyId = options.policyId;
    

    var that = this;

    that.data.policy_id = options.policy;

    that.data.userId = app.globalData.userInfo.id
    that.data.sessionId = app.globalData.userInfo.session_id


    getpolicephone(that);

    if (app.globalData.add!= null ){
      that.setData({
        address: app.globalData.add,
        etitle: app.globalData.add,
        drivernum: app.globalData.drivernum
      })
    }

    getInfo(data=>{
      console.log("fff"+JSON.stringify(data));

      if(data.data.status == 0){

        console.log(data.data.bookingId);

        if (data.data.bookingId != null && data.data.order_id != null && 
          data.data.driverId != null && data.data.token !=null){

          app.globalData.bookingId = data.data.bookingId;
          app.globalData.driverId = data.data.driverId;
          app.globalData.orderId = data.data.order_id;
          app.globalData.pollingCount = "1";
          app.globalData.etoken = data.data.token;
          app.globalData.etel = data.data.driver_phone;

          wx.navigateTo({
            url: '../driverstate/driverstate',
          })

        }else{

          wx.showModal({
            title: '提示',
            content: '有未完成的订单，请联系e代驾客服',
          })
        }
        
      }
    })

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
        etitle: options.title,
        phonenumber:options.phone
      })

    }

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

    app.globalData.add = this.data.address;

    console.log("%%%%%%", app.globalData.add);
    
    
    wx.navigateTo({
      url: '../verificationCode/verificationCode?phone=' + this.data.phonenumber,
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
