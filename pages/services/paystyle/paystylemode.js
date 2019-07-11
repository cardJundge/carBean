import { Base } from '../../../utils/base.js';

var app = getApp();

class Paystyle extends Base{

  constructor(){
    super();
  }

  //微信支付
  wxPay(callback){
    var params = {
      type: 'POST',
      url: '/user/user/payJoinfee',
      data: {
        body: app.globalData.serviceclassify,
        order_no: app.globalData.seviceorderno,
        money: app.globalData.serviceplatform_price,
        // money:'1',
        openid: app.globalData.userInfo.openId_chedou,
        order_id: app.globalData.serviceorderid,
        type: 0,   //1 114  0 车豆
      },
      sCallback: callback
    }

    this.request(params);
  }


  //支付成功回调 改变订单状态
  systemOk(callback){

    var params = {
      type: 'GET',
      url: '/user/user/callBack',
      data: {
        order_id: app.globalData.serviceorderid,
      },
      sCallback: callback
    }

    this.request(params)
  }

  //金豆支付
  beanPay(callback){

    var params = {
      type: 'POST',
      url: '/user/server/douPay',
      data: {
        order_id: app.globalData.serviceorderid,
        user_id: app.globalData.userInfo.id,
        price: app.globalData.serviceplatform_price
      },
      sCallback: callback
    }

    this.request(params);

  }

  //会员支付
  vipPay(callback){

    var params = {
      type: 'POST',
      url: '/user/server/comboPay',
      data: {
        order_id: app.globalData.serviceorderid
      },
      sCallback: callback
    }

    this.request(params);
  }


  //保单支付(礼包支付)
  policyPay(id,callback){

    var params = {
      type:'POST',
      url:'/user/server/policyPay',
      data:{
        order_id: app.globalData.serviceorderid,
        policy_id:id
      },
      sCallback: callback

    }

    this.request(params);
  
  }


}

export { Paystyle }