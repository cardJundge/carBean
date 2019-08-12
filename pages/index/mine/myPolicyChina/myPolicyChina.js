// 中银保险
// pages/index/mine/myPolicy/myPolicy.js
import common from '../../../../utils/common.js'
import {
  Member
} from '../../../common/models/member.js'
var memberModel = new Member()
var test1 = getApp().globalData.hostName;
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chinaNumber: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    timer: 300,
    mobile: 18392390727,
    // container: 'container',
    // back_cell: 'back_cell',
    // title_cell: 'title_cell',
    // marginTop: '64px',
    serviceArr: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    introArr: []
  },


  // switchnav: function (e) {
  //   var that = this;

  //   that.setData({
  //     currentTab: e.currentTarget.dataset.index
  //   })

  // },

  toMyOrder: function() {
    this.data.activeId = this.data.activeSertvice.id
    app.globalData.activePolicy = {
      id: this.data.activeSertvice.id
    }

    wx.navigateTo({
      url: '../../../services/orderlist/orderlist',
    })
  },

  addMore: function() {
    this.setData({
      hasBinling: false,
      ifAdd: true
    })
  },

  notAdd: function() {
    this.setData({
      hasBinling: true,
    })
  },

  toserviceItem: function(e) {
    console.log(e)
    if (e.currentTarget.dataset.server == '代为送检(年审,不含上线)') {
      this.setData({
        openItem: true,
      })
      return
      
    }
    app.globalData.activePolicy = {
      id: this.data.activeSertvice.id
    }
    this.data.ifonshow = true
    wx.navigateTo({
      url: '../../../services/servicestype/servicestype?server=' + e.currentTarget.dataset.server,
    })
    this.data.activeId = this.data.activeSertvice.id
    app.globalData.ifPolicy = true
  },

  okItem: function() {
    this.setData({
      openItem: false
    })
    memberModel.agentOrderDetail(app.globalData.userInfo.id, 2, res => {
      console.log(res)
      if (res.status == 1) {
        if (res.data.status < 2) {
          wx.setStorageSync("agentType", res.data.type)
          wx.navigateTo({
            url: '../../../common/member/agent/order/order',
          })
        } else {
          wx.navigateTo({
            url: '../../../common/member/agent/agent?content=' + '年审代办',
          })
        }
      } else {
        wx.navigateTo({
          url: '../../../common/member/agent/agent?content=' + '年审代办',
        })
      }
    })
    return
    // console.log(this.data.activeSertvice)
    // app.globalData.activePolicy = {
    //   id: this.data.activeSertvice.id
    // }

    // this.data.activeId = this.data.activeSertvice.id
    // wx.navigateTo({
    //   url: '../../../services/servicestype/servicestype?server=代为送检(年审,不含上线)',
    // })
    // app.globalData.ifPolicy = true
  },

  closeItem: function() {
    this.setData({
      openItem: false
    })
  },

  openIntro: function(e) {
    console.log(e.currentTarget.id)
    this.data.introArr[e.currentTarget.id] = !this.data.introArr[e.currentTarget.id]
    this.setData({
      introArr: this.data.introArr
    })
  },

  veryifyCode: function(e) {
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
      success: function(res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            temp = JSON.parse(jsonStr);
            res.data = temp;
          }
        }
        if (res.data.status == 1) {
          checkPolicy(that)
          that.setData({
            unionId: app.globalData.userInfo.unionId
          })
          wx.request({
            url: test1 + '/user/login/index',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              unionid: that.data.unionId,
              source: 'chedou'
            },
            success(res) {
              console.log('登录成功', res)
              if (res.data.status == 1) {
                app.globalData.userInfo = res.data.data
              }
            }
          })
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

  bingingPolicy: function(e) {
    var that = this
    var reCar = /([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/i;
    if (reCar.test(e.detail.value.policyNum)) {
      console.log('ok')
    } else {
      if (e.detail.value.policyNum.length == 6) {

      } else {
        this.setData({
          inforOk: true
        })
        return
      }

    }
    that.data.bindCarNo = e.detail.value.policyNum
    wx.showLoading({
      title: '查询中...',
    })
    console.log(e.detail.value.policyNum)
    wx.request({
      url: test1 + '/user/user/bankGetPolicy',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      data: {
        car_no: e.detail.value.policyNum,
      },
      success: function(res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            temp = JSON.parse(jsonStr);
            res.data = temp;
          }
        }
        console.log(res)
        wx.hideLoading()
        if (res.data.status == 1) {
          that.setData({
            vertifing: true,
            mobile: res.data.mobile,
            mobile1: res.data.mobile.slice(0, 3) + '****' + res.data.mobile.slice(8, 11)
          })
          that.data.timerCon = setInterval(function() {
            if (that.data.timer == 0) {
              clearInterval(that.data.timerCon)
              that.setData({
                timer: 300
              })
            } else {
              that.data.timer--
                that.setData({
                  timer: that.data.timer
                })
            }

          }, 1000)

        } else if (res.data.status == 0) {
          that.setData({
            no_policy: true
          })

        } else if (res.data.status == -1) {
          that.setData({
            bindings: true
          })
        } else if (res.data.status == -2){
          that.setData({
            bindings: true
          })
        }
      },
    })
  },

  backIndex: function() {
    wx.switchTab({
      url: '../../service/service',
    })
  },
 
 

  onLoad: function(options) {
    var that = this
    this.data.ifonshow = false
    if (!app.globalData.userInfo) {
      app.getAuth((res) => {
        if (!res) {
          that.setData({
            hasUserInfo: false
          })
        } else {
          app.getUserLogin(res, (response) => {
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
    // var menu = 1
    // if (options.menu == 1) {
    //   this.setData({
    //     menu: 1
    //   })
     
    // }
    //  else {
    //   that.setData({
    //     userId: app.globalData.userInfo.id,
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true,
    //     sessionId: app.globalData.userInfo.session_id
    //   })
    //   if (app.globalData.userInfo.is_policy == 1) {
    //     checkPolicy(that)
    //   } else {
    //     that.setData({
    //       loaded: true,
    //       hasBinling: false
    //     })
    //   }
    // }
    // that.setData({
    //   hasUserInfo: true
    // })
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.model)
        app.globalData.mobileType = res.model
      }
    })
    var screenHeight = wx.getSystemInfoSync().screenHeight
    var screenWidth = wx.getSystemInfoSync().screenWidth
    that.setData({
      screenWidth: (screenWidth * 317) / 375 + 'px'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    app.globalData.activePolicy = {}
    if (app.globalData.userInfo) {
      if (app.globalData.userInfo.is_policy == 1) {
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
  changePolicy: function(e) {

    console.log("hhhhhhhhhh", e, this.data.policyArr);
    this.setData({
      activeItem: e.currentTarget.id,
      activeSertvice: this.data.policyArr[e.currentTarget.id]
    })

  },
  getUserInfo: function(e) {
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
          app.getUserLogin(res,(response)=> {
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

  toDriving: function(e) {

    this.data.ifonshow = true
    console.log(JSON.stringify(this.data.activeSertvice) + "kk" + e.currentTarget.id)


    wx.navigateTo({
      url: '../../../edaijia/driving_/driving_?card_length=' + e.currentTarget.id + '&policyId=' + this.data.activeSertvice.policy_no + '&policy=' + this.data.activeSertvice.id + '&title=',
    })
    this.data.activeId = this.data.activeSertvice.id
  },
  cancelModal: function() {
    this.setData({
      showLogo: true,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  cancelRed: function() {
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
    success: function(res) {
      wx.hideLoading()
      if (res.data.status == 1) {
        that.setData({
          serviceArr: [],
          vertifing: false
        })
        that.data.policyArr = res.data.data
        // that.data.tempProject = res.data.data.project
        getservice(that)
        getItemClassify(that).then(function() {
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

          })
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
          that.setData({
            serviceArr: that.data.serviceArr
          })
        })
      } else {
        that.setData({
          hasBinling: false,
          loaded: true
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
      id: 3949
    },
    success: function(res) {
      console.log(res)

      //保险公司id
      app.globalData.service_no = res.data.id;

      var dataType = typeof res.data
      if (dataType == 'string') {
        var jsonStr = res.data;
        jsonStr = jsonStr.replace(" ", "");
        var temp
        if (typeof jsonStr != 'object') {
          jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
          temp = JSON.parse(jsonStr);
          res.data = temp;
        }
      }
      if (res.data.status == 1) {
        // that.data.policyDetail.policy.service_name = res.data.name

        that.setData({
          hasBinling: true,
          serviceName: res.data.name,
          loaded: true

          // 修改屏蔽
          // policyDetail: that.data.policyDetail
        })
        setTimeout(function() {
          that.setData({
            showLogo: true
          })
        }, 2000)
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
  return new Promise(function(resolve, reject) {
    wx.request({
      url: test1 + '/user/user/classList',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      success: function(res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            temp = JSON.parse(jsonStr);
            res.data = temp;
          }
        }
        that.data.classifyArr = res.data
        resolve(that)
      },
    })
  })
}