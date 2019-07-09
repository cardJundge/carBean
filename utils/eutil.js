var test = getApp().globalData.hostName;
const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function formId(formId){
  console.log(app.globalData.userInfor)
  console.log(formId)
  if (formId == 'the formId is a mock one' || formId == 'undefined' || formId == undefined || formId == ''){
    return
  }
  if (wx.getStorageSync('sessionId')==''){
  return
  }
  wx.request({
    url: test + '/user/user/formid',
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + app.globalData.userInfor.session_id
    },
    data: {
      formId: formId
    },
    success: function (res) {
      console.log(res)
    }
  })
}
function share(that){
  wx.request({
    url: test + '/user/user/share',
    method: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + app.globalData.userInfor.session_id
    },
    success: function (res) {
      console.log(res.data.msg)
      if (res.data.msg=='分享成功'){
        that.data.beanLogTit='分享',
        that.data.beanLogBean='+1',
        beanLog(that)
      }else{
      }
    }
  })
}
function beanLog(that) {
  var location = app.globalData.location
  if (app.globalData.location == 'undefined' || app.globalData.location == undefined){
    location=''
  }
  wx.request({
    url: test + '/user/user/entry',
    method: 'POST',
    data:{
      models: app.globalData.mobileType,
      address: location,
      title:that.data.beanLogTit,
      bean: that.data.beanLogBean,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'PHPSESSID=' + app.globalData.userInfor.session_id
    },
    success: function (res) {
    }
  })
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
module.exports = {
  formatTime: formatTime,
  formId: formId,
  share:share,
  beanLog: beanLog
}
