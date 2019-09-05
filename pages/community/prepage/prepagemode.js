import {Base} from '../../../utils/base.js'

class Prepage extends Base{
  constructor(){
    super()
  }

  //获取引导页数据
  guide(callback){
    var that = this;
    var params = {
      url: '/user/community/guide',
      type: 'GET',
      sCallback: callback
    }

    this.request(params);
  }

  dynamicInfo(id, callback){
    var that = this;
    var params = {
      url: '/user/index/dynamic_info',
      type: 'GET',
      data:{
        dynamic_id: id,
      },
      sCallback: callback
    }

    this.request(params);
  }
}

export {Prepage}