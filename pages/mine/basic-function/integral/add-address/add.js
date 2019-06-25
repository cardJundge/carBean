// 添加收货地址
Page({
  data: {
    region: ['陕西省', '西安市', '雁塔区']
  },
  onLoad: function(options) {

  },
  switchChange: function(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  toSaveAddress: function(e) {

  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  }
})