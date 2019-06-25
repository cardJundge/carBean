import { Base } from "../../../utils/base.js";

class Itemdetails extends Base{
  constructor(){
    super();
  }

  //获取服务商项目详情
  getServiceprojectInfo(that,callback){

    var parmas = {
      type:'GET',
      url:'/user/index/projectInfo',
      data: {
        project_id: that.data.projectid,
        service_id: that.data.serviceid,
        classify_id: that.data.classify_id,
      },
      sCallback: callback
    }

    this.request(parmas)
  }
}

export {Itemdetails}