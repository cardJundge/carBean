var app = getApp();
import { Community } from '../../pages/community/communitymode.js';
var community = new Community();
import { Config } from '../../utils/config.js';
//社区选项卡
Component({
  properties: {
    tablist:Array,
    currentTab:Number
  },
  data: {

    page:1
    
  },
  methods: {

    switchnav(e) {

      console.log("e",e);

      var that = this;
      
      that.setData({
        currentTab:e.currentTarget.dataset.index
      })

      // app.globalData.event_type = e.currentTarget.dataset.index;

      console.log("888", that.data.page);
      that.data.dynamicArr = [];

      community.getDynamicList(that.data.page, app.globalData.userInfo.id, e.currentTarget.dataset.index,(res) => {

        console.log("11111", res);

        //触发父类事件
        that.triggerEvent('send', {
          res: res,
          loadedMore:false,
          event_type: e.currentTarget.dataset.index
        })
      })
    }
  }
})