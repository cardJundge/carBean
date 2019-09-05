import { OrderList } from '../../pages/services/orderlist/orderlistmode.js';
import { Servicesdetails } from '../../pages/services/servicesdetails/servicesdetailsmode.js';
import { Base } from '../../utils/base.js';

var QQMapWX = require('./../../qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ' // 必填
});

var orderlist = new OrderList();
var servicesdetails = new Servicesdetails();
var base = new Base();

//订单列表
Component({
  properties: {
    orderlistitem: Array,
    currentTab: Number
  },
  data: {

   

  },
  methods: {

    ondelete(e) {

      var that = this;
      var orderid = e.currentTarget.dataset.orderid;
      
      orderlist.delOrder(orderid,res=>{
        console.log("删除成功",res);
        wx.showToast({
          title: '删除成功!',
        })

        wx.showNavigationBarLoading();
        orderlist.myOrder("","",1,res=>{

          if(res.status == 1){
            wx.hideNavigationBarLoading();
            that.setData({
              orderlistitem: res.data
            })
          }
          
        })

      })

    },

    //去支付
    payorder:function(e){

      var that = this;
      var price = e.currentTarget.dataset.price;
      var classify_name = e.currentTarget.dataset.classify_name;
      var orderno = e.currentTarget.dataset.orderno;
      var id = e.currentTarget.dataset.orderid;

      wx.navigateTo({
        url: '../../services/paystyle/paystyle?price=' + price + "&classify_name=" + classify_name + "&orderno=" + orderno + "&id=" + id,
      })
    },

    //取消订单
    cancelorder:function(e){
      
      var that = this;
      var orderid = e.currentTarget.dataset.orderid;

      orderlist.cancelorder(orderid, res => {

        if(res.status == 1){
          console.log("取消成功", res);
          wx.showToast({
            title: '订单取消成功!',
          })

          wx.showNavigationBarLoading();
          orderlist.myOrder("", "", 1, res => {

            if (res.status == 1) {
              wx.hideNavigationBarLoading();
              that.setData({
                orderlistitem: res.data
              })
            }
          })
        }else{

          wx.showToast({
            title: '订单取消失败!',
          })
        }

      })

    },

    //待评价
    evaluate:function(e){

      var orderid = e.currentTarget.dataset.orderid;

      wx.navigateTo({
        url: '../../services/evaluate/evaluate?orderid=' + orderid,
      })
    },

    //详情
    todetail:function(e){
      var serviceid = e.currentTarget.dataset.serviceid;

      servicesdetails.getServerDetail(serviceid,res=>{

        if (res.status == 1){
          var short_name = res.data.service.short_name;
          var order = res.data.service.order;
          var name = res.data.service.name;
          var comment = res.data.service.comment;
          var type = res.data.service.type;
          var address = res.data.service.address;

          base.geocoder(demo, address,response=>{
            
            var location = response;
            base.calculateDistance(demo,response.lat,response.lng,response1=>{
              
              var distance = (response1 / 1000).toFixed(1); 

              wx.navigateTo({
                url: '../../services/servicesdetails/servicesdetails?detail=' + serviceid + "&shopname=" + short_name + '&order=' + order + '&comment=' + comment + '&distance=' + distance + '&name=' + name + '&type=' + type + '&address=' + address + '&lng=' + JSON.stringify(location),
              })
            })
          })

        }
      })
    }

  }
})