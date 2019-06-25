import {
  Base
} from '../../../utils/base.js';
class Bean extends Base {

  // 获取我的豆子数量
  getBeanNum(memberId, type, callback) {
    var params = {
      url: '/user/user/myBean',
      type: 'GET',
      data: {
        user_id: memberId,
        type: type
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 获取豆子详情
  getBeanDetail(id,page,callback) {
    var params = {

      //url: '/user/user/beanLogs',
      url: '/user/user/my_bean_logs',
      type: 'GET',
      data: {
        member_id:id,
        page:page
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 获取未领取的豆子
  getNoRecive(memberId, callback) {
    var params = {
      url: '/user/user/no_receive',
      type: 'POST',
      data: {
        member_id: memberId
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 领取豆子
  getRecive(memberId, beanNum, logsId, callback) {
    var params = {
      url: '/user/user/get_bean',
      type: 'GET',
      data: {
        member_id: memberId,
        bean_num: beanNum,
        logs_id: logsId
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 判断用户是否为新手
  isNew(openId,type,callback) {
    var params = {
      url: '/user/index/is_new',
      type: 'POST',
      data: {
        open_id: openId,
        type:type
      },
      sCallback: callback
    }
    this.request(params)
  }
}

export {
  Bean
}