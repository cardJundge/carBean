import utils from '../../../utils/util.js';
import {
  Community
} from '../communitymode.js';
var community = new Community();
import {
  Config
} from '../../../utils/config.js';



var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showlocation: true,
    tablist: ['文字版', '地图版'],
    currentTab: 1,
    page: 1,
    dynamicArr: [],
    markers: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;

    that.data.userId = app.globalData.userInfo.id

    if (app.globalData.latitude) {

      that.setData({
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude
      })

    } else {

      that.setData({
        locationshow: true
      })

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {

          that.setData({
            locationshow: true
          })
        } else {

          utils.getlocation().then(function(res) {

            if (res) {
              that.setData({
                longitude: res.longitude,
                latitude: res.latitude
              })
            } else {
              wx.showToast({
                title: '获取地理位置失败！',
                icon: "none",
                duration: "2000"
              })
            }

          })
        }
      }
    })

    //地图社区
    community.mapDynamic(that.data.latitude + "," + that.data.longitude, res => {

      if (res.status == 1) {

        for (var i in res.data) {
          if (res.data[i].type == 1) {
            if (res.data[i].content) {
              res.data[i].imagecell = res.data[i].content.split(',')
            }
          } else if (res.data[i].type == 2) {
            if (res.data[i].content) {
              res.data[i].voiceduration = res.data[i].content.split('?')[1];
            }
          }
          that.data.dynamicArr.push(res.data[i])

        }

        for (var i = 0; i < that.data.dynamicArr.length; i++) {


          that.sleep(200);
          draw(that, i).then(function () {

            console.log("3333", that.data.markers)
            that.setData({
              markers: that.data.markers
            })

          })

        }

        console.log("hhh", that.data.dynamicArr)

        that.setData({
          dynamicArr: that.data.dynamicArr,
          hostName: Config.restUrl
        })

      }

    })

    // community.getDynamicList(that.data.page, that.data.userId, 0, (res) => {

    //   console.log("11111", res);

    //   //处理图文
    //   if (res.status == 1) {

    //     that.setData({
    //       flag: false
    //     })

    //     if (that.data.dynamicArr.length == 0 && res.data.length == 0) {
    //       that.setData({
    //         dynamicNull: true      //暂无动态的模板
    //       })

    //     } else {
    //       that.setData({
    //         dynamicNull: false
    //       })
    //       if (res.data.length == 0) {
    //         that.setData({
    //           noData: true,
    //         })
    //       } else {
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
    //           that.data.dynamicArr.push(res.data[i])

    //         }

    //         console.log("data" + JSON.stringify(that.data.dynamicArr));

    //         wx.hideNavigationBarLoading();

    //         // for (var item in that.data.dynamicArr){

    //         for (var i = 0; i < that.data.dynamicArr.length ; i++){


    //           that.sleep(200);
    //           draw(that, i).then(function () {

    //             console.log("3333")
    //             that.setData({
    //               markers: that.data.markers
    //             })

    //           })


    //         }

    //         that.setData({
    //           dynamicArr: that.data.dynamicArr,
    //           hostName: Config.restUrl
    //         })
    //       }
    //     }

    //     wx.hideNavigationBarLoading();

    //     wx.stopPullDownRefresh() //停止下拉刷新

    //   } else {

    //     // wx.showModal({
    //     //   title: '操作超时',
    //     //   content: '',
    //     // })


    //   }

    //   that.setData({
    //     loadedMore: false
    //   })

    // })


  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

    var pages = getCurrentPages();

    var prevPage = pages[pages.length - 2]; //上一个页面

    prevPage.setData({
      currentTab: 0
    })
  },

  //延时执行
  sleep: function(numberMillis) {

    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }

  },


  //选项卡选择
  switchnav: function(e) {
    var that = this;

    that.setData({
      currentTab: e.currentTarget.dataset.index
    })

    if (that.data.currentTab == 0) {

      wx.switchTab({
        url: '../community',
      })
    }
  },

  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed   
    if (e.type == 'end' && e.causedBy == 'drag') {
      console.log('update之后', e)
      var that = this
      this.mapCtx = wx.createMapContext("map");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function(res) {
          console.log(res, '没转换之前的地理位置')
          // var coordinate = that.gcj02towgs84(res.longitude, res.latitude)
          // console.log(coordinate, '转换之后的拖拽的地理位置')
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude, 
            circles: [{
              latitude: res.latitude,
              longitude: res.longitude,
              color: '#FF0000DD',
              fillColor: '#d1edff88',
              radius: 0,
              //定位点半径
              strokeWidth: 1
            }]
          })


          community.mapDynamic(that.data.latitude + "," + that.data.longitude, res => {

            if (res.status == 1) {

              for (var i in res.data) {
                if (res.data[i].type == 1) {
                  if (res.data[i].content) {
                    res.data[i].imagecell = res.data[i].content.split(',')
                  }
                } else if (res.data[i].type == 2) {
                  if (res.data[i].content) {
                    res.data[i].voiceduration = res.data[i].content.split('?')[1];
                  }
                }
                that.data.dynamicArr.push(res.data[i])

              }

              for (var i = 0; i < that.data.dynamicArr.length; i++) {


                that.sleep(200);
                draw(that, i).then(function () {

                  console.log("3333", that.data.markers)
                  that.setData({
                    markers: that.data.markers
                  })

                })

              }

              console.log("hhh", that.data.dynamicArr)

              that.setData({
                dynamicArr: that.data.dynamicArr,
                hostName: Config.restUrl
              })

            }

          })


        }
      })
    }
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  hideLoginModal: function() {

    var that = this;
    that.setData({
      hideLoginModal: false
    })

  },


  markerstap:function(e){
    console.log("ddd",e);
    var id = e.markerId;
    community.dynamicInfo(id,res=>{

      if (res.status == 1){

        if (res.data.type == 1) {
          if (res.data.content) {
            res.data.imagecell = res.data.content.split(',')
          }
        } else if (res.data.type == 2) {
          if (res.data.content) {
            res.data.voiceduration = res.data.content.split('?')[1];
          }
        }

        app.globalData.dynamicArr = res.data
        
        wx.navigateTo({
          url: '../comment/comment?id=' + id + '&dynamicArr=' + res.data,
        })
      }
    })
  },


})

function draw(that, item) {
  return new Promise(function(resolve, reject) {

    const ctx = wx.createCanvasContext('handleCanvas');
    wx.downloadFile({
      // url: that.data.voiceArr[voiceId].user_info.face, // 仅为示例，并非真实的资源
      // url: Config.restUrl + '/uploads/community/voice/' + that.data.dynamicArr[item].content,
      url: that.data.dynamicArr[item].user_info.face,
      success(res) {

        console.log("9999", res)
        ctx.save()
        ctx.beginPath()
        ctx.arc(50, 50, 50, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(res.tempFilePath, 0, 0, 120, 120)
        // ctx.drawImage("../../../images/132.jpg", 0, 0, 100, 100)
        ctx.draw(false, function() {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 120,
            height: 120,
            canvasId: 'handleCanvas',
            success(res) {

              console.log("333333", that.data.dynamicArr[item])

              ctx.drawImage(res.tempFilePath, 0, 0, 120, 120)

              ctx.restore()

              if (that.data.dynamicArr[item].type == 2) {
                ctx.drawImage('../../../images/audioBac.png', 120, 10, 200, 90)
                ctx.drawImage('../../../images/community/triangle.png', 130, 30, 45, 45)
                ctx.drawImage('../../../images/community/wave.png', 190, 30, 80, 50)
                // ctx.drawImage('../../../images/position.png', 30, 120, 40, 40)
                ctx.setFontSize(20)
                ctx.setStrokeStyle('red')
                ctx.fillText(that.data.dynamicArr[item].voiceduration + '″', 290, 60)

                console.log("55555")

              } else {
                ctx.fillText(that.data.dynamicArr[item].title.substring(0, 6) + '″', 110, 60)
                ctx.setFontSize(20)
                ctx.setStrokeStyle('red')
              }

              ctx.draw(false, function() {
                wx.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  width: 370,
                  height: 160,
                  canvasId: 'handleCanvas',
                  success(res) {

                    console.log("123456")

                    ctx.restore()
                    that.setData({
                      aa1: res.tempFilePath
                    })

                    that.data.markers.push({
                      id: that.data.dynamicArr[item].id,
                      latitude: that.data.dynamicArr[item].location.split(",")[0],
                      longitude: that.data.dynamicArr[item].location.split(",")[1],
                      iconPath: that.data.aa1,
                      // callout: {
                      //   content: ' 正在播放... ',
                      //   color: '#ffffff',
                      //   fontSize: 10,
                      //   borderRadius: 20,
                      //   bgColor: '#000',
                      //   padding: '4',
                      //   display: 'BYCLICK',
                      //   textAlign: 'center'
                      // },
                      width: 90,
                      height: 70,
                    })

                    console.log("markers", that.data.markers);
                    // that.setData({
                    //   markers: that.data.markers
                    // })

                    resolve(that)

                  },
                  fail(res){
                    console.log("147852");
                  },
                  complete(res){
                    console.log("369852");
                  }
                })
              })
            },
            fail(res) {
              console.log("00000");
            },
            complete(res) {
              console.log("00000");
            }
          })

        })
      },
      fail(res) {
        console.log("UUU" + JSON.stringify(res))
      }
    })


    // if (that.data.voiceArr.length - 1 > that.data.voiceId) {

    //     that.data.voiceId++
    //   }

  })
}