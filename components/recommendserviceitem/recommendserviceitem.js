var app = getApp();

//推荐服务商列表
Component({
  properties: {
    servicelist: Array,
    hostName: String
  },
  data: {


  },
  methods: {

    itemdetail: function (e) {

      var that = this;

      var detail = e.currentTarget.dataset.detail;
      console.log("eee", detail);

      app.globalData.serviceface = detail.face;

      wx.navigateTo({
          url: '../servicesdetails/servicesdetails?detail=' + detail.id + "&shopname=" + detail.short_name + '&order=' + detail.order + '&comment=' + detail.comment + '&distance=' + detail.distance + '&name=' + detail.name + '&type=' + detail.type + '&address=' + detail.address + '&lng=' + JSON.stringify(detail.location)
        })

      


    }
  }
})