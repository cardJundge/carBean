// pages/common/member/registered/code/code.js
var app = getApp();
import { Codemode } from 'codemode.js'
import { Car } from '../../../models/car.js'
import { Member } from '../../../models/member.js'
import { Servicesdetails } from '../../../../services/servicesdetails/servicesdetailsmode.js';
var servicesdetails = new Servicesdetails();

var codemode = new Codemode();
var carmode = new Car();
var memberModel = new Member();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputLen: 4,
    iptValue: "",
    isFocus:false,
    sendMessage: true,
    limit:60,
    service:""
  },

  
  onLoad:function(options){
    
    var that = this;

    if (options.service){
      that.data.service = options.service
    }

    that.data.usertel = app.globalData.baseuserinformation.usertel

    that.setData({
      usertel: that.data.usertel 
    })

    that.data.time = setInterval(function(){

      --that.data.limit;

      that.setData({
        limit: that.data.limit
      })

      if(that.data.limit == 0){
        clearInterval(that.data.time)
        that.setData({
          sendMessage:false
        })
      }

    },1000)
  },
  
  onFocus:function(e){
    var that = this;
    that.setData({ isFocus: true });
  },

  setValue: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({ iptValue: e.detail.value });
  },

  //验证码验证
  verificationCode:function(e){

    var that = this;

    wx.showLoading({
      title: '请稍后!',
    })
    
    that.data.username = app.globalData.baseuserinformation.username;

    codemode.verifyCode(that.data.usertel, that.data.username, that.data.iptValue,res=>{
      
      if(res.status == 1){

        //已绑定车辆
        if (res.is_car==1){

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

                    // wx.redirectTo({
                    //   url: '../payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
                    // })
                    wx.navigateTo({
                      url: '../../../../services/payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
                    })

                  } else {

                    wx.hideLoading();

                    wx.showToast({
                      title: '下单失败！',
                    })
                  }
                })
                // wx.navigateTo({
                //   url: '../../../../services/servicesdetails/servicesdetails?detail=' + detail.id + "&shopname=" + detail.short_name + '&order=' + detail.order + '&comment=' + detail.comment + '&distance=' + detail.distance + '&name=' + detail.name + '&type=' + detail.type + '&address=' + detail.address + '&lng=' + JSON.stringify(detail.location),
                // })
              } else {

                wx.hideLoading();

                wx.showToast({
                  title: '登录失败!',
                  duration: 2000,
                  icon: "none"
                })
              }

            })

          } else {

            wx.hideLoading();
            wx.redirectTo({
              url: '../../bronze/bronze',
            })

          }

        }else{

          wx.hideLoading();

          // wx.navigateTo({
          //   url: '../binding/binding?service=' + that.data.service,
          // })

          wx.redirectTo({
            url: '../binding/binding?service=' + that.data.service,
          })

        }

      } 
      // else if (res.status == 2){

        // wx.hideLoading();

        // wx.navigateTo({
        //   url: '../binding/binding?service=' + that.data.service,
        // })
        
      // } 
      else{

        wx.hideLoading();

        wx.showToast({
          title: "验证码验证失败！",
          duration: 2000,
          icon: "none"
        })

      }
    })
  },

  //重新发送验证码
  sendMessage:function(){
    var mobile = app.globalData.baseuserinformation.usertel;
    codemode.sendMSM(mobile,res=>{
     
      if(res.status == 1){
        wx.showToast({
          title: '验证码发送成功!',
          duration:2000,
          icon:"none"
        })
      }else{
        wx.showToast({
          title: '验证码发送失败!',
          duration: 2000,
          icon: "none"
        })
      }
    })
  }

  
})