import { Servicesdetails } from 'servicesdetailsmode.js';
var servicesdetails = new Servicesdetails();
import { Member } from '../../common/models/member.js';

var memberModel = new Member();

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceid:'',
    cancelorder:'',
    serviceitemprice:"0.00",
    market_price:"0.00",
    allPolicy:[],
    jsonobj:{
      id:"",
      mun:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    app.globalData.servicedetailindex = 0;
    app.globalData.distance = options.distance;

    that.data.userid = app.globalData.userInfo.id;

    that.data.detail = options.detail;

    var shopname;

    if (options.shopname!=''){
      shopname = options.shopname;
    }else{
      shopname = options.name;
    }

      that.setData({
        shopname: shopname,
        comment: options.comment,
        order: options.order,
        type: options.type,
        distance: options.distance,
        address: options.address,
        lng: JSON.parse(options.lng)
      })

  },

  //获取会员权益
  getEquity:function(callback){

    var that = this;

    servicesdetails.getEquity(that.data.userid,res=>{

      console.log('222', res);

      if(res.status == 1){

        if (typeof (that.data.detailproject) == "object"){
          for (var item in that.data.detailproject) {

            that.data.detailproject[item].combo_id = res.data.combo.combo_id

            for (var equityid in res.data.project) {

              if (equityid == that.data.detailproject[item].classify_id) {

                that.data.detailproject[item].equity_num = res.data.project[equityid];
              }
            }
          }
        } 
      }
      console.log("eee", that.data.detailproject);
      app.globalData.servicedetail = that.data.detailproject;

      that.data.serviceitemid = that.data.detailproject[0].id
      that.data.serviceitemclassify = that.data.detailproject[0].classify_id
      that.data.serviceitemprice = that.data.detailproject[0].platform_price

      app.globalData.serviceitemid = that.data.serviceitemid;
      app.globalData.serviceitemclassify = that.data.serviceitemclassify;
      app.globalData.serviceitemprice = that.data.serviceitemprice;


      that.setData({
        serviceitem: that.data.detailproject,
        task_count: that.data.task_count
      })
      
      callback && callback(res);
    })
    
  },

  //导航
  openMap: function (e) {
    var that = this
    
    if (that.data.lng){
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          wx.openLocation({
            latitude: that.data.lng.lat,
            longitude: that.data.lng.lng,
            scale: 28,
            name: e.currentTarget.dataset.name,
            address: e.currentTarget.id
          })
        }
      })
    }else{

      console.log("没有经纬度");
    }
    
  },

  //获取用户手机号
  // getPhoneNumber:function(e){
  // },

  //获取服务选中项
  onCheck:function(e){  
    var that = this;
    that.data.serviceitemid = e.detail.serviceitemid
    that.data.serviceitemclassify = e.detail.serviceitemclassify
    that.data.serviceitemprice = e.detail.serviceitemprice
    that.data.serviceitemmarketprice = e.detail.serviceitemmarketprice

    that.data.serviceprojectname = e.detail.serviceprojectname

    app.globalData.serviceitemid = that.data.serviceitemid;
    app.globalData.serviceitemclassify = that.data.serviceitemclassify;
    app.globalData.serviceitemprice = that.data.serviceitemprice;

    app.globalData.policyInfo = that.data.detailproject[app.globalData.servicedetailindex].classify_num

    that.setData({
      serviceitemprice: that.data.serviceitemprice,
      market_price: that.data.serviceitemmarketprice,
      serviceprojectname: that.data.serviceprojectname
    })

  },

  // 关闭登录模态框
  hideLoginModal: function () {
    // this.setData({
    //   hasUser: true
    // })
    var that = this;

    wx.showLoading({
      title: '请等待...',
    })  
    app.getAuth(data=>{
      app.getUserLogin(data, response=>{
        console.log("hh",response);
        wx.hideLoading();
        that.data.userid = response.data.data.id
        app.globalData.userInfo = response.data.data
      })
    })
  },

  //结算
  pay:function(){
    var that = this;

    if (that.data.serviceitemid){

      app.getSet(res=>{
        if(!res){
          that.setData({
            showLoginModal: true
          })
        }else{
          if (app.globalData.userInfo.mobile) {

            servicesdetails.setOrder(that, res => {

              console.log("ddd", res);

              if (res.status == 1) {

                app.globalData.serviceorderid = res.order.id;

                // wx.redirectTo({
                //   url: '../payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
                // })
                wx.navigateTo({
                  url: '../payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
                })

              } else {

                wx.showToast({
                  title: '下单失败！',
                })
              }
            })


          } else {

            // wx.navigateTo({
            //   url: '../../common/member/registered/registered',
            // })

            that.setData({
              usertelshow: true
            })
          }
        }
      })



    }else{

      wx.showToast({
        title: '请选择服务项',
      })
    }  
  },

  //客服咨询
  callphone:function(e){

    this.setData({
      phoneshow:true
    })
  },



  //获取保单详情
  getPolicyInfo: function (callback){

    var that = this;

    servicesdetails.getPolicyInfo(that.data.userid,res=>{

      for (var item in that.data.detailproject){

        // for ( var id in res.data[0].project){
        //   if(id == that.data.detailproject[item].classify_id){       
        //     that.data.detailproject[item].classify_num = res.data[0].project[id];
        //   }
        // }

        for (var item1 in res.data) {

          for (var item2 in res.data[item1].project) {

            if (item2 == that.data.detailproject[item].classify_id) {

              that.data.jsonobj={
                id: res.data[item1].id,
                num: res.data[item1].project[item2]
              }
             
              // that.data.allPolicy.push(res.data[item1].project[item2])

              that.data.allPolicy.push(that.data.jsonobj)
              that.data.detailproject[item].classify_num = that.data.allPolicy;

  
            }
          }
        }

        that.data.allPolicy = [];
        
      }

      //值为0=false
      // if (app.globalData.mobile.is_vip){

      // if (app.globalData.userInfo.vip_lv == 2 || app.globalData.userInfo.vip_lv == 3){

      //   that.getEquity(res=>{

      //   });

      // }else{


        // app.globalData.servicedetail = that.data.detailproject;
        // that.setData({
        //   serviceitem: that.data.detailproject,
        //   task_count: that.data.task_count
        // })
      // }
    
      callback && callback(res)
    })
  },

  //门店技工
  toTechnician: function () {

    var that = this

    var serviceid = app.globalData.serviceid;

    servicesdetails.getTaskDetail(serviceid,res=>{
      console.log("dd",res)

      if(res.status == 1){
        that.data.task = JSON.stringify(res.task);

        wx.navigateTo({
          url: '../technician/technician?tasks=' + this.data.task,
          // success: function (res) { },
          // fail: function (res) { },
          // complete: function (res) {
          //     that.data.task = JSON.parse(that.data.task)
          //   },
          })

      }
    });
    
    // this.data.task = JSON.stringify(this.data.task);
    // console.log(this.data.task)
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if (that.data.cancelorder){
      wx.showToast({
        title: '订单取消成功!',
        duration:2000
      })
    }

    servicesdetails.getServerDetail(that.data.detail, res => {

      console.log("resres", res)
      that.data.detailproject = res.data.project;
      app.globalData.serviceid = res.data.service.id;
      app.globalData.service = res.data.service;

      that.data.task_count = res.data.task_count

      that.data.stores = res.data.service.stores.split(",")
      that.setData({
        stores: that.data.stores
      })

      that.getPolicyInfo(policyres=>{

        //服务商服务项目
        if (typeof (that.data.detailproject) == "object") {

          //默认选中
          if (app.globalData.servicedetailindex == 0) {

            console.log("hhhh", that.data.detailproject)

            that.data.serviceitemid = that.data.detailproject[0].id
            that.data.serviceitemclassify = that.data.detailproject[0].classify_id
            that.data.serviceitemprice = that.data.detailproject[0].platform_price
            that.data.serviceitemmarketprice = that.data.detailproject[0].market_price
            that.data.serviceprojectname = that.data.detailproject[0].classify

            app.globalData.serviceitemid = that.data.serviceitemid;
            app.globalData.serviceitemclassify = that.data.serviceitemclassify;
            app.globalData.serviceitemprice = that.data.serviceitemprice;

            that.setData({
              serviceitem: that.data.detailproject,
              task_count: that.data.task_count,
              serviceitemprice: that.data.serviceitemprice,
              market_price: that.data.serviceitemmarketprice,
              serviceprojectname: that.data.serviceprojectname,

            })
          } else {

            that.data.serviceitemid = that.data.detailproject[app.globalData.servicedetailindex].id
            that.data.serviceitemclassify = that.data.detailproject[app.globalData.servicedetailindex].classify_id
            that.data.serviceitemprice = that.data.detailproject[app.globalData.servicedetailindex].platform_price
            that.data.serviceitemmarketprice = that.data.detailproject[app.globalData.servicedetailindex].market_price
            that.data.serviceprojectname = that.data.detailproject[app.globalData.servicedetailindex].classify

            app.globalData.serviceitemid = that.data.serviceitemid;
            app.globalData.serviceitemclassify = that.data.serviceitemclassify;
            app.globalData.serviceitemprice = that.data.serviceitemprice;

            that.setData({
              serviceitem: that.data.detailproject,
              task_count: that.data.task_count,
              serviceitemprice: that.data.serviceitemprice,
              market_price: that.data.serviceitemmarketprice,
              serviceprojectname: that.data.serviceprojectname,
            })

          }


          app.globalData.servicedetail = that.data.detailproject

          app.globalData.policyInfo = that.data.detailproject[app.globalData.servicedetailindex].classify_num
          // app.globalData.servicedetailindex = 0

        }

      })





      // if (app.globalData.userInfo.vip_lv == 2 || app.globalData.userInfo.vip_lv == 3) {

      //   that.getEquity(equityres => {

      //     //服务商服务项目
      //     if (typeof (that.data.detailproject) == "object") {

      //       //默认选中
      //       if (app.globalData.servicedetailindex == 0) {

      //         console.log("hhhh", that.data.detailproject)

      //         that.data.serviceitemid = that.data.detailproject[0].id
      //         that.data.serviceitemclassify = that.data.detailproject[0].classify_id
      //         that.data.serviceitemprice = that.data.detailproject[0].platform_price
      //         that.data.serviceitemmarketprice = that.data.detailproject[0].market_price
      //         that.data.serviceprojectname = that.data.detailproject[0].classify

      //         app.globalData.serviceitemid = that.data.serviceitemid;
      //         app.globalData.serviceitemclassify = that.data.serviceitemclassify;
      //         app.globalData.serviceitemprice = that.data.serviceitemprice;

      //         that.setData({
      //           serviceitem: that.data.detailproject,
      //           task_count: that.data.task_count,
      //           serviceitemprice: that.data.serviceitemprice,
      //           market_price: that.data.serviceitemmarketprice,
      //           serviceprojectname: that.data.serviceprojectname,

      //         })
      //       } else {

      //         that.data.serviceitemid = that.data.detailproject[app.globalData.servicedetailindex].id
      //         that.data.serviceitemclassify = that.data.detailproject[app.globalData.servicedetailindex].classify_id
      //         that.data.serviceitemprice = that.data.detailproject[app.globalData.servicedetailindex].platform_price
      //         that.data.serviceitemmarketprice = that.data.detailproject[app.globalData.servicedetailindex].market_price
      //         that.data.serviceprojectname = that.data.detailproject[app.globalData.servicedetailindex].classify

      //         app.globalData.serviceitemid = that.data.serviceitemid;
      //         app.globalData.serviceitemclassify = that.data.serviceitemclassify;
      //         app.globalData.serviceitemprice = that.data.serviceitemprice;

      //         that.setData({
      //           serviceitem: that.data.detailproject,
      //           task_count: that.data.task_count,
      //           serviceitemprice: that.data.serviceitemprice,
      //           market_price: that.data.serviceitemmarketprice,
      //           serviceprojectname: that.data.serviceprojectname,

      //         })

      //       }


      //       // app.globalData.servicedetailindex = 0

      //     }

      //   });




      // } else {
      //   app.globalData.servicedetail = that.data.detailproject;

      //   if (typeof (that.data.detailproject) == "object") {

      //     //默认选中

      //     if (app.globalData.servicedetailindex == 0) {

      //       that.data.serviceitemid = that.data.detailproject[0].id
      //       that.data.serviceitemclassify = that.data.detailproject[0].classify_id
      //       that.data.serviceitemprice = that.data.detailproject[0].platform_price
      //       that.data.serviceitemmarketprice = that.data.detailproject[0].market_price
      //       that.data.serviceprojectname = that.data.detailproject[0].classify

      //       app.globalData.serviceitemid = that.data.serviceitemid;
      //       app.globalData.serviceitemclassify = that.data.serviceitemclassify;
      //       app.globalData.serviceitemprice = that.data.serviceitemprice;

      //       that.setData({
      //         serviceitem: that.data.detailproject,
      //         task_count: that.data.task_count,
      //         serviceitemprice: that.data.serviceitemprice,
      //         market_price: that.data.serviceitemmarketprice,
      //         serviceprojectname: that.data.serviceprojectname

      //       })
      //     } else {

      //       that.data.serviceitemid = that.data.detailproject[app.globalData.servicedetailindex].id
      //       that.data.serviceitemclassify = that.data.detailproject[app.globalData.servicedetailindex].classify_id
      //       that.data.serviceitemprice = that.data.detailproject[app.globalData.servicedetailindex].platform_price
      //       that.data.serviceitemmarketprice = that.data.detailproject[app.globalData.servicedetailindex].market_price
      //       that.data.serviceprojectname = that.data.detailproject[app.globalData.servicedetailindex].classify

      //       app.globalData.serviceitemid = that.data.serviceitemid;
      //       app.globalData.serviceitemclassify = that.data.serviceitemclassify;
      //       app.globalData.serviceitemprice = that.data.serviceitemprice;

      //       that.setData({
      //         serviceitem: that.data.detailproject,
      //         task_count: that.data.task_count,
      //         serviceitemprice: that.data.serviceitemprice,
      //         market_price: that.data.serviceitemmarketprice,
      //         serviceprojectname: that.data.serviceprojectname,

      //       })
      //     }
      //   }
      // }

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

  },

  //补全信息
  onConfirm:function(e){

    var that = this;

    wx.navigateTo({
      url: '../completeinformation/completeinformation?service=service',
    })

    // wx.navigateTo({
    //   url: '../../common/member/registered/registered?service=service',
    // })
    
    // var params = {
    //   mobile: e.detail.telphone,
    //   trueName: e.detail.name
    // }

    // memberModel.postUserInfo(params, (res)=> {

    //   console.log("4444",res);

    //   if(res.status == 1) {

    //     memberModel.toLogin(app.globalData.userInfo.unionId, 'chedou', res => {

    //       if (res.status == 1) {

    //         app.globalData.userInfo = res.data;

    //         servicesdetails.setOrder(that, res => {

    //           console.log("ddd", res);

    //           if (res.status == 1) {

    //             app.globalData.serviceorderid = res.order.id;

    //             wx.navigateTo({
    //               url: '../payment/payment?add_time=' + res.order.add_time + '&order_no=' + res.order.order_no,
    //             })

    //           } else {

    //             wx.showToast({
    //               title: '下单失败！',
    //             })
    //           }
    //         })

    //       }
    //     })
      
    //   } else {
    //     wx.showToast({
    //       title: '请核对真实姓名与手机号码',
    //       icon: 'fail',
    //       duration: 2000
    //     })
    //   }
    // })


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})