import {
  Base
} from '../../utils/base.js';
class Sign extends Base {
  // 获取签到状态
  getSignStatus(memberId, callback) {
    var params = {
      url: '/user/user/signStatus',
      type: 'GET',
      data: {
        member_id: memberId
      },
      sCallback: callback
    }

    this.request(params)
  }
// 签到
  toSign(memberId, callback) {
    var params = {
      url: '/user/user/sign_in',
      type: 'GET',
      data: {
        member_id: memberId
      },
      sCallback: callback
    }

    this.request(params)
  }
}

export {
  Sign
}