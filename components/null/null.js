// 页面为空
Component({
  properties: {
    img: String,
    text01: String,
    text02: String,
    btnText: String,
    width: Number,
    height: Number,
    btnHidden: Boolean
  },
  data: {

  },
  methods: {
    toAddressInfo: function(e) {
      this.triggerEvent('navigate')
    }
  }
})