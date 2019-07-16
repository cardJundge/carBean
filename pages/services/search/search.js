import { Services } from '../servicesmode.js';
import { Base } from '../../../utils/base.js';
// 引入SDK核心类
var QQMapWX = require('../../../qqmap-wx-jssdk.js');

// 实例化API核心类
var demo = new QQMapWX({
  key: 'OEIBZ-MF2HD-B6U4J-HRVAP-AASNO-CMBEQ' // 必填
});

var services = new Services();
var base = new Base();
// 搜索
Page({
  data: {
    tagData: [
      "雁塔区", "雁塔区上汽大众", "上汽大众嘉悦", "雁塔区上汽大众"
    ],
    text: '',
    searching: true,
    region:[],
    isSearch:true,
    total:[]
  },
  onLoad: function (options) {

  },

  onInput:function(e){

    var that = this;
    // 将tag标签内容放入input框开始搜索
    const text = e.currentTarget.dataset.text || e.detail.value
    that.data.text = text;

  },

  onConfirm: function(e) {
    var that = this;

    this.setData({
      isSearch:false
    })
   
    that.data.searchKeys = that.data.text;
    
    that.setData({
      searchKeys: that.data.searchKeys
    })

    
    that.data.total = [];
    services.getServiceList(that,res=>{

      console.log("res",res);
      if (res.status == 1){

        if(res.service.length>0){


          that.data.servicelist = res.service

          var temparr = [];

          base.distance(demo, res.service, (data) => {

            temparr.push(data);

            if (temparr.length == that.data.servicelist.length) {

              base.sort(temparr, res => {

                that.data.total = that.data.total.concat(temparr);

                that.setData({
                  searchlist: that.data.total,

                })
              })
            }
          })


          // that.setData({
          //   searchlist:res.service
          // })
        }else{

          that.setData({
            searchlist:[]
          })
        }

      }else{



      }

    })

    this.setData({
      searching: false
    })
    // 开始搜索searching为true
  },

  //热门搜索
  onServicelist:function(e){
    var that = this;
    // 将tag标签内容放入input框开始搜索
    const text = e.currentTarget.dataset.text || e.detail.value

    wx.navigateTo({
      url: '/pages/services/servicestype/servicestype?server=' + text,
    })

  },

  onCancel:function(e){
    
    var that = this;
    that.setData({
      text:'',
      isSearch:true,
      searching:true
    })
  }
})