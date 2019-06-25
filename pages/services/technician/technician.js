// pages/services/technician/technician.js
var test = getApp().globalData.hostName;
const app = getApp()
import common from '../../../utils/common.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    container: 'container',
    back_cell: 'back_cell',
    title_cell: 'title_cell',
    task: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var printHeight = wx.getSystemInfoSync().windowHeight;

    that.setData({
      contnt_height: printHeight - 74 + 'px'
    })

    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        app.globalData.mobileType = res.model
      }
    })
    var iphoneReg = /iPhone X/
    if (app.globalData.mobileType.match(iphoneReg)) {
      console.log('我是iphoneX')
      that.setData({
        contnt_height: printHeight - 100 + 'px',
        back_cell: 'back_cellX',
        title_cell: 'title_cellX',
        container: 'containerX'
      })
    }
    // console.log(JSON.parse(options.tasks))

    // this.data.task = JSON.parse(options.tasks)

    that.data.task = JSON.parse(options.tasks);

    console.log("ss", that.data.task);

    for (var i in this.data.task) {
      var tempArr = common.handleStar(this.data.task[i].comment)
      this.data.task[i].star = tempArr
    }
    this.setData({
      hostName: test,
      task: this.data.task
    })

    console.log(this.data.task)
  },

  backPage: function () {
    wx.navigateBack({
      delta: 1
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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