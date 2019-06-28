var test = getApp().globalData.hostName;
const app = getApp();

function userInfor(that) {
  return new Promise(function(resolve, reject) {
    wx.request({
      url: test + '/user/user/info',
      method: 'POST',
      header: { 
        'content-type': 'application/json', // 默认值
        'Cookie': 'PHPSESSID=' + app.globalData.userInfo.session_id 
      },
      data: {
        id: that.data.case_id
      },
      success: function(res) {
        if (res.data.status == 1) {
          that.data.survey = res.data.survey
        } else {}
        resolve(that)
      },
    })
  })

}


function requestInfor(params){
    wx.request({
      url: test+params.url,
      method: params.type,
      header:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + app.globalData.userAllInfor.session_id 
      },
      data:params.data,
      success:function(res){
        params.sCallback && params.sCallback(res.data);
      }
    })
}


//页面样式
function pageCss(that, iphone, other) {
  if (!iphone) {
    iphone = 0
  }
  if (!other) {
    other = 0
  }
  wx.getSystemInfo({
    success: function(res) {
      app.globalData.mobileType = res.model
    }
  })
  var screenHeight = wx.getSystemInfoSync().screenHeight
  var mobileReg = 'iPhone X'
  if (app.globalData.mobileType.match(mobileReg)) {
    that.setData({
      back_cell: 'back_cellX',
      title_cell: 'title_cellX',
      container: 'containerX',
      marginTop: '90px',
      searchTop: '134px',
      nav_cell: "nav_cellX",
      marginTop: '90px',
      sceollHeight: screenHeight - iphone + 'px'
    })
  } else {
    that.setData({
      marginTop: '64px',

      back_cell: 'back_cell',
      title_cell: 'title_cell',
      container: 'container',
      nav_cell: "nav_cell",
      sceollHeight: screenHeight - other + 'px'
    })

  }
}

//页面动画----完成动画
function animationEvent(that) {
  var animation = wx.createAnimation({
    transformOrigin: "0 0",
    duration: 500,
    timingFunction: "ease-in",
    delay: 200
  })
  that.animation = animation
  animation.translateY(-30).step()
  that.setData({
    animationData: animation.export(),
  })
}
//页面动画----开始动画
function animaEventBefore(that) {
  var animation = wx.createAnimation({
    transformOrigin: "0 0",
    duration: 200,
    timingFunction: "ease-in",
    delay: 0
  })
  that.animation = animation
  animation.translateY(0).step()
  that.setData({
    animationData: animation.export(),
  })
}
//处理评价星
function handleStar(ratings) {
  var tempArr = [];
  var tempStar = ratings
  let score = Math.floor(tempStar * 2) / 2;
  let hasDecimal = score % 1 !== 0;
  let integer = Math.floor(score);
  for (let i = 0; i < integer; i++) {
    tempArr.push('full');
  }
  if (hasDecimal) {
    tempArr.push('half');
  }
  while (tempArr.length < 5) {
    tempArr.push('space');
  }
  return tempArr
}
//上传发动态的文件
function uploadDynamic(that) {
  return new Promise(function(resolve, reject) {

    console.log("###" + that.data.mediaSrc);
    console.log("%%%%" + that.data.fileType);
    
    if (that.data.mediaSrc == '') {

      console.log("()()()()()(");
      that.data.fileTypePublic = 1
      that.data.fileName = ''
      resolve(that)
      return
    }

    wx.uploadFile({
      url: test + '/user/community/upload',
      method: 'POST',
      name: 'file',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Cookie': 'PHPSESSID=' + that.data.sessionId
        'Cookie': 'PHPSESSID=' + app.globalData.userInfo.session_id
      },
      filePath: that.data.mediaSrc,
      formData: {
        // type: "voice",
        type: that.data.fileType
      },
      success: function(res) {

        console.log("444444444"+JSON.stringify(res.data));
        var jsonStr = res.data;
        jsonStr = jsonStr.replace(" ", "");
        jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
        res.data = JSON.parse(jsonStr);
        if (res.data.status == 1) {
          that.data.fileName = res.data.file_name
          console.log(that.data.fileName)
          resolve(that)
        } else if (res.data.status == -2) {
          wx.hideLoading()
          wx.showModal({
            title: '文件大于2M',
            content: '',
          })
          reject(that)
        }

      },
      fail: function() {
        reject(that)
      },
      complete: function() {

      },
    })
  })

}
//发布动态
function publicDynamic(that) {
  return new Promise(function(resolve, reject) {
    if (that.data.fileTypePublic==2){
      that.data.fileName = that.data.fileName+'?'+that.data.audiolength

    } 
    wx.request({
      url: test + '/user/community/release',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + app.globalData.userInfo.session_id
      },
      data: {
        title: that.data.publicContent,
        content: that.data.fileName,
        user_id: that.data.userId,
        type: that.data.fileTypePublic,  // 1 图文 2. 语音 3.视频
        // location: app.globalData.location.latLong.lat + ',' + app.globalData.location.latLong.long,
        location: app.globalData.latitude + ',' + app.globalData.longitude,
        address: app.globalData.address,
        event_type: app.globalData.event_type //事件类型(1:保险，2:理赔，3:维修/保养)
      },
      success: function(res) {
       console.log(res)
       if(res.data.status==1){
         that.data.tempUploadId=res.data.id
         resolve(that)
       }else{
         wx.hideLoading()
         wx.showModal({
           title: '操作超时',
           content: '',
         })
       }
       
      },
    })
  })
}
//获取用户具体信息
function getUserInfor(that) {
  console.log("%%%%%"+that.data.userId)
  console.log("%%%%%#########" + that.data.tempUserId)
  return new Promise(function(resolve, reject) {
    wx.request({
      url: test + '/user/user/user_info',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        self_user_id: that.data.userId,
        to_user_id: that.data.tempUserId
      },
      success: function(res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            temp = JSON.parse(jsonStr);
            res.data = temp;
          }
        }
        console.log(res)
        if(res.data.status==1){
          that.setData({
            userInforTemp: res.data.data
          })
        }else{
          wx.showModal({
            title: '操作超时',
            content: '',
          })
        }
       
        resolve(that)
      }
    })
  })

}

function giveThumnUp(that) {

  return new Promise(function (resolve, reject) {

    wx.request({
      url: test + '/user/community/zan',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        dynamic_id: that.data.dynamic_id,
        user_id: that.data.userId,
        type: 0
      },
      success: function (res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            temp = JSON.parse(jsonStr);
            res.data = temp;
          }
        }
        console.log(res)
        if (res.data.status == 1) {

          resolve(res.data.status)
          app.globalData.dianzan = true
        } else {
          wx.showToast({
            title: '点赞失败',
          })
          app.globalData.dianzan = false
          resolve(res.data.status)
        }

      }
    })

  })


}
function cancelThumnUp(that) {

  return new Promise(function (resolve, reject) {

    wx.request({
      url: test + '/user/community/cancel_zan',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        dynamic_id: that.data.dynamic_id,
        user_id: that.data.userId,
        type: 0
      },
      success: function (res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            temp = JSON.parse(jsonStr);
            res.data = temp;
          }
        }
        console.log(res)
        if (res.data.status == 1) {

          resolve(res.data.status)
        } else {
          wx.showToast({
            title: '失败',
          })
          resolve(res.data.status)
        }

      }
    })


  })

}
function shareDynamic(that) {
  wx.request({
    url: test + '/user/community/share',
    method: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'PHPSESSID=' + that.data.sessionId
    }, // 默认值
    data: {
      dynamic_id: that.data.dynamic_id
    },
    success: function (res) {
      var dataType = typeof res.data
      if (dataType == 'string') {
        var jsonStr = res.data;
        jsonStr = jsonStr.replace(" ", "");
        var temp
        if (typeof jsonStr != 'object') {
          jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
          temp = JSON.parse(jsonStr);
          res.data = temp;
        }
      }
      console.log(res)
      if (res.data.status == 1) {
        // wx.showToast({
        //   title: '分享成功',
        // })

        console.log("分享成功!");

      } else {
      }

    }
  })
}
function getDynamicList(that) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: test + '/user/user/my_dynamic',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        page: that.data.page,
        user_id: that.data.tempUserId,
        self_user_id:that.data.userId
      },
      success: function (res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            temp = JSON.parse(jsonStr);
            res.data = temp;
          }
        }
        console.log(res)
        //处理图文
        if (res.data.status == 1) {
          if (that.data.dynamicArr.length == 0 && res.data.data.length == 0) {
            that.setData({
              dynamicNull: true
            })
            resolve(that)
          } else {
            that.setData({
              dynamicNull: false
            })
            if (res.data.data.length == 0) {
              that.setData({
                noData: true,
              })
            } else {
              for (var i in res.data.data) {
                if (res.data.data[i].type == 1) {
                  if (res.data.data[i].content) {
                    res.data.data[i].imagecell = res.data.data[i].content.split(',')
                    console.log(res.data.data[i].imagecell)
                  }
                }
                that.data.dynamicArr.push(res.data.data[i])
              }
            }
          }
        } else if (res.data.status == 0) {
          if (that.data.dynamicArr.length == 0) {
            that.setData({
              dynamicNull: true
            })
            resolve(that)
            return
          }
          that.setData({
            dynamicNoData: true
          })

        } else {
          wx.showModal({
            title: '操作超时',
            content: '',
          })
        }
        that.setData({
          dynamicArr: that.data.dynamicArr
        })
        resolve(that)
        console.log(that.data.dynamicArr)
      }
    })
  })
}
function getFollowsList(that) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: test + '/user/user/my_follow',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        page: that.data.pageFollow,
        user_id: that.data.tempUserId
      },
      success: function (res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            temp = JSON.parse(jsonStr);
            res.data = temp;
          }
        }
        console.log(res)
        resolve(that)
        if (res.data.status == 1) {
          for (var i in res.data.data){
              that.data.followsArr.push(res.data.data[i])
            }
            that.setData({
              followsArr: that.data.followsArr
            })
          console.log(that.data.followsArr)
        } else if (res.data.status == 0) {
          if (that.data.followsArr.length == 0) {
            that.setData({
              followsNull: true,
            })
            return
          }
          that.setData({
            followsNoData: true
          })
        } else {
          wx.showModal({
            title: '操作超时',
            content: '',
          })
        }
      
      }
    })
  })
}
function getFansList(that) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: test + '/user/user/my_fans',
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + that.data.sessionId
      }, // 默认值
      data: {
        page: that.data.fansPage,
        user_id: that.data.tempUserId
      },
      success: function (res) {
        var dataType = typeof res.data
        if (dataType == 'string') {
          var jsonStr = res.data;
          jsonStr = jsonStr.replace(" ", "");
          var temp
          if (typeof jsonStr != 'object') {
            jsonStr = jsonStr.replace(/\ufeff/g, ""); //重点
            temp = JSON.parse(jsonStr);
            res.data = temp;
          }
        }
        console.log(res)
        if (res.data.status == 1) {
            for(var i in res.data.data){
              that.data.fansArr.push(res.data.data[i])
            }
            that.setData({
              fansArr: that.data.fansArr
            })
        } else if (res.data.status == 0) {
          if (that.data.fansArr.length == 0) {
            that.setData({
              fansNull: true,
            })
            return
          }
          that.setData({
            fansNoData: true
          })

        } else {
          wx.showModal({
            title: '操作超时',
            content: '',
          })
        }
        resolve(that)
      }
    })
  })
}

//评价
function evaluate(that){
  return new Promise(function (resolve, reject){
    wx.request({
      url: test + '/user/user/evaluate',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + app.globalData.userInfo.session_id
      }, // 默认值
      data: {
        // order_id: that.data.fansPage,
        order_id: that.data.orderid,
        star: that.data.tempUserId,
        content:that.data.evacontent,
        picture: that.data.mediaSrc
      },
      success:function(res){
        resolve(res.data)
      }
    })
  })
}

module.exports = {
  pageCss: pageCss,
  userInfor: userInfor,
  animationEvent: animationEvent,
  handleStar: handleStar,
  uploadDynamic: uploadDynamic,
  publicDynamic: publicDynamic,
  getUserInfor: getUserInfor,
  giveThumnUp: giveThumnUp,
  shareDynamic: shareDynamic,
  animaEventBefore: animaEventBefore,
  getDynamicList: getDynamicList,
  getFollowsList: getFollowsList,
  getFansList: getFansList,
  cancelThumnUp: cancelThumnUp,
  requestInfor: requestInfor,
  evaluate: evaluate
}