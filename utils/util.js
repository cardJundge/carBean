var test = getApp().globalData.hostName
var QQMapWX = require('../qqmap-wx-jssdk.js');
var demo = new QQMapWX({
  key: '4J3BZ-YS3CO-XKKWU-SV3H4-HPQF7-5XBUV' // 必填
});

var app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const week = date.getDay()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]

  return {
    date:[year, month, day].map(formatNumber).join('-'),
    time:[hour, minute].map(formatNumber).join(':'),
    // week: weekday[week]
    }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getlocation(){

  return new Promise(function (resolve, reject){

      wx.getLocation({
        type:'gcj02',
        success: function(res) {

          const latitude = res.latitude
          const longitude = res.longitude

          demo.reverseGeocoder({
            location:{
              latitude: res.latitude,
              longitude: res.longitude
            },
            success:res=>{

              console.log("sss",res);
              app.globalData.city = res.result.address_component.city
              app.globalData.address = res.result.address
              app.globalData.province = res.result.address_component.province
              app.globalData.street = res.result.address_component.street
              app.globalData.district = res.result.address_component.district
            }
          })
          resolve(res);
        },
        fail:res=>{
          resolve(false)
        }
      })
  })
}

function beanLog(that) {
  var location = app.globalData.location
  if (app.globalData.location == 'undefined' || app.globalData.location == undefined) {
    location = ''
  }
  wx.request({
    url: test + '/user/user/entry',
    method: 'POST',
    data: {
      models: app.globalData.mobileType,
      address: location,
      title: that.data.beanLogTit,
      bean: that.data.beanLogBean,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + app.globalData.userInfo.session_id
    },
    success: function (res) {
    }
  })
}

module.exports = {
  formatTime: formatTime,
  getlocation: getlocation,
  beanLog: beanLog
}
