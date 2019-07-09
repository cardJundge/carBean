
var md5 = require('../../../utils/md5.js');
import location from '../../../utils/area.js';
var util = require('../../../utils/eutil.js');
var app = getApp();
import commond from '../../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionFee: [{ value: "40元", key: "起步价(含3公里)" }, { value: "0元", key: "里程费(1.0公里)" }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    orderpay(that).then(function(res){

      console.log("打印的数据"+JSON.stringify(res));
      
      if (res.data.code == "0"){
        
        if (res.data.data.collectionFee.length == 2){

          var startprice = res.data.data.collectionFee[0].value;
          var mileagefee = res.data.data.collectionFee[1].value;

          that.setData({
            startprice: startprice,
            mileagefee: mileagefee,
            servicefee: '0元',
          })

        } else if (res.data.data.collectionFee.length == 3){
         
          var startprice = res.data.data.collectionFee[0].value;
          var mileagefee = res.data.data.collectionFee[1].value;
          var servicefee = res.data.data.collectionFee[2].value;
          that.setData({
            startprice: startprice,
            mileagefee: mileagefee,
            servicefee: servicefee,
          })

        }else{

          var startprice = res.data.data.collectionFee[0].value;
          that.setData({
            startprice: startprice,
            mileagefee: '0元',
            servicefee: '0元',
          })
    
        }
        
        var income = res.data.data.income;

        app.globalData.income =income;
        app.globalData.totalDistance = res.data.data.totalDistance;

        var getofftime = app.globalData.getofftime;
        var address = app.globalData.add;

        getInfo(data => {
          console.log("ddd" + JSON.stringify(data))
        })

        if (parseInt(income)>60){
          var value = parseInt(income) - 60 
        }else{
          var value = 0;
        }
        

        that.setData({
          income: income,
          getofftime: getofftime,
          address:address,
          pictureSmall: app.globalData.pictureSmall,
          drivername: app.globalData.drivername,
          driverId: app.globalData.driverId,
          value:value
        })

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

  back:function(){

    let pages = getCurrentPages();    //获取当前页面信息栈

    wx.navigateBack({
      delta: pages.length - 3
    })
  },

  wechatpay:function(e){
    
    wx.requestPayment({
      timeStamp: '',
      nonceStr: '',
      package: '',
      signType: '',
      paySign: '',
    })
  }


})


function orderpay(that){

  return new Promise(function (resolve, reject){
    
    var currenttime = util.formatTime(new Date());

    md5(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from' + app.globalData.efrom + 'orderId' + app.globalData.orderId + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);
    var hash = md5.create();
    hash.update(app.globalData.secret + 'appkey' + app.globalData.appkey + 'from'+app.globalData.efrom+'orderId' + app.globalData.orderId + 'timestamp' + currenttime + 'token' + app.globalData.etoken + 'ver3.4.2' + app.globalData.secret);
    hash = hash.hex().substring(0, 30);

    wx.request({
      url: app.globalData.httpurl+'/order/orderpay',
      method: 'GET',
      data: {
        appkey: app.globalData.appkey,
        from: '01012345',
        orderId:app.globalData.orderId,
        timestamp: currenttime,
        token: app.globalData.etoken,
        ver: '3.4.2',
        sig: hash
      },
      success: function (res) {
        
        resolve(res);

      },
      fail: function (res) {
        console.log('失败' + res);
      }
    })
  })
}

function getInfo(callback) {
  var param = {
    url: '/user/user/driving_complete',
    data: {
      order_id: app.globalData.orderId,
      status:1,
      price: app.globalData.income,
      end_time: util.formatTime(new Date()),
      mileage: app.globalData.totalDistance,
      end_address: app.globalData.end_address
    },
    type: 'POST',
    sCallback: function (data) {
      callback && callback(data);
    }
  };

  commond.requestInfor(param);
}