// pages/index/mine/myOrder/serviceRatings/serviceRatings.js
const app = getApp()
var test = getApp().globalData.hostName;
var test1 = getApp().globalData.hostName2;
var imgId = 0;

import utils from '../../../../utils/util.js';
import common from '../../../../utils/common.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    container: 'container',
    back_cell: 'back_cell',
    title_cell: 'title_cell',
    fileType: 'img',
    fileTypePublic: 1,
    fileNameTemp: '',
    imagecell: [],
    imgNameArr: [],
    mess:200,
    type:["全部","保险","理赔","维修"],
    locationshow:false

  },
  backPage: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    common.pageCss(this)

    that.data.sessionId = app.globalData.userInfo.session_id
    that.data.userId = app.globalData.userInfo.id
    
    that.data.userInfo = app.globalData.userInfo

  },

  //回传发布类型的值
  onchecktype:function(e){

    var that= this;
    app.globalData.event_type = e.detail.typeindex
  },

  addImage: function() {
    var that = this
    var tempNum = 0
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {

        console.log("imgres",res);
        var tempPicLength = res.tempFilePaths.length;
        if (tempPicLength + that.data.imagecell.length > 9) {
          res.tempFilePaths = res.tempFilePaths.slice(0, 9 - that.data.imagecell.length)
        }
        for (let i in res.tempFilePaths) {
          that.data.imagecell.push({
            id: imgId++,
            path: res.tempFilePaths[i]
          })
        }
        that.setData({
          imagecell: that.data.imagecell
        })
        console.log(that.data.imagecell)


      }
    })

  },
  deleteImg: function(e) {
    console.log(e)
    console.log(e.currentTarget.id)
    for (var i in this.data.imagecell) {
      if (this.data.imagecell[i].id == e.currentTarget.id) {
        console.log(i)
        this.data.imagecell.splice(i, 1)
        this.setData({
          imagecell: this.data.imagecell
        })
        break
      }
    }
  },

  //文本输入
  shareinput:function(e){
    console.log("eee",e);
    var that = this;
    var mess = e.detail.value.length;
    
    that.setData({
      mess:that.data.mess-mess
    })
  },

  submitRatings: function(e) {

    console.log("^^^^^"+JSON.stringify(e));
    var that = this
    that.data.publicContent = e.detail.value.intro

    if (app.globalData.latitude){

      if (that.data.publicContent) {

        console.log("llll" + e.detail.value.intro)


        that.data.publicContent = common.utf16toEntities(that.data.publicContent)

        
        wx.showLoading({
          title: '上传中...',
        })
        Promise.all(that.data.imagecell.map((item, index) => {
          return new Promise(function (resolve, reject) {
            console.log("@@@@@" + item)
            that.data.mediaSrc = item.path
            common.uploadDynamic(that).then(function () {
              console.log('上传' + index)
              console.log(that.data.fileName)
              console.log(JSON.stringify(that.data))
              that.data.fileNameTemp = that.data.fileName + ',' + that.data.fileNameTemp
              resolve(that)
            })
          }).then(function () { })
        })).then(function (resolve, reject) {
          console.log('上传惋惜和')
          that.data.fileName = that.data.fileNameTemp.substr(0, that.data.fileNameTemp.length - 1);
          common.publicDynamic(that).then(function () {
            wx.hideLoading(that.data.fileName)
            wx.showToast({
              title: '发布成功',
            })
            console.log(that.data.fileName)
            //处理上个页面
            var tempFile = []
            if (that.data.fileName) {
              tempFile = that.data.fileName.split(',')
              console.log(tempFile)
            }
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];

            prevPage.data.dynamicArr.unshift({
              id: that.data.tempUploadId,
              add_time: '刚刚',
              comment: 0,
              content: that.data.fileName,
              grade: that.data.userInfo.grade[0],
              //grade:7,
              imagecell: tempFile,
              is_zan: 0,
              share: 0,
              title: common.entitiesToUtf16(that.data.publicContent),
              location: app.globalData.latitude + ',' + app.globalData.longitude,
              address: app.globalData.address,
              user_id: that.data.userId,
              user_info: { nickname: that.data.userInfo.nickname, face: that.data.userInfo.face },
              zan: 0,
              type: 1
            })
            prevPage.setData({
              dynamicArr: prevPage.data.dynamicArr
            })

            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)

          })
        })

      } else {

        wx.showToast({
          title: '内容不能为空!',
        })
      }

    }else{

      that.setData({
        locationshow: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
    var that = this;
    utils.getlocation().then(function (res) {

      app.globalData.latitude = res.latitude;
      app.globalData.longitude = res.longitude;

      // that.data.latitude = res.latitude;
      // that.data.longitude = res.longitude;


    })
  },

  //关闭授权地址的模化框
  hideLocationModal: function () {
    var that = this;
    that.setData({
      locationshow: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})