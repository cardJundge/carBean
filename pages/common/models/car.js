import {
  Base
} from '../../../utils/base.js';
class Car extends Base {
  // 获取车辆列表
  getCarList(memberId, callback) {
    var params = {
      url: '/user/user/car_list',
      type: 'GET',
      data: {
        member_id: memberId
      },
      sCallback: callback
    }

    this.request(params)
  }

  // 添加车辆
  addCar(memberId, brandId, modelId, carNo, callback) {
    var params = {
      url: '/user/user/add_car',
      type: 'POST',
      data: {
        member_id: memberId,
        brand_id: brandId,
        model_id: modelId,
        car_no: carNo
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 删除车辆
  delCar(carId, callback) {
    var params = {
      url: '/user/user/del_car',
      type: 'GET',
      data: {
        id: carId
      },
      sCallback: callback
    }
    this.request(params)
  }

  // 默认车辆
  bindCar(memberId, carId, callback) {
    var params = {
      url: '/user/user/set_default',
      type: 'GET',
      data: {
        member_id: memberId,
        car_id: carId
      },
      sCallback: callback
    }
    this.request(params);
  }

  // 车辆品牌加载
  // carBrand()
}

export {
  Car
}