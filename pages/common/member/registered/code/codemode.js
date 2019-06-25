import { Base } from '../../../../../utils/base.js'

class Codemode extends Base{

  constructor(){
    super();
  }

  //发送验证码
  sendMSM(mobile,callback){

    var params = {
      url: '/user/user/getCode',
      type: 'POST',
      data: {
        mobile: mobile
      },
      sCallback: callback
    }

    this.request(params);
  }

  //验证验证码
  verifyCode(mobile,type,code,callback){
    var params = {
      url: '/user/user/setCode',
      type: 'POST',
      data: {
        mobile: mobile,
        code: code,
        type: type
      },
      sCallback: callback
    }

    this.request(params);
  }

  //成为铜牌会员
  toBronze(usertel, carInfo,carid,callback){
    
    var params = {
      url: '/user/user/toBronze',
      type: 'POST',
      data: {
        mobile: usertel,
        brand_id: carInfo.brandId,
        model_id: carInfo.seriesId,
        car_no: carid
      },
      sCallback: callback
    }

    this.request(params);
  }
}

export {Codemode}