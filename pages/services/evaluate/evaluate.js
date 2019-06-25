// pages/services/evaluate/evaluate.js
import common from '../../../utils/common.js';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagecell: [],
    imagecellArray:[],
    fileType: 'img',
    tempUserId:"0",
    auto:true,
    num:5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.data.orderid = options.orderid;
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

  //评价发布
  evaluaterelease:function(e){


    var that = this;

    console.log("999",e.detail.value.intro);

    if (e.detail.value.intro){

      that.data.evacontent = e.detail.value.intro;

      if (that.data.imagecell.length>0){

        that.data.imagecell.map((item, index) => {

          console.log("***" + item);

          that.data.mediaSrc = item;

          common.uploadDynamic(that).then(function(that){

            common.evaluate(that).then(function(res){

              console.log("ddd",res);
              //发布成功
              if(res.status == 1){

                that.setData({
                  auto: false,
                  num: that.data.num,
                  rating_contents: ''
                })

                var num = that.data.num;

                var time = setInterval(function () {

                  console.log("dddddddd")

                  that.setData({
                    num: num--
                  })

                  if (that.data.num == -1) {
                    clearInterval(time);

                    that.setData({
                      auto: true,
                      num: 5
                    })

                    var pages = getCurrentPages();

                    wx.navigateBack({
                      delta: 1
                    })

                  }

                }, 1000)
                
              }else{

                wx.showToast({
                  title: res.msg,
                })
              }

            })
          })

        })

      }else{
        wx.showToast({
          title: '图片不能为空!',
        })
      }

    }else{
      wx.showToast({
        title: '评价内容不能为空',
      })
    }

    // Promise.all(that.data.imagecell.map((item, index) => {

    //   return new Promise(function (resolve, reject) {
    //     console.log("@@@@@" + item)
    //     that.data.mediaSrc = item.path
    //     common.uploadDynamic(that).then(function () {
    //       console.log('上传' + index)
    //       console.log(that.data.fileName)
    //       console.log(JSON.stringify(that.data))
    //       that.data.fileNameTemp = that.data.fileName + ',' + that.data.fileNameTemp
    //       resolve(that)
    //     })
    //   }).then(function () { })
    // })
    
    
       
  },

  evafocus:function(){

    var that = this;
    that.setData({
      promptslogans:true
    })

  },

  addstars:function(e){

    var that = this;
    var startsnum = e.currentTarget.dataset.startnum;

    //星星数
    that.data.tempUserId = startsnum;

    if (startsnum == "1"){

      that.setData({
        stars1: true,
        stars2:false,
        stars3: false,
        stars4: false,
        stars5: false
      })

    } else if (startsnum == "2"){

      that.setData({
        stars1: true,
        stars2: true,
        stars3: false,
        stars4: false,
        stars5: false
      })

    } else if (startsnum == "3") {

      that.setData({
        stars1: true,
        stars2: true,
        stars3: true,
        stars4: false,
        stars5: false
      })

    } else if (startsnum == "4") {

      that.setData({
        stars1: true,
        stars2: true,
        stars3: true,
        stars4: true,
        stars5: false
      })

    } else if (startsnum == "5") {
      that.setData({
        stars1: true,
        stars2: true,
        stars3: true,
        stars4: true,
        stars5: true
      })
    } 

  },

  //拍照/获取图库照片
  addImage:function(){
    var that = this
    var tempNum = 0

    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {

        console.log("imgres", res);
        // var tempPicLength = res.tempFilePaths.length;
        // if (tempPicLength + that.data.imagecell.length > 9) {
        //   res.tempFilePaths = res.tempFilePaths.slice(0, 9 - that.data.imagecell.length)
        // }
        // for (let i in res.tempFilePaths) {
        //   that.data.imagecell.push({
        //     id: imgId++,
        //     path: res.tempFilePaths[i]
        //   })
        // }
        // that.setData({
        //   imagecell: that.data.imagecell
        // })
        // console.log(that.data.imagecell)

        for (let i in res.tempFilePaths){

          that.data.imagecell.push(res.tempFilePaths[i]) 
        }

        that.setData({
          imagecell: that.data.imagecell
        })

      }
    })
  }

})