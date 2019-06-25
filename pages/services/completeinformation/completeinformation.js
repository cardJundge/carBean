// pages/services/completeinformation/completeinformation.js
import { Codemode } from '../../common/member/registered/code/codemode.js';

import { Member } from '../../common/models/member.js'

import { Servicesdetails } from '../servicesdetails/servicesdetailsmode.js';
var servicesdetails = new Servicesdetails();

var memberModel = new Member();

var codemode = new Codemode();
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    codetext:"获取验证码",
    //1是铜牌会员 空是服务下单验证的
    type:""  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if(options.service){
      this.data.service = options.service
      this.data.type=""
    } else if (options.agent) {
      this.data.agent = options.agent
    } else {
      this.data.type = "1"
    }
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

  //获取验证码
  obtaincode:function(e){

    var that = this;

    var regPhone = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/

    if (regPhone.test(that.data.mobile)){
      
      codemode.sendMSM(that.data.mobile, res => {
        console.log("res", res);

        if (res.status == 1) {
          wx.showToast({
            title: '验证码已发送',
            duration: 2000,
            icon: "none"
          })

          that.setData({
            codetext: "重新发送"
          })
        }
      })

    }else{

      wx.showToast({
        title: '请核对您的手机号码',
        icon: 'none',
        duration: 2000
      })
    }
  
  },

  //获取手机号
  obtaintel:function(e){
    var that = this;
    that.setData({
      mobile: e.detail.value
    })
  },

  //完成
  formSubmit:function(e){

    var that = this;
    console.log("eee",e);

    wx.showLoading({
      title: '请稍后!',
    })

    var regPhone = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/

    if (regPhone.test(that.data.mobile) && e.detail.value.code) {

      

      codemode.verifyCode(that.data.mobile, that.data.type, e.detail.value.code, res => {

        if(res.status == 1){

          //已绑定车辆
          // if (res.is_car == 1) {

            if (that.data.service) {

              var detail = app.globalData.servicelistitem;

              memberModel.toLogin(app.globalData.userInfo.unionId, '114', res => {

                if (res.status == 1) {

                  app.globalData.userInfo = res.data;

                  that.data.serviceitemid = app.globalData.serviceitemid;
                  that.data.serviceitemclassify = app.globalData.serviceitemclassify;
                  that.data.serviceitemprice = app.globalData.serviceitemprice;
                  that.data.userid = app.globalData.userInfo.id;

                  servicesdetails.setOrder(that, res => {

                    console.log("ddd", res);

                    if (res.status == 1) {

                      wx.hideLoading();

                      app.globalData.serviceorderid = res.order.id;

                      wx.navigateTo({
                        url: '../payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
                      })

                    } else {

                      wx.hideLoading();

                      wx.showToast({
                        title: '下单失败！',
                      })
                    }
                  })

                } else {

                  wx.hideLoading();

                  wx.showToast({
                    title: '登录失败!',
                    duration: 2000,
                    icon: "none"
                  })
                }

              })

            } else if(that.data.agent) {
              memberModel.toLogin(app.globalData.userInfo.unionId, '114', res => {
                if (res.status == 1) {
                  app.globalData.userInfo = res.data;
                  memberModel.toAgentOrder(app.globalData.userInfo.id, wx.getStorageSync("agentType"), (res) => {
                    if (res.status == 1) {
                      wx.redirectTo({
                        url: '../../common/member/agent/order/order',
                      })
                    }
                  })
                }
              })
            }else {

              //绑定的车辆
              if (res.is_car == 1){

                wx.hideLoading();
                wx.redirectTo({
                  url: '../../common/member/bronze/bronze',
                })

              }else{
                wx.hideLoading();

                wx.redirectTo({
                  url: '../../common/member/registered/binding/binding?usertel=' + that.data.mobile,
                })
              }
            }

          // }else{

          //   wx.hideLoading();

          //   wx.redirectTo({
          //     url: '../binding/binding?service=' + that.data.service,
          //   })

          // }

        } else if (res.status == -2){

          wx.hideLoading();

          wx.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none"
          })
        } else if (res.status == 0){

          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none"
          })
        }else{

          wx.hideLoading();

          wx.showToast({
            title: res.msg,
            duration: 2000,
            icon: "none"
          })
        }
      })
  
    }else{

      wx.hideLoading();

      wx.showToast({
        title: '请核对您的手机号码和验证码',
        icon: 'none',
        duration: 2000
      })

    }

    
  }



})