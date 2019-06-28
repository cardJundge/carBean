import { Base } from '../../../utils/base.js';
var app = getApp();

class OrderList extends Base{

  constructor() {
    super();
  }

  //获取我的订单
  myOrder(status,work_status,page,callback){

    var params = {
      url:'/user/user/myOrder',
      type:'GET',
      data:{
        user_id: app.globalData.userInfo.id,
        page: page,
        status: status,   //支付状态
        work_status: work_status  //业务状态
      },
      sCallback: callback
    }

    this.request(params);
  }

  //删除订单
  delOrder(orderid,callback) {

    var params = {
      url: '/user/user/delOrder',
      type: 'GET',
      data: {
        order_id: orderid
      },
      sCallback: callback
    }

    this.request(params);
  }

  //取消订单
  cancelorder(orderid,callback){

    var params = {
      url: '/user/server/cancelOrder',
      type: 'GET',
      data: {
        order_id: orderid,
        type:"chedou"
      },
      sCallback: callback
    }

    this.request(params);
  }

}

export {OrderList}