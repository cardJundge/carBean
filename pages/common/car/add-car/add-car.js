// 添加车辆
import {
  Car
} from '../../models/car.js';
var carModel = new Car();
const app = getApp();
Page({
  data: {
    carInfo: {},
    carPlate: '',
    userId: ''
  },
  onLoad: function(options) {
    this.setData({
      userId: app.globalData.userInfo.id
    })
  },
  // 选择车的型号
  toSelectBrand: function(e) {
    wx.navigateTo({
      url: '../car-brand/car-brand',
    })
  },
  // 新增车辆
  toAddCar: function(e) {
    // console.log(this.data.carInfo.brandName)
    var reCar = /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/
    var that = this
    if (reCar.test(that.data.carPlate)) {

      carModel.getCarList(that.data.userId,res=>{
        if(res.status == 1){
          for(var item in res.data){
            if (res.data[item].car_no == that.data.carPlate){
              wx.showToast({
                title: '该车牌已存在!',
                duration:2000,
                icon:"none"
              })  
              that.setData({
                existence:true
              })
            }else{
              that.setData({
                existence: false
              })
            }
          }

          if (!that.data.existence){
            that.addCar();
          }
        }else{

          that.addCar();
        }
      })
    } else {
      wx.showToast({
        title: '您输入的车牌号码有误！',
        icon: 'none'
      })
    }
  },

  addCar:function(){

    var that= this;
    carModel.addCar(that.data.userId, that.data.carInfo.brandId, that.data.carInfo.seriesId, that.data.carPlate, (res) => {
      // console.log('添加成功返回信息',res)
      if (res.status == 1) {

        var flag = wx.getStorageSync("carFlag")
        // console.log(flag)

        if (flag == 1) {
          wx.redirectTo({
            url: '../car',
          })
        } else if (flag == 2) {
          console.log('vvv', flag)
          wx.reLaunch({
            url: '../../../index/index?carid=' + that.data.carPlate,
          })
        }
      }
    })

  },

  // 获得车牌
  getCarPlate: function(e) {
    this.setData({
      carPlate: e.detail.value
    })
  },
  onShow: function(options) {
    // if (wx.getStorageSync('temp')) {
    //   this.setData({
    //     carInfo: wx.getStorageSync('temp')
    //   })
    // }
    var that = this;

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    if (currPage.data.temp){
      this.setData({
        carInfo: currPage.data.temp
      })
    }
  }
})