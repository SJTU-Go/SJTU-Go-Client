// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    wxbound:0,
  },

  testLoc:function(){
    wx.startLocationUpdateBackground({
      complete: (res) => {console.log(res)},
    })
    
    var app = getApp();
    var curSpeed = 0;
    var beginTime = Date.parse(new Date())/1000
    var status = 0; // 0表示行程待开始
    wx.onLocationChange((result) => {
      var curLng = result.longitude;
      var curLat = result.latitude;
      var curTime = Date.parse(new Date())/1000;
      curSpeed = result.speed == -1 ? curSpeed : result.speed;
      app.globalData.curRoute.trace.push([curLng, curLat, curSpeed, curTime-beginTime])
      console.log(app.globalData.curRoute.trace)
    })
  },



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