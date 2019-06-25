// 开通会员
var app = getApp();
import {
  ConfirmMember
} from './memberMode.js'
var confirmModel = new ConfirmMember()
Page({
  data: {

  },
  onLoad: function(options) {
    var that = this
    // console.log('用户是否授权信息', res)

    var scene = decodeURIComponent(options.scene);

    that.setData({
      scene: scene
    })

    app.getAuth((data) => {
      // 没有授权
      if (!data) {
        // 已经授权
        that.setData({
          hasAuth: false
        })
      } else {
        app.getUserLogin(data, response => {
          app.globalData.userInfo = response.data.data
          that.setData({
            hasAuth: true
          })
        })
      }
    })
  },
  openMember: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {} else {
        var id = app.globalData.userInfo.id
        var level = app.globalData.userInfo.vip_lv
        if (level > 1) {
          wx.showModal({
            title: '提示',
            content: '您已经是会员了，前往首页查看详情',
            success: function (res) {
              if (res.cancel) {
                //点击取消
              } else if (res.confirm) {
                //点击确定
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          })
        } else {
          confirmModel.userToConfirm(id, that.data.scene, (res) => {
            if (res.status == 1) {
              wx.redirectTo({
                url: './success/success',
              })
            } else if (res.status == -1) {
              wx.showModal({
                title: '提示',
                content: '您已提交申请，请等待审核',
                success: function (res) {
                  if (res.cancel) {
                    //点击取消
                  } else if (res.confirm) {
                    //点击确定
                    wx.reLaunch({
                      url: '../index/index',
                    })
                  }
                }
              })
            } else if (res.status == 2) {
              wx.showToast({
                title: '您已经被拒绝超过三次',
                icon: 'none'
              })
            }
          })
        }
      }
    })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      app.getAuth((data) => {
        // 没有授权
        if (!data) {
          // 已经授权
        } else {
          app.getUserLogin(data, response => {
            this.openMember()
          })
        }
      })
    } else {
      console.log('拒绝访问')
    }
  }
})