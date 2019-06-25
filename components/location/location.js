// 获取位置弹出框
Component({
  properties: {
    show: Boolean
  },
  data: {

  },
  methods: {
    hideModal: function (e) {
      this.setData({
        show: false,
      })

      this.triggerEvent('hide', {})

    },

  }
})
