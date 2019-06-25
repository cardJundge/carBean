// 底部弹出来的键盘上方的input框
Component({
  properties: {
    focus: Boolean,
    showInputBox: Boolean
  },
  data: {

  },
  methods: {
    // 获得textarea里面的值
    getReplyText: function(e) {
      this.setData({
        replyTextVal: e.detail.value
      })
    },
    // 点击发送按钮或者软键盘上的完成按钮
    showReplyText: function(e) {
      this.triggerEvent('send', {
        replyText: this.data.replyTextVal
      })
      this.setData({
        showInputBox: false
      })
    }
  }
})