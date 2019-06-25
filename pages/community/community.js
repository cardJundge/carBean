// pages/community/community.js

import { Community } from 'communitymode.js';
var community = new Community();
import { Config } from '../../utils/config.js';
var app = getApp();

import common from '../../utils/common.js';
import utils from '../../utils/util.js'

const myAudio = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamicArr:[],
    tablist: ['文字版', '地图版'],
    sidelist:['全部','保险','理赔','维修/保养'],
    page:1,
    event_type:0,
    hasUserinfo:false,
    showLoginModal:false,
    showVoiceModal:false,
    animationData:{},
    isvoiceplay:true  //暂停/播放
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("初始化加载");
    var that = this;

    console.log("ddd", app.globalData.userInfo);
    
  
    utils.getlocation().then(function (res) {

      app.globalData.latitude = res.latitude;
      app.globalData.longitude = res.longitude;

      console.log(res.latitude + "***" + res.longitude);

    });

    that.data.sessionId = app.globalData.userInfo.session_id
    that.data.userId = app.globalData.userInfo.id

    app.globalData.event_type = 0

    that.setData({
      tablist: that.data.tablist,
      currentTab: 0
    })
  
  },

  //组件传过来的值
  onSend:function(e){
    console.log("eee",e);

    var that = this;

    that.data.dynamicArr = [];
    that.data.page =1;
    var res = e.detail.res;

    that.data.event_type = e.detail.event_type;

    //处理图文
    if (res.status == 1) {

      if (that.data.dynamicArr.length == 0 && res.data.length == 0) {

        that.setData({
          dynamicNull: true, 
          dynamicArr:that.data.dynamicArr,
          noData:false
        })

      } else {

        that.setData({
          dynamicNull: false
        })

        if (res.data.length == 0) {
          that.setData({
            noData: true,
          })

        } else {
          for (var i in res.data) {
            if (res.data[i].type == 1) {
              if (res.data[i].content) {
                res.data[i].imagecell = res.data[i].content.split(',')
              }
            }
            that.data.dynamicArr.push(res.data[i])

          }

          console.log("data" + JSON.stringify(that.data.dynamicArr));
          that.setData({
            dynamicArr: that.data.dynamicArr,
            hostName: Config.restUrl
          })
        }
      }

      wx.hideNavigationBarLoading();

      wx.stopPullDownRefresh() //停止下拉刷新
    } else {

      wx.showModal({
        title: '操作超时',
        content: '',
      })
    }

    that.setData({
      loadedMore: e.detail.loadedMore
    })

  },

  //详情
  toDetail: function (e) {

    var that = this;
    console.log(JSON.stringify(e));
    let dynamicArr = JSON.stringify(e.currentTarget.dataset.dynamicarr);
    console.log("dynamicArr" + dynamicArr);

    that.data.page = 1;

    wx.navigateTo({
      url: 'comment/comment?item=' + e.target.dataset.item + '&page=' + that.data.page + '&id=' + e.target.id + '&dynamicArr=' + dynamicArr,
    })

  },


  //预览图片 
  previewImage: function (e) {

    // var imgsrc = test +"/uploads/community/img/"+e.target.id;
    this.setData({
      flag:true
    })

    var imgArr = [];
    var index = e.currentTarget.dataset.index;
    var imgindex = e.currentTarget.dataset.imgindex

    console.log("&&&&&&&&&&" + index + JSON.stringify(e));

    for (let c of this.data.dynamicArr[index].imagecell) {

      imgArr.push(Config.restUrl + "/uploads/community/img/" + c);

    }

    // console.log("jjj" + JSON.stringify(imgsrc));
    wx.previewImage({
      urls: imgArr,
      current: imgArr[imgindex]
    })
  },

  openPublic: function () {
    this.setData({
      ifPublic: true
    })
  },
  closePublic: function () {
    this.setData({
      ifPublic: false
    })
  },
  toPublicText: function () {
    wx.navigateTo({
      url: 'listdetail/publicText/publicText',
    })
    this.setData({
      ifPublic: false
    })
  },
  topublicVideo: function () {
    wx.navigateTo({
      url: 'listdetail/publicVideo/publicVideo',
    })
    this.setData({
      ifPublic: false
    })
  },

  //点赞
  toThumnUp: function (e) {
    var that = this;

    if(app.globalData.userInfo){

      console.log("&&&&" + JSON.stringify(e));
      that.data.dynamic_id = e.currentTarget.id;
      that.data.userId = app.globalData.userInfo.id

      common.giveThumnUp(that).then(function(res){

        if(res == 1){
          var temp = 'dynamicArr[' + e.target.dataset.item + '].is_zan'
          var zan = that.data.dynamicArr[e.target.dataset.item].zan
          var zanvalue = parseInt(zan) + 1

          var temp1 = 'dynamicArr[' + e.target.dataset.item + '].zan'

          that.setData({
            [temp]: 1,
            [temp1]: zanvalue
          })
        }
      });

    }else{

      // wx.showToast({
      //   title: '请先登录...',
      // })

      that.setData({
        showLoginModal:true
      })

    }
   
  },

  //登录返回
  hideLoginModal:function(e){

    var that = this;
    that.login();
  },


  //登录
  login:function(){

    var that = this;
    app.getAuth((data) => {
      that.setData({
        openId: app.globalData.openId
      })
      // 没有授权
      if (!data) {
        
        // 已经授权
      } else {
        app.getUserLogin(data, response => {

          app.globalData.userInfo = response.data.data
          wx.setStorageSync("hasUserInfo", true)
          
        })
      }
    })
  },


  //取消点赞
  toCancelThumnUp: function (e) {

    var that = this

    if (app.globalData.userInfo) {

      that.data.dynamic_id = e.currentTarget.id;
      that.data.userId = app.globalData.userInfo.id
      common.cancelThumnUp(that).then(function(res){

        if(res==1){

          var temp = 'dynamicArr[' + e.target.dataset.item + '].is_zan'

          console.log("dddddddd", that.data.dynamicArr);
          var zan = that.data.dynamicArr[e.target.dataset.item].zan
          var zanvalue = parseInt(zan) - 1

          var temp1 = 'dynamicArr[' + e.target.dataset.item + '].zan'
          that.setData({
            [temp]: 0,
            [temp1]: zanvalue
          })
        }

      });

    }else{

      that.setData({
        showLoginModal: true
      })
    }

  },

  //分享
  toShare: function (e) {

    console.log("ddd"+JSON.stringify(e),app.globalData.userInfo);

    if (app.globalData.userInfo){

      console.log("ddd", this.data.dynamicArr);

      this.data.dynamic_id = e.target.id;
      var temp = "dynamicArr[" + e.target.dataset.index + "].share"

      var share = this.data.dynamicArr[e.target.dataset.index].share
      var sharevalue = parseInt(share) + 1

      this.setData({
        [temp]: sharevalue
      })
      common.shareDynamic(this)

    }else{
      // wx.showToast({
      //   title: '请先登录...',
      // })
      that.setData({
        showLoginModal: true
      })
    }

    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    if (currPage.data.currentTab) {
      this.setData({
        currentTab: currPage.data.currentTab
      })
    }


    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userInfo']) {
    //       that.setData({
    //         showLoginModal: true
    //       })
    //     }
    //   }
    // })

    if(that.data.flag){


    }else{

      
      that.data.dynamicArr = [];
      that.data.page = 1;
    }

    // that.data.dynamicArr = [];
    

    if (app.globalData.userInfo) {

      that.setData({
        islogin: true
      })
    } else {
      that.setData({
        islogin: false
      })
    }

    community.getDynamicList(that.data.page, that.data.userId, 0, (res) => {

      console.log("11111",res);

      //处理图文
      if (res.status == 1) {

        that.setData({
          flag: false
        })

        if (that.data.dynamicArr.length == 0 && res.data.length == 0) {
          that.setData({
            dynamicNull: true      //暂无动态的模板
          })

        } else {
          that.setData({
            dynamicNull: false
          })
          if (res.data.length == 0) {
            that.setData({
              noData: true,
            })
          } else {
            for (var i in res.data) {
              if (res.data[i].type == 1) {
                if (res.data[i].content) {
                  res.data[i].imagecell = res.data[i].content.split(',')
                }
              } else if (res.data[i].type == 2){
                if (res.data[i].content) {
                  res.data[i].voiceduration= res.data[i].content.split('?')[1];
                }
              }
              that.data.dynamicArr.push(res.data[i])

            }

            console.log("data" + JSON.stringify(that.data.dynamicArr));

            wx.hideNavigationBarLoading();
            that.setData({
              dynamicArr: that.data.dynamicArr,
              hostName: Config.restUrl
            })
          }
        }

        wx.hideNavigationBarLoading();

        wx.stopPullDownRefresh() //停止下拉刷新
        
      } else {

        // wx.showModal({
        //   title: '操作超时',
        //   content: '',
        // })
        

      }

      that.setData({
        loadedMore: false
      })

    })

  },

  onReady:function(){
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
    var that = this;

    console.log("hhhhhhh");
    // that.data.page = 1;
    // that.data.isReachBottom=false
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    var that = this;
    that.data.page = 1;
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  //播放语音
  playvoice:function(e){
    
    var that = this;
    if(that.data.isvoiceplay){
      myAudio.src = Config.restUrl + "/uploads/community/voice/" + e.currentTarget.dataset.voicesrc;
      myAudio.play();
      that.setData({
        isvoiceplay:false
      })
    }else{
      myAudio.pause();
      that.setData({
        isvoiceplay: true
      })
    }
  },

  //语音结束刷新页面
  refresh:function(){
    var that = this;
    that.onShow();
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this
    ++that.data.page;

    community.getDynamicList(that.data.page, that.data.userId, that.data.event_type,(res) => {

      //处理图文
      if (res.status == 1) {

        console.log("kkkk", that.data.dynamicArr);

        that.setData({
          flag:false
        })

        if (that.data.dynamicArr.length == 0 && res.data.length == 0) {

          
          that.setData({
            dynamicNull: true
          })

        } else {
          that.setData({
            dynamicNull: false
          })
          if (res.data.length == 0) {
            that.setData({
              noData: true,
            })
          } else {
            for (var i in res.data) {
              if (res.data[i].type == 1) {
                if (res.data[i].content) {
                  res.data[i].imagecell = res.data[i].content.split(',')
                }
              }
              that.data.dynamicArr.push(res.data[i])
            }

            console.log("data" + JSON.stringify(that.data.dynamicArr));

            wx.hideNavigationBarLoading();
            that.setData({
              dynamicArr: that.data.dynamicArr,
              hostName: Config.restUrl
            })
          }
        }

        wx.hideNavigationBarLoading();

        wx.stopPullDownRefresh() //停止下拉刷新
      } else {

        wx.showModal({
          title: '操作超时',
          content: '',
        })
      }

      that.setData({
        loadedMore: false
      })

    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    console.log("ddd"+JSON.stringify(e));
  },

  //显示语音模板
  topublicVoice:function(){

    var that = this;
    that.setData({
      showVoiceModal:true,
      ifPublic: false
    })
  }
})