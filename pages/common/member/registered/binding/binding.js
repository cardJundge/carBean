// pages/common/member/registered/bing/bing.js
var app = getApp();

import {Codemode} from '../code/codemode.js';
import { Member } from '../../../models/member.js';
import { Servicesdetails } from '../../../../services/servicesdetails/servicesdetailsmode.js';
var servicesdetails = new Servicesdetails();

var codemode = new Codemode();
var memberModel = new Member();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    // if (options.service){
    //   that.setData({
    //     service: options.service
    //   })
    // }

    that.data.usertel = options.usertel;

  },

  onShow:function(e){
    
    var that = this;

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    if (currPage.data.temp) {
      console.log("currPage.data.temp", currPage.data.temp);
      that.setData({
        carInfo: currPage.data.temp
      })
    }
  },

  //选择车辆类型
  toSelectBrand:function(e){

    wx.navigateTo({
      url: '../../../car/car-brand/car-brand',
    })
  },

  //绑定车辆
  formSubmit:function(e){

    var carid = e.detail.value.carid;

    wx.showLoading({
      title: '请稍后',
    })

    var reCar = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/
    var that = this
    if (reCar.test(carid)&& carid.length == 7) {

      codemode.toBronze(that.data.usertel, that.data.carInfo,carid,respones=>{

        if (respones.status == 1){
          memberModel.toLogin(app.globalData.userInfo.unionId, 'chedou', res => {

            if (res.status == 1) {

              app.globalData.userInfo = res.data;

              wx.showToast({
                title: '车辆绑定成功!',
                duration: 2000,
                icon: "none"
              })

              // if (that.data.service){

              //   that.data.serviceitemid = app.globalData.serviceitemid;
              //   that.data.serviceitemclassify = app.globalData.serviceitemclassify;
              //   that.data.serviceitemprice = app.globalData.serviceitemprice;
              //   that.data.userid = app.globalData.userInfo.id;

              //   servicesdetails.setOrder(that, res => {

              //     console.log("ddd", res);

              //     if (res.status == 1) {

              //       wx.hideLoading();

              //       app.globalData.serviceorderid = res.order.id;
              //       // wx.navigateTo({

              //       //   url: '../../../../services/payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
              //       // })

              //       wx.redirectTo({
              //         url: '../../../../services/payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
              //       })

              //     } else {
              //       wx.hideLoading();

              //       wx.showToast({
              //         title: '下单失败！',
              //       })
              //     }
              //   })

              // }else{

                wx.hideLoading();
                wx.navigateTo({
                  url: '../../bronze/bronze',
                })

              // }

            } else {

              wx.hideLoading();

              wx.showToast({
                title: '登录失败!',
                duration: 2000,
                icon: "none"
              })

            }
          })

        }else{

          wx.hideLoading();

          wx.showToast({
            title: '绑定车辆失败!',
            duration: 2000,
            icon: "none"
          })
        }
      })
    }else{

      wx.hideLoading();

      wx.showToast({
        title: '车牌号输入不正确!',
        duration:2000,
        icon:"none"
      })
    }
  }
})