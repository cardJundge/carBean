var app = getApp();
import { OrderList } from '../../pages/services/orderlist/orderlistmode.js';
var orderlist = new OrderList();
import { Config } from '../../utils/config.js';

//我的订单选项卡
Component({
  properties: {
    tablist: Array,
    currentTab: Number
  },
  data: {
    page:1,
    status:'',
    work_status:''
  },
  methods: {

    switchitem:function(e){
      var that = this;

      that.setData({
        currentTab: e.currentTarget.dataset.index
      })

      if (that.data.currentTab == 0){
        that.data.status = ''
        that.data.work_status = ''

      } else if (that.data.currentTab == 1){
        that.data.work_status = "4"
        that.data.status = ""
      } else if (that.data.currentTab == 2){
        that.data.status = "4"
        that.data.work_status = ""
      } else if (that.data.currentTab == 3){
        that.data.status = "3"
        that.data.work_status = ""
      }

      orderlist.myOrder(that.data.status, that.data.work_status,that.data.page,res=>{
        console.log("uuu",res);
        
        //触发父类事件
        that.triggerEvent('send', {
          res: res,
          status: that.data.status,
          work_status: that.data.work_status,
          currentTab: that.data.currentTab
        })

      })
    },

    onsend:function(e){

    }
  }
})