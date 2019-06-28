import { Base } from "../../../utils/base.js";

var app = getApp();

class Servicesdetails extends Base{

  constructor(){
    super();
  }

  //获取服务商详情
  getServerDetail(detail, callback){

    var params = {
      type:"GET",
      url:'/user/index/serviceInfo',
      data: {
        service_id: detail
      },
      sCallback: callback
    }

    this.request(params);
  }


  //获取保单详情
  getPolicyInfo(id,callback){

    var params = {
      type:"GET",
      url:'/user/user/policyInfo',
      data:{
        user_id:id
      },
      sCallback: callback
    }

    this.request(params);
  }

  //获取会员权益
  getEquity(id,callback){

    var params = {
      type:'GET',
      url:'/user/telecom/equity',
      data:{
        user_id:id
      },
      sCallback: callback
    }

    this.request(params);

  }

  //用户下单
  setOrder(that,callback){
    var params = {
      type:"POST",
      url:'/user/server/setOrder',
      data:{
        service_id: app.globalData.serviceid,
        project_id: that.data.serviceitemid,
        classify_id: that.data.serviceitemclassify,
        price: that.data.serviceitemprice,
        user_id: that.data.userid,
        source:"openId_chedou"
      },
      sCallback:callback
    }
    this.request(params)
  }

  //获取门店技工详情
  getTaskDetail(id,callback){
    var params = {
      type: "GET",
      url: '/user/server/taskList',
      data: {
        service_id: id
      },
      sCallback: callback
    }

    this.request(params)
  }

}

export { Servicesdetails }