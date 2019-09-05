// pages/community/community.js

import {
  Community
} from '../communitymode.js';
var community = new Community();
import {
  Config
} from '../../../utils/config.js';
var app = getApp();

import common from '../../../utils/common.js';
import utils from '../../../utils/util.js';

import { Base } from '../../../utils/base.js';

var base = new Base();


// 引入SDK核心类
var QQMapWX = require('../../../qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ' // 必填
});

const myAudio = wx.createInnerAudioContext();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dynamicArr: [],
    // mapdynamicArr: [],
    // tablist: ['列表模式', '地图模式'],
    // tablist: ['最新', '最热'],
    // sidelist: ['全部', '保险', '理赔', '维修/保养'],
    page: 1,
    event_type: 0,
    locationshow: false,
    hasUserinfo: false,
    showLoginModal: false,
    showVoiceModal: false,
    animationData: {},
    isvoiceplay: true, //暂停/播放
    communitymodeshow: true,
    showlocation: true,
    markers: [],
    mapscale: 16,
    setshow: true,
    details: false,
    dylogo: 1, //1代表 社区  2代表 详情
    gesture: false, //禁止非全屏模式下滑动调亮，音量大小
    centerplay: true, //显示播放按钮
    videohiddle: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    console.log("ddd", app.globalData.userInfo);

    wx.getSystemInfo({
      success(res) {
        console.log(res);

        if ((res.system).substring(0, 3) == 'iOS') {

          that.setData({
            model: "ios"
          })
        } else {

          that.setData({
            model: "Android"
          })
        }
        
      }
    })

    utils.getlocation().then(function (res) {

      app.globalData.latitude = res.latitude;
      app.globalData.longitude = res.longitude;

      that.data.latitude = res.latitude;
      that.data.longitude = res.longitude;

      // that.data.circles = [{
      //   latitude: res.latitude,
      //   longitude: res.longitude,
      //   fillColor: '#d1edff88',
      //   radius: 600,
      //   //定位点半径
      //   strokeWidth: 1
      // }]

      that.setData({
        latitude: that.data.latitude,
        longitude: that.data.longitude
      })

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
  onSend: function (e) {
    console.log("eee", e);

    var that = this;

    that.data.dynamicArr = [];
    that.data.page = 1;
    var res = e.detail.res;

    that.data.event_type = e.detail.event_type;

    //处理图文
    if (res.status == 1) {

      if (that.data.dynamicArr.length == 0 && res.data.length == 0) {

        that.setData({
          dynamicNull: true,
          dynamicArr: that.data.dynamicArr,
          noData: false
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

              res.data[i].title = common.entitiesToUtf16(res.data[i].title);
              if (res.data[i].content) {
                res.data[i].imagecell = res.data[i].content.split(',')
              }
            } else if (res.data[i].type == 2) {
              if (res.data[i].content) {
                res.data[i].voiceduration = res.data[i].content.split('?')[1];
                res.data[i].voiceisplaying = false
              }
            } else {
              res.data[i].title = common.entitiesToUtf16(res.data[i].title);
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

  //社区板块切换
  // onSelect: function (e) {

  //   var that = this;

  //   if (e) {
  //     that.data.currentTab = e.detail.currentTab;
  //   }

  //   // that.setData({
  //   //   currentTab: that.data.currentTab
  //   // })

  //   if (that.data.currentTab == 0) {

  //     that.setData({
  //       communitymodeshow: true,
  //       setshow: true
  //     })

  //     that.data.page = 1;
  //     that.data.dynamicArr = [];

  //     community.getDynamicList(that.data.page, that.data.userId, 0, (res) => {

  //       console.log("11111", res);

  //       //处理图文
  //       if (res.status == 1) {

  //         that.setData({
  //           flag: false
  //         })

  //         if (that.data.dynamicArr.length == 0 && res.data.length == 0) {
  //           that.setData({
  //             dynamicNull: true //暂无动态的模板
  //           })

  //         } else {
  //           that.setData({
  //             dynamicNull: false
  //           })
  //           if (res.data.length == 0) {
  //             that.setData({
  //               noData: true,
  //               dynamicArr: []
  //             })
  //           } else {
  //             for (var i in res.data) {
  //               if (res.data[i].type == 1) {

  //                 res.data[i].title = common.entitiesToUtf16(res.data[i].title);
  //                 if (res.data[i].content) {
  //                   res.data[i].imagecell = res.data[i].content.split(',')
  //                 }
  //               } else if (res.data[i].type == 2) {
  //                 if (res.data[i].content) {
  //                   res.data[i].voiceduration = res.data[i].content.split('?')[1];
  //                   res.data[i].voiceisplaying = false
  //                 }
  //               } else {
  //                 res.data[i].title = common.entitiesToUtf16(res.data[i].title);
  //               }
  //               that.data.dynamicArr.push(res.data[i])

  //             }

  //             console.log("data" + JSON.stringify(that.data.dynamicArr));

  //             wx.hideNavigationBarLoading();
  //             that.setData({
  //               dynamicArr: that.data.dynamicArr,
  //               hostName: Config.restUrl
  //             })
  //           }
  //         }

  //         wx.hideNavigationBarLoading();

  //         wx.stopPullDownRefresh() //停止下拉刷新

  //       } else {

  //         // wx.showModal({
  //         //   title: '操作超时',
  //         //   content: '',
  //         // })


  //       }

  //       that.setData({
  //         loadedMore: false
  //       })

  //     })

  //   } else {

  //     that.setData({
  //       communitymodeshow: false,
  //       setshow: false
  //     })

  //     that.data.userId = app.globalData.userInfo.id

  //     if (that.data.latitude) {

  //       that.setData({
  //         longitude: app.globalData.longitude,
  //         latitude: app.globalData.latitude
  //       })

  //     } else {

  //       wx.getSetting({
  //         success(res) {
  //           if (!res.authSetting['scope.userLocation']) {

  //             that.setData({
  //               locationshow: true
  //             })
  //           } else {

  //             if (that.data.latitude) {



  //             } else {

  //               utils.getlocation().then(function (res) {

  //                 if (res) {
  //                   that.setData({
  //                     longitude: res.longitude,
  //                     latitude: res.latitude
  //                   })
  //                 } else {
  //                   wx.showToast({
  //                     title: '获取地理位置失败！',
  //                     icon: "none",
  //                     duration: "2000"
  //                   })
  //                 }

  //               })
  //             }
  //           }
  //         }
  //       })
  //     }

  //     that.data.markers = [];
  //     that.data.mapdynamicArr = [];

  //     //地图社区
  //     community.mapDynamic(that.data.latitude + "," + that.data.longitude, res => {

  //       if (res.status == 1) {

  //         for (var i in res.data) {
  //           if (res.data[i].type == 1) {
  //             if (res.data[i].content) {
  //               res.data[i].imagecell = res.data[i].content.split(',')
  //             }
  //           } else if (res.data[i].type == 2) {
  //             if (res.data[i].content) {
  //               res.data[i].voiceduration = res.data[i].content.split('?')[1];
  //             }
  //           }
  //           that.data.mapdynamicArr.push(res.data[i])

  //         }

  //         // for (var i = 0; i < that.data.mapdynamicArr.length; i++) {

  //         //   console.log("YYY",i);
  //         //   that.sleep(1000);
  //         //   draw(that, i).then(function () {

  //         //     console.log("222222",i, that.data.markers)
  //         //     that.setData({
  //         //       markers: that.data.markers
  //         //     })

  //         //   })

  //         // }


  //         that.myCode(0, that.data.mapdynamicArr)
  //       } else {
  //         that.setData({
  //           markers: that.data.markers
  //         })
  //       }

  //     })

  //   }
  // },


  // myCode: function (i, data) {
  //   var that = this

  //   console.log("dddd", data);

  //   draw(that, i).then(function (res) {
  //     if (++i < data.length) {
  //       that.myCode(i, data)
  //       console.log("222222", i, that.data.markers)
  //     } else {

  //     }
  //   })
  // },


  //放大地图
  // enlargeMap: function () {

  //   var that = this
  //   if (that.data.mapscale > 20) {
  //     return
  //   }
  //   that.data.mapscale++
  //   that.setData({
  //     mapscale: that.data.mapscale
  //   })
  // },

  //缩小地图
  // narrowMap: function () {
  //   if (this.data.mapscale < 4) {
  //     return
  //   }
  //   this.data.mapscale--
  //   this.setData({
  //     mapscale: this.data.mapscale
  //   })
  // },

  //跳转到当前位置
  mylocation: function () {

    var that = this;
    utils.getlocation().then(function (res) {
      that.setData({
        latitude: res.latitude,
        longitude: res.longitude
      })
    })

  },

  //跳转地图
  // toMap: function (e) {

  //   var that = this;

  //   that.setData({
  //     currentTab: 1,
  //     communitymodeshow: false
  //   })


  //   var address = e.currentTarget.dataset.address;

  //   base.geocoder(demo, address, res => {

  //     that.setData({
  //       longitude: res.lng,
  //       latitude: res.lat
  //     })
  //   })

  //   that.data.markers = [];
  //   that.data.mapdynamicArr = [];

  //   //地图社区
  //   community.mapDynamic(that.data.latitude + "," + that.data.longitude, res => {

  //     if (res.status == 1) {

  //       for (var i in res.data) {
  //         if (res.data[i].type == 1) {
  //           if (res.data[i].content) {
  //             res.data[i].imagecell = res.data[i].content.split(',')
  //           }
  //         } else if (res.data[i].type == 2) {
  //           if (res.data[i].content) {
  //             res.data[i].voiceduration = res.data[i].content.split('?')[1];
  //           }
  //         }
  //         that.data.mapdynamicArr.push(res.data[i])

  //       }

  //       that.myCode(0, that.data.mapdynamicArr)
  //     }

  //   })
  // },

  //延时执行
  sleep: function (numberMillis) {

    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }

  },

  //删除动态
  deletedynamic: function (e) {

    var that = this
    var dynamicid = e.currentTarget.dataset.dynamicid;


    wx.showModal({
      title: '提示',
      content: '确定删除吗?',
      success(res) {
        if (res.confirm) {

          community.deletedynamic(dynamicid, res => {

            console.log("res", res)

            if (res.status == 1) {

              wx.showToast({
                title: '删除成功!',
              })

              that.data.page = 1;

              that.data.dynamicArr = [];


              community.getDynamicList(that.data.page, that.data.userId, 0, (res) => {

                console.log("11111", res);

                //处理图文
                if (res.status == 1) {

                  that.setData({
                    flag: false
                  })

                  if (that.data.dynamicArr.length == 0 && res.data.length == 0) {
                    that.setData({
                      dynamicNull: true //暂无动态的模板
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
                          res.data[i].title = common.entitiesToUtf16(res.data[i].title);
                          if (res.data[i].content) {
                            res.data[i].imagecell = res.data[i].content.split(',')
                          }
                        } else if (res.data[i].type == 2) {
                          if (res.data[i].content) {
                            res.data[i].voiceduration = res.data[i].content.split('?')[1];
                            res.data[i].voiceisplaying = false
                          }
                        } else {
                          res.data[i].title = common.entitiesToUtf16(res.data[i].title);
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

            } else {
              wx.showToast({
                title: '删除失败!',
              })
            }
          })
        }
      }
    })

  },


  //地图marker进去详情也
  // markerstap: function (e) {
  //   console.log("dddddddddddddd", e);
  //   var id = e.markerId;
  //   community.dynamicInfo(id, res => {

  //     console.log("hhhhhhh", res);

  //     if (res.status == 1) {

  //       if (res.data.type == 1) {
  //         if (res.data.content) {
  //           res.data.imagecell = res.data.content.split(',')
  //         }
  //         res.data.title = common.entitiesToUtf16(res.data.title);
  //       } else if (res.data.type == 2) {
  //         if (res.data.content) {
  //           res.data.voiceduration = res.data.content.split('?')[1];
  //         }
  //       } else {

  //         res.data.title = common.entitiesToUtf16(res.data.title);
  //       }

  //       app.globalData.dynamicArr = res.data

  //       wx.navigateTo({
  //         url: 'comment/comment?id=' + id + '&dynamicArr=' + res.data,
  //       })
  //     }
  //   })
  // },


  //地图拖拽触发事件
  // regionchange(e) {

  //   var that = this;

  //   // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed   
  //   if (e.type == 'end' && e.causedBy == 'drag') {
  //     console.log('update之后', e)
  //     var that = this
  //     this.mapCtx = wx.createMapContext("map");
  //     this.mapCtx.getCenterLocation({
  //       type: 'gcj02',
  //       success: function (res) {
  //         console.log(res, '没转换之前的地理位置')
  //         // var coordinate = that.gcj02towgs84(res.longitude, res.latitude)
  //         // console.log(coordinate, '转换之后的拖拽的地理位置')
  //         that.setData({
  //           latitude: res.latitude,
  //           longitude: res.longitude,
  //           // circles: [{
  //           //   latitude: res.latitude,
  //           //   longitude: res.longitude,
  //           //   color: '#FF0000DD',
  //           //   fillColor: '#d1edff88',
  //           //   radius: 100,
  //           //   //定位点半径
  //           //   strokeWidth: 1
  //           // }]
  //         })

  //         that.data.mapdynamicArr = [];
  //         that.data.markers = [];

  //         base.calculateDistance(demo, res.latitude, res.longitude, res => {

  //           if (parseInt(res) > 1000) {
  //             community.mapDynamic(that.data.latitude + "," + that.data.longitude, res => {

  //               if (res.status == 1) {

  //                 for (var i in res.data) {
  //                   if (res.data[i].type == 1) {
  //                     if (res.data[i].content) {
  //                       res.data[i].imagecell = res.data[i].content.split(',')
  //                     }
  //                   } else if (res.data[i].type == 2) {
  //                     if (res.data[i].content) {
  //                       res.data[i].voiceduration = res.data[i].content.split('?')[1];
  //                     }
  //                   }
  //                   that.data.mapdynamicArr.push(res.data[i])

  //                 }

  //                 // for (var i = 0; i < that.data.mapdynamicArr.length; i++) {


  //                 //   that.sleep(1000);
  //                 //   draw(that, i).then(function () {

  //                 //     console.log("3333", that.data.markers)
  //                 //     that.setData({
  //                 //       markers: that.data.markers
  //                 //     })

  //                 //   })

  //                 // }

  //                 that.setData({
  //                   mapdynamicArr: that.data.mapdynamicArr
  //                 })

  //                 that.myCode(0, that.data.mapdynamicArr)

  //                 // console.log("hhh", that.data.dynamicArr)

  //                 // that.setData({
  //                 //   dynamicArr: that.data.dynamicArr,
  //                 //   hostName: Config.restUrl
  //                 // })

  //               }

  //             })
  //           }
  //         })
  //       }
  //     })
  //   }
  // },


  //判断是否获取地理位置
  getLocation: function () {

    var that = this;

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            showLoginModal: true,
            videohiddle: true
          })
        } else if (!res.authSetting['scope.userLocation']) {
          that.setData({
            locationshow: true
          })
        }
      }
    })


  },

  //详情
  toDetail: function (e) {

    var that = this;
    console.log(JSON.stringify(e));
    let dynamicArr = JSON.stringify(e.currentTarget.dataset.dynamicarr);
    console.log("dynamicArr" + dynamicArr);

    that.data.page = 1;

    app.globalData.dynamicArr = e.currentTarget.dataset.dynamicarr

    wx.navigateTo({
      url: '../comment/comment?item=' + e.target.dataset.item + '&page=' + that.data.page + '&id=' + e.currentTarget.id + '&dynamicArr=' + dynamicArr,
    })

  },


  //预览图片 
  previewImage: function (e) {

    // var imgsrc = test +"/uploads/community/img/"+e.target.id;
    this.setData({
      flag: true
    })

    console.log("111", e);

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

    var that = this;

    // that.getLocation()
    that.setData({
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

    if (app.globalData.userInfo) {

      console.log("&&&&" + JSON.stringify(e));
      that.data.dynamic_id = e.currentTarget.id;
      that.data.userId = app.globalData.userInfo.id;
      that.data.sessionId = app.globalData.userInfo.session_id;

      common.giveThumnUp(that).then(function (res) {

        if (res == 1) {
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

    } else {

      // wx.showToast({
      //   title: '请先登录...',
      // })

      that.setData({
        showLoginModal: true,
        videohiddle: true
      })

    }

  },

  //隐藏/显示视频
  videohiddle: function () {
    this.setData({
      videohiddle: false
    })
  },

  //登录返回
  hideLoginModal: function (e) {

    var that = this;
    that.login();
  },

  //关闭授权地址的模化框
  hideLocationModal: function () {
    var that = this;
    that.setData({
      locationshow: false
    })
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

          app.globalData.userInfo = response.data.data;
          that.data.sessionId = app.globalData.userInfo.session_id
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
      that.data.userId = app.globalData.userInfo.id;
      that.data.sessionId = app.globalData.userInfo.session_id;

      common.cancelThumnUp(that).then(function (res) {

        if (res == 1) {

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

    } else {

      that.setData({
        showLoginModal: true,
        videohiddle: true
      })
    }

  },

  //分享
  toShare: function (e) {

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
      // wx.showToast({
      //   title: '请先登录...',
      // })
      that.setData({
        showLoginModal: true,
        videohiddle: true
      })
    }


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;

    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1]; //当前页面
    // if (currPage.data.currentTab) {
    //   this.setData({
    //     currentTab: currPage.data.currentTab
    //   })
    // }




    if (app.globalData.latitude) {

      that.setData({
        latitude: that.data.latitude,
        longitude: that.data.longitude
      })

    } else {

      utils.getlocation().then(function (res) {

        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;

        that.data.latitude = res.latitude;
        that.data.longitude = res.longitude;

        that.setData({
          latitude: that.data.latitude,
          longitude: that.data.longitude
        })

      })
    }

    if (that.data.flag) {



    } else {


      that.data.dynamicArr = [];
      that.data.page = 1;

      if (that.data.currentTab == 1) {
        that.onSelect(false);
      } else {


        community.getDynamicList(that.data.page, that.data.userId, 0, (res) => {

          console.log("11111", res);

          //处理图文
          if (res.status == 1) {

            that.setData({
              flag: false
            })

            if (that.data.dynamicArr.length == 0 && res.data.length == 0) {
              that.setData({
                dynamicNull: true //暂无动态的模板
              })

            } else {
              that.setData({
                dynamicNull: false
              })
              if (res.data.length == 0) {
                that.setData({
                  noData: true,
                  dynamicArr: []
                })
              } else {
                for (var i in res.data) {
                  if (res.data[i].type == 1) {

                    res.data[i].title = common.entitiesToUtf16(res.data[i].title);
                    if (res.data[i].content) {
                      res.data[i].imagecell = res.data[i].content.split(',')
                    }
                  } else if (res.data[i].type == 2) {
                    if (res.data[i].content) {
                      res.data[i].voiceduration = res.data[i].content.split('?')[1];
                      res.data[i].voiceisplaying = false
                    }
                  } else {
                    res.data[i].title = common.entitiesToUtf16(res.data[i].title);
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

      }
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

  },

  onReady: function () {

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

  //当开始/继续播放时触发play事件
  bindplay: function (e) {

    var videoId = e.currentTarget.id

    var that = this;

    that.data.videocontext = wx.createVideoContext(videoId, that)
    that.data.videocontext.requestFullScreen();
  },

  //视频进入和退出全屏时触发
  bindfullscreenchange: function (e) {

    var that = this;
    console.log("eeee", e);
    if (e.detail.fullScreen) {

      that.setData({
        videostyle: "none"
      })

    } else {

      that.data.videocontext.stop();

      that.setData({
        videostyle: "block"
      })
    }

  },

  //播放语音
  playingvoice: function (e) {

    var that = this;

    var index = e.currentTarget.dataset.index;

    console.log("UUUUUUU", that.data.dynamicArr[index].voiceisplaying)

    if (!that.data.dynamicArr[index].voiceisplaying) {

      for (var i in that.data.dynamicArr) {
        if (that.data.dynamicArr[i].voiceisplaying) {

          that.data.dynamicArr[i].voiceisplaying = false;

          myAudio.stop();
          that.setData({
            dynamicArr: that.data.dynamicArr
          })
        }
      }



      var temp = 'dynamicArr[' + index + '].voiceisplaying'

      that.setData({
        [temp]: true,
        isvoiceplay: false,
        dynamicArr: that.data.dynamicArr
      })

      myAudio.src = Config.restUrl + "/uploads/community/voice/" + e.currentTarget.dataset.voicesrc;
      myAudio.play();

      myAudio.onEnded(res => {
        var temp = 'dynamicArr[' + index + '].voiceisplaying';
        myAudio.stop();
        that.setData({
          isvoiceplay: true,
          [temp]: false,
          dynamicArr: that.data.dynamicArr
        })
      })




    } else {
      var temp = 'dynamicArr[' + index + '].voiceisplaying'
      myAudio.stop();
      that.setData({
        isvoiceplay: true,
        [temp]: false,
        dynamicArr: that.data.dynamicArr
      })
    }
  },

  //语音结束刷新页面
  refresh: function () {
    var that = this;
    that.onShow();


    that.setData({
      videostyle: "block"
    })


  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this
    ++that.data.page;

    community.getDynamicList(that.data.page, that.data.userId, that.data.event_type, (res) => {

      //处理图文
      if (res.status == 1) {

        console.log("kkkk", that.data.dynamicArr);

        that.setData({
          flag: false
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
            // for (var i in res.data) {
            //   if (res.data[i].type == 1) {
            //     if (res.data[i].content) {
            //       res.data[i].imagecell = res.data[i].content.split(',')
            //     }
            //   }
            //   that.data.dynamicArr.push(res.data[i])
            // }

            for (var i in res.data) {
              if (res.data[i].type == 1) {

                res.data[i].title = common.entitiesToUtf16(res.data[i].title);
                if (res.data[i].content) {
                  res.data[i].imagecell = res.data[i].content.split(',')
                }
              } else if (res.data[i].type == 2) {
                if (res.data[i].content) {
                  res.data[i].voiceduration = res.data[i].content.split('?')[1];
                  res.data[i].voiceisplaying = false
                }
              } else {
                res.data[i].title = common.entitiesToUtf16(res.data[i].title);
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
    console.log("ddd" + JSON.stringify(e));
  },

  //显示语音模板
  topublicVoice: function () {

    var that = this;
    that.setData({
      showVoiceModal: true,
      ifPublic: false,
      videostyle: "none"
    })
  },


  remSize: function (num) {

    var that = this;
    return num * that.data.scale
  },

 



})



// function draw(that, item) {
//   return new Promise(function (resolve, reject) {

//     console.log("fffffff");

//     const ctx = wx.createCanvasContext('handleCanvas');
//     wx.downloadFile({
//       // url: that.data.voiceArr[voiceId].user_info.face, // 仅为示例，并非真实的资源
//       // url: Config.restUrl + '/uploads/community/voice/' + that.data.dynamicArr[item].content,
//       url: that.data.mapdynamicArr[item].user_info.face,
//       success(res) {

//         console.log("fffffff1111", res);

//         ctx.save()
//         ctx.beginPath()
//         ctx.arc(that.remSize(20), that.remSize(20), that.remSize(20), 0, 2 * Math.PI)
//         // ctx.rect(0, 0, 200, 100)
//         ctx.clip()

//         ctx.drawImage(res.tempFilePath, 0, 0, that.remSize(40), that.remSize(40))
//         // ctx.drawImage("../../images/unlogin.png", 0, 0, 100, 100)
//         ctx.draw(false, function () {

//           setTimeout(function () {

//             wx.canvasToTempFilePath({
//               x: 0,
//               y: 0,
//               width: that.remSize(42),
//               height: that.remSize(42),
//               canvasId: 'handleCanvas',
//               // destWidth: that.remSize(42)*2,
//               // destHeight: that.remSize(42) * 2,
//               success(res) {

//                 console.log("fffffff2222", res);

//                 ctx.drawImage(res.tempFilePath, 0, 0, that.remSize(42), that.remSize(42))

//                 ctx.restore()

//                 console.log("www", that.data.mapdynamicArr, "ppp", item);

//                 if (that.data.mapdynamicArr[item].type == 2) {
//                   ctx.drawImage('../../images/audioBac.png', that.remSize(42), 0, that.remSize(97), that.remSize(42))
//                   ctx.drawImage('../../images/community/triangle.png', that.remSize(50), that.remSize(15), that.remSize(12), that.remSize(12))
//                   ctx.drawImage('../../images/community/wave.png', that.remSize(70), that.remSize(6), that.remSize(42), that.remSize(30))
//                   // ctx.drawImage('../../../images/position.png', 20, 50, 40, 40)
//                   ctx.setFontSize(that.remSize(15))
//                   // ctx.setStrokeStyle('red')
//                   ctx.fillText(that.data.mapdynamicArr[item].voiceduration + '″', that.remSize(122), that.remSize(28))


//                 } else {

//                   ctx.drawImage('../../images/audioBac.png', that.remSize(42), 0, that.remSize(97), that.remSize(42))

//                   ctx.setFontSize(that.remSize(15))
//                   // ctx.setTextAlign('left')
//                   ctx.fillText(that.data.mapdynamicArr[item].title.substring(0, 4) + "...", that.remSize(50), that.remSize(28))


//                   // ctx.setStrokeStyle('red')
//                 }

//                 ctx.draw(false, function () {
//                   wx.canvasToTempFilePath({
//                     x: 0,
//                     y: 0,
//                     width: that.remSize(152),
//                     height: that.remSize(42),
//                     canvasId: 'handleCanvas',
//                     success(res) {

//                       ctx.restore()
//                       that.setData({
//                         aa1: res.tempFilePath
//                       })

//                       console.log("aa1", that.data.aa1);

//                       that.data.markers.push({
//                         id: that.data.mapdynamicArr[item].id,
//                         latitude: that.data.mapdynamicArr[item].location.split(",")[0],
//                         longitude: that.data.mapdynamicArr[item].location.split(",")[1],
//                         iconPath: that.data.aa1,
//                         // callout: {
//                         //   content: ' 正在播放... ',
//                         //   color: '#ffffff',
//                         //   fontSize: 10,
//                         //   borderRadius: 20,
//                         //   bgColor: '#000',
//                         //   padding: '4',
//                         //   display: 'BYCLICK',
//                         //   textAlign: 'center'
//                         // },
//                         // width: 200,
//                         // height: 100,
//                       })


//                       that.setData({
//                         markers: that.data.markers
//                       })

//                       resolve(that)

//                     },
//                     fail(res) {
//                       console.log("147852", res);
//                     },
//                     complete(res) {
//                       console.log("gggg", res);
//                     }

//                   })
//                 })
//               },
//               fail(res) {
//                 console.log("00000");
//               }
//             })

//           }, 600)


//         })
//       },
//       fail(res) {
//         console.log("UUU" + JSON.stringify(res))
//       },
//     })


//     // if (that.data.voiceArr.length - 1 > that.data.voiceId) {

//     //     that.data.voiceId++
//     //   }

//   })
// }