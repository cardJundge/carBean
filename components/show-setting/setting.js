// 设置地理权限
Component({
  properties: {
    show: Boolean,
  },
  data: {

  },
  methods: {
    hideModal: function (e) {
      this.setData({
        show: false
      })
      // this.triggerEvent('hide', {})
    },
    openSetting: function() {
      wx.openSetting()
      this.setData({
        show: false
      })
    }
  }
})
