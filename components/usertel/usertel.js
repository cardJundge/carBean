
//用户手机号组件模态框
Component({
  properties: {
    show: Boolean
  },
  data: {


  },
  methods: {

    cancel:function(){
      this.setData({
        show:false
      })
    },

    perfect:function(){
      this.setData({
        show: false,
        // showModal:true,
        title:'完善个人信息'
      })

      this.triggerEvent('confirm', {
        // name: e.detail.name,
        // telphone: e.detail.telphone
      })

    },

    onConfirm:function(e){
      var that = this;
      //触发父类事件
      that.triggerEvent('confirm', {
          name: e.detail.name,
          telphone: e.detail.telphone
      })
    }
  },

})