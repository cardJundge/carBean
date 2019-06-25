// pages/common/member/registered/registered.js
import { Codemode } from './code/codemode.js';

var codemode = new Codemode();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    service:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    if (options.service){
      that.data.service = options.service
    }
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //基本信息提交
  formSubmit:function(e){

    var  that = this;

    var username = e.detail.value.username;
    var usertel = e.detail.value.usertel;

    var regPhone = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
    var regName = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
    if (regPhone.test(usertel) && regName.test(username)) {

      codemode.sendMSM(usertel,res=>{
        
        app.globalData.baseuserinformation = {
          username: username,
          usertel:usertel
        }
        // wx.navigateTo({
        //   url: './code/code?service=' + that.data.service,
        // })

        wx.redirectTo({
          url: './code/code?service=' + that.data.service,
        })
      })

    }else{

      wx.showToast({
        title: '请核对您的手机号码和姓名',
        icon: 'none',
        duration: 2000
      })
    }
  }

  
})