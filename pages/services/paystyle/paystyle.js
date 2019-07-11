// pages/services/paystyle/paystyle.js
import { Paystyle } from 'paystylemode.js';
import { Bean } from '../../common/models/bean.js';

import { Servicesdetails } from '../servicesdetails/servicesdetailsmode.js';
var servicesdetails = new Servicesdetails();

var bean = new Bean();
var paystyle = new Paystyle();
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    var userid = app.globalData.userInfo.id;

    //从我的=>我的订单
    if (options.price){

      // servicesdetails.getPolicyInfo(userid, res =>{

      //   if (res.status == 1) {

      //     app.globalData.seviceorderno = options.orderno;
      //     app.globalData.serviceplatform_price = options.price;

      //     app.globalData.serviceorderid = options.id;
      //     app.globalData.serviceclassify = options.classify_name;

      //   }

      // })

      servicesdetails.getPolicyInfo(userid, res => {

        if (res.status == 1) {

          app.globalData.seviceorderno = options.orderno;
          app.globalData.serviceplatform_price = options.price;

          app.globalData.serviceorderid = options.id;
          app.globalData.serviceclassify = options.classify_name;

          // if (res.status == 1) {

          if (options.classify_name == "代为送检(年审,不含上线)") {

            that.data.projectid = 14

          } else if (options.classify_name == "代办维修/保养") {

            that.data.projectid = 15

          } else if (options.classify_name == "代办理赔") {

            that.data.projectid = 16

          } else if (options.classify_name == "车辆检测") {

            that.data.projectid = 17

          } else if (options.classify_name == "洗车") {

            that.data.projectid = 20

          } else if (options.classify_name == "非事故救援(搭电/换胎)") {

            that.data.projectid = 21

          }

          for (var item in res.data.project) {

            if (item == that.data.projectid) {

              that.setData({
                equity_num: res.data.project[item],
                money: options.price
              })
            }
          }

          // }

        } else {

          app.globalData.seviceorderno = options.orderno;
          app.globalData.serviceplatform_price = options.price;

          app.globalData.serviceorderid = options.id;
          app.globalData.serviceclassify = options.classify_name;


          that.setData({
            equity_num: 0,
            money: options.price
          })
        }
      })
    }

    if (app.globalData.policyInfo){

      that.setData({
        policyInfo: app.globalData.policyInfo
      })
    }

    if (app.globalData.serviceitem) {

      if (app.globalData.serviceitem.equity_num){

        that.setData({
          equity_num: app.globalData.serviceitem.equity_num,
          money: app.globalData.serviceplatform_price
        }) 

      }else{

        that.setData({
          equity_num: 0,
          money: app.globalData.serviceplatform_price
        }) 
      }
    }


    bean.getBeanNum(app.globalData.userInfo.id,'0',res=>{
      console.log("dd",res);
      
      if(res.status == 1){

        that.setData({
          beannum: res.bean
        })

      }else{
        // wx.showToast({
        //   title: '金豆获取失败!',
        // })
      }
    })
    
  
    // that.setData({
    //   money: app.globalData.serviceplatform_price
    // })

    that.setData({
      check1: true,
      check2: false,
      arrindex: -1
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

  paystyle:function (e) {

    var that = this;
    

    if (e.currentTarget.dataset.index == 1){
      that.setData({
        check1:true,
        check2:false,
        arrindex:-1
      })
    } else if (e.currentTarget.dataset.index == 2){
      that.setData({
        check1: false,
        check2: true,
        arrindex: -1
      })
    } else if (e.currentTarget.dataset.index == 3) {

      var item = e.currentTarget.dataset.item

      that.data.policyid = item.id;

      that.data.arrindex = e.currentTarget.dataset.arrindex;

      that.setData({
        check1: false,
        check2: false,
        arrindex: e.currentTarget.dataset.arrindex
      })
    } 
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

  surepay:function(){

    var that = this;

    if(that.data.check1){

      paystyle.wxPay(res=>{

        console.log("wechat",res);

        if (res.status == 1){

          that.data.payInfor = res.result;

          wx.requestPayment({
            'timeStamp': that.data.payInfor.timeStamp.toString(),
            'nonceStr': that.data.payInfor.nonceStr,
            'package': that.data.payInfor.package,
            'signType': 'MD5',
            'paySign': that.data.payInfor.sign,
            'success': function (res) {

              paystyle.systemOk(res=>{
                console.log("支付成功",res);

                if (res.status == 1){

                  wx.redirectTo({
                    url: '../paycompleted/paycompleted',
                  })
                  // wx.showToast({
                  //   title: '支付成功',
                  // })
                }
              })
            },
            'fail': function (res) {
              wx.showToast({
                title: '支付失败',
              })
            },
            'complete': function (res) {
            }
          });

        }

      })

    }else{

      if(that.data.check2){

        var money =parseInt(that.data.money)

        if (that.data.beannum < money){

          wx.showToast({
            title: '金豆余额不足!',
          })

        }else{

          paystyle.beanPay(res=>{

            console.log('金豆',res);

            if (res.status == 1){

              wx.showToast({
                title: '支付成功!',
              })

              wx.setStorageSync("beanNum", that.data.beannum - money)

            }else{
              wx.showToast({
                title: '支付失败!',
              })
            }
          })
        }

      }else{

        
        if (that.data.arrindex >= 0){

          paystyle.policyPay(that.data.policyid,res=>{

            if (res.status == 1) {

              if (app.globalData.policyInfo[that.data.arrindex].num !="不限"){
                that.setData({
                  policyInfo: that.data.policyInfo[that.data.arrindex].num --
                })
              }

              wx.redirectTo({
                url: '../paycompleted/paycompleted',
              })
            }

          })

          // if (app.globalData.policyInfo <= 0){
          //   wx.showToast({
          //     title: '无使用次数!',
          //   })
          // }else{

          //   paystyle.vipPay(res=>{
          //     console.log("会员支付",res);

          //     if (res.status == 1){

          //       if (that.data.equity_num != '不限'){
          //         that.data.equity_num --
          //       }
          //       wx.showToast({
          //         title: '支付成功!',
          //       })
          //     }

          //     // wx.navigateTo({
          //     //   url: '../paycompleted/paycompleted',
          //     // })

          //     wx.redirectTo({
          //       url: '../paycompleted/paycompleted',
          //     })

          //   })
          // }

        }else{
          wx.showToast({
            title: '请选择付款方式',
          })

          // wx.navigateTo({
          //   url: '../paycompleted/paycompleted',
          // })
        }
      }
    }
  }
})