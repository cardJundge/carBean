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

  //获取动态详情
  dynamicInfo(dynamic_id,callback){
    var that = this;
    var params = {
      url: '/user/index/dynamic_info',
      type: 'GET',
      data: {
        dynamic_id: dynamic_id
      },
      sCallback: callback
    }

    this.request(params);
  }

  //删除动态
  deletedynamic(dynamicid, callback){
    var that = this;
    var params = {
      url: '/user/community/dynamicDel',
      type: 'GET',
      data: {
        dynamic_id: dynamicid
      },
      sCallback: callback
    }

    this.request(params);
  }

  //删除评论
  evadel(eva_id,dynamicid,callback){
    var that = this;
    var params = {
      url: '/user/community/eva_del',
      type: 'GET',
      data: {
        eva_id: eva_id,
        dynamic_id: dynamicid
      },
      sCallback: callback
    }

    this.request(params);
  }
}

export {Community}