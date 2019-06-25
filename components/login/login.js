// 登录弹出框
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
      
    },

    bindGetUserInfo: function (e) {

      if (e.detail.userInfo) {
        this.hideModal();
        this.triggerEvent('hide', {})
      }
    }
  }
})
