// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wxbound:0,
  },

  testLoc:function(){
    
    
    var app = getApp();

    if (~ app._startLocationBackground()){
      return;
    }


    var curSpeed = 0;
    var beginTime = Date.parse(new Date())/1000
    var status = 0; // 0表示行程待开始
    wx.onLocationChange((result) => {
      var curLng = result.longitude;
      var curLat = result.latitude;
      var curTime = Date.parse(new Date())/1000;
      var beginTime = app.globalData.curRoute.beginTime;
      curSpeed = result.speed == -1 ? curSpeed : result.speed;
      switch (status) {
        case 0:
          if (true){
            status = 1
            var new_pid = app.globalData.curRoute.pid + 1;
            app.globalData.curRoute.pid = new_pid
            // 切换到后台记录模式，如果当前Route超时则停止记录
            setTimeout(
              function(){
                if (getApp().globalData.curRoute.pid == new_pid){
                  wx.offLocationChange((res) => {})
                  wx.stopLocationUpdate({
                    complete: (res) => {},
                  })
                  status = 2
                }
                console.log("finish")
              },
              1000*30
            )
            app.globalData.curRoute.beginTime = Date.parse(new Date())/1000
          }
          break;
        case 1:
          app.globalData.curRoute.trace.push([curLng, curLat, curSpeed, curTime-beginTime])
          console.log(app.globalData.curRoute.trace)
          break;
        default:
          // wx.offLocationChange((res) => {console.log("finish")})
          /** TODO: arrange the storage of trace records in the local storage */
          break;
      }
  })},



  jumpaccountLogin:function(){wx.navigateTo({url: '../accountLoginPage/accountLoginPage', })
  },
  checkUserInfo: function()
  {wx.switchTab({url: '../index/index', })
},
  onLoad: function() {
    // 查看是否授权
    
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  }})