import { OrderList } from '../../pages/services/orderlist/orderlistmode.js';
var orderlist = new OrderList();

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
    }

  }
})