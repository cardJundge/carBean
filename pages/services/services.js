// 服务
var app = getApp();

// 引入SDK核心类
var QQMapWX = require('../../qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ' // 必填
});

import {Services} from 'servicesmode.js';
import { Base } from '../../utils/base.js';
import { Config } from '../../utils/config.js'

var base = new Base();

var services = new Services();

Page({
  data: {
    search:true,
    region:['陕西省','全部','全部'],
    customItem:'全部',
    servicelist:[],
    storeType: ['全部门店', '4s门店', '快修门店', '改装门店', '洗车美容', '道路救援', '轮胎门店'],
    sortArr: ['默认排序', '附近优先', '评分最高', '销量优先'],
    sortIndex: 0,
    storeIndex: 0,
    total:[],
    noservice1:true,
    server:'',
    locationshow:false,
    goodurl: Config.restUrl
  },
  onLoad: function (options) {

    var that = this;

    that.data.total = [];

    // that.data.keywords = '洗车',

    that.data.keywords = ''
    that.data.tags = ''
    that.data.page = 1

    // that.getservicelistcommond();

    services.highGrade(res=>{

      console.log("22222222",res);
      that.setData({
        goodservicelist:res.data
      })

    })

    that.setData({
      topactive: false
    })
  },

  bindRegionChange:function(e){

    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })

    this.data.page =1;
    this.data.total = [];
    this.getservicelistcommond();
  },

  bindPickerStore:function(e){

    var that = this;

    console.log("e.detail.value" + e.detail.value);


    if (that.data.storeType[e.detail.value] == "4s门店"){

      that.data.typeStore = "2"

    } else if (that.data.storeType[e.detail.value] == "快修门店"){

      that.data.typeStore = "5"

    } else if (that.data.storeType[e.detail.value] == "改装门店") {

      that.data.typeStore = "4"

    } else if (that.data.storeType[e.detail.value] == "洗车美容") {

      that.data.typeStore = "6"

    } else if (that.data.storeType[e.detail.value] == "道路救援") {

      that.data.typeStore = "8"

    } else if (that.data.storeType[e.detail.value] == "轮胎门店") {

      that.data.typeStore = "7"

    } else if (that.data.storeType[e.detail.value] == "全部门店") {

      that.data.typeStore = ""
    }

    this.data.page = 1;
    this.data.total = [];
    this.getservicelistcommond();
    
    this.setData({
      storeIndex:e.detail.value
    })
  },

  bindPickerSort:function(e){

    var that = this;
    that.data.page = 1;
    that.data.total = [];

    console.log("e.detail.value" + e.detail.value);

    if (that.data.sortArr[e.detail.value] == "评分最高"){

      that.data.sort = 'comment'

    } else if (that.data.sortArr[e.detail.value] == "附近优先"){

      that.data.sort = ''

    } else if (that.data.sortArr[e.detail.value] == "销量优先"){

      that.data.sort = 'order'

    } else if (that.data.sortArr[e.detail.value] == "默认排序") {

      that.data.sort = ''

    }

    that.getservicelistcommond();

    that.setData({
      sortIndex: e.detail.value
    })
  },

  //优质服务
  // goodservice1:function(){

  //   var that = this;

  //   wx.navigateTo({
  //     url: './servicestype/servicestype?server=优质保养',
  //   })

  // },

  //优质服务
  goodservice: function (e) {

    var that = this;

    wx.navigateTo({
      url: './servicestype/servicestype?goodserver=' + e.currentTarget.dataset.tag + '&goodtitle=' + e.currentTarget.dataset.title,
    })

  },

  //关闭登录模块
  // hideLoginModal:function(){

  //   app.getAuth(data => {
  //     app.getUserLogin(data, response => {
  //       console.log("hh", response);
  //       // wx.hideLoading();
  //       // that.data.userid = response.data.data.id
  //       app.globalData.userInfo = response.data.data
  //     })
  //   })
  // },

  onSearching: function(e) {
    wx.navigateTo({
      url: 'search/search',
    })
  },

  onShow: function (e){

    var that = this;

    // if(wx.getStorageSync("flag")){
      wx.getSetting({
        success: function (res) {
          if (!res.authSetting['scope.userLocation']) {
            that.setData({
              locationshow: true
            })
          }else{

            that.data.total = [];
            that.data.keywords = ''
            that.data.page = 1

            wx.getLocation({
              type: "gcj02",
              altitude: true,
              success(res) {
                base.reverseGeocoder(demo, res.latitude, res.longitude, res => {

                  var region = [];

                  region.push(res.province);
                  region.push(res.city);
                  region.push(res.district);

                  that.setData({
                    region: region
                  })

                  that.getservicelistcommond();

                })

              }
            })

            
          }
        }
      })
    // }
        
  },

  getservicelistcommond:function(){

    var that = this;

    app.globalData.region = that.data.region[2];
    app.globalData.keywords = that.data.keywords;

    app.globalData.typeStore = that.data.typeStore

    that.data.searchKeys = '',

    services.getServiceList(that, res => {

      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh() //停止下拉刷新

      if(res.status == 0){

        that.setData({
          noservice1:false,
          servicelist:[]
        })

      }else{

        that.data.servicelist = res.service

        var temparr = [];

        if (res.service.length == 0){

          that.setData({
            noservice1: false,
            servicelist: that.data.total
          })

        }else{

          wx.setStorageSync("flag", 2)

          base.distance(demo, res.service, (data) => {

            temparr.push(data);

            if (temparr.length == that.data.servicelist.length) {
 
              base.sort(temparr, res => {

                that.data.total = that.data.total.concat(temparr);

                that.setData({
                  servicelist: that.data.total,
                  hostName: Config.restUrl,
                  noservice1:true
                })
              })
            }
          })
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
    var that = this;
    that.data.page++;
    
    that.getservicelistcommond();
    
    wx.showNavigationBarLoading()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //显示导航条加载动画
    that.getservicelistcommond();
  },

})