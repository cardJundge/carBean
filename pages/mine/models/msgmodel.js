import {
  Base
} from '../../../utils/base.js';
var base = new Base()
class Mine extends Base {
  // 获取动态消息
  getDynamic(userId, page, callback) {
    var params = {
      url: '/user/user/message',
      type: 'GET',
      data: {
        user_id: userId,
        page: page
      },
      sCallback: callback
    }

    this.request(params);
  }
  // 回复动态消息
  replyMsg() {
    
  }
}

export {
  Mine
}