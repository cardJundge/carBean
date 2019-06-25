import { Base } from '../../../utils/base.js';
var app = getApp();

class Payment extends Base{
  constructor(){
    super();
  }

  //取消订单
  cancelorder(orderid,callback){

    var params = {
      url: '/user/server/cancelOrder',
      type: 'GET',
      data: {
        order_id: orderid
      },
      sCallback: callback
    }

    this.request(params);
  }
}

export {Payment}