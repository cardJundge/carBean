import { Base } from '../../utils/base.js';
var app = getApp();

class Community extends Base{

  constructor(){
    super();
  }

  //获取社区列表
  getDynamicList(page,userId,event_type,callback){

    var that = this;
    var params ={
      url: '/user/index/dynamic_list',
      type: 'GET',
      data: {
        page: page,
        user_id: userId,
        event_type: event_type      //事件类型
      },
      sCallback: callback
    }

    this.request(params);
  }

  //地图动态
  mapDynamic(location,callback){
    var that = this;
    var params = {
      url: '/user/community/map_dynamic',
      type: 'POST',
      data: {
        location: location
      },
      sCallback: callback
    }

    this.request(params);
  }
}

export {Community}