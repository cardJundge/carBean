// 银牌
import {
  Member
} from '../../models/member.js'
var memberModel = new Member()
var app = getApp()
Page({
  data: {
    basicUserInfo: {},
    showMemberIntro: true,
    comboproject:{},
    serviceArr:[]
  },
  onLoad: function(options) {

    if (options.tag){
      this.data.tag = options.tag;
    }

    this.setData({
      basicUserInfo: app.globalData.userInfo
    })
    var leavel = wx.getStorageSync("memberInfo")
    if (leavel.leavel == 2) {
      this.setData({
        showMemberIntro: false
      })
    }
  },

  onShow: function() {
    var leavel = wx.getStorageSync("memberInfo")
    this.setData({
      serviceArr: []
    })
    if (leavel.leavel == 2) {
      this.getEquity()
    }
  },

  onUnload:function(){
  
    // var pages = getCurrentPages();
    // console.log("FFFFf",pages.length);
    // wx.navigateBack({
    //   delta: pages.length-2
    // })

    if (this.data.tag){
      wx.switchTab({
        url: '/pages/mine/mine'
      })

    }else{
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  
  },

  // 购买银牌会员
  toBuySilver: function(e) {
    var that = this
    var params = {
      body: '白银套餐',
      openId: that.data.basicUserInfo.openId_chedou,
      money: '168',
      type: '1'
    }
    memberModel.toBuyMember(params, (res)=> {
      var that = this
      if(res.status == 1) {
        console.log(res)
        var payInfo = res.result
        wx.requestPayment({
          'timeStamp': payInfo.timeStamp.toString(),
          'nonceStr': payInfo.nonceStr,
          'package': payInfo.package,
          'signType': 'MD5',
          'paySign': payInfo.sign,
          'success': function (res) {
            that.payOk()
          },
          'fail': function (res) {
            wx.showToast({
              title: '支付失败',
              icon: "none"
            })
          },
          'complete': function (res) {
            
          }
        })
      }
    })
  },
  // 购买套餐回调
  payOk: function() {
    var that = this
    var params = {
      comboId: '2',
      userId: that.data.basicUserInfo.id,
      type: '2'
    }
    memberModel.buyCombo(params, (res)=> {
      if(res.status == 1) {
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
    memberModel.getEquity(this.data.basicUserInfo.id, (res)=> {
      console.log(res)
      let starttimes = [];
      let endtimes = [];
      starttimes = res.data.combo.pay_date.split(" ");
      endtimes = res.data.combo.end_date.split(" ");

      memberModel.getItemClassify(res1=>{

        for (var i in res.data.project){
          for(var j in res1){
            if(i == res1[j].id){
              for(var k in res.data.projects) {
                if(i == k) {
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

  // 跳转到车务咨询
  toAgent: function(e) {
    wx.navigateTo({
      url: '../agent/agent?content=' + e.currentTarget.dataset.agent,
    })
  },


  //VIP专属特权
  toserviceItem: function (e) {
    app.globalData.server = e.currentTarget.dataset.server;

    wx.navigateTo({
      url: '../../../services/servicestype/servicestype?server=' + e.currentTarget.dataset.server,
    })
  },

  toInsurance: function() {
    wx.navigateTo({
      url: '../insurance/insurance',
    })
  }
}) 