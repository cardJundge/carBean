//客服咨询弹出框
Component({
  properties: {
    show:Boolean
  },
  data: {

  },
  methods: {

    cancel:function(){
      this.setData({
        show:false
      })
    },

    callphone:function(){
      wx.makePhoneCall({
        phoneNumber: '89521836',
      })
    }
  }
})
