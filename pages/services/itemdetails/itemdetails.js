// pages/services/itemdetails/itemdetails.js

import { Itemdetails } from 'itemdetailsmode.js';

import { Servicesdetails } from '../servicesdetails/servicesdetailsmode.js';
var servicesdetails = new Servicesdetails();

var itemdetails = new Itemdetails();

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stores:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    that.data.classify_id = options.classify_id;
    that.data.projectid = options.projectid;
    that.data.serviceid = app.globalData.serviceid;
    that.data.platform_price = options.platform_price;
    that.data.market_price = options.market_price;

    that.data.serviceitemid = that.data.projectid;
    that.data.serviceitemclassify = that.data.classify_id;
    that.data.serviceitemprice = that.data.platform_price;
    that.data.userid = app.globalData.userInfo.id;

    if (options.stores) {
      that.data.stores = options.stores.split(",")
    }
    
    itemdetails.getServiceprojectInfo(that,res=>{

      console.log("333",res);

      that.setData({
        projectInfo: res.data,
        platform_price: options.platform_price,
        market_price: options.market_price,
        distance:app.globalData.distance,
        order: options.order,
        stores: that.data.stores,
        hostName: app.globalData.hostName
      })

    })
  },

  //客服咨询
  callphone:function(e){
    this.setData({
      phoneshow: true
    })
  },

  // 关闭登录模态框
  hideLoginModal: function () {
    // this.setData({
    //   hasUser: true
    // })
    var that = this;

    wx.showLoading({
      title: '请等待...',
    })
    app.getAuth(data => {
      app.getUserLogin(data, response => {
        console.log("hh", response);
        wx.hideLoading();
        that.data.userid = response.data.data.id
        app.globalData.userInfo = response.data.data
      })
    })
  },

  //结算
  pay:function(){

    var that = this;

    if (that.data.projectid) {

      app.getSet(res => {
        if (!res) {
          that.setData({
            showLoginModal: true
          })
        } else {
          if (app.globalData.userInfo.mobile) {

            servicesdetails.setOrder(that, res => {

              console.log("ddd", res);

              if (res.status == 1) {

                app.globalData.serviceorderid = res.order.id;

                // wx.redirectTo({
                //   url: '../payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
                // })
                wx.navigateTo({
                  url: '../payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
                })

              } else {

                wx.showToast({
                  title: '下单失败！',
                })
              }
            })


          } else {

            // wx.navigateTo({
            //   url: '../../common/member/registered/registered',
            // })

            that.setData({
              usertelshow: true
            })
          }
        }
      })



    } else {

      wx.showToast({
        title: '请选择服务项',
      })
    } 

  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this;
    if (that.data.cancelorder) {
      wx.showToast({
        title: '订单取消成功!',
        duration: 2000
      })
    }
  },

  //补全信息
  onConfirm: function (e) {

    var that = this;

    wx.navigateTo({
      url: '../../common/member/registered/registered?service=service',
    })

  },

})