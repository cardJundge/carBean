// pages/index/mine/myOrder/serviceRatings/serviceRatings.js
const app = getApp()
import common from '../../../../utils/common.js'
import utils from '../../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileTypePublic: 3,
    fileName: '',
    mediaSrc: '',
    container: 'container',
    back_cell: 'back_cell',
    title_cell: 'title_cell',
    videoSrc: '',
    duration: 0,
    mess: 200,
    type: ["全部", "保险", "理赔", "维修"],
    locationshow: false

  },
  backPage: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  //回传发布类型的值
  onchecktype: function(e) {

    var that = this;
    app.globalData.event_type = e.detail.typeindex
  },

  addVideo: function() {
    var that = this

    that.setData({
      isOver: false
    })
    console.log("1111")
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      compressed: true, 
      success(res) {
        console.log(res)
        that.data.fileType = 'video';

        that.setData({
          mediaSrc: res.tempFilePath,
          duration: res.duration,
          mediaSize: res.size
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete(res) {
        console.log(res)
      }
    })
  },

  sharecontent: function(e) {
    var that = this

    var mess = e.detail.value.length;

    that.setData({
      mess: that.data.mess - mess,
      isOver: false
    })

  },

  submitPublic: function(e) {
    var that = this

    if (app.globalData.userInfo) {

      console.log("HHHHH" + that.data.mediaSrc);

      var fileType = that.data.mediaSrc.substr().toLowerCase();

      console.log("UUUUU" + JSON.stringify(fileType) + fileType)

      console.log("%%%%%%%" + e.detail.value.content + that.data.videoSrc);

      if (app.globalData.latitude) {

        if (e.detail.value.content == '' && that.data.videoSrc == '') {
          wx.showToast({
            title: '内容不能为空',
          })

          that.setData({
            isOver: false
          })
          return

        } else if (that.data.duration > 60) {

          wx.showToast({
            title: '时长超过60s'
          })

          that.setData({
            isOver: false,
            mediaSrc: "",
            rating_contents: ""
          })

          return
        } else if (that.data.mediaSize > 20*1024*1024) {

          wx.showToast({
            title: '视频内存超过20MB'
          })

          that.setData({
            isOver: false,
            mediaSrc: "",
            rating_contents: ""
          })

          return
        }


        wx.showLoading({
          title: '发布中...',
        })

        that.setData({
          isOver: true
        })

        that.data.publicContent = e.detail.value.content

        that.data.publicContent = common.utf16toEntities(that.data.publicContent)
        common.uploadDynamic(that).then(common.publicDynamic).then(function() {
          wx.showToast({
            title: '发布成功',
          })
          console.log(that.data.fileName)
          console.log(JSON.stringify(that.data))
          //处理上个页面
          var tempType = 3
          if (!that.data.mediaSrc) {

            tempType = 1
            that.data.fileName = ''
          }
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.data.dynamicArr.unshift({
            id: that.data.tempUploadId,
            add_time: '刚刚',
            comment: 0,
            content: that.data.fileName,
            //grade: app.globalData.userAllInfor.grade[0],
            grade: that.data.userInfo.grade[0],
            is_zan: 0,
            share: 0,
            title: common.entitiesToUtf16(that.data.publicContent),
            location: app.globalData.latitude + ',' + app.globalData.longitude,
            address: app.globalData.address,
            user_id: that.data.userId,
            user_info: {
              nickname: that.data.userInfo.nickName,
              face: that.data.userInfo.avatarUrl
            },
            zan: 0,
            type: tempType
          })
          prevPage.setData({
            dynamicArr: prevPage.data.dynamicArr
          })

          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)

        })
      } else {

        that.setData({
          locationshow: true
        })
      }


    } else {

      that.setData({
        showLoginModal: true
      })
    }



  },

  hideLoginModal: function() {

    var that = this;
    app.getAuth(data => {
      app.getUserLogin(data, response => {
        console.log("hh", response);
        app.globalData.userInfo = response.data.data
        that.data.userInfo = app.globalData.userInfo
        that.data.sessionId = app.globalData.userInfo.session_id
        that.data.userId = app.globalData.userInfo.id
      })
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


    console.log(app.globalData.location)
    var textReg = /市/i
    if (app.globalData.address.match(textReg)) {
      console.log(app.globalData.address.match(textReg))
      that.setData({
        address: app.globalData.address.slice(app.globalData.address.match(textReg).index + 1)
      })
    }
    that.data.userInfo = app.globalData.userInfo
    console.log("ddd", that.data.userInfo);



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
    
    if (!app.globalData.longitude) {
      utils.getlocation().then(function (res) {

        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;

        that.data.latitude = res.latitude;
        that.data.longitude = res.longitude;

        // that.data.circles = [{
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        //   fillColor: '#d1edff88',
        //   radius: 600,
        //   //定位点半径
        //   strokeWidth: 1
        // }]

        that.setData({
          latitude: that.data.latitude,
          longitude: that.data.longitude
        })

        console.log(res.latitude + "***" + res.longitude);

      });
    }
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

  //关闭授权地址的模化框
  hideLocationModal: function() {
    var that = this;
    that.setData({
      locationshow: false
    })
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