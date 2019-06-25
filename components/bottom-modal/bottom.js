import { Config } from '../../utils/config.js'
import {
  Car
} from '../../pages/common/models/car.js'
import {
  Member
} from '../../pages/common/models/member.js'
var memberModel = new Member()
var carModel = new Car()
var app = getApp()
// 服务的底部弹出框
Component({
  properties: {
    show: Boolean,
    tag: Number,
    title: String,
    img: String,
    list: Array,
    hascar: Boolean,
    defaultCar:Boolean,
    animationData: Object
  },
  data: {
    carshow: true,
    icon: false,
    // defaultCar: false,
    carList: [],
    hostName: Config.restUrl
  },
  methods: {
    hideModal: function(e) {
      var that = this
      var animation = wx.createAnimation({
        duration: 500,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
      })
      that.animation = animation
      that.fadeDown();//调用隐藏动画
      setTimeout(function () {
        that.setData({
          show: false
        })
      },500)   
    },

    toserviceItem: function(e) {
      app.globalData.server = e.currentTarget.dataset.server;
      // console.log("app.globalData.server");
      // wx.switchTab({
      //   url: '../services/services'
      // })

      wx.navigateTo({
        url: '../services/servicestype/servicestype?server=' + e.currentTarget.dataset.server,
      })
    },

    onIcon: function(e) {
      var that = this
      // console.log(e.currentTarget.dataset.carid)
      that.setData({
        carId: e.currentTarget.dataset.carid
      })
      // 设置默认车辆
      carModel.bindCar(app.globalData.userInfo.id, e.currentTarget.dataset.carid, (res)=> {
        if(res.status == 1) {
          that.setData({
            defaultCar: true
          })
          carModel.getCarList(app.globalData.userInfo.id, (res) => {
            if (res.status == 1) {
              that.setData({
                list: res.data
              })
              res.data.forEach(item => {
                if (item.default == 1) {
                  wx.setStorageSync("defaultCar", item)
                  that.triggerEvent('confirm', {
        car_no: item.car_no
      })
                }
              })
              wx.showToast({
                title: '默认车辆更改成功',
                icon: 'none',
                duration: 1500
              })
            }
          })
        }
      })
      
    },
    addNewCar: function(e) {
      var flag = 2
      wx.navigateTo({
        url: '../../pages/common/car/add-car/add-car',
      })
      wx.setStorageSync("carFlag", flag)
    },
    fadeDown: function () {
      this.animation.translateY(300).step()
      this.setData({
        animationData: this.animation.export(),
      })
    },
    toAgent: function (e) {
      // console.log(e.currentTarget.dataset.agent)
      if (e.currentTarget.dataset.type) {
        memberModel.agentOrderDetail(app.globalData.userInfo.id, e.currentTarget.dataset.type, res => {
          if (res.status == 1) {
            if (res.data.status < 2) {
              wx.setStorageSync("agentType", res.data.type)
              wx.navigateTo({
                url: '../../pages/common/member/agent/order/order',
              })
            } else {
              wx.navigateTo({
                url: '../../pages/common/member/agent/agent?content=' + e.currentTarget.dataset.agent,
              })
            }
          } else {
            wx.navigateTo({
              url: '../../pages/common/member/agent/agent?content=' + e.currentTarget.dataset.agent,
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '../../pages/common/member/agent/agent?content=' + e.currentTarget.dataset.agent,
        })
      }
    }
  }
})