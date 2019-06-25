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

  // 我的发布
  getPublish(userId, page, selfUserId, callback) {
    var params = {
      url: '/user/user/my_dynamic',
      type: 'GET',
      data: {
        user_id: userId,
        page: page,
        self_user_id: selfUserId
      },
      sCallback: callback
    }
    this.request(params);
  }

  // 意见反馈
  postFeedBack(userId, content, callback) {
    var params = {
      url: '/user/user/feedback',
      type: 'POST',
      data: {
        user_id: userId,
        content: content
      },
      sCallback: callback
    }
    this.request(params);
  }

  // 退出登录
  logOut(callback) {
    var params = {
      url: '/user/user/logout',
      type: 'GET',
      data: {},
      sCallback: callback
    }
    this.request(params);
  }
}

export {
  Mine
}