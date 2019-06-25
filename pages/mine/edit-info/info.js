// 基本信息修改
Page({
  data: {

  },
  onLoad: function (options) {
    this.setData({
     name: options.name,
     avatar: options.avatar
    })
  },
})