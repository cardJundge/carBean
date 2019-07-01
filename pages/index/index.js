//index.js
//获取应用实例
import {
  formatTime
} from '../../utils/util.js'
import {
  Car
} from '../common/models/car.js';
import {
  Sign
} from '../../components/models/sign.js';
import {
  Bean
} from '../common/models/bean.js';
import {
  Index
} from './models/index.js';
// import {
//   Member
// } from '../common/models/member.js'
// var memberModel = new Member();
var indexModel = new Index();
var beanModel = new Bean();
var signModel = new Sign();
var carModel = new Car();
import utils from '../../utils/util.js'
var app = getApp();
var amapFile = require('../../utils/amap-wx.js');
var markersData = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "c52037b5121de3cec2fde1db03bb4694"//申请的高德地图key
};
Page({
  data: {
    // false为模态框不显示
    showSignModal: false, // 签到
    showLoginModal: false, // 登录框
    showBottomModal: false, // 服务、车库和活动共用一个模态框
    basicUserInfo: {},
    hasUserInfo: true,
    hasUser: false,
    imgLogoUrl: '', // 首页下拉框logo
    memberImg: '',
    openId: '',
    carid: '车豆',
    showWeather: false, // 天气显示的框
    showLimit: false,
    showLocationModal: false,
    restrainFlag: false,
    animationData: {}
    // weatherFlag: false
    // isToExamine: true
  },

  onLoad: function() {
    var that = this
    // console.log('用户是否授权信息', res)

    if(!app.globalData.userInfo){
      app.getAuth((data) => {
        that.setData({
          openId: app.globalData.openId
        })
        // 没有授权
        if (!data) {
          // 判断是否是新手
          beanModel.isNew(that.data.openId,"chedou",(res) => {
            if (res.status == 0) {
              that.setData({
                hasUser: false,  //不显示个人信息
                showLoginModal: true  //弹出登录授权框
              })
            } else {
              that.setData({
                hasUserInfo: false,  //弹出新手奖励遮罩层
                hasUser: false  //不显示个人信息
              })
              that.calculateScrollViewHeight();
            }
          })
          // 已经授权
        } else {

          app.getUserLogin(data, response => {

            app.globalData.userInfo = response.data.data
            that.setData({
              hasUserInfo: true,
              hasUser: true,
              basicUserInfo: response.data.data
            })
            wx.setStorageSync("hasUserInfo", true)
            that.memberLevel(response.data.data.vip_lv)
            // that.getSignStatus(response.data.data.id)
            that.randData(response.data.data.id)
            that.getBeanNum(response.data.data.id)
            // that.carListNum(response.data.data.id)
            that.carList()
            // that.loadGWeather()
            that.loadInfo()
          })
        }
      })

    }else{
      that.setData({
        hasUserInfo: true,
        hasUser: true,
        basicUserInfo: app.globalData.userInfo
      })
      that.randData(app.globalData.userInfo.id)
      // that.loadGWeather()
      that.loadInfo()
    }
    var animation = wx.createAnimation({
      duration: 500,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    that.animation = animation
  },

  onShow: function() {
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
        basicUserInfo: app.globalData.userInfo,
        hasUser: true,
        showLoginModal: false
      })
      console.log('基本信息',this.data.basicUserInfo)
      wx.setStorageSync("hasUserInfo", true)
      // this.getSignStatus(this.data.basicUserInfo.id)
      this.noReceive(this.data.basicUserInfo.id)
      this.getBeanNum(this.data.basicUserInfo.id)
      // this.carListNum(this.data.basicUserInfo.id)
      this.carList()
      indexModel.toLogin(app.globalData.userInfo.unionId, 'chedou',(res) => {
        if(res.status == 1) {
          app.globalData.userInfo = res.data
          this.memberLevel(res.data.vip_lv)

          this.setData({
            basicUserInfo: res.data
          })
        }
      })
    }
  },
  containerTap: function (res) {
    var that = this
    // console.log("ddd",res)
    var x = res.touches[0].pageX;
    var y = res.touches[0].pageY;
    that.setData({
      rippleStyle: ''
    });
    setTimeout(function () {
      that.setData({
        rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
      });
    }, 200)
  },
  // 天气=====>高德地图获取地理位置
  loadInfo: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude//维度
        var longitude = res.longitude//经度
        console.log('经纬度',res);
        that.loadCity(latitude, longitude);
      }
    })
  },
  // 天气====》 高德地图获取城市
  loadCity: function (latitude, longitude) {
    var that = this
    var myAmapFun = new amapFile.AMapWX({ key: markersData.key })
    myAmapFun.getRegeo({
      location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
      success: function (data) {       
        var city = data[0].regeocodeData.addressComponent.city.replace("市", "")
        that.setData({
          city: city
        })
      },
      fail: function (info) { }
    })
    myAmapFun.getWeather({
      success: function (data) {
        console.log('成功', data, data.liveData)
        var weatherData = data.liveData.weather
        var temperature = data.liveData.temperature
        var tag
        if (weatherData.match("晴")) {
          tag = 1
          console.log('晴', tag)
        } else if (weatherData.match("雨")) {
          tag = 2
          console.log('雨', tag)
        } else if (weatherData.match("雪")) {
          tag = 3
          console.log('雪', tag)
        } else if (temperature >= 30) {
          tag = 5
          console.log('高温', tag)
        } else if (temperature <= 0) {
          tag = 4
          console.log('低温', tag)
        } else {
          console.log('温度适宜', tag)
          tag = 1
        }
        that.setData({
          weatherTag: tag
        })
        that.weatherSentence(tag)
      },
      fail: function (info) {}
    })
  },
  // 天气-------》获取天气
  // loadWeather: function (city) {
  //   var page = this;
  //   wx.request({
  //     url: 'https://api.map.baidu.com/telematics/v3/weather/?ak=UU38f0bxWbqIVgjH3OjUS9fTPVniO9Ko&location=' + city + '&output=json',
  //     header: {
  //       'Content-Type': 'application/json'
  //     },
  //     success: function (res) {
  //       console.log('错误信息2', res)
  //       console.info('查询天气返回',res.data.results[0])
  //       var weatherData = res.data.results[0].weather_data[0]
  //       var temperature = weatherData.temperature.split(' ~')[0]
  //       var tag
  //       if (weatherData.weather.match("晴")) {
  //         tag = 1
  //         // console.log('晴', tag)
  //       } else if (weatherData.weather.match("雨")) {
  //         tag = 2
  //         // console.log('雨', tag)
  //       } else if (weatherData.weather.match("雪")) {
  //         tag = 3
  //         // console.log('雪', tag)
  //       } else if (temperature >= 30) {
  //         tag = 5
  //         // console.log('高温', tag)
  //       } else if (temperature <= 0) {
  //         tag = 4
  //         // console.log('低温', tag)
  //       } else {
  //         // console.log('温度适宜', tag)
  //         tag = 1
  //       }
  //       page.setData({
  //         weatherTag: tag
  //       })
  //       page.weatherSentence(tag)
  //     }
  //   })
  // },
  // 调用天气接口----》
  weatherSentence: function(tag) {
    var that = this
    indexModel.isWeather(tag, (res)=>{
      if(res.status == 1) {
        that.setData({
          // weatherFlag: true,
          weatherMsg: res.data
        })
        indexModel.isRestrain(that.data.city, (res1) => {
          if(res1.status == 1) {
            var arr = ""
            for (var i in res1.data) {
              if(i == res1.data.length - 1) {
                arr += res1.data[i]
              } else {
                arr += res1.data[i] + ','
              }
            }
            that.setData({
              restrainMsg: '您的车辆' + arr + '今天限行,请注意！'
            })
            that.weatherTimer()
          } else {
            that.setData({
              restrainMsg: res1.msg
            })
            that.weatherTimer()
          }
        })
      }
      
    })    
  },

  // 判断天气定时器
  weatherTimer: function() {
    var that = this
    that.setData({
      showWeather: true,
      showWMsg: that.data.weatherMsg
    })
    that.timeOut(5000).then(function () {
      that.setData({
        showWeather: false,
        showWMsg: that.data.restrainMsg
      })
      return that.timeOut(1000)
    }).then(function () {
      that.setData({
        showLimit: true
      })
      return that.timeOut(5000)
    }).then(function () {
      that.setData({
        showLimit: false
      })
    })
  },

  // 点击气泡提示
  weatherTip: function() {
    var that = this

    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      }else{
        wx.getSetting({
          success: function (res) {
            if (!res.authSetting['scope.userLocation']) {
              that.setData({
                showLocationModal: true
              })
            } else {
              if (that.data.weatherTag) {
                that.weatherSentence(that.data.weatherTag)
              } else {
                // that.loadGWeather()
                that.loadInfo()
              }
            }
          }
        })

      }
    })


    
  },

  // 一个异步定时器的顺序执行
  timeOut: function(n) {
    return new Promise(function (resolve) {
      setTimeout(resolve, n)
    })
  },

  // 获得车辆列表
  carList: function() {

    var that = this

    carModel.getCarList(app.globalData.userInfo.id, (res) => {

      if (res.status == 1) {

        that.setData({
          carNum: res.data.length
        })

        var defaultCar = []
        res.data.forEach(item => {
          defaultCar.push(item)
          wx.setStorageSync("defaultCar", defaultCar)
        })

        if (res.data.length == 1) {

          that.setData({
            carid: res.data[0].car_no
          })

        } else if (res.data.length > 1) {

          for (var item in res.data) {
            if (res.data[item].default == 1) {
              that.setData({
                carid: res.data[item].car_no
              })
            }
          }
        }

      }else{

        that.setData({
          carNum: 0
        })
      }
    })
  },

  // 判断是否领取新手奖励
  isNew: function() {
    beanModel.isNew(that.data.openId, (res) => {
      console.log(res)
    })
  },

  // 获取签到状态
  getSignStatus: function() {
    signModel.getSignStatus(app.globalData.userInfo.id, (res) => {
      if (res.status == 1) {
        this.setData({
          statusList: res.data
        })
      } else if (res.status == 0) {

        this.setData({
          statusCount: res.data
        })

      }
      this.setData({
        showSignModal: true,
        time: formatTime(new Date)
      })
    })
  },

  //回调的函数
  confirm: function(e) {
    var that = this;
    that.setData({
      carid: e.detail.car_no
    })
  },

  // 会员等级显示
  memberLevel: function(params) {
    if (params == 0) {
      this.setData({
        memberImg: 'cloud://cheguanjia1-beb14e.6368-cheguanjia1-beb14e/home/unlogin.png',
        memberName: '普通用户'
      })
    } else if (params == 1) {
      this.setData({
        memberImg: 'cloud://cheguanjia1-beb14e.6368-cheguanjia1-beb14e/home/vip_tp.png',
        memberName: '铜牌会员'
      })
    } else if (params == 2) {
      this.setData({
        memberImg: 'cloud://cheguanjia1-beb14e.6368-cheguanjia1-beb14e/home/vip_yp.png',
        memberName: '银牌会员'
      })
    } else if (params == 3) {
      this.setData({
        memberImg: 'cloud://cheguanjia1-beb14e.6368-cheguanjia1-beb14e/home/vip_jp.png',
        memberName: '金牌会员'
      })
    }
    var memberInfo = {
      leavel: params,
      img: this.data.memberImg,
      name: this.data.memberName
    }
    wx.setStorageSync("memberInfo", memberInfo)
  },

  // 获取滚动高度
  calculateScrollViewHeight() {
    let that = this;
    let query = wx.createSelectorQuery();
    query.select('#scrollview').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec(function(res) {
      let height = res[0].height;
      wx.getSystemInfo({
        success: function(res) {
          let mainHeight = height > res.windowHeight ? height : res.windowHeight
          that.setData({
            mainHeight
          })
        }
      });
    });
  },

  // 成为会员入口
  onMember: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        if (that.data.basicUserInfo.vip_lv != 0) {
          if (that.data.basicUserInfo.vip_lv == 1) {
            wx.navigateTo({
              url: '../common/member/bronze/bronze',
            })
          } else if (that.data.basicUserInfo.vip_lv == 2) {
            wx.navigateTo({
              url: '../common/member/silver/silver',
            })
          } else if (that.data.basicUserInfo.vip_lv == 3) {
            wx.navigateTo({
              url: '../common/member/gold/gold',
            })
          }
        } else {
          wx.navigateTo({
            url: '../common/member/member',
          })
        }
      }
    })
  },
  // 进入豆子详情
  toBeanDetails: function(e) {

    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        var id = app.globalData.userInfo.id;
        wx.navigateTo({
          url: '../common/bean-details/bean?params=' + id,
        })
      }
    })
  },
  // 去签到
  toSignIn: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        that.getSignStatus()
      }
    })
  },

  // 签到结束
  toHide: function(e) {
    this.randData(this.data.basicUserInfo.id)
  },
  // 进入个人资料
  personalData: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        wx.navigateTo({
          url: 'personal-data/personal',
        })
      }
    })
  },
  // 服务的底部模态框
  toServiceModal: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {

        that.setData({
          showBottomModal: true,
          title: '服务',
          tag: 1,
          imgLogoUrl: 'cloud://a-data-1a3ebf.612d-a-data-1a3ebf/home/pic_wodefuwu.png'
        })
        
        // setTimeout(function () {
          that.fadeIn()//调用显示动画
        // }, 200)   
      }
    })
  },

  // 攻略
  toStrategy:function(e){

    wx.navigateTo({
      url: 'gonglue/gonglue',
    })

  },
  // 活动的底部模态框
  toActivityModal: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        that.setData({
          showBottomModal: true,
          title: '活动',
          tag: 2,
          imgLogoUrl: 'cloud://a-data-1a3ebf.612d-a-data-1a3ebf/home/pic_huodong.png'
        })
        // setTimeout(function () {
          that.fadeIn()//调用显示动画
        // }, 200)  
      }
    })
  },
  // 车库的底部模态框
  toGarageModal: function(e) {
    var that = this
    app.getSet((res) => {
      if (!res) {
        that.setData({
          showLoginModal: true
        })
      } else {
        that.setData({
          showBottomModal: true,
          title: '车库',
          tag: 3,
          imgLogoUrl: 'cloud://a-data-1a3ebf.612d-a-data-1a3ebf/home/pic_wodecheke.png'
        })
        if (app.globalData.userInfo.id) {
          // 获得车辆列表
          carModel.getCarList(app.globalData.userInfo.id, (res) => {

            if (res.status == 1) {

              that.setData({
                  defaultCar: true,
                  modalList: res.data,
                  hasCar: true
                })

              // if (res.data.length != 0) {

              //   carModel.bindCar(res.data[0].member_id, res.data[0].id, res1 => {
              //     if (res1.status == 1) {
              //       console.log('设置默认车辆成功')

              //       carModel.getCarList(app.globalData.userInfo.id, (res2) =>{

              //         if (res2.status == 1){
              //           that.setData({
              //             defaultCar: true,
              //             modalList: res2.data,
              //             hasCar: true
              //           })
              //         }
              //       })

              //     }
              //   })
              // } else {

              //   that.setData({
              //     modalList: res.data,
              //     hasCar: true
              //   })
              // }

            } else {
              that.setData({
                hasCar: false
              })
            }
          })
        }
        // setTimeout(function () {
          that.fadeIn()//调用显示动画
        // }, 200)  
      }
    })
  },

  // 底部模态框组件弹出来的动画
  fadeIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },

  // 车库列表在首页显示的时候加载(获取绑定车辆个数)
  // carListNum: function(params) {
  //   carModel.getCarList(params, (res) => {
  //     if (res.status == 1) {
  //       this.setData({
  //         CarNum: res.data.length
  //       })
  //       var defaultCar = []
  //       res.data.forEach(item => {
  //         defaultCar.push(item)
  //         wx.setStorageSync("defaultCar", defaultCar)
  //       })

  //     }
  //   })
  // },

  // 产生随机数据
  randData: function(params) {
    // 获取没有领取的豆子
    var randDigits = []
    // toModify
    var max = 8;
    while (randDigits.length < max) {
      var randDigit = Math.floor(Math.random() * max);
      if (randDigits.indexOf(randDigit) == -1) { //首次出现的位置 没有为-1
        randDigits.push(randDigit);
      }
    }
    // -------------------------------------
    this.setData({
      randDigits: randDigits
    })
    this.noReceive(params)

  },

  // 未领取豆子
  noReceive: function(params) {
    var beanData = []
    var that = this
    var randDigits = that.data.randDigits
    beanModel.getNoRecive(params, (res) => {

      var i = 0;
      //console.log(res.data.new)
      if (res.status == 1) {
        var tipList = []
        if (res.data.sign) {
          var beanS = res.data.sign.bean;
          var sign = {
            id: res.data.sign.id,
            bean: beanS,
            text: "签到"
          }
          tipList[randDigits[i]] = sign
          i++
        }
        if (res.data.new) {
          var beanS = res.data.new.bean;
          var newhand = {
            id: res.data.new.id,
            bean: beanS,
            text: "新手奖励"
          }

          tipList[randDigits[i]] = newhand
          i++

          // 领取新手奖励
          // beanModel.getRecive(params, 100, res.data.new.id, (res) => {
          //   console.log(res)
          //   if (res.status == 1) {
          //     that.getBeanNum(app.globalData.userInfo.id)
          //   }
          // })
        }

        if (res.data.release) {

          for (var item in res.data.release) {

            var release = {
              id: res.data.release[item].id,
              bean: res.data.release[item].bean,
              text: "动态发布"
            }

            tipList[randDigits[i]] = release
            i++;
          }

        }

        if (res.data.eva) {
          for (var item in res.data.eva) {
            var eva = {
              id: res.data.eva[item].id,
              bean: res.data.eva[item].bean,
              text: "评论"
            }
            tipList[randDigits[i]] = eva
            i++;
          }
        }

        that.setData({
          tipList: tipList
        })
      }
    })
  },

  // 领取豆子
  toGetBean: function(e) {
    var that = this
    beanModel.getRecive(app.globalData.userInfo.id, e.currentTarget.dataset.beannum, e.currentTarget.dataset.signid, (res) => {
      console.log(res)
      if (res.status == 1) {
        that.noReceive(app.globalData.userInfo.id)
        that.getBeanNum(app.globalData.userInfo.id)
      }
    })
  },

  // 获取豆子数量
  getBeanNum: function(params) {
    var that = this
    beanModel.getBeanNum(params, 1, (res) => {
      if (res.status == 1) {
        that.setData({
          beanNum: res.bean
        })
        wx.setStorageSync("beanNum", res.bean)
      }
    })
  },

  // 关闭登录模态框
  hideLoginModal: function() {
    this.setData({
      hasUser: true
    })
    this.onLoad()
  },

  // 未授权引导用户授权
  bindGetUserInfo: function(e) {
    var that = this;

    if (e.detail.userInfo) {
      // this.onLoad()

      app.getAuth(data => {

        app.getUserLogin(data, response => {

          if (app.globalData.userInfo) {
            beanModel.getNoRecive(app.globalData.userInfo.id, res => {
              var newid = res.data.new.id;
              var newbean = res.data.new.bean;
              beanModel.getRecive(app.globalData.userInfo.id, newbean, newid, res => {
                if (res.status == 1) {
                  that.noReceive(that.data.basicUserInfo.id)
                  that.getBeanNum(app.globalData.userInfo.id)
                  that.memberLevel(response.data.data.vip_lv)
                  // that.getSignStatus(response.data.data.id)
                  that.carList()
                  that.setData({
                    hasUserInfo: true,
                    basicUserInfo: response.data.data,
                    hasUser: true
                  })
                  wx.setStorageSync("hasUserInfo", true)
                }
              })

            })
            // that.loadGWeather()
            that.loadInfo()
          }
        })
      })

    }
  }
})