// 退出登录模态框
Component({
  properties: {
    show: Boolean,
  },
  data: {

  },
  methods: {
    hideModal: function (e) {
      this.setData({
        show: false,
      })
    },

    confirm: function(e) {
      this.triggerEvent('confirm', {})
    }
  }
})
