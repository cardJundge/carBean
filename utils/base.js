import {Config} from 'config.js'

var app = getApp();

class Base{

  constructor(){
    
    this.baseRestUrl = Config.restUrl;
  }

  //http请求
  request(params){

    var that = this;

    wx.request({
      url: this.baseRestUrl + params.url,
      method:params.type,
      header:{
        'content-type': 'application/json',
        // 'Cookie': 'PHPSESSID=' + that.data.sessionId
        'Cookie': 'PHPSESSID=' + app.globalData.userInfo.session_id
      },
      data: params.data,
      success:res=>{
        params.sCallback && params.sCallback(res.data)
      },
      fail:res=>{
        params.sCallback && params.sCallback(res.data)
      }
    })
  }

//地址转经纬度
  distance(demo,service,sCallback) {

  for(let item of service){
    for(let i in item){
      if(i == 'address'){
        
        demo.geocoder({
          address:item[i],
          success:res=>{
            item.location = res.result.location;

            demo.calculateDistance({
              mode:'driving',
              to:[{
                latitude:item.location.lat,
                longitude: item.location.lng
              }],
              success:res=>{
                item.distance = res.result.elements[0].distance;

                item.distance = (item.distance / 1000).toFixed(1); 

                sCallback && sCallback(item)
              },
              fail:res=>{
                console.log("999" ,res)
              }

            })
          },
          fail:res=>{

            item.distance = 0;
            sCallback && sCallback(item)
          }
      })
      }  
    }
  } 
}

  //单独计算距离
  calculateDistance(demo, lat, lng, sCallback) {

    var distance;
    demo.calculateDistance({

      mode: 'driving',
      to: [{
        latitude: lat,
        longitude: lng
      }],
      success(res) {

        if (res.status == 0) {
          distance = res.result.elements[0].distance
        } else {
          console.log("请求距离失败!");
        }

        sCallback && sCallback(distance)

      }
    })

  }


//距离排序
sort(arr,sCallback){
  arr.sort(function(a,b){
    return a.distance - b.distance;
  })

  sCallback && sCallback(arr) 
}

  //地址转经纬度
  geocoder(demo, address, sCallback) {

    demo.geocoder({
      address: address,
      success: res => {
        sCallback && sCallback(res.result.location)
      }
    })
  }

  //腾讯坐标转地址
  reverseGeocoder(demo, lat, lng, sCallback) {
    demo.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success(res) {
        sCallback && sCallback(res.result.address_component)
      },
      fail(error) {
        console.error(error);
      }
    })
  }




}

export {Base}