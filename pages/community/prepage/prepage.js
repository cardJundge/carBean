// pages/community/prepage/prepage.js
import { Prepage } from "./prepagemode.js"

var prepage = new Prepage();

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    app.getAuth((data)=>{
      app.getUserLogin(data, response => {
        app.globalData.userInfo = response.data.data
        prepage.guide(res => {
          console.log(res.data);
          that.setData({
            preData:res.data
          })       
        })
      })
    })
    
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  lipei:function(e){

    prepage.dynamicInfo(e.currentTarget.dataset.id,res=>{
      console.log("kkk",res.data);

      if (res.data.type == 1) {
        if (res.data.content) {
          res.data.imagecell = res.data.content.split(',')
        }

        let dynamicArr = JSON.stringify(res.data);

        app.globalData.dynamicArr = res.data

        wx.redirectTo({
          url: '../comment/comment?page=' + "1" + '&id=' + e.currentTarget.dataset.id + '&dynamicArr=' + dynamicArr + '&pre=1',
        })
      } 
     
    })
  }

})