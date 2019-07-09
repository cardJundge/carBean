// pages/index/service/drivingmap/drivingmap.js
import location from '../../../utils/area.js';
var md5 = require('../../../utils/md5.js');
var util = require('../../../utils/eutil.js');
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    background:true,
    citybackground:true,
    mapshow:false,
    recommendshow:false,
    phone:'',
    projectName:{
      num:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.data.phone = options.phone;
    that.data.projectName.num = options.project;

    location.getLocetion(that).then(function(that){

      that.setData({
        latitude: app.globalData.location.latLong.lat,
        longitude: app.globalData.location.latLong.long,
        city: app.globalData.location.city,
        address:app.globalData.location.address,
        etitle: app.globalData.location.poistitle
      })
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

  obtainLocation:function(e){

    var that = this;
    var pois = app.globalData.location.pois; 

    console.log("pois",pois);

    that.setData({
      pois: pois,
      background:false,
      mapshow:true,
      recommendshow:true
    })

  },

  surelocation:function(e){
    console.log("fff",e);
    var that = this;
    that.data.keyword = e.detail.value;

    location.getSuggestion(that).then(function(res){

      that.setData({
        pois: res,
        background: false,
        mapshow: true,
        recommendshow: true
      })

    })

    
  },

  cancel:function(){

    var that = this
    that.setData({
      pois: "",
      background: true,
      citybackground: true,
      mapshow: false,
      recommendshow: false
    })
  },

  sureaddress:function(e){

    
    wx.redirectTo({
      url: '../driving_/driving_?title=' + this.data.etitle + '&phone=' + this.data.phone + '&card_length=' + this.data.projectName.num + "&address=" + this.data.address,
    })
  },

  confirmateAddress:function(e){
   
    var title = e.currentTarget.dataset.title;

    var address = e.currentTarget.dataset.address

    var location = e.currentTarget.dataset.location;

    app.globalData.location.latLong = {
      lat: location.lat,
      long: location.lng
    }

    wx.redirectTo({
      url: '../driving_/driving_?title=' + title + '&phone=' + this.data.phone + 
        '&card_length=' + this.data.projectName.num + "&address=" + address,
    })
  },

  selectcity:function(e){

    var that = this;

    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom+'timestamp' + currenttime + 'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'timestamp' + currenttime + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    that.data.hash = hash;
    that.data.currenttime = currenttime;

    obtaincity(that).then(function(res){

      var cityList = res.data.cityList;

         var citylist = [];
         for (var city in cityList) {
           citylist.push(city)
         }

         that.setData({
           citylist: citylist,
           citybackground: false,
           mapshow: true,
           recommendshow:true
         })
    })

    // wx.request({
    //    url: 'http://open.d.api.edaijia.cn/city/open/list',
    //    method: 'GET',
    //    data:{
    //      appkey: app.globalData.appkey,
    //      from: '01012345',
    //      timestamp: currenttime,
    //      ver: '3.4.2',
    //      sig: hash
    //    },
    //    success:function(res){
    //      var cityList = res.data.cityList;
         
    //      var citylist = [];
    //      for (var city in cityList) {
    //        citylist.push(city)
    //      }

    //      that.setData({
    //        citylist: citylist,
    //        citybackground: false,
    //        mapshow: true
    //      })
   
    //    },
    //    fail:function(res){
    //      console.log('失败'+res);
    //    }
    //  })

  },

  selectcityitem:function(e){
    
    var that = this;

    var city = e.currentTarget.dataset.city;

    that.data.addresss = city;

    location.geocoder(that).then(function(that1){

      that.data.lat = that1.result.location.lat;
      that.data.lng = that1.result.location.lng;

      location.reverseGeocoder(that).then(function(that1){

        // console.log("FFF"+JSON.stringify(that1));
        that.setData({
          city: city,
          citybackground: true,
          background: false,
          pois: that1
        })


      })

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

function obtaincity(that,callback){

  return new Promise(function (resolve, reject){

    wx.request({
      url: app.globalData.httpurl +'/city/open/list',
      method: 'GET',
      data: {
        appkey: app.globalData.appkey,
        from: app.globalData.efrom,
        timestamp: that.data.currenttime,
        ver: '3.4.2',
        sig: that.data.hash
      },
      success: function (res) {

        // callback && callback(res)
        resolve(res);
      },
      fail: function (res) {
        console.log('失败' + res);
      }
    })

  })  
}