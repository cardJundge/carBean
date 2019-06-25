var app= getApp();

Component({

  properties: {
    servicelist: Array,
    hostName:String,
    type:String
  },
  data:{

  },
  methods:{
    
    itemdetail:function(e){

      var that = this;
      
      var detail = e.currentTarget.dataset.detail;

      app.globalData.servicelistitem = detail;
      console.log("eee",detail);
      app.globalData.serviceface = detail.face;


      //判断没有地址的商户
      if (!detail.location){
        detail.location={}
      } 

      if (that.properties.type == 'home'){

        wx.navigateTo({
          url: '../servicesdetails/servicesdetails?detail=' + detail.id + "&shopname=" + detail.short_name + '&order=' + detail.order + '&comment=' + detail.comment + '&distance=' + detail.distance + '&name=' + detail.name + '&type=' + detail.type + '&address=' + detail.address + '&lng=' + JSON.stringify(detail.location)
        })

      }else{

        wx.navigateTo({
          url: 'servicesdetails/servicesdetails?detail=' + detail.id + "&shopname=" + detail.short_name + '&order=' + detail.order + '&comment=' + detail.comment + '&distance=' + detail.distance + '&name=' + detail.name + '&type=' + detail.type + '&address=' + detail.address + '&lng=' + JSON.stringify(detail.location),
        })
      }

      
    }
  }
})