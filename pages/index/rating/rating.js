const app = getApp()
import common from '../../../utils/common.js'
var test = getApp().globalData.hostName
import utils from '../../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo: false,
    ifMobile: 0,
    medaReason: [],
    reasonsArr: [{
      id: 1,
      content: '服务态度不好',
      class: 'each_reason perfect',
      ifActive: false
    },
    {
      id: 2,
      content: '着装不规范',
      class: 'each_reason right_reason perfect',
      ifActive: false
    },
    {
      id: 3,
      content: '未做理赔指引',
      class: 'each_reason perfect',
      ifActive: false
    },
    {
      id: 4,
      content: '现场到达太慢',
      class: 'each_reason right_reason perfect',
      ifActive: false
    },
    {
      id: 5,
      content: '解答不专业',
      class: 'each_reason perfect',
      ifActive: false
    },

    ],
    reasonSuccess: [{
      id: 1,
      content: '现场到达快',
      class: 'each_reason perfect',
      ifActive: false
    },
    {
      id: 2,
      content: '着装规范',
      class: 'each_reason right_reason perfect',
      ifActive: false
    },
    {
      id: 3,
      content: '态度热情',
      class: 'each_reason perfect',
      ifActive: false
    },
    {
      id: 4,
      content: '理赔专业',
      class: 'each_reason right_reason perfect',
      ifActive: false
    },
    {
      id: 5,
      content: '热心解答',
      class: 'each_reason perfect',
      ifActive: false
    },

    ],
    rating_contents: '',
    starIndex: false,
    moduleArr: ['代办理赔', '代办维修', '代办年审', '拖车', '紧急救援', '事故车定损', '二手车评估', '保险代售', '查勘定损', '风险调查', '车辆推修'],
    ratingText: ['非常不满意，各方面都很差', '不满意，比较差', '一般，还需要改善', '比较满意，仍可改善', '非常满意，无可挑剔'],
    starts: [{
      id: 0,
      color: 'grey'
    }, {
      id: 1,
      color: 'grey'
    }, {
      id: 2,
      color: 'grey'
    }, {
      id: 3,
      color: 'grey'
    }, {
      id: 4,
      color: 'grey'
    }],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    starLigh: 0, //亮的星星
    ratingOk: false,
  },
  unhappyReason: function (e) {
    var tempId = e.currentTarget.dataset.content.id - 1
    this.data.medaReason[tempId].ifActive = !this.data.medaReason[e.currentTarget.dataset.content.id - 1].ifActive
    this.setData({
      medaReason: this.data.medaReason
    })

  },
  ratingStar: function (e) {
    var starId = parseInt(e.currentTarget.id)
    this.setData({
      starIndex: starId,
    })

    if (this.data.starts[starId].color == 'grey') {
      this.data.starLigh = starId + 1
      this.setData({
        hasStar: true,
      })
      for (var i in this.data.starts) {
        if (i > starId) { } else {
          this.data.starts[i].color = 'yellow'
        }
      }
    } else {
      this.data.starLigh = starId
      if (starId == 0) {
        this.setData({
          hasStar: false,
          starIndex: false,
        })
      }
      for (var i in this.data.starts) {
        if (i > starId || i == starId) {
          this.data.starts[i].color = 'grey'
        } else {

        }
      }
    }
    if (this.data.starLigh == 5) {
      //this.data.medaReason = this.data.reasonsArr
      this.setData({
        medaReason: this.data.reasonSuccess
      })
    } else {
      //this.data.medaReason = this.data.reasonsArr
      this.setData({
        medaReason: this.data.reasonsArr
      })
      this.setData({
        changeReason: ''
      })
    }
    this.setData({
      starts: this.data.starts
    })
  },
  submitRatings: function () {
    var that = this
    that.setData({
      isOver: true,
    })
    var tags = '';
    for (let i in that.data.medaReason) {
      if (that.data.medaReason[i].ifActive) {
        if (i == that.data.medaReason.length - 1) {
          tags += that.data.medaReason[i].content
        } else {
          tags += that.data.medaReason[i].content + '，'
        }

      }
    }

    wx.request({
      url: app.globalData.hostName + '/task/evaluate/add_eva',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      },
      data: {
        user_id: app.globalData.userInfo.id,
        service_id: that.data.survey.service_id,
        // service_id:"3951",
        // case_id: that.data.caseId,
        case_id: that.data.case_id,
        star: that.data.starLigh,
        // star:3,
        content: that.data.rating_contents,
        // content:"123",
        task_id: that.data.survey.task_id,
        // task_id:"456",
        tags: tags,
        // report_no: 11,
        verify: 1,
        // report_no: that.data.survey.report_no,
      },
      success: function (res) {
        that.setData({
          isOver: false,
        })
        if (res.data.status == 1) {
          app.globalData.coupon = res.data.coupon.id
          that.setData({
            beanLogTit: '评价',
            beanLogBean: '+0',
            ratingOk: true
          })
          getBean(that)
          wx.showToast({
            title: '评价成功',
          })
        } else if (res.data.status == -2) {
          wx.showModal({
            title: "消息通知",
            content: res.data.result,
            success(res) {
              if (res.confirm) {
                that.setData({

                  medaReason: [{
                    id: 1,
                    content: '服务态度不好',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 2,
                    content: '着装不规范',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 3,
                    content: '未做理赔指引',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 4,
                    content: '现场到达太慢',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 5,
                    content: '解答不专业',
                    class: 'each_reason perfect',
                    ifActive: false
                  },

                  ],
                  reasonSuccess: [{
                    id: 1,
                    content: '现场到达快',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 2,
                    content: '着装规范',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 3,
                    content: '态度热情',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 4,
                    content: '理赔专业',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 5,
                    content: '热心解答',
                    class: 'each_reason perfect',
                    ifActive: false
                  },

                  ],
                  rating_contents: '',
                  starIndex: false,
                  moduleArr: ['代办理赔', '代办维修', '代办年审', '拖车', '紧急救援', '事故车定损', '二手车评估', '保险代售', '查勘定损', '风险调查', '车辆推修'],
                  ratingText: ['非常不满意，各方面都很差', '不满意，比较差', '一般，还需要改善', '比较满意，仍可改善', '非常满意，无可挑剔'],
                  starts: [{
                    id: 0,
                    color: 'grey'
                  }, {
                    id: 1,
                    color: 'grey'
                  }, {
                    id: 2,
                    color: 'grey'
                  }, {
                    id: 3,
                    color: 'grey'
                  }, {
                    id: 4,
                    color: 'grey'
                  }],
                  ratingOk: false
                })
                wx.switchTab({
                  url: '../index',
                })

              } else if (res.cancel) {
                that.setData({

                  medaReason: [{
                    id: 1,
                    content: '服务态度不好',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 2,
                    content: '着装不规范',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 3,
                    content: '未做理赔指引',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 4,
                    content: '现场到达太慢',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 5,
                    content: '解答不专业',
                    class: 'each_reason perfect',
                    ifActive: false
                  },

                  ],
                  reasonSuccess: [{
                    id: 1,
                    content: '现场到达快',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 2,
                    content: '着装规范',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 3,
                    content: '态度热情',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 4,
                    content: '理赔专业',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 5,
                    content: '热心解答',
                    class: 'each_reason perfect',
                    ifActive: false
                  },

                  ],
                  rating_contents: '',
                  starIndex: false,
                  moduleArr: ['代办理赔', '代办维修', '代办年审', '拖车', '紧急救援', '事故车定损', '二手车评估', '保险代售', '查勘定损', '风险调查', '车辆推修'],
                  ratingText: ['非常不满意，各方面都很差', '不满意，比较差', '一般，还需要改善', '比较满意，仍可改善', '非常满意，无可挑剔'],
                  starts: [{
                    id: 0,
                    color: 'grey'
                  }, {
                    id: 1,
                    color: 'grey'
                  }, {
                    id: 2,
                    color: 'grey'
                  }, {
                    id: 3,
                    color: 'grey'
                  }, {
                    id: 4,
                    color: 'grey'
                  }],
                  ratingOk: false
                })
              }
            }

          })
        } else {
          wx.showModal({
            title: '操作超时',
            content: '',
            success(res) {
              if (res.confirm) {
                that.setData({

                  medaReason: [{
                    id: 1,
                    content: '服务态度不好',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 2,
                    content: '着装不规范',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 3,
                    content: '未做理赔指引',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 4,
                    content: '现场到达太慢',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 5,
                    content: '解答不专业',
                    class: 'each_reason perfect',
                    ifActive: false
                  },

                  ],
                  reasonSuccess: [{
                    id: 1,
                    content: '现场到达快',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 2,
                    content: '着装规范',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 3,
                    content: '态度热情',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 4,
                    content: '理赔专业',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 5,
                    content: '热心解答',
                    class: 'each_reason perfect',
                    ifActive: false
                  },

                  ],
                  rating_contents: '',
                  starIndex: false,
                  moduleArr: ['代办理赔', '代办维修', '代办年审', '拖车', '紧急救援', '事故车定损', '二手车评估', '保险代售', '查勘定损', '风险调查', '车辆推修'],
                  ratingText: ['非常不满意，各方面都很差', '不满意，比较差', '一般，还需要改善', '比较满意，仍可改善', '非常满意，无可挑剔'],
                  starts: [{
                    id: 0,
                    color: 'grey'
                  }, {
                    id: 1,
                    color: 'grey'
                  }, {
                    id: 2,
                    color: 'grey'
                  }, {
                    id: 3,
                    color: 'grey'
                  }, {
                    id: 4,
                    color: 'grey'
                  }],
                  ratingOk: false
                })
              } else if (res.cancel) {
                that.setData({

                  medaReason: [{
                    id: 1,
                    content: '服务态度不好',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 2,
                    content: '着装不规范',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 3,
                    content: '未做理赔指引',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 4,
                    content: '现场到达太慢',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 5,
                    content: '解答不专业',
                    class: 'each_reason perfect',
                    ifActive: false
                  },

                  ],
                  reasonSuccess: [{
                    id: 1,
                    content: '现场到达快',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 2,
                    content: '着装规范',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 3,
                    content: '态度热情',
                    class: 'each_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 4,
                    content: '理赔专业',
                    class: 'each_reason right_reason perfect',
                    ifActive: false
                  },
                  {
                    id: 5,
                    content: '热心解答',
                    class: 'each_reason perfect',
                    ifActive: false
                  },

                  ],
                  rating_contents: '',
                  starIndex: false,
                  moduleArr: ['代办理赔', '代办维修', '代办年审', '拖车', '紧急救援', '事故车定损', '二手车评估', '保险代售', '查勘定损', '风险调查', '车辆推修'],
                  ratingText: ['非常不满意，各方面都很差', '不满意，比较差', '一般，还需要改善', '比较满意，仍可改善', '非常满意，无可挑剔'],
                  starts: [{
                    id: 0,
                    color: 'grey'
                  }, {
                    id: 1,
                    color: 'grey'
                  }, {
                    id: 2,
                    color: 'grey'
                  }, {
                    id: 3,
                    color: 'grey'
                  }, {
                    id: 4,
                    color: 'grey'
                  }],
                  ratingOk: false
                })
              }
            }
          })
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    var caseId = decodeURIComponent(options.scene)
    that.setData({
      medaReason: that.data.reasonsArr,
      case_id: caseId
    })
    common.pageCss(this)
    app.getAuth(res => {
      console.log('*******',res)
      if (!res) {
        that.setData({
          hasUserInfo: false
        })
      } else {
        app.getUserLogin(res, (response)=> {
          app.globalData.userInfo = response.data.data
          if (response.data.status == 1) {
            that.setData({
              userInfo: response.data.data,
              hasUserInfo: true,
              sessionId: response.data.data.session_id
            })
            common.userInfor(that).then(function (res) {
            })
          }
        })
      }
    })
   
  },
  ckeckContent: function (e) {
    this.setData({
      rating_contents: e.detail.value
    })
  },
  getUserInfo: function (e) {
    var that = this
    // wx.showLoading({
    //   title: '获取中...',
    // })
    // app.getUser(e.detail.rawData)
    that.setData({
      isOver: true
    })
    // var dataType = typeof e.detail.rawData
    // if (dataType == 'string') {
    //   var jsonStr = e.detail.rawData;
    //   jsonStr = jsonStr.replace(" ", "");
    //   var temp
    //   if (typeof jsonStr != 'object') {
    //     jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
    //     e.detail.rawData = JSON.parse(jsonStr);
    //   }
    // }
    if (e.detail.userInfo) {
      // app.globalData.userInfo = e.detail.userInfo
      app.getAuth(res=> {
        if (!res) {
          that.setData({
            hasUserInfo: false
          })
        } else {
          app.getUserLogin(res, (response) => {
            app.globalData.userInfo = response.data.data
            if (response.data.status == 1) {
              that.setData({
                userInfo: response.data.data,
                hasUserInfo: true,
                beanLogTit: '登录',
                beanLogBean: '+0',
                ratingOk: true,
                sessionId: response.data.data.session_id,
                isOver: false
              })
              getBean(that)
              common.userInfor(that).then(function (res) {
                if (res.data.survey) {
                  that.submitRatings()
                }
              })

            }
          })
        }
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this

  },

  toOut: function () {
    wx.navigateBack({
      delta: 1
    })
  },

})


function getBean(that) {
  wx.request({
    url: test + '/user/user/insertBean',
    method: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'PHPSESSID=' + that.data.sessionId
    },
    data: {
      bean: that.data.beanLogBean
    },
    success: function (res) {
     
      wx.setStorageSync('userBean', wx.getStorageSync('userBean') + 3)
      utils.beanLog(that)
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
      if (that.data.ratingOk) {
        that.setData({
          modal: true
        })
        setTimeout(function () {
          that.setData({
            modal: false,
          })
          if (that.data.insuranceType == 1) {

            wx.redirectTo({
              url: './ratingOk/ratingOk?serviceId=' + that.data.survey.service_id + '&&case_id=' + that.data.case_id,
            })
          } else {
            wx.switchTab({
              url: '../index',
            })

          }

        }, 2000)
      }
    }
  })
}

