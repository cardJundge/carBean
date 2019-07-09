const recorderManager = wx.getRecorderManager();
const myAudio = wx.createInnerAudioContext();
myAudio.obeyMuteSwitch = false  // 是否遵循系统静音开关,当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音

import common from '../../utils/common.js';
import { Config } from  '../../utils/config.js'
var app = getApp();

import { Community } from '../../pages/community/communitymode.js';
var community = new Community();


//语音组件模态框
Component({
  properties: {
    show: Boolean,
    mode:String
  },
  data: {
    voicecontent: "点击录制",
    fileName:'',
    voicetime:"00:00",
    page:1
  },
  methods: {

    close: function() {

      var that = this;

      clearInterval(that.data.time)
      recorderManager.stop();

      that.setData({
        show: false,
        voicecontent:'点击录制',
        voicetime:"00:00",
        voicegif:""
      })


      //触发父类事件
      that.triggerEvent('refresh', {
        
      })





    },

    // id: canvas 组件的唯一标识符 canvas - id ，x: canvas 绘制圆形的半径， w: canvas 绘制圆环的宽度
    drawCircleBg: function(id, x, w) {

      x = 37.5;
      w = 2;
      id = "123";
      // 设置圆环外面盒子大小 宽高都等于圆环直径
      this.setData({
        size: 2 * x
      });
      // 使用 wx.createContext 获取绘图上下文 ctx  绘制背景圆环
      var ctx = wx.createCanvasContext(id)
      ctx.setLineWidth(w / 2);
      ctx.setStrokeStyle('#20183b');
      ctx.setLineCap('round')
      ctx.beginPath(); //开始一个新的路径
      //设置一个原点(x,y)，半径为r的圆的路径到当前路径 此处x=y=r
      ctx.arc(x, x, x - w, 0, 2 * Math.PI, false);
      ctx.stroke(); //对当前路径进行描边
      ctx.draw();
    },

    recorde: function() {

      var that = this;
      if (that.data.voicecontent =="点击录制"){

        
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userInfo'] || !res.authSetting['scope.userLocation']) {

              //触发父类事件
              that.triggerEvent('location', {

              })
            }else{

              const options = {
                duration: 60000,
                format: "mp3",
                frameSize: 50
              }
              recorderManager.start(options);

              recorderManager.onStart(res=>{

                var time = 0;

                that.data.time = setInterval(function () {

                  ++time;

                  if (time < 10) {
                    that.setData({
                      voicetime: "00:0" + time
                    })
                  } else {

                    if (time >= 60) {
                      that.setData({
                        voicetime: "01:00"
                      })
                      clearInterval(that.data.time)
                      recorderManager.stop();

                      wx.showToast({
                        title: '结束录音!'
                      })

                      recorderManager.onStop(res => {

                        console.log("录音路径:",res);

                        that.data.mediaSrc = res.tempFilePath

                        //计算录音时间
                        that.data.audiolength = parseInt(res.duration / 1000);

                      })

                      that.setData({
                        voicecontent: "录制完成"
                      })


                    } else {
                      that.setData({
                        voicetime: "00:" + time
                      })
                    }
                  }
                }, 1000)
              })

              that.setData({
                voicecontent: "正在录制",
                voicegif: "/images/icon/voice.gif"
              })
              
            } 
          }
        })

      } else if (that.data.voicecontent =="正在录制"){

        clearInterval(that.data.time);

        recorderManager.stop();

        recorderManager.onStop(res=>{
          console.log("录音的路径:",res);

          //计算录音时间
          that.data.audiolength = parseInt(res.duration / 1000);

          if (res.duration <= 1){
            wx.showToast({
              title: '录音时间少于1s',
              duration:2000,
              icon:'none'
            })

            that.setData({
              voicecontent:"点击录制"
            })
            return
          }

          that.data.mediaSrc = res.tempFilePath 

          console.log("that.data.mediaSrc", res.tempFilePath);
          
          // common.uploadDynamic(that).then(common.publicDynamic).then(function (res) {

          //   console.log("发布" + that.data.fileName)
          // })
        })

        that.setData({
          voicecontent: "录制完成"
        })

      } else{

        // myAudio.src = Config.restUrl + "/uploads/community/voice/" + that.data.fileName;
        // myAudio.play();

      }

    },

    //删除语音
    deletevoice:function(){

      var that = this;
      that.data.mediaSrc = "";
      wx.showToast({
        title: '删除成功!',
        duration: 2000,
        icon: "none",
        success(res){

          that.setData({
            voicecontent: '点击录制',
            voicetime: "00:00",
            voicegif: ""
          })
        }
      })

    },

    //完成
    complate:function(){
      var that = this

      that.data.fileType = "voice";
      that.data.publicContent = "";  //语音文字内容
      that.data.userId = app.globalData.userInfo.id;
      that.data.fileTypePublic = "2";

      console.log("that.properties.mode", that.properties.mode);

      if(that.properties.mode == "动态"){

        common.uploadDynamic(that).then(function (that) {

          if (that.data.fileName) {
            common.publicDynamic(that).then(function (that) {

              console.log("发布" + that.data.fileName)
              wx.showToast({
                title: '语音发布成功!',
                duration: 2000
              })

              // clearInterval(that.data.time)
              // recorderManager.stop();

              that.setData({
                show: false,
                voicecontent: '点击录制',
                voicetime: "00:00",
                voicegif:''
              })


              //触发父类事件
              that.triggerEvent('refresh', {

              })
            })
          }
        })
      }else{

        common.uploadDynamic(that).then(function (that) {

          if (that.data.fileName) {

            that.setData({
              show: false,
              voicecontent: '点击录制',
              voicetime: "00:00"
            })


            //触发父类事件
            that.triggerEvent('comment', {
              fileName: that.data.fileName +"?"+ that.data.audiolength
            })
          }
        })
        
        
      } 
    }
  },

})