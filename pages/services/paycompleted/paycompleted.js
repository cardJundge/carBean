// pages/services/paycompleted/paycompleted.js

// 引入SDK核心类
var QQMapWX = require('../../../qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ' // 必填
});
import { Services } from '../servicesmode.js';
import { Base } from '../../../utils/base.js';

import { Config } from '../../../utils/config.js'

var base = new Base();
var services = new Services();

var app = getApp();
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    total:[],
    region:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    that.data.region[2] = app.globalData.region;
    

    that.data.keywords = app.globalData.keywords;
    that.data.sort = 'order',
    that.data.typeStore = app.globalData.typeStore;

    services.getServiceList(that,res=>{
      console.log("tt",res)

      if(res.status == 1){

        var temparr = [];
        that.data.servicelist = res.service

        if (res.service.length > 0){

          base.distance(demo, res.service, (data) => {

            temparr.push(data);

            if (temparr.length == that.data.servicelist.length) {

              base.sort(temparr, res => {

                that.data.total = that.data.total.concat(temparr);

                that.setData({
                  servicelist: that.data.total,
                  hostName: Config.restUrl
                })

                console.log("qq", that.data.servicelist);
              })
            }
          })
        }
      }
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

  onUnload: function (e) {

    

  },

  back:function(){
    var pages = getCurrentPages();
     
    wx.navigateBack({
      delta: pages.length
    })
  },

  orderlist:function(e){
    // wx.navigateTo({
    //   url: '../orderlist/orderlist',
    // })

    wx.redirectTo({
      url: '../orderlist/orderlist',
    })
  }
})