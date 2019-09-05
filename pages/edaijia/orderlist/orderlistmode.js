import { Base } from "../../../utils/base.js";

var app = getApp();

class orderlist extends Base{

  constructor() {
    super();
  }

  //获取用户登录token
  authorizeToken(that,callback){
    var parmas = {
      type: 'GET',
      url: '/customer/authorizeToken',
      data: {
        appkey:app.globalData.appkey,
        phone:that.data.phone,
        from: app.globalData.efrom, 
        strategyId:"1000123",
        strategyServiceSign:"38aca56816beb721907e"
      },
      sCallback: callback
    }

    this.request(parmas)
  }
}

export {orderlist}