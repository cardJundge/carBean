import {
  Base
} from '../../../utils/base.js';
class Index extends Base {
  toLogin(unionId, source, callback) {

    var params = {
      url: '/user/login/index',
      type: 'POST',
      data: {
        unionid: unionId,
        source: source
      },
      sCallback: callback
    }
    this.request(params);
  }

  isWeather(type, callback) {
    var params = {
      url: '/user/user/weather',
      type: 'POST',
      data: {
        type: type
      },
       sCallback: callback
    }
    this.request(params);
  }

  isRestrain(city, callback) {
    var params = {
      url: '/user/user/restrain',
      type: 'POST',
      data: {
        city: city
      },
      sCallback: callback
    }
    this.request(params);
  }

}

export {
  Index
}