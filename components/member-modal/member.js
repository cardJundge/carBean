// 自定义模态框组件
Component({
  properties: {
    show: Boolean,
    title:String
  },
  data: {

  },
  methods: {
    hideModal: function() {
      this.setData({
        show: false
      });
    },
    // 获得输入框中的值
    getName: function(e) {
      var val = e.detail.value
      this.setData({
        name: val
      })
    },
    getPhone: function(e) {
      var val = e.detail.value
      this.setData({
        telphone: val
      })
    },
    // 获得车牌
    // getLicensePlate:function(e) {
    //   var val = e.detail.value
    //   this.setData({
    //     licensePlate: val
    //   })
    // },
    // 确定按钮
    onConfirm: function() {
      var regPhone = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
      var regName = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/
      console.log(this.data.telphone)
      if (regPhone.test(this.data.telphone) && regName.test(this.data.name)) {
        this.triggerEvent('confirm', {
          name: this.data.name,
          telphone: this.data.telphone
          // licensePlate: this.data.licensePlate
        })
        this.setData({
          show: false
        });
      } else {
        wx.showToast({
          title: '请核对您的手机号码和姓名',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})