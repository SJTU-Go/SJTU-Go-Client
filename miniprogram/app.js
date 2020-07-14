//app.js
App({
  globalData:{
    search:''
  },
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      onTrip: false,
      curRoute:{
        trace: [],
        pid : 0,
        beginTime:Date.parse(new Date())/1000
      }
    }
  },

  onLocateTrip: function(routeList) {
    /* 可调节的参数 */
    var waitTimes = 1.5; // 最长允许行程时间与预估时间的倍数
    const _isNearPoint = function(alng,alat,blng,blat){
      return (abs(alng-blng)<0.0001 && abs(alat-blat)<0.0001)
    } // 到达附近的判断标准


    
    var app = getApp();
    if (this._startLocationBackground()){
    } else {
      return; // 授权失败case
    } 

    this.globalData.onTrip = true;


    wx.removeStorage({
      key: 'currentTrip',
    })

    for (const route of routeList)  {
      var routeType = route.type;
      var continueFlag = false;
      var result = {};
      switch (routeType) {
        case "HELLOBIKE":
          result.type = 0;
          break;
      
        default:
          continueFlag = true
          break;
      }
      if (continueFlag) {
        continue
      }
      var routePath = route.routePath.coordinates;
      var beginPoint = routePath[0];
      var endPoint = routePath[routePath.length - 1];
      var beginLng = beginPoint[0];
      var beginLat = beginPoint[1];
      var endLng = endPoint[0];
      var endLat = endPoint[1];
      var expectTime = route.travelTime;



      var curSpeed = 0;
      var status = 0; // 0表示行程待开始


      wx.onLocationChange((result) => {
        var curLng = result.longitude;
        var curLat = result.latitude;
        var curTime = Date.parse(new Date())/1000;
        var beginTime = app.globalData.curRoute.beginTime;
        curSpeed = result.speed == -1 ? curSpeed : result.speed;

        switch (status) {
          case 0:
            if (~ _isNearPoint(curLng,curLat,beginLng,beginLat)){
              status = 1
              new_pid = app.globalData.curRoute.pid + 1;
              app.globalData.curRoute.pid = new_pid
              // 切换到后台记录模式，如果当前Route超时则停止记录
              setTimeout(
                callback= function(){
                  if (getApp().globalData.curRoute.pid == new_pid){
                    wx.offLocationChange((res) => {})
                  }
                  
                },
                delay= 1000*expectTime*waitTimes
              )
              app.globalData.curRoute.beginTime = Date.parse(new Date())/1000
            }
            break;
          case 1:
            app.globalData.curRoute.trace.push([curLng, curLat, curSpeed, curTime-beginTime])
            if (_isNearPoint(curLng,curLat,endLng,endLat)){
              status = 2
            }
            break;
          default:
            wx.offLocationChange((res) => {})
            /** TODO: arrange the storage of trace records in the local storage */
            break;
        }
        
        console.log(app.globalData.curRoute.trace)
      })

    };

  },



  _startLocationBackground: function(){
    var success = true;
    wx.startLocationUpdateBackground({
      complete: (res) => {
      },
      success: (res) => {
        console.log("已启动行程记录")
      },
      fail: (res) => {
        wx.offLocationChange((res) => {})
        wx.stopLocationUpdate({
          complete: (res) => {},
        })
        wx.showModal({
          title:"启动行程记录失败",
          content:"请到个人设置页面检查位置信息权限设置",
        })
        success = false
      },
    })
    return success;
  }
})
