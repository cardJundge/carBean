
var app = getApp();
import { Community } from '../../pages/community/communitymode.js';
var community = new Community();
import { Config } from '../../utils/config.js';

//社区模式标题
Component({
  properties: {
    tablist:Array,
    currentTab: Number,
    sidelist:Array,
    animation:Object,
    
  },
  data: {
    page: 1,
    sidetab:0,
    sideshow:true,
    modechange:true
  },
  methods: {

    switchnav:function(e){
      var that = this;

      that.setData({
        currentTab: e.currentTarget.dataset.index
      })

      if (that.data.currentTab == 1){
        that.setData({
          modechange:false
        })
      }else{
        that.setData({
          modechange: true
        })
      }


      //触发父类事件
      that.triggerEvent('select', {
        currentTab: that.data.currentTab
      })


      // if (that.data.currentTab == 1){
      //   wx.navigateTo({
      //     url: './mapcommunity/mapcommunity',
      //   })
      // }

    },

    sidelabel:function(){

      var that = this

      that.animation = wx.createAnimation({
        duration:500,
        timingFunction:"ease"
      });

      that.animation.translateX(0).step()
      
      that.setData({
        animationout: that.animation.export(),
        sideshow: false
      })

    },

    close:function(){

      var that = this

      that.animation.translateX(120).step()

      that.setData({
        animationout: that.animation.export()
      })

      setTimeout(function () {
        that.setData({
          sideshow: true
        })
      }, 500)  
      
    },

    selectitem:function(e){

      var that = this;

      var selectitem = e.currentTarget.dataset.index
      that.setData({
        sidetab: selectitem
      })

      that.data.dynamicArr = [];

      community.getDynamicList(that.data.page, app.globalData.userInfo.id, e.currentTarget.dataset.index, (res) => {

        console.log("11111", res);

        //触发父类事件
        that.triggerEvent('send', {
          res: res,
          loadedMore: false,
          event_type: e.currentTarget.dataset.index
        })
      })
    }



  }
})