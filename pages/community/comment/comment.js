// pages/index/Community/communityC/comment.js

var app = getApp();
var test = getApp().globalData.hostName;

import util from '../../../utils/util.js';
import common from '../../../utils/common.js';
import { Config } from '../../../utils/config.js';
import { Community } from '../communitymode.js';

var community = new Community();

const myAudio = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    dynamicArr:[],  //消息列表
    hostName: test,
    inputBoxShow: true,
    evaluatepage:1,
    evaluationArr:[], //评论列表
    evaluationObj:{},  //评论对象
    reply:[],
    reply1:{}, 
    dianzan:false,
    re_content:'',
    focus:false,
    touid:'',
    level:0,
    logo:'写评论',
    moreShow:true,
    showLoginModal:false,
    showVoiceModal:false,
    isvoiceplay: true, //暂停/播放(评论)
    isvoiceplay1:true,   //(详情页)
    back: false,
    details:true,
    dylogo:2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    var phone = wx.getSystemInfoSync();  //调用方法获取机型

    if (phone.platform == 'ios' ){

      that.setData({
        detail: false
      })

    }else{

      that.setData({
        detail: true
      })
    }

    if (app.globalData.userInfo) {

      that.setData({
        islogin: true
      })
    } else {
      that.setData({
        islogin: false
      })
    }

    that.data.sessionId = app.globalData.userInfo.session_id
    that.data.userId = app.globalData.userInfo.id

    that.data.userInfo = app.globalData.userInfo
  
    that.data.userimg = app.globalData.userInfo.face;
    that.data.username = app.globalData.userInfo.nickname

    if (options.item){
      that.data.item = options.item;
      that.data.page = options.page;
    }
    
    that.data.id = options.id;

    that.data.dynamicArr = app.globalData.dynamicArr;
    // that.data.dynamicArr = JSON.parse(options.dynamicArr);

  
    if (options.dynamic_id) {

      that.data.id = options.dynamic_id

      that.setData({
        back: true
      })

      community.dynamicInfo(options.dynamic_id, res => {

        console.log("log", res)

        if (res.status == 1) {

          if (res.data.type == 1) {
            if (res.data.content) {
              res.data.imagecell = res.data.content.split(',')
            }

            res.data.title = common.entitiesToUtf16(res.data.title);
          } else if (res.data.type == 2) {
            if (res.data.content) {
              res.data.voiceduration = res.data.content.split('?')[1];
            }
          } else {
            res.data.title = common.entitiesToUtf16(res.data.title);
          }

          app.globalData.dynamicArr = res.data

          // wx.navigateTo({
          //   url: 'comment/comment?id=' + id + '&dynamicArr=' + res.data,
          // })

          that.setData({
            dynamicArr: [res.data]
          })
        }

      })

    } else {

      console.log("GGGG", that.data.dynamicArr);

      that.setData({
        dynamicArr: [that.data.dynamicArr],
        moreShow: true,
        hostName: Config.restUrl,
        touid: that.data.dynamicArr.user_id,
        userid: app.globalData.userInfo.id
      })
    }

    getDynamicevaluationlist(that);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //返回首页
  back: function () {

    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this;
    that.data.evaluatepage++;

    
    getDynamicevaluationlist(that)

  },

  //显示语音模块
  playvoicemode:function(){

    var that = this;
    that.setData({
      showVoiceModal:true,
      logo:""
    })
  },

  //判断是否获取地理位置
  getLocation: function () {

    var that = this;

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            showLoginModal: true
          })
        } else if (!res.authSetting['scope.userLocation']) {
          that.setData({
            locationshow: true
          })
        }
      }
    })

  },

  //语音结束刷新页面
  refresh: function () {
    var that = this;
    // that.onLoad();
    
  },

  //播放详情页面的语音
  playingvoice: function (e) {

    var that = this;

    var index = e.currentTarget.dataset.index;


    if (that.data.isvoiceplay1) {
      myAudio.src = Config.restUrl + "/uploads/community/voice/" + e.currentTarget.dataset.voicesrc;
      myAudio.play();


      var temp = 'dynamicArr[' + index + '].voiceisplaying'

      that.setData({
        [temp]: true,
        isvoiceplay1: false,
        dynamicArr: that.data.dynamicArr
      })


      myAudio.onEnded(res => {
        var temp = 'dynamicArr[' + index + '].voiceisplaying';
        myAudio.stop();
        that.setData({
          isvoiceplay1: true,
          [temp]: false,
          dynamicArr: that.data.dynamicArr
        })
      })

    } else {
      var temp = 'dynamicArr[' + index + '].voiceisplaying'
      myAudio.pause();
      that.setData({
        isvoiceplay1: true,
        [temp]: false,
        dynamicArr: that.data.dynamicArr
      })
    }


  },

  //复制文本
  copytitle:function(e){

    wx.setClipboardData({
      data: e.currentTarget.dataset.dynamicarr.title,
      success: function (res) {
        // self.setData({copyTip:true}),
        wx.showToast({
          title: '复制成功',
        })
      }
    });
  },

  //分享
  toShare: function (e) {

    // console.log("ddd" + JSON.stringify(e), app.globalData.userInfo);
    // if (app.globalData.userInfo) {
    //   console.log("ddd", this.data.dynamicArr);
    //   this.data.dynamic_id = e.target.id;
    //   var temp = "dynamicArr[" + e.target.dataset.index + "].share"
    //   var share = this.data.dynamicArr[e.target.dataset.index].share
    //   var sharevalue = parseInt(share) + 1
    //   this.setData({
    //     [temp]: sharevalue
    //   })
    //   common.shareDynamic(this)
    // } else {   
    //  that.setData({
    //    showLoginModal:true
    //  })
    // }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {

      // console.log(JSON.stringify(e));

      // this.data.dynamic_id = e.target.id;
      // var temp = "dynamicArr[" + e.target.dataset.index + "].share"

      // var share = this.data.dynamicArr[e.target.dataset.index].share
      // var sharevalue = parseInt(share) + 1

      // this.setData({
      //   [temp]: sharevalue
      // })
      // common.shareDynamic(this)


    console.log("ddd" + JSON.stringify(e), app.globalData.userInfo);

    if (app.globalData.userInfo) {

      console.log("ddd", this.data.dynamicArr);

      this.data.dynamic_id = e.target.id;
      var temp = "dynamicArr[" + e.target.dataset.index + "].share"

      var share = this.data.dynamicArr[e.target.dataset.index].share
      var sharevalue = parseInt(share) + 1

      this.setData({
        [temp]: sharevalue
      })
      common.shareDynamic(this)

    } else {

      that.setData({
        showLoginModal: true
      })
    }

    return {
      title: '社区分享',
      path: 'pages/community/comment/comment?dynamic_id=' + this.data.dynamic_id,
    }
    
  },

  distext:function(){
    this.setData({
      focus:false,
      dianzan:false,
      logo:"写评论"
    })
  },

  textinput:function(e){

    this.setData({
      dianzan:true,
      focus:true,
      height: e.detail.height
    })
  },

  submitPublic:function(e){

    var that = this

    //type 1是文字  2是语音

    if (app.globalData.userInfo) {

      if (e.detail.value){

        if (e.detail.value.content==""){
          
          wx.showToast({
            title: '评论内容不能为空!',
          })

          return
        }else{
          that.data.content = e.detail.value.content;

          that.data.content=common.utf16toEntities(that.data.content);

          that.data.type = "1"
        }
        
      }else{
        that.data.content = e.detail.fileName
        that.data.type = "2"
      }

      console.log("^^^^^" + that.data.content);

      releaseevaluation(that).then(function (that) {

        console.log("UUU" + JSON.stringify(that.data.evaluationArr));
        var temp = 'dynamicArr[0].comment';

        var comment = parseInt(that.data.dynamicArr[0].comment) + 1

        console.log("HHHHH" + that.data.dynamicArr[0].comment);

        that.setData({
          evaluationArr: that.data.evaluationArr,
          re_content: '',
          touid: "",
          level: 0,
          content: '',
          logo: '写评论',
          evaluate: "",
          [temp]: comment
          // dynamicArr: [that.data.dynamicArr]
        })
      })

    }else{

      that.setData({
        showLoginModal:true
      })
    }

  },


  //登录返回
  hideLoginModal: function (e) {

    var that = this;
    that.login();
  },


  //登录
  login: function () {

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



  //弹出键盘
  keyboard:function(e){

    console.log("FFF"+JSON.stringify(e));

    this.data.i = e.currentTarget.dataset.index;

    var nickname = e.currentTarget.dataset.nickname

    this.data.itusername = nickname;

    nickname = "回复" + nickname + ":";

    console.log(nickname.length)

    this.data.touid = e.currentTarget.dataset.fromid;
    this.data.level = e.currentTarget.dataset.level

    if (e.currentTarget.dataset.type == 2){

      this.setData({
        dianzan: false
      })

    }else{

      this.setData({
        focus: true,
        dianzan: true,
        logo: nickname
      })
      
    }

    

  },

  reply:function(e){

    var that = this;
    
    console.log("RRRRRR"+JSON.stringify(e));
    var replyindex = e.target.dataset.replyindex
    // var touid = that.data.evaluationArr[replyindex].id;
    var dynamicid = that.data.evaluationArr[replyindex].dynamic_id;
    
    wx.navigateTo({
      url: '../reply/reply?dynamicid=' + dynamicid + '&index=' + replyindex,
    })

  },

  onHide:function(){
    
  },

  onUnload:function(){
    console.log("RRRRR");
    app.globalData.communityc = true;
  },

  moreShow:function(e){

    this.data.index = e.currentTarget.dataset.index;

    var temp2 = 'evaluationArr[' + this.data.index + '].moreShow'

    this.setData({
      
      [temp2]:true
    })
  },

  loseFocus:function(){

    console.log("UUUUUUUUUUU");

    this.setData({
      focus:false
    })
  },

  //预览图片 
  previewImage: function (e) {

    // var imgsrc = test +"/uploads/community/img/"+e.target.id;

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

  

  //点赞
  toThumnUp: function (e) {
    var that = this;

    if (app.globalData.userInfo){

      console.log("&&&&" + JSON.stringify(e));
      that.data.dynamic_id = e.currentTarget.id;
      //  that.data.userId = that.data.userId;

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

      that.setData({
        showLoginModal:true
      })

    }

  },

  //取消点赞
  toCancelThumnUp: function (e) {

    var that = this

    if (app.globalData.userInfo){
      console.log("JJJJJ" + JSON.stringify(e));

      that.data.dynamic_id = e.currentTarget.id;

      //  that.data.userId = that.data.userId
      common.cancelThumnUp(that).then(function(res){

        if(res == 1){
          var temp = 'dynamicArr[' + e.target.dataset.item + '].is_zan'
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

      wx.setData({
        showLoginModal:true
      })
    }
  },

  //组件返回
  getComment:function(e){

    var that = this;
    that.setData({
      logo:"写评论"
    })

    // that.data.content = e.detail.fileName;
    that.submitPublic(e)
  },

  //播放语音
  playvoice: function (e) {

    var that = this;

    console.log("that.data.isvoiceplay",e);

    if (e.currentTarget.dataset.reply == "reply"){

      var evaluationindex = e.currentTarget.dataset.evaluationindex;
      var index = e.currentTarget.dataset.index;

      if (that.data.isvoiceplay) {

        myAudio.src = Config.restUrl + "/uploads/community/voice/" + e.currentTarget.dataset.voicesrc;
        myAudio.play();


        // var temp = 'evaluationArr[' + evaluationindex + '].reply[' + index + '].revoiceisplaying'voiceisplaying
        var temp = 'evaluationArr[' + evaluationindex + '].reply[' + index + '].voiceisplaying'

        that.setData({
          [temp]: true,
          isvoiceplay: false,
          evaluationArr: that.data.evaluationArr
        })

        myAudio.onEnded(res => {
          var temp = 'evaluationArr[' + evaluationindex + '].reply[' + index + '].voiceisplaying'
          myAudio.stop();
          that.setData({
            isvoiceplay: true,
            [temp]: false,
            evaluationArr: that.data.evaluationArr
          })
        })


      } else {
        var temp = 'evaluationArr[' + evaluationindex + '].reply[' + index + '].voiceisplaying'
        myAudio.pause();
        that.setData({
          isvoiceplay: true,
          [temp]: false,
          evaluationArr: that.data.evaluationArr
        })
      }

    }else{

      var index = e.currentTarget.dataset.index;

      if (that.data.isvoiceplay) {
        myAudio.src = Config.restUrl + "/uploads/community/voice/" + e.currentTarget.dataset.voicesrc;
        myAudio.play();


        var temp = 'evaluationArr[' + index + '].voiceisplaying'

        that.setData({
          [temp]: true,
          isvoiceplay: false,
          evaluationArr: that.data.evaluationArr
        })

        myAudio.onEnded(res => {
          var temp = 'evaluationArr[' + index + '].voiceisplaying';
          myAudio.stop();
          that.setData({
            isvoiceplay: true,
            [temp]: false,
            evaluationArr: that.data.evaluationArr
          })
        })


      } else {
        var temp = 'evaluationArr[' + index + '].voiceisplaying'
        myAudio.pause();
        that.setData({
          isvoiceplay: true,
          [temp]: false,
          evaluationArr: that.data.evaluationArr
        })
      }

    }

    console.log("$$$$$$$$", that.data.evaluationArr);

  },

  deleteEva:function(e){

    var that = this;

    var evaid = e.currentTarget.dataset.evaid;

    var dynamicid = e.currentTarget.dataset.dynamicid;

    wx.showModal({
      title: '提示',
      content: '确定删除吗?',
      success(res) {
        if (res.confirm) {

          community.evadel(evaid, dynamicid, res => {
            console.log("res" + res);
            if(res.status == 1){
              wx.showToast({
                title: '删除成功!',
              })

              that.data.evaluationArr=[];
              that.data.evaluatepage =1;
              getDynamicevaluationlist(that);

              var temp = 'dynamicArr[0].comment';

              var comment = parseInt(that.data.dynamicArr[0].comment) - 1

              console.log("HHHHH" + that.data.dynamicArr[0].comment);

              that.setData({
                [temp]: comment
              })

            }else{
              wx.showToast({
                title: '删除失败!',
              })

            } 
          })

        } else if (res.cancel) {
          
        }
      }
    })

    
  }
 
})

//获取动态列表
function getDynamicList(that) {

  console.log("page" + that.data.page);

  return new Promise(function (resolve, reject) {
    wx.request({
      url: test + '/user/index/dynamic_list',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        page: that.data.page,
        user_id: that.data.userId
      },
      success: function (res) {
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
        //处理图文
        if (res.data.status == 1) {

          for (var i in res.data.data) {
            if (res.data.data[i].type == 1) {
              if (res.data.data[i].content) {
                res.data.data[i].imagecell = res.data.data[i].content.split(',')
              }
            }
            that.data.dynamicArr.push(res.data.data[i])
          }
          
        } else {
          wx.showModal({
            title: '操作超时',
            content: '',
          })
        }
        resolve(that)
      }
    })
  })
}

// 获取动态评价列表
function getDynamicevaluationlist(that){

  return new Promise(function (resolve, reject){

    wx.request({
      url: test + '/user/index/eva_list',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        page: that.data.evaluatepage,
        dynamic_id: that.data.id
      },
      success:function(res){
    
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

        if (res.data.status == 1){

          for(var i in res.data.data){
            
            for(var j in res.data.data[i]){
              
              if (j == "reply") {

                if ((res.data.data[i])[j].length != 0){

                  that.data.length = (res.data.data[i])[j].length

                  

                  // if ((res.data.data[i])[j].type == 2){

                  //   for (var k in (res.data.data[i])[j]) {
                      
                  //     if (((res.data.data[i])[j])[k].content){
                        
                  //     }

                  //   }

                    
                    
                    // if ((res.data.data[i])[j].content) {
                    //   (res.data.data[i])[j].voiceduration = (res.data.data[i])[j].content.split('?')[1];
                    //   (res.data.data[i])[j].voiceisplaying = false
                    // }
                  // }else{

                    for (var k in (res.data.data[i])[j]){
                      console.log("eeeee", ((res.data.data[i])[j])[k].content);
                      ((res.data.data[i])[j])[k].content = common.entitiesToUtf16(((res.data.data[i])[j])[k].content);

                      if (((res.data.data[i])[j])[k].type == 2) {

                        if (((res.data.data[i])[j])[k].content) {
                          ((res.data.data[i])[j])[k].voiceduration = ((res.data.data[i])[j])[k].content.split('?')[1];
                          ((res.data.data[i])[j])[k].voiceisplaying = false
                        }
                      }
                    } 
                      
                  // }
                
                }else{

                  that.data.length = 0;
                }


                if (res.data.data[i].type == 2) {

                  if (res.data.data[i].content) {
                    res.data.data[i].voiceduration = res.data.data[i].content.split('?')[1];
                    res.data.data[i].voiceisplaying = false
                  }
                }

                res.data.data[i].length = that.data.length;

                res.data.data[i].moreShow = false
              }

              if (j == "content"){

                (res.data.data[i])[j]=common.entitiesToUtf16((res.data.data[i])[j])
              }

            }

            that.data.evaluationArr.push(res.data.data[i]);
            
          }
          
          console.log("%%%%%%%" , that.data.evaluationArr);

           that.setData({
             evaluationArr: that.data.evaluationArr
           })



        }else{

          console.log("dddddd", that.data.evaluationArr)

          if (that.data.evaluationArr.length==0){

            that.setData({
              evaluate: res.data.data,
              evaluationArr:[]
            })

          }else{

            that.setData({
              evaluate: ""
            })
          }

          
        }

        resolve(that)

      }
    })
  })
}

//发布动态评论
function releaseevaluation(that){
  return new Promise(function (resolve, reject){

    wx.request({
      url: test + '/user/community/eva_add',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        content: that.data.content,
        dynamic_id: that.data.id,
        from_uid: that.data.userId,
        to_uid: that.data.touid,
        level: that.data.level,
        type:that.data.type
      },
      success:function(res){
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
          console.log("RRRR" + JSON.stringify(res.data));
          wx.showToast({
            title: '评论成功!',
          })

          var time =util.formatTime(new Date())

          time = time.date +' ' + time.time;

          if(that.data.level == 0){

            if(that.data.type == 2){

              if (that.data.content) {
                that.data.voiceduration = that.data.content.split('?')[1];
                that.data.voiceisplaying = false
              }

              that.data.evaluationObj = {
                id: res.data.id,
                dynamic_id: that.data.id,
                content: that.data.content,
                level: 0,
                from_uid: that.data.userId,
                to_uid: 0,
                post_date: time,
                user_info: {
                  nickname: that.data.username,
                  face: that.data.userimg
                },
                reply: [],
                type:2,
                voiceduration: that.data.voiceduration,
                voiceisplaying: that.data.voiceisplaying
              }

            }else{

              that.data.evaluationObj = {
                id: res.data.id,
                dynamic_id: that.data.id,
                content: common.entitiesToUtf16(that.data.content),
                level: 0,
                from_uid: that.data.userId,
                to_uid: 0,
                post_date: time,
                user_info: {
                  nickname: that.data.username,
                  face: that.data.userimg
                },
                reply: [],
                type:1
              }
            }

            

            console.log("7777", that.data.evaluationObj);

            that.data.evaluationArr.push(that.data.evaluationObj)

          }else{

            // that.data.evaluationObj[that.data.i].push()
            
            //  = {
              // id: that.data.level,
              // dynamic_id: that.data.id,
              // content: that.data.content,
              // level: 0,
              // post_date: time,
              // user_info: {
              //   nickname: that.data.username,
              //   face: that.data.userimg
              // },
              
            // }

            console.log("RRRRRRRRRRR" + JSON.stringify(that.data.evaluationArr));
            console.log("HHHHHHHHHHHH"+that.data.i)

            if(that.data.type == 2){

              if (that.data.content){
                that.data.voiceduration = that.data.content.split('?')[1];
                that.data.voiceisplaying = false
              }

              that.data.reply1 = {
                dynamic_id: that.data.id,
                content: that.data.content,
                from_uid: that.data.userId,
                to_uid: that.data.touid,
                post_date: time,
                level: that.data.level,
                from_user_info: {
                  nickname: that.data.username
                },
                to_user_info: {
                  nickname: that.data.itusername
                },
                type:2,
                voiceduration: that.data.voiceduration,
                voiceisplaying:that.data.voiceisplaying
              }
            }else{

              that.data.reply1 = {
                dynamic_id: that.data.id,
                content: that.data.content,
                from_uid: that.data.userId,
                to_uid: that.data.touid,
                post_date: time,
                level: that.data.level,
                from_user_info: {
                  nickname: that.data.username
                },
                to_user_info: {
                  nickname: that.data.itusername
                },
                type:1
              }
            }

            

            that.data.evaluationArr[that.data.i].reply.push(that.data.reply1);


          }
          

         
          resolve(that);

        } else {

          if(!app.globalData.userInfo){
            wx.showToast({
              title: "请先登录!",
            })
          }else{
            wx.showToast({
              title: "评论失败",
            })
          }
          reject(that)
        }
      }
    })
  })
}