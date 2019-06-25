//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init({
      env: 'cheguanjia1-beb14e'
    })

    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager()

      //监听向微信后台请求检查更新结果事件
      updateManager.onCheckForUpdate(function (res) {

        console.log(res);
        // 请求完新版本信息的回调
        if (res.hasUpdate) {

          //监听小程序有版本更新事件。客户端主动触发下载（无需开发者触发），下载成功后回调
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)

                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })

          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })

        }
      })
    } else {

      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

  },

  getAuth: function (sCallback) {
    var that = this
    // 微信登录
    wx.login({
      success: (res1) => {
        // console.log('res1', res1)
        wx.request({
          url: getApp().globalData.hostName + '/user/login/wxLogin',
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            type: 'chedou',
            js_code: res1.code
          },
          success: (res2) => {
            // console.log('res2', res2)

            getApp().globalData.sessionKey = res2.data.data.session_key
            getApp().globalData.openId = res2.data.data.openid
            wx.getSetting({
              success: (res3) => {
                console.log('res3', res3)
                if (!res3.authSetting['scope.userInfo']) {
                  sCallback(false);
                } else {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: (res4) => {
                      // console.log('res4', res4)
                      sCallback(res4)
                    }
                  })
                }
              }
            })
            // console.log("微信登录获取用户信息或者openid", response);
          }
        })
      }
    })
  },

  // 用户是否授权
  getSet: function (sCallback) {
    wx.getSetting({
      success: (res3) => {
        if (!res3.authSetting['scope.userInfo']) {
          sCallback(false);
        } else {
          sCallback(true)
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        }
      }
    })
  },

  // 获取用户unionID
  getUserLogin: function (params, sCallback) {
    wx.request({
      url: getApp().globalData.hostName + '/user/login/getUnionId',
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        type: 'chedou',
        encryptedData: params.encryptedData,
        iv: params.iv,
        sessionKey: getApp().globalData.sessionKey
      },
      success: (res) => {
        console.log('获取unionId', res)

        wx.request({
          url: getApp().globalData.hostName + '/user/login/index',
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            unionid: res.data.member.unionId,
            source: 'chedou'
          },
          success: (res1) => {
            console.log('系统登录', res1)
            getApp().globalData.userInfo = res1.data.data
            sCallback(res1)

          }
        })
      }
    })
  },


  globalData: {
    userInfo: '',
    hostName:'https://dev.feecgo.com',
    // hostName: 'http://192.168.1.108',
    // hostName: 'https://www.chedou123.cn',
    server: null,
  }
})