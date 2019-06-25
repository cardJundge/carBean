// pages/services/payment/payment.js

import { Config } from '../../../utils/config.js';
import { Payment } from 'paymentmode.js';

var payment = new Payment();

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    telphone:'',
    editMobile:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var ordertime = options.add_time;
    var orderno = options.order_no;

    that.data.serviceitem = app.globalData.servicedetail[app.globalData.servicedetailindex];

    console.log("333", that.data.serviceitem)

    app.globalData.serviceitem = that.data.serviceitem;
    
    if (app.globalData.userInfo.mobile){
      that.data.telphone = app.globalData.userInfo.mobile
    }else{
      that.data.telphone = options.telphone
    }
    that.setData({
      nickname: app.globalData.userInfo.nickname,
      telphone: that.data.telphone,
      shopname: app.globalData.service.short_name ? app.globalData.service.short_name : app.globalData.service.name,
      shopaddress: app.globalData.service.address,
      serviceface: app.globalData.serviceface,
      platform_price: that.data.serviceitem.platform_price,
      classify: that.data.serviceitem.classify,
      hostName: Config.restUrl,
      ordertime: ordertime,
      orderno: orderno
    })

    app.globalData.seviceorderno = orderno;
    app.globalData.serviceplatform_price = that.data.platform_price;
    app.globalData.serviceclassify = that.data.classify;
    
  },

  //门店服务商详情
  serviceitemdetail:function(){

    var that = this;

    // var classify_id = that.data.serviceitem.classify_id;
    // var projectid = that.data.serviceitem.id;
    // var market_price = that.data.serviceitem.market_price;
    // var platform_price = that.data.serviceitem.platform_price;
    // var order = that.data.serviceitem.order;

    // wx.navigateTo({
    //   url: '../itemdetails/itemdetails?classify_id=' + classify_id + '&projectid=' + projectid + '&market_price=' + market_price + '&platform_price=' + platform_price + '&order=' + order,
    // })

    var detail = app.globalData.servicelistitem;

    wx.navigateTo({
      url: '../servicesdetails/servicesdetails?detail=' + detail.id + "&shopname=" + detail.short_name + '&order=' + detail.order + '&comment=' + detail.comment + '&distance=' + detail.distance + '&name=' + detail.name + '&type=' + detail.type + '&address=' + detail.address + '&lng=' + JSON.stringify(detail.location)
    })

  },

  pay:function(){
    // wx.navigateTo({
    //   url: '../paystyle/paystyle',
    // })

    wx.redirectTo({
      url: '../paystyle/paystyle',
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

  //复制
  copyTBL: function (e) {
    console.log(e.currentTarget.id)
    wx.setClipboardData({
      data: e.currentTarget.id,
      success: function (res) {
        // self.setData({copyTip:true}),
        wx.showToast({
          title: '复制成功',
        })
      }
    });
  },

  //修改电话号码弹框
  editModal: function () {

    console.log("dddd");
    this.setData({
      editMobile: true
    })
  },

  
  cancelModal: function () {
    this.setData({
      editMobile: false,
      mobileError:false
    })
  },

  //确认修改
  updateMobile:function(e){

    var that = this
    var reg = /^1[3456789]\d{9}$/;
    if (reg.test(e.detail.value.mobile)) {
      console.log('ok')
    } else {
      that.setData({
        mobileError: true
      })
      return
    }
    wx.showLoading({
      title: '修改中...',
    })
    wx.request({
      url: Config.restUrl + '/user/user/resetInfo', //存手机号码
      method: 'POST',
      data: {
        // user_id: aapp.globalData.userInfo.id,
        mobile: e.detail.value.mobile
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + app.globalData.userInfo.session_id
      }, // 默认值
      success: function (res) {
      
        if (res.data.status == 1) {
          wx.showToast({
            title: '修改成功',
          })
          app.globalData.userInfo.mobile = e.detail.value.mobile
          that.setData({
            telphone: e.detail.value.mobile,
            editMobile: false,
            mobileError: false
          })

        } else {
          wx.showToast({
            title: '操作超时',
          })
        }
      }
    })
  },

  //取消订单
  cancelorder:function(e){

    var orderid = app.globalData.serviceorderid;

    payment.cancelorder(orderid,res=>{
      console.log("￥￥", res);
      
      if(res.status == 1){
        
        let pages = getCurrentPages();
        let prevPage = pages[pages.length-2];
        prevPage.setData({
          cancelorder:'订单取消'
        })
        wx.navigateBack({
          delta:1
        })
      }
    });
  }
})