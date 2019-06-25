import {Base} from '../../utils/base.js'

class Services extends Base{

  constructor(){
    super();
  }

  //获取洗车列表信息
  getServiceList(that,callback){

    var params = {
      url: '/user/index/serviceList',
      type: 'POST',
      data: {
        keywords: that.data.keywords,
        sort: that.data.sort,
        type: that.data.typeStore,
        address: that.data.region[2],
        name: that.data.searchKeys,
        page: that.data.page,
        tags: that.data.tags
      },
      sCallback: callback
    }

    this.request(params);
  }


  //获取优质服务
  highGrade(callback){
    var params = {
      url: '/user/index/highGrade',
      type: 'POST',
      sCallback: callback
    }

    this.request(params);
  }


}

export {Services}