// pages/index/mine/myPolicy/myPolicy.js
import common from '../../../../utils/common.js'
var test1 = getApp().globalData.hostName;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chinaNumber: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    timer: 300,
    mobile: '',
    // serviceArr: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    introArr: []
  },
  toMyOrder: function () {
    this.data.activeId = this.data.activeSertvice.id
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },
  addMore: function () {
    this.setData({
      hasBinling: false,
      ifAdd: true
    })
  },
  notAdd: function () {
    this.setData({
      hasBinling: true,
    })
  },

  toserviceItem: function (e) {
    console.log(e)
    if (e.currentTarget.dataset.server == '代为送检(年审,不含上线)') {
      this.setData({
        openItem: true,
      })
      return
    }
    this.data.activeId = this.data.activeSertvice.id
    this.data.ifonshow = true
    app.globalData.activePolicy = { id: this.data.activeSertvice.id }
    wx.navigateTo({
      url: '../../../services/servicestype/servicestype?server=' + e.currentTarget.dataset.server,
    })
    app.globalData.ifPolicy = true
  },
  okItem: function () {
    this.setData({
      openItem: false
    })
    app.globalData.activePolicy = { id: this.data.activeSertvice.id }
    this.data.activeId = this.data.activeSertvice.id
    wx.navigateTo({
      url: '../../../services/servicestype/servicestype?server=代为送检(年审,不含上线)',
    })
    app.globalData.ifPolicy = true
  },
  closeItem: function () {
    this.setData({
      openItem: false
    })
  },
  openIntro: function (e) {
    console.log(e.currentTarget.id)
    this.data.introArr[e.currentTarget.id] = !this.data.introArr[e.currentTarget.id]
    this.setData({
      introArr: this.data.introArr
    })
  },
  veryifyCode: function (e) {
    var that = this

    if (e.detail.value.code.length != 6) {
      that.setData({
        codeError: true
      })
      return
    }
    wx.showLoading({
      title: '绑定中...',
    })
    clearInterval(that.data.timerCon)
    wx.request({
      url: test1 + '/user/user/codeVerify',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      data: {
        car_no: that.data.bindCarNo,
        mobile: that.data.mobile,
        user_id: that.data.userId,
        code: e.detail.value.code,
      },
      success: function (res) {
        // var dataType = typeof res.data
        // if (dataType == 'string') {
        //   var jsonStr = res.data;
        //   jsonStr = jsonStr.replace(" ", "");
        //   var temp
        //   if (typeof jsonStr != 'object') {
        //     jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
        //     temp = JSON.parse(jsonStr);
        //     res.data = temp;
        //   }
        // }
        if (res.data.status == 1) {
          checkPolicy(that)

        } else if (res.data.status == 0) {
          wx.hideLoading()
          that.setData({
            codeError: true
          })
        } else if (res.data.status == -2) {
          wx.hideLoading()

        } else if (res.data.status == -1) {
          wx.hideLoading()
          that.setData({
            bindings: true
          })
        }
      },
    })
  },
  bingingPolicy: function (e) {
    wx.showLoading({
      title: '查询中...',
    })
    var that = this
    console.log(e.detail.value.policyNum)
    wx.request({
      url: test1 + '/user/user/setPolicy',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      data: {
        policy_no: e.detail.value.policyNum,
        user_id: that.data.userId
      },
      success: function (res) {
        // var dataType = typeof res.data
        // if (dataType == 'string') {
        //   var jsonStr = res.data;
        //   jsonStr = jsonStr.replace(" ", "");
        //   var temp
        //   if (typeof jsonStr != 'object') {
        //     jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
        //     temp = JSON.parse(jsonStr);
        //     res.data = temp;
        //   }
        // }
        wx.hideLoading()
        console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: '绑定成功',
          })
          app.globalData.userInfo.is_policy = 1
          that.setData({
            vertifing: true,
          })
          checkPolicy(that)
        } else if (res.data.status == -1) {
          that.setData({
            bindings: true
          })

        } else if (res.data.status == -2) {
          that.setData({
            no_policy: true
          })
        }
      },
    })
  },
  backIndex: function () {
    wx.switchTab({
      url: '../../service/service',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.data.ifonshow = false
    var menu = 1
    if (menu == 1) {
      this.setData({
        menu: 1
      })
      if (!app.globalData.userInfo) {
        app.getAuth((res)=> {
          if (!res) {
            that.setData({
              hasUserInfo: false
            })
          } else {
            app.getUserLogin(res, (response)=> {
              app.globalData.userInfo = response.data.data
              if (response.data.status == 1) {
                that.setData({
                  userId: response.data.data.id,
                  userInfo: response.data.data,
                  hasUserInfo: true,
                  sessionId: response.data.data.session_id
                })
                if (response.data.data.is_policy == 1) {
                  checkPolicy(that)
                } else {
                  that.setData({
                    loaded: true,
                    hasBinling: false
                  })
                }
              }
            })
          }
        })
      } else {
        that.setData({
          userId: app.globalData.userInfo.id,
          userInfo: app.globalData.userInfo,
          hasUserInfo: true,
          sessionId: app.globalData.userInfo.session_id
        })
        if (app.globalData.userInfo.is_policy == 1) {
          checkPolicy(that)
        } else {
          that.setData({
            loaded: true,
            hasBinling: false
          })
        }
      }
    } else {
      that.setData({
        userId: app.globalData.userInfo.id,
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        sessionId: app.globalData.userInfo.session_id
      })
      if (app.globalData.userInfo.is_policy == 1) {
        checkPolicy(that)
      } else {
        that.setData({
          loaded: true,
          hasBinling: false
        })
      }
    }
    // that.setData({
    //   hasUserInfo: true
    // })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        app.globalData.mobileType = res.model
      }
    })
    var screenHeight = wx.getSystemInfoSync().screenHeight
    var screenWidth = wx.getSystemInfoSync().screenWidth
    that.setData({
      screenWidth: (screenWidth * 317) / 375 + 'px'
    })

    // that.data.userId = app.globalData.userAllInfor.id
    // that.data.sessionId = app.globalData.userAllInfor.session_id
    // if (app.globalData.userAllInfor.is_policy == 1) {
    //   checkPolicy(that)
    // } else {
    //   that.setData({
    //     loaded: true,
    //     hasBinling: false
    //   })
    // }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if (app.globalData.userInfo) {
      if (this.data.ifonshow && app.globalData.userInfo.is_policy == 1) {
        checkPolicy(that)
      } else {
        that.setData({
          loaded: true,
          hasBinling: false
        })
      }
    } else {
      that.onLoad()
    }
  },
  changePolicy: function (e) {
    this.setData({
      activeItem: e.currentTarget.id,
      activeSertvice: this.data.policyArr[e.currentTarget.id]
    })

  },
  getUserInfo: function (e) {
    var that = this
    // app.getUser(e.detail.rawData)
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '获取中...',
      })
      app.getAuth((res)=> {
        if (!res) {
          that.setData({
            hasUserInfo: false
          })
        } else {
          app.getUserLogin(res, (response)=> {
            app.globalData.userInfo = response.data.data
            if (response.data.status == 1) {
              wx.hideLoading()
              that.setData({
                userId: response.data.data.id,
                userInfo: response.data.data,
                hasUserInfo: true,
                sessionId: response.data.data.session_id,
                userface: response.data.data.face
              })
              if (response.data.data.is_policy == 1) {
                checkPolicy(that)
              } else {
                that.setData({
                  loaded: true,
                  hasBinling: false
                })
              }
            }
          })
        }
      })
    }

  },

  toDriving: function (e) {
    this.data.ifonshow = true
    this.data.activeId = this.data.activeSertvice.id
    wx.navigateTo({
      url: '../../service/driving_/driving_?card_length=' + e.currentTarget.id + '&policyId=' + this.data.activeSertvice.policy_no + '&policy=' + this.data.activeSertvice.id + '&title=',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  cancelRed: function () {
    this.setData({
      codeError: false,
      inforOk: false,
      no_policy: false,
      bindings: false
    })
  },
})

function checkPolicy(that) {
  wx.request({
    url: test1 + '/user/user/policyInfo',
    method: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'PHPSESSID=' + that.data.sessionId
    },
    data: {
      user_id: that.data.userId
    },
    success: function (res) {
      wx.hideLoading()
      if (res.data.status == 1) {
        // that.setData({
        //   serviceArr: []
        // })
        that.data.policyArr = res.data.data
        that.data.tempProject = res.data.data.project
        getservice(that)
        getItemClassify(that).then(function () {
          for (var i in that.data.policyArr) {
            that.data.policyArr[i].start_date = that.data.policyArr[i].start_date.slice(0, 10)
            that.data.policyArr[i].end_date = that.data.policyArr[i].end_date.slice(0, 10)
            var tempService = []
            for (var j in that.data.policyArr[i].project) {
              for (var m in that.data.classifyArr) {
                if (j == that.data.classifyArr[m].id) {
                  tempService.push({
                    id: that.data.classifyArr[m].id,
                    name: that.data.classifyArr[m].name,
                    num: that.data.policyArr[i].project[j],
                    intro: that.data.classifyArr[m].intro
                  })
                }
              }
            }
            that.data.policyArr[i].projectName = tempService
          }
          that.setData({
            policyArr: that.data.policyArr,
            vertifing: false,

          })
          console.log('policyArr', that.data.policyArr, that.data.activeId)
          
          if (that.data.activeId) {
            for (var i in that.data.policyArr) {
              if (that.data.policyArr[i].id == that.data.activeId) {
                that.setData({
                  activeItem: i,
                  activeSertvice: that.data.policyArr[i]
                })
              }
            }
          } else {
            that.setData({
              activeItem: 0,
              activeSertvice: that.data.policyArr[0]
            })
          }
          // that.setData({
          //   serviceArr: that.data.serviceArr
          // })
          // console.log('serviceArr', that.data.serviceArr)
        })
      } else {
        wx.showModal({
          title: '操作超时',
          content: '',
        })
      }
    },
  })
}

function getservice(that) {
  wx.request({
    url: test1 + '/user/index/sponsors',
    method: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'PHPSESSID=' + that.data.sessionId
    },
    data: {
      id: 17
    },
    success: function (res) {
      // var dataType = typeof res.data
      // if (dataType == 'string') {
      //   var jsonStr = res.data;
      //   jsonStr = jsonStr.replace(" ", "");
      //   var temp
      //   if (typeof jsonStr != 'object') {
      //     jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
      //     temp = JSON.parse(jsonStr);
      //     res.data = temp;
      //   }
      // }
      if (res.data.status == 1) {
        // that.data.policyDetail.policy.service_name = res.data.name

        that.setData({
          hasBinling: true,
          serviceName: res.data.name,
          loaded: true,
          // policyDetail: that.data.policyDetail
        })

        common.animationEvent(that)
      } else {
        wx.showModal({
          title: '操作超时',
          content: '',
        })

      }
    },
  })
}

function getItemClassify(that) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: test1 + '/user/user/classList',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      success: function (res) {
        // var dataType = typeof res.data
        // if (dataType == 'string') {
        //   var jsonStr = res.data;
        //   jsonStr = jsonStr.replace(" ", "");
        //   var temp
        //   if (typeof jsonStr != 'object') {
        //     jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
        //     temp = JSON.parse(jsonStr);
        //     res.data = temp;
        //   }
        // }
        console.log('###', res)
        that.data.classifyArr = res.data
        resolve(that)

      },
    })
  })
}