// 我的发布
import {
  Config
} from '../../../../utils/config.js'
import {
  Mine
} from '../../models/minemodel.js';

import {
  Community
} from '../../../community/communitymode.js';
var community = new Community();

import common from '../../../../utils/common.js';
import utils from '../../../../utils/util.js'
var mineModel = new Mine()
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    basicUserInfo: {},
    dynamicArr: [],
    page: 1,
    event_type: 0,
    mine:"mine"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      basicUserInfo: app.globalData.userInfo,
      hostName: Config.restUrl,
      sessionId: app.globalData.userInfo.session_id,
      userId: app.globalData.userInfo.id
    })
    utils.getlocation().then(function (res) {

      app.globalData.latitude = res.latitude;
      app.globalData.longitude = res.longitude;
    });
    app.globalData.event_type = 0

  },

  //组件传过来的值
  onSend: function (e) {
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
              if (res.data[i].content) {
                res.data[i].imagecell = res.data[i].content.split(',')
              }
            } else if (res.data[i].type == 2) {
              if (res.data[i].content) {
                res.data[i].voiceduration = res.data[i].content.split('?')[1];
                res.data[i].voiceisplaying = false
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

    that.data.page = 1;

    wx.navigateTo({
      url: '../../../community/comment/comment?item=' + e.target.dataset.item + '&page=' + that.data.page + '&id=' + e.target.id + '&dynamicArr=' + dynamicArr,
    })

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

              
              mineModel.getPublish(that.data.basicUserInfo.id, that.data.page, that.data.basicUserInfo.id, (res) => {
                //处理图文
                if (res.status == 1) {

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
                        } else if (res.data[i].type == 2) {
                          if (res.data[i].content) {
                            res.data[i].voiceduration = res.data[i].content.split('?')[1];
                            res.data[i].voiceisplaying = false
                          }
                        }
                        that.data.dynamicArr.push(res.data[i])

                      }

                      wx.hideNavigationBarLoading();
                      that.setData({
                        dynamicArr: that.data.dynamicArr,
                        hostName: Config.restUrl
                      })
                    }
                  }

                  wx.hideNavigationBarLoading();

                  wx.stopPullDownRefresh() //停止下拉刷新

                } else if (res.status == 0) {
                  that.setData({
                    // noData: true,
                    dynamicNull: true,
                    dynamicArr:[]
                  })
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


  //预览图片 
  previewImage: function (e) {

    // var imgsrc = test +"/uploads/community/img/"+e.target.id;

    var imgArr = [];
    var index = e.currentTarget.dataset.index;

    console.log("&&&&&&&&&&" + index + JSON.stringify(e));

    for (let c of this.data.dynamicArr[index].imagecell) {

      imgArr.push(Config.restUrl + "/uploads/community/img/" + c);

    }

    // console.log("jjj" + JSON.stringify(imgsrc));
    wx.previewImage({
      urls: imgArr
    })
  },

  // openPublic: function () {
  //   this.setData({
  //     ifPublic: true
  //   })
  // },
  closePublic: function () {
    this.setData({
      ifPublic: false
    })
  },
  toPublicText: function () {
    wx.navigateTo({
      url: '../../../community/listdetail/publicText/publicText',
    })
    this.setData({
      ifPublic: false
    })
  },
  topublicVideo: function () {
    wx.navigateTo({
      url: '../../../community/listdetail/publicVideo/publicVideo',
    })
    this.setData({
      ifPublic: false
    })
  },

  //点赞
  toThumnUp: function (e) {
    var that = this;
    that.data.dynamic_id = e.currentTarget.id;
    that.data.userId = app.globalData.userInfo.id

    common.giveThumnUp(that);

    var temp = 'dynamicArr[' + e.target.dataset.item + '].is_zan'
    var zan = that.data.dynamicArr[e.target.dataset.item].zan
    var zanvalue = parseInt(zan) + 1

    var temp1 = 'dynamicArr[' + e.target.dataset.item + '].zan'

    that.setData({
      [temp]: 1,
      [temp1]: zanvalue
    })
  },

  //取消点赞
  toCancelThumnUp: function (e) {

    var that = this
    that.data.dynamic_id = e.currentTarget.id;
    that.data.userId = app.globalData.userInfo.id
    common.cancelThumnUp(that);

    var temp = 'dynamicArr[' + e.target.dataset.item + '].is_zan'
    var zan = that.data.dynamicArr[e.target.dataset.item].zan
    var zanvalue = parseInt(zan) - 1

    var temp1 = 'dynamicArr[' + e.target.dataset.item + '].zan'
    that.setData({
      [temp]: 0,
      [temp1]: zanvalue
    })

  },

  //分享
  toShare: function (e) {

    this.data.dynamic_id = e.target.id;
    var temp = "dynamicArr[" + e.target.dataset.index + "].share"

    var share = this.data.dynamicArr[e.target.dataset.index].share
    var sharevalue = parseInt(share) + 1

    this.setData({
      [temp]: sharevalue
    })
    common.shareDynamic(this)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var that = this;

    that.data.dynamicArr = [];
    that.data.page = 1;

    mineModel.getPublish(that.data.basicUserInfo.id, that.data.page, that.data.basicUserInfo.id, (res) => {
      //处理图文
      if (res.status == 1) {

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
              } else if (res.data[i].type == 2) {
                if (res.data[i].content) {
                  res.data[i].voiceduration = res.data[i].content.split('?')[1];
                  res.data[i].voiceisplaying = false
                }
              }
              that.data.dynamicArr.push(res.data[i])

            }

            wx.hideNavigationBarLoading();
            that.setData({
              dynamicArr: that.data.dynamicArr,
              hostName: Config.restUrl
            })
          }
        }

        wx.hideNavigationBarLoading();

        wx.stopPullDownRefresh() //停止下拉刷新

      } else if (res.status == 0) {
        that.setData({
          // noData: true,
          dynamicNull:true
        })
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this
    that.data.page++;

    mineModel.getPublish(that.data.basicUserInfo.id, that.data.page, that.data.basicUserInfo.id, (res) => {

      //处理图文
      if (res.status == 1) {

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
              } else if (res.data[i].type == 2) {
                if (res.data[i].content) {
                  res.data[i].voiceduration = res.data[i].content.split('?')[1];
                  res.data[i].voiceisplaying = false
                }
              }
              that.data.dynamicArr.push(res.data[i])
            }

            wx.hideNavigationBarLoading();
            that.setData({
              dynamicArr: that.data.dynamicArr,
              hostName: Config.restUrl
            })
          }
        }

        wx.hideNavigationBarLoading();

        wx.stopPullDownRefresh() //停止下拉刷新
      } else if (res.status == 0) {
        that.setData({
          noData: true,
        })
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
})