// 金牌
import {
  Member
} from '../../models/member.js'
var memberModel = new Member()
var app = getApp()
Page({
  data: {
    basicUserInfo: {},
    showMemberIntro: true,
    serviceArr: [],
    agentArr: []
  },
  onLoad: function(options) {
    this.setData({
      basicUserInfo: app.globalData.userInfo
    })
    var leavel = wx.getStorageSync("memberInfo")
    if (leavel.leavel == 3) {
      this.setData({
        showMemberIntro: false
      })
      // this.getEquity()
    }
  },

  onShow: function() {
    var leavel = wx.getStorageSync("memberInfo")
    this.setData({
      serviceArr: [],
      agentArr: []
    })
    if (leavel.leavel == 3) {
      this.getEquity()
      this.getOtherEquity()
    }
  },

  onUnload: function() {
    // console.log("FFFFf");
    // var pages = getCurrentPages();
    // wx.navigateBack({
    //   delta: pages.length
    // })

    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 购买金牌会员
  toBuyGold: function(e) {

    var that = this
    var params = {
      body: '黄金套餐',
      openId: that.data.basicUserInfo.openId_114,
      money: '0.01',
      type: '1'
    }
    memberModel.toBuyMember(params, (res) => {
      if (res.status == 1) {
        console.log(res)
        var payInfo = res.result
        wx.requestPayment({
          'timeStamp': payInfo.timeStamp.toString(),
          'nonceStr': payInfo.nonceStr,
          'package': payInfo.package,
          'signType': 'MD5',
          'paySign': payInfo.sign,
          'success': function(res) {
            console.log('微信支付', res)
            that.payOk()
          },
          'fail': function(res) {
            wx.showToast({
              title: '支付失败',
              icon: "fail"
            })
          },
          'complete': function(res) {

          }
        })
      }
    })
  },
  // 购买套餐回调
  payOk: function() {
    var that = this
    var params = {
      comboId: '3',
      userId: that.data.basicUserInfo.id,
      type: '3'
    }
    memberModel.buyCombo(params, (res) => {
      if (res.status == 1) {
        memberModel.toLogin(that.data.basicUserInfo.unionId, that.data.basicUserInfo.source, (res) => {
          if (res.status == 1) {

            that.getEquity();
            wx.showToast({
              title: '付款成功',
              icon: "success"
            })
            that.setData({
              showMemberIntro: false
            })

            app.globalData.userInfo = res.data
            that.setData({
              basicUserInfo: res.data
            })

          }
        })
      }
    })
  },
  // 会员权益
  getEquity: function(e) {
    var that = this
    memberModel.getEquity(that.data.basicUserInfo.id, (res) => {
      console.log(res)
      let starttimes = [];
      let endtimes = [];
      starttimes = res.data.combo.pay_date.split(" ");
      endtimes = res.data.combo.end_date.split(" ");


      memberModel.getItemClassify(res1 => {
        for (var i in res.data.project) {
          for (var j in res1) {
            if (i == res1[j].id) {
              for (var k in res.data.projects) {
                if (i == k) {
                  that.data.serviceArr.unshift({
                    id: i,
                    name: res1[j].name,
                    num: res.data.project[i],
                    intro: res1[j].intro,
                    sum: res.data.projects[k]
                  })

                }
              }

            }
          }
        }

        // if (i == 20) {

        // } else {
        //   that.data.serviceArr.push({
        //     id: i,
        //     name: res1[j].name,
        //     num: res.data.project[i],
        //     intro: res1[j].intro
        //   })
        // }
        that.setData({
          comboList: res.data.combo,
          starttimes: starttimes[0],
          endtimes: endtimes[0],
          comboproject: that.data.serviceArr
        })

        console.log(that.data.comboproject);
      })
    })
  },

  // 会员其他权益
  getOtherEquity: function(e) {
    memberModel.getOtherEquity(this.data.basicUserInfo.id, (res) => {
      for (var i in res.count) {
        this.data.agentArr.unshift({
          id: i,
          count: res.count[i]
        })
      }
      this.setData({
        agentList: this.data.agentArr
      })
      console.log(res, this.data.agentArr)
    })
  },

  //VIP专属特权
  toserviceItem: function(e) {
    app.globalData.server = e.currentTarget.dataset.server;

    wx.navigateTo({
      url: '../../../services/servicestype/servicestype?server=' + e.currentTarget.dataset.server,
    })
  },
  toInsurance: function() {
    wx.navigateTo({
      url: '../insurance/insurance',
    })
  },
  toAgent: function(e) {
    console.log(e.currentTarget.dataset.agent)
    if (e.currentTarget.dataset.type) {
      memberModel.agentOrderDetail(app.globalData.userInfo.id, e.currentTarget.dataset.type, res => {
        if (res.status == 1) {
          console.log('1')
          if (res.data.status < 2) {
            wx.setStorageSync("agentType", res.data.type)
            wx.navigateTo({
              url: '../agent/order/order',
            })
          } else {
            wx.navigateTo({
              url: '../agent/agent?content=' + e.currentTarget.dataset.agent,
            })
          }
        } else {
          console.log('2')
          wx.navigateTo({
            url: '../agent/agent?content=' + e.currentTarget.dataset.agent,
          })
        }
      })
    } else {
     
      wx.navigateTo({
        url: '../agent/agent?content=' + e.currentTarget.dataset.agent,
      })
    }
  }
})