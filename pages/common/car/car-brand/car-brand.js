// 车类型列表
import { Config } from '../../../../utils/config.js'
var app = getApp()
// import {
//   Car
// } from '../../models/car.js';
// var carModel = new Car();
Page({
  data: {
    basicUserInfo:{},
    animationData: {},
    container: 'container',
    back_cell: 'back_cell',
    title_cell: 'title_cell',
    series: [],
    toViewModal: 'A',
    selectCar: '',
    selectCarName: '',
    selectSeries: '',
    selectSeriesName: '',
    allList: [{
        id: 'A',
        list: []
      },
      {
        id: 'B',
        list: []
      },
      {
        id: 'C',
        list: []
      },
      {
        id: 'D',
        list: []
      },
      {
        id: 'E',
        list: []
      },
      {
        id: 'F',
        list: []
      },
      {
        id: 'G',
        list: []
      },
      {
        id: 'H',
        list: []
      },
      {
        id: 'I',
        list: []
      },
      {
        id: 'J',
        list: []
      },
      {
        id: 'K',
        list: []
      },
      {
        id: 'L',
        list: []
      },
      {
        id: 'M',
        list: []
      },
      {
        id: 'N',
        list: []
      },
      {
        id: 'O',
        list: []
      },
      {
        id: 'P',
        list: []
      },
      {
        id: 'Q',
        list: []
      },
      {
        id: 'R',
        list: []
      },
      {
        id: 'S',
        list: []
      },
      {
        id: 'T',
        list: []
      },
      {
        id: 'V',
        list: []
      },
      {
        id: 'W',
        list: []
      },
      {
        id: 'X',
        list: []
      },
      {
        id: 'Y',
        list: []
      },
      {
        id: 'Z',
        list: []
      },

    ],
    letterList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'],
    Alist: [],
    Blist: [],
    Clist: [],
    Dlist: [],
    Elist: [],
    Flist: [],
    Glist: [],
    Hlist: [],
    Ilist: [],
    Jlist: [],
    Klist: [],
    Llist: [],
    Mlist: [],
    Nlist: [],
    Olist: [],
    Plist: [],
    Qlist: [],
    Rlist: [],
    Slist: [],
    Tlist: [],
    Ulist: [],
    Vlist: [],
    Wlist: [],
    Xlist: [],
    Ylist: [],
    Zlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      config: Config.restUrl,
      basicUserInfo: app.globalData.userInfo
    })
  },
  // backPage: function() {
  //   wx.navigateBack({
  //     delta: 1
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  chooseSeries: function(e) {
    var that = this
    this.data.selectSeries = e.currentTarget.id
    for (var i in this.data.series) {
      if (this.data.series[i].id == e.currentTarget.id) {
        this.setData({
          selectSeriesName: this.data.series[i].name
        })
        this.data.series[i].class = 'each_series active_series'
      } else {
        this.data.series[i].class = 'each_series'
      }
    }
    this.setData({
      series: this.data.series
    })
  },
  onReady: function() {
    var that = this;
    var systemHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      systemHeight: systemHeight + 'px',
      systemHeightC: (systemHeight - 20) + 'px'
    })
    wx.request({
      url: Config.restUrl + '/user/index/brand',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'Cookie': 'PHPSESSID=' + that.data.basicUserInfo.session_id
      },
      data: {
        page: that.data.page,
        city: '西安'
      },
      success: function(res) {
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
        for (var i in res.data) {
          if (res.data[i].first_name == 'A') {
            that.data.Alist.push(res.data[i])
            that.data.Alist[that.data.Alist.length - 1].class = 'brand_cell'
            that.data.allList[0].list.push(that.data.Alist[that.data.Alist.length - 1])
          } else if (res.data[i].first_name == 'B') {
            that.data.Blist.push(res.data[i])
            that.data.Blist[that.data.Blist.length - 1].class = 'brand_cell'
            that.data.allList[1].list.push(that.data.Blist[that.data.Blist.length - 1])
          } else if (res.data[i].first_name == 'C') {
            that.data.Clist.push(res.data[i])
            that.data.Clist[that.data.Clist.length - 1].class = 'brand_cell'
            that.data.allList[2].list.push(that.data.Clist[that.data.Clist.length - 1])
          } else if (res.data[i].first_name == 'D') {
            that.data.Dlist.push(res.data[i])
            that.data.Dlist[that.data.Dlist.length - 1].class = 'brand_cell'
            that.data.allList[3].list.push(that.data.Dlist[that.data.Dlist.length - 1])
          } else if (res.data[i].first_name == 'E') {
            that.data.Elist.push(res.data[i])
            that.data.Elist[that.data.Elist.length - 1].class = 'brand_cell'
            that.data.allList[4].list.push(that.data.Elist[that.data.Elist.length - 1])
          } else if (res.data[i].first_name == 'F') {
            that.data.Flist.push(res.data[i])
            that.data.Flist[that.data.Flist.length - 1].class = 'brand_cell'
            that.data.allList[5].list.push(that.data.Flist[that.data.Flist.length - 1])
          } else if (res.data[i].first_name == 'G') {
            that.data.Glist.push(res.data[i])
            that.data.Glist[that.data.Glist.length - 1].class = 'brand_cell'
            that.data.allList[6].list.push(that.data.Glist[that.data.Glist.length - 1])
          } else if (res.data[i].first_name == 'H') {
            that.data.Hlist.push(res.data[i])
            that.data.Hlist[that.data.Hlist.length - 1].class = 'brand_cell'
            that.data.allList[7].list.push(that.data.Hlist[that.data.Hlist.length - 1])
          } else if (res.data[i].first_name == 'I') {
            that.data.Ilist.push(res.data[i])
            that.data.Ilist[that.data.Ilist.length - 1].class = 'brand_cell'
            that.data.allList[8].list.push(that.data.Ilist[that.data.Ilist.length - 1])
          } else if (res.data[i].first_name == 'J') {
            that.data.Jlist.push(res.data[i])
            that.data.Jlist[that.data.Jlist.length - 1].class = 'brand_cell'
            that.data.allList[9].list.push(that.data.Jlist[that.data.Jlist.length - 1])
          } else if (res.data[i].first_name == 'K') {
            that.data.Klist.push(res.data[i])
            that.data.Klist[that.data.Klist.length - 1].class = 'brand_cell'
            that.data.allList[10].list.push(that.data.Klist[that.data.Klist.length - 1])
          } else if (res.data[i].first_name == 'L') {
            that.data.Llist.push(res.data[i])
            that.data.Llist[that.data.Llist.length - 1].class = 'brand_cell'
            that.data.allList[11].list.push(that.data.Llist[that.data.Llist.length - 1])
          } else if (res.data[i].first_name == 'M') {
            that.data.Mlist.push(res.data[i])
            that.data.Mlist[that.data.Mlist.length - 1].class = 'brand_cell'
            that.data.allList[12].list.push(that.data.Mlist[that.data.Mlist.length - 1])
          } else if (res.data[i].first_name == 'N') {
            that.data.Nlist.push(res.data[i])
            that.data.Nlist[that.data.Nlist.length - 1].class = 'brand_cell'
            that.data.allList[13].list.push(that.data.Nlist[that.data.Nlist.length - 1])
          } else if (res.data[i].first_name == 'O') {
            that.data.Olist.push(res.data[i])
            that.data.Olist[that.data.Olist.length - 1].class = 'brand_cell'
            that.data.allList[14].list.push(that.data.Olist[that.data.Olist.length - 1])
          } else if (res.data[i].first_name == 'P') {
            that.data.Plist.push(res.data[i])
            that.data.Plist[that.data.Plist.length - 1].class = 'brand_cell'
            that.data.allList[15].list.push(that.data.Plist[that.data.Plist.length - 1])
          } else if (res.data[i].first_name == 'Q') {
            that.data.Qlist.push(res.data[i])
            that.data.Qlist[that.data.Qlist.length - 1].class = 'brand_cell'
            that.data.allList[16].list.push(that.data.Qlist[that.data.Qlist.length - 1])
          } else if (res.data[i].first_name == 'R') {
            that.data.Rlist.push(res.data[i])
            that.data.Rlist[that.data.Rlist.length - 1].class = 'brand_cell'
            that.data.allList[17].list.push(that.data.Rlist[that.data.Rlist.length - 1])
          } else if (res.data[i].first_name == 'S') {
            that.data.Slist.push(res.data[i])
            that.data.Slist[that.data.Slist.length - 1].class = 'brand_cell'
            that.data.allList[18].list.push(that.data.Slist[that.data.Slist.length - 1])
          } else if (res.data[i].first_name == 'T') {
            that.data.Tlist.push(res.data[i])
            that.data.Tlist[that.data.Tlist.length - 1].class = 'brand_cell'
            that.data.allList[19].list.push(that.data.Tlist[that.data.Tlist.length - 1])
          } else if (res.data[i].first_name == 'V') {
            that.data.Vlist.push(res.data[i])
            that.data.Vlist[that.data.Vlist.length - 1].class = 'brand_cell'
            that.data.allList[20].list.push(that.data.Vlist[that.data.Vlist.length - 1])
          } else if (res.data[i].first_name == 'W') {
            that.data.Wlist.push(res.data[i])
            that.data.Wlist[that.data.Wlist.length - 1].class = 'brand_cell'
            that.data.allList[21].list.push(that.data.Wlist[that.data.Wlist.length - 1])
          } else if (res.data[i].first_name == 'X') {
            that.data.Xlist.push(res.data[i])
            that.data.Xlist[that.data.Xlist.length - 1].class = 'brand_cell'
            that.data.allList[22].list.push(that.data.Xlist[that.data.Xlist.length - 1])
          } else if (res.data[i].first_name == 'Y') {
            that.data.Ylist.push(res.data[i])
            that.data.Ylist[that.data.Ylist.length - 1].class = 'brand_cell'
            that.data.allList[23].list.push(that.data.Ylist[that.data.Ylist.length - 1])
          } else if (res.data[i].first_name == 'Z') {
            that.data.Zlist.push(res.data[i])
            that.data.Zlist[that.data.Zlist.length - 1].class = 'brand_cell'
            that.data.allList[24].list.push(that.data.Zlist[that.data.Zlist.length - 1])
          }

        }
        that.data.allList[0].list[0].class = 'brand_cell active'
        that.setData({
          allList: that.data.allList
        })
        that.data.selectCar = that.data.allList[0].list[0].id
        that.setData({
          selectCarName: that.data.allList[0].list[0].name
        })
        var first_id = that.data.Alist[0].id
        getSeries(first_id, that)

      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  changeSeries: function(e) {
    var that = this
    var animation = wx.createAnimation({
      transformOrigin: "0 0",
      duration: 100,
      timingFunction: "ease-in",
      delay: 0
    })
    that.animation = animation
    animation.opacity(0).step()
    that.setData({
      animationData1: animation.export()
    })
    var letter = e.currentTarget.dataset.letter
    this.data.selectCar = e.currentTarget.id;
    for (var i in this.data.allList) {
      if (this.data.allList[i].id == letter) {
        for (var j in this.data.allList[i].list) {
          if (this.data.allList[i].list[j].id == e.currentTarget.id) {
            this.setData({
              selectCarName: this.data.allList[i].list[j].name
            })
            this.data.allList[i].list[j].class = 'brand_cell active'
          } else {
            this.data.allList[i].list[j].class = 'brand_cell'
          }
        }
      } else {
        for (var j in this.data.allList[i].list) {
          this.data.allList[i].list[j].class = 'brand_cell'
        }
      }
    }
    this.setData({
      allList: this.data.allList
    })
    getSeries(e.currentTarget.id, this)
  },
  toView: function(e) {
    var that = this
    this.setData({
      animation: true,
      toViewModal: e.currentTarget.id
    })
    setTimeout(function() {
      that.setData({
        animation: false,
      })
    }, 500)
  },
  optionCar: function(e) {
    console.log(this.data)
    var temp = {
      brandId: this.data.selectCar,
      brandName: this.data.selectCarName,
      seriesId: this.data.selectSeries,
      seriesName: this.data.selectSeriesName,
      has: true
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];   //上一个页面

    prevPage.setData({
      temp:temp
    })  

    wx.navigateBack({
      delta:1
    })

    // wx.setStorageSync('temp',temp)
    // var flag = true
    // wx.redirectTo({
    //   url: '../add-car/add-car?flag=' + flag,
    // })
  },
})

function getSeries(first_id, that) {
  wx.request({
    url: Config.restUrl + '/user/index/series',
    method: 'GET',
    header: {
      'content-type': 'application/json', // 默认值
      'Cookie': 'PHPSESSID=' + that.data.basicUserInfo.session_id
    },
    data: {
      id: first_id
    },
    success: function(res) {
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
      that.setData({
        series: res.data
      })
      console.log('xxxxx',res)
      var animation = wx.createAnimation({
        transformOrigin: "0 0",
        duration: 300,
        timingFunction: "ease-in",
        delay: 0
      })
      that.animation = animation
      animation.opacity(1).step()
      that.setData({
        animationData1: animation.export()
      })

      for (var m in that.data.series) {
        if (m == 0) {
          that.data.series[m].class = 'each_series active_series'
          that.data.selectSeries = that.data.series[m].id
          that.setData({
            selectSeriesName: that.data.series[m].name
          })
        } else {
          that.data.series[m].class = 'each_series'
        }
      }
      that.setData({
        loaded: true,
        series: that.data.series
      })
    }
  })
}