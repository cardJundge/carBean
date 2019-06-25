// 账户明细
import {
  Bean
} from '../models/bean.js';
var beanModel = new Bean();
Page({
  data: {
    showMsgNull: true,
    beanList: [],
    total:[],
    page:1
  },
  onLoad: function(options) {

    this.queryBeanList(options.params);
    this.data.userid = options.params;

  },
  // 获取豆子明细
  queryBeanList: function(id) {
    var that = this
     beanModel.getBeanDetail(id,that.data.page,(res) => {
       console.log('豆子明细', res.data)
      if (res.status == 1) {
        that.setData({
          beanList: res.data,
          showMsgNull: false
        })
      } else {
        // wx.showToast({
        //   title: "加载数据失败",
        //   icon: 'none',
        //   duration: 1000
        // });
      }
    })
  },

  onPullDownRefresh:function(e){
    var that = this;
    ++that.data.page;
    wx.showNavigationBarLoading();
    beanModel.getBeanDetail(that.data.userid, that.data.page,(res) => {
      console.log('豆子明细', res.data)

      if (res.status == 1) {

        for (var item in that.data.beanLis){
          
          that.data.total.push(that.data.beanLis[item])
        }

        console.log("ggg",that.data.total);

        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh() //停止下拉刷新

        that.setData({
          beanList: that.data.total,
          showMsgNull: false
        })
      } else {

        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh() //停止下拉刷新

        if (res.data == '暂无数据'){
          
          var time = setTimeout(function () {
            clearTimeout(time);
            that.setData({
              nodata: false
            })
          }, 3000)

          that.setData({
            nodata:true
          })
        }else{

          wx.showToast({
            title: "加载数据失败",
            icon: 'none',
            duration: 1000
          });
        }
        
      }
    })
  }
})