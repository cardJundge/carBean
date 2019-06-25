import {
  Base
} from '../../../utils/base.js';
class Member extends Base {
  // 成为铜牌会员（补充用户信息接口）
  postUserInfo(params, callback) {
    console.log(params)
    var params = {
      url: '/user/user/toBronze',
      type: 'POST',
      data: {
        mobile: params.mobile,
        true_name: params.trueName
      },
      sCallback: callback
    }
    this.request(params)
  }


  // 成为会员之后重新调取登录信息
  toLogin(unionid, source, callback) {
    var params = {
      url: '/user/login/index',
      type: 'POST',
      data: {
        unionid: unionid,
        source: source
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 购买银牌会员和金牌会员
  toBuyMember(params, callback) {
    var params = {
      url: '/user/telecom/payCombo',
      type: 'POST',
      data: {
        body: params.body,
        openid: params.openId,
        money: params.money,
        type: params.type
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 购买套餐回调
  buyCombo(params, callback) {
    var params = {
      url: '/user/telecom/buy_combo',
      type: 'GET',
      data: {
        combo_id: params.comboId,
        user_id: params.userId,
        type: params.type
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 会员权益
  getEquity(memberId, callback) {
    var params = {
      url: '/user/telecom/equity',
      type: 'GET',
      data: {
        user_id: memberId
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 服务商服务项目
  getItemClassify(callback) {

    var params = {
      url: '/user/user/classList',
      type: 'POST',
      sCallback: callback
    }
    this.request(params)
  }

  // 获取其他会员权益
  getOtherEquity(id, callback) {
    var params = {
      url: '/user/server/replaceCount',
      type: 'GET',
      data: {
        member_id: id
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 下单
  toAgentOrder(id, type, callback) {
    var params = {
      url: '/user/server/serReplace',
      type: 'POST',
      data: {
        member_id: id,
        type: type
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 代办服务订单详情
  agentOrderDetail(id, type, callback) {
    var params = {
      url: '/user/server/replaceInfo',
      type: 'GET',
      data: {
        member_id: id,
        type: type
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 取消代办服务订单
  cancelOrder(id, callback) {
    var params = {
      url: '/user/server/replaceCancel',
      type: 'GET',
      data: {
        replace_id: id
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 修改手机号
  modifyTel(mobile, callback) {
    var params = {
      url: '/user/user/resetInfo',
      type: 'POST',
      data: {
        mobile: mobile
      },
      sCallback: callback
    }
    this.request(params)
  }
}

export {
  Member
}