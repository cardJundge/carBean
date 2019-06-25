// 消息通知
import {
  Mine
} from '../../models/msgmodel.js';

import { Config } from '../../../../utils/config.js'
var mineModel = new Mine();
const app = getApp();


Page({
  data: {
    showMsg: true, // 系统和动态消息切换
    showInputBox: false,
    showMsgNull: true,
    showDynamicNull: false,
    dynamicId: null,
    dynamicPage: 1,
    dynamicPageSize: 10,
    fromInfoList: [], // 动态消息的列表
    hasMoreData: true, // 是否有更多数据的判断
    noMoreData: false,
    bottomShow: false,
    showLoadding: false, // 显示加载
    // focus: false,  //底部弹出框
    // replayList: []
  },
  // 页面加载
  onLoad: function(options) {
    this.setData({
      basicUserInfo: app.globalData.userInfo,
      restUrl: Config.restUrl +"/uploads/community/img/"
    })
    this.queryDynamic()
  },
  // 请求动态消息
  queryDynamic: function(message) {
    var that = this
    // 获得动态消息接口
    mineModel.getDynamic(that.data.basicUserInfo.id, that.data.dynamicPage, (res) => {
      if (res.status == 1) {

        var reqInfo = [];
        var fromInfoList = that.data.fromInfoList

        for(var i in res.data){

          if (res.data[i].dynamic.content){
            res.data[i].dynamic.imagecell = res.data[i].dynamic.content.split(',')
            console.log("hhh", res.data[i].dynamic.imagecell[0]);
          }

          reqInfo.push(res.data[i])
        }

        console.log("aaaa", reqInfo);

      
        if (that.data.fromInfoList.length < that.data.dynamicPageSize) {
          that.setData({
            fromInfoList:  fromInfoList.concat(reqInfo),
            hasMoreData: false,
          })
          console.log('12@@@@@',that.data.fromInfoList)
        } else {
          that.setData({
            fromInfoList: fromInfoList.concat(reqInfo),
            hasMoreData: true,
            dynamicPage: that.data.dynamicPage + 1,
          })
        }
      } else if (res.status == 0) {
        that.setData({
          showDynamicNull: true
        })
      } else {
        wx.showToast({
          title: "加载数据失败",
          icon: 'none',
          duration: 1000
        });
      }
      // console.log('动态消息', res)
    })
  },

  // 系统通知和动态的切换
  onSwitchMsgTab: function(e) {
    let tab = e.currentTarget.dataset.tab
    if (tab == 1) {
      this.setData({
        showMsg: true
      })
    } else {
      this.setData({
        showMsg: false
      })
    }
  },
  // 底部弹出来的input框
  // openKeyBoard: function(e) {
  //   this.setData({
  //     focus: true,
  //     showInputBox: true,
  //     dynamicId: e.currentTarget.dataset.dynamicid
  //   })
  // },
  // onSend: function(e) {
  //   var replay = this.data.replayList.push(e.detail.replyText)
  //   console.log(this.data.replayList)
  //   this.setData({
  //     replyList: this.data.replayList
  //   })
  // },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (that.data.hasMoreData) {
      that.queryDynamic()
      that.setData({
        bottomShow: true,
        noMoreData: false
      })
    } else {
      that.setData({
        bottomShow: true,
        noMoreData: true
      })
      setTimeout(function () {
        //要延时执行的代码
        that.setData({
          bottomShow: false,
        })
      }, 2000)  
    }
  }
})