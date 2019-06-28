// 我的
import {
  Mine
} from 'models/minemodel.js';
var mineModel = new Mine()
const app = getApp();

Page({
  data: {
    hasUserInfo: true,
    basicUserInfo: {}, //用户基本信息
    beanNum: "",
    showLoginModal: false,
    showLogoutModal: false,
    memberInfo: {}
  },
  onLoad: function(options) {
    var that = this
    if (app.globalData.userInfo) {
      that.setData({
        basicUserInfo: app.globalData.userInfo,
        memberInfo:wx.getStorageSync("memberInfo")
      })
    } else {
      // 再请求一遍
      app.getAuth((data) => {
        if (!data) {
          that.setData({
            hasUserInfo: false
          })
          wx.setStorageSync("hasUserInfo", false)
        } else {
          app.getUserLogin(data, response => {
            app.globalData.userInfo = response.data.data
            that.setData({
              hasUserInfo: true,
              basicUserInfo: response.data.data,
              memberInfo: wx.getStorageSync("memberInfo")
            })
            wx.setStorageSync("hasUserInfo", true)
          })
        }
      })
    }
  },

  onShow: function() {
    if (app.globalData.userInfo) {
      this.setData({
        basicUserInfo: app.globalData.userInfo,
        hasUserInfo: true,
        beanNum: wx.getStorageSync("beanNum"),
        memberInfo: wx.getStorageSync("memberInfo")
      })
    }
  },
  // 去登录授权
  toLogin: function(e) {
    this.setData({
      showLoginModal: true
    })

  },
  // 修改资料
  toInfoEdit: function(e) {
    wx.navigateTo({
      url: './edit-info/info?avatar=' + this.data.basicUserInfo.face + '&name=' + this.data.basicUserInfo.nickname,
    })
  },
  // 我的会员
  onMember: function(e) {

    var that= this;

    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
        }else{

        if (that.data.basicUserInfo.vip_lv != 0) {
          if (that.data.basicUserInfo.vip_lv == 1) {
            wx.navigateTo({
              url: '../common/member/bronze/bronze?tag=mine',
            })
          } else if (that.data.basicUserInfo.vip_lv == 2) {
            wx.navigateTo({
              url: '../common/member/silver/silver?tag=mine',
            })
          } else if (that.data.basicUserInfo.vip_lv == 3) {
            wx.navigateTo({
              url: '../common/member/gold/gold?tag=mine',
            })
          }
        } else {
          wx.navigateTo({
            url: '../common/member/member',
          })
        }
        }
    })

  },

  // 成为会员
  onMemberEntry: function(e) {

    var that = this
    app.getSet(res=>{
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      }else{
        wx.navigateTo({
          url: '../common/member/member',
        })
      }
    })  
  },
  // 我的订单
  onOrderList: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.navigateTo({
          url: '../services/orderlist/orderlist',
        })
      }
    })
  },
  // 我的保单
  onPolicy: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.navigateTo({
          url: '../index/mine/myPolicyChina/myPolicyChina',
        })
      }
    })
  },
  // 我的发布
  onPublish: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.navigateTo({
          url: './basic-function/publish/publish',
        })
      }
    })
  },
  // 用法帮助
  onUseHelp: function(e) {
    wx.navigateTo({
      url: 'setting/use-help/help'
    })
  },
  // 意见反馈
  onFeedback: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.navigateTo({
          url: 'setting/feedback/feedback'
        })
      }
    })

  },
  // 关于我们
  onAboutUs: function(e) {
    wx.navigateTo({
      url: 'setting/about-us/about'
    })
  },
  // 积分兑换
  onExchange: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.navigateTo({
          url: 'basic-function/integral/integral',
        })
      }
    })
  },
  // 消息通知
  onMessage: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.navigateTo({
          url: 'basic-function/message/message',
        })
      }
    })
  },
  // 我的车库
  onCar: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.navigateTo({
          url: '../common/car/car',
        })
      }
    })
  },
  // 去提现
  toBean: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        var id = app.globalData.userInfo.id;
        wx.navigateTo({
          url: '../common/bean-details/bean?params=' + id,
        })
      }
    })
  },
  // 关闭登录模态框
  hideLoginModal: function() {
    this.onLoad()
  },
  // 退出登录模态框
  toLogout: function(e) {
    // wx.showModal({
    //   title: '提示',
    //   content: '确定退出登录吗？',
    //   showCancel: true,
    //   cancelColor: '#BBBBBB',
    //   confirmColor: '#4F93FD',
    //   success: function(res) {
    //     if (res.cancel) {

    //     } else {
    //       // 退出登录接口
    //       mineModel.logOut((res)=> {
    //         console.log(res)
    //       })
    //     }
    //   },
    //   fail: function(res) {},
    // })
    this.setData({
      showLogoutModal: true
    })

  },
  // 退出登录
  confirmLogout: function(e) {
    mineModel.logOut((res) => {
      console.log(res)
    })
  }
})