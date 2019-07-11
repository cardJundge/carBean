var app = getApp();

Component({

  properties: {
    serviceitem: Array
  },

  data: {
    ischecked:false
  },

  methods: {

    serviceitemdetail:function(e){

      var classify_id = e.currentTarget.dataset.itemdetails.classify_id;
      var projectid = e.currentTarget.dataset.itemdetails.id;
      var market_price = e.currentTarget.dataset.itemdetails.market_price;
      var platform_price = e.currentTarget.dataset.itemdetails.platform_price;
      var order = e.currentTarget.dataset.itemdetails.order;


      app.globalData.servicedetailindex = e.currentTarget.dataset.index

      console.log("444", e.currentTarget.dataset);

      wx.navigateTo({
        url: '../itemdetails/itemdetails?classify_id=' + classify_id + '&projectid=' + projectid + '&market_price=' + market_price + '&platform_price=' + platform_price + '&order=' + order,
      })
    },

    oncheck:function(e){
      console.log(e);
      var that = this;

      app.globalData.servicedetailindex = e.currentTarget.dataset.index

     
        that.setData({
          serviceid: e.currentTarget.dataset.id,
          ischecked:true
        })
     
  
      // that.triggerEvent('confirm', {
      //   name: e.detail.name,
      //   telphone: e.detail.telphone
      // })

      that.triggerEvent('oncheck',{
        serviceitemid: e.currentTarget.dataset.id,
        serviceitemclassify: e.currentTarget.dataset.classify,
        serviceitemprice: e.currentTarget.dataset.price,
        serviceitemmarketprice: e.currentTarget.dataset.market_price,
        serviceprojectname: e.currentTarget.dataset.serviceprojectname
      })

    }

  }
})