// pages/services/orderlist/orderlist.js

import { OrderList } from 'orderlistmode.js';

var orderlist = new OrderList();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    tablist:['全部','已完成','已取消','已评价'],
    status:'',
    page:1,
    work_status:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({
      tablist:that.data.tablist,
      currentTab: 0
    })

    orderlist.myOrder(that.data.status,that.data.work_status,that.data.page,res=>{
      if(res.status == 1){

        if (res.data.length>0){
          

          that.setData({
            orderlistitem: res.data,
            noorder:false
          })
        }else{
          that.setData({
            orderlistitem: res.data,
            noorder: true,
            orderinfor:''
          })
        }
      }
    })
  },

  onsend:function(e){
    var that = this;
    var orderlistitem = e.detail.res.data;
    var status = e.detail.status;
    var work_status = e.detail.work_status 

    console.log("jjj", orderlistitem, status);

    if (e.detail.res.data.length>0){

      that.setData({
        orderlistitem: orderlistitem,
        noorder:false
      })
    }else{

      if (status == '') {

        that.setData({
          orderlistitem: orderlistitem,
          noorder: true,
          orderinfor:''
        })

      } else if (status == '1') {

        that.setData({
          orderlistitem: orderlistitem,
          noorder: true,
          orderinfor: '完成'
        })

      } else if (status == '4') {

        that.setData({
          orderlistitem: orderlistitem,
          noorder: true,
          orderinfor: '取消'
        })

      } else if (status == '3') {
        that.setData({
          orderlistitem: orderlistitem,
          noorder: true,
          orderinfor: '评价'
        })
      }
      
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    // var pages = getCurrentPages();
    // wx.navigateBack({
    //   delta: pages.length-1
    // })

    // wx.reLaunch({
    //   url: '../services/services',
    // })
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