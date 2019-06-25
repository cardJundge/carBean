// 发布类型模块化
Component({
  properties: {
    type: Array
  },
  data: {
    istype:false,
    num:1,
    fabutype:"选择发布类型"
  },
  methods: {

  
    fabu:function(){

      var that = this;
      if (that.data.num == 1) {

        if (that.data.fabutype == "选择发布类型"){

          that.setData({
            typeindex: 0,
            istype: true,
            num: 2,
            fabutype:"全部"
          })

        }else{

          console.log("ddd", that.data.typeindex);

          that.setData({
            typeindex: that.data.typeindex,
            istype: true,
            num: 2,
            fabutype: that.data.fabutype
          })

        }
      }else{
        that.setData({
          typeindex: that.data.typeindex,
          istype: false,
          num: 1,
          fabutype: that.data.fabutype
        })
      }
      
    },

    ontype:function(e){

      var that = this;
      
      this.setData({
        typeindex:e.currentTarget.dataset.index,
        fabutype: that.properties.type[e.currentTarget.dataset.index]
      })

      that.triggerEvent('onchecktype', {
        typeindex: e.currentTarget.dataset.index
      })
    }
  }
})