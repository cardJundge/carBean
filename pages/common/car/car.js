// 我的车库
import { Config } from '../../../utils/config.js'
import {
  Car
} from '../models/car.js';
var carModel = new Car();
const app = getApp();
Page({
  data: {
    carList: [], //车辆列表
    hostName: ''
  },
  onLoad: function(options) {
    this.setData({
      hostName: Config.restUrl
    })
    this.queryCarList(app.globalData.userInfo.id)
  },
  // 加载车辆列表
  queryCarList: function(params) {
    var that = this
    carModel.getCarList(params, (res) => {
      console.log('***',res.data)
      if (res.status == 1) {
        that.setData({
          carList: res.data
        })
        // that.onLoad()
      } else if (res.status == 0) {
        that.setData({
          carList: []
        })
      }
    })
  },
  deleteCar: function(carId) {
    var that = this
    carModel.delCar(carId, (res)=> {
      console.log(res)
      if(res.status == 1) {
        that.onLoad()
      }
    })
  },
  // 删除车辆
  delCar: function(e) {
    var that = this
    console.log(e.currentTarget.dataset.carid)
    wx.showModal({
      title: '提示',
      content: '确定要从列表删除这辆车吗？',
      showCancel: true,
      cancelColor: '#BBBBBB',
      confirmColor: '#4F93FD',
      success: function(res) {
        if (res.cancel) {
          
        } else {
          that.deleteCar(e.currentTarget.dataset.carid)
        }
      },
      fail: function(res) {}, //接口调用失败的回调函数
    })
  },
  toAddCar: function(e) {
    var flag = 1
    wx.redirectTo({
      url: './add-car/add-car',
    })
    wx.setStorageSync("carFlag", flag)
  }
})