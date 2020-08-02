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
      recordTypes: {
        "HELLOBIKE":0,
        "E100":2,
        "CLOUDMOTOR":1,
        "MOBIKE":0,
      },
      onTrip: false,
      curTripID: 0,
      curRoute:{
        type: -1,
        route: null,
        punishlist: [],
        pid : 0,
        beginTime:Date.parse(new Date())/1000,
        status: 0,
        remainRoutes:[],
        prevSpeed: 0,
      },
      waitTimes: 1.5 //参数
    }

    this.getSystemInfo();
  },


  _isNearPoint: function(alng,alat,blng,blat){
    return (Math.abs(alng-blng)<0.0001 && Math.abs(alat-blat)<0.0001)
  },


  cancelTrip: function(){
    wx.offLocationChange((res) => {})
    wx.stopLocationUpdate({
      complete: (res) => {},
    })
    wx.removeStorage({
      key: 'currentTrip',
    })
    this.globalData.onTrip = false;
  },

  onLocateTrip: function(tripID, routeList) {
  
    var app = getApp();
    if (! this._startLocationBackground()){
      return;
    }

    // 初始化，开始新的记录
    if (this.globalData.onTrip) {
      wx.showModal({
        title:"开始行程失败",
        content:"已有行程在记录中，请检查或稍等",
      })
      return;
    }
    this.globalData.onTrip = true;
    this.globalData.curTripID = tripID;
    this.globalData.curRoute = {
      type: this.globalData.recordTypes[routeList[0].type],
      punishlist: [],
      pid : 0,
      beginTime:Date.parse(new Date())/1000,
      status: 5,
      remainRoutes:routeList,
      prevSpeed: 0,
    }
    wx.setStorageSync('currentTrip',  [])

      // 获取当前段route的详细信息，起终点经纬度、预估时间
    wx.onLocationChange(app.locationChange)

    wx.stopLocationUpdate({
      complete: (res) => {},
    })
    this.globalData.onTrip = false;
    // 此处把记录结果POST给服务器
  },

  locationChange: function(result){
    var app = getApp()
    var data = app.globalData.curRoute

    var curLng = result.longitude;
    var curLat = result.latitude;
    var curTime = Date.parse(new Date())/1000;
    var beginTime = app.globalData.curRoute.beginRecordTime;
    var curSpeed = result.speed == -1 ? data.prevSpeed : result.speed;

    var route = data.route;
    if (route) {
      var routePath = route.routePath.coordinates;
      var beginPoint = routePath[0];
      var endPoint = routePath[routePath.length - 1];
      var beginLng = beginPoint[0];
      var beginLat = beginPoint[1];
      var endLng = endPoint[0];
      var endLat = endPoint[1];
      var expectTime = route.routeTime;
    }



    console.log(app.globalData.curRoute)

    switch (data.status) {
      case 0: // 等待开始状态
        // if (~ _isNearPoint(curLng,curLat,beginLng,beginLat)){
        if (true){
          data.status = 1
          var new_pid = app.globalData.curRoute.pid + 1;
          app.globalData.curRoute.pid = new_pid
          // 切换到后台记录模式，如果当前Route超时则停止记录,算作意外退出
          setTimeout(function(){
              if (getApp().globalData.curRoute.pid == new_pid){
                // data.status = 2
                data.status = 3
              }
              console.log("quit")
            }, 1000*5
            // }, 1000*expectTime*getApp().globalData.waitTimes
          )
          app.globalData.curRoute.beginRecordTime = Date.parse(new Date())/1000
        }
        break;
      case 1: // 记录中状态
        app.globalData.curRoute.punishlist.push([curLng, curLat, curSpeed, curTime-beginTime])
        if (app._isNearPoint(curLng,curLat,endLng,endLat)){
          data.status = 3
        }
        break;
      case 2: // 意外结束状态
        wx.removeStorage({
          key: 'currentTrip',
        })
        console.log("break down")
        this.globalData.onTrip = false;
        wx.request({
          url: 'https://api.ltzhou.com/punishment/fail?tripID='+getApp().globalData.tripID,
          method: 'GET',
          success:(res)=>{
            console.log(res)
            wx.offLocationChange((res) => {})
            wx.stopLocationUpdate({
              complete: (res) => {},
            })
          }
        })
        break;
      case 3: // 一段记录完状态
        try {
          var recordList = wx.getStorageSync('currentTrip')
          if (recordList) {
            recordList.push(app.globalData.curRoute)
            wx.setStorageSync('currentTrip',  recordList)
          } else {
            wx.setStorageSync('currentTrip', [app.globalData.curRoute])
          }
        } catch(e){
          data.status = 2
        }
      // 此处没有break
      case 5: // 判断形成是否跳过状态
        data.route = data.remainRoutes.shift()
        if (data.route) {
          if (getApp().globalData.recordTypes[data.route.type]){
            data.type = getApp().globalData.recordTypes[data.route.type]
            data.status = 0
          } else {
            data.status = 5
          }
        } else {
          data.status = 4
        }
        break;
      case 4:
        var curTrip = wx.getStorageSync('currentTrip')
        console.log(curTrip)
        this.globalData.onTrip = false;
        wx.request({
          url: 'https://api.ltzhou.com/punishment/punish?tripid='+getApp().globalData.curTripID.data,
          data: curTrip,
          method: "POST",
          success:(e)=>{
            console.log(e)
            wx.offLocationChange((res) => {})
            wx.stopLocationUpdate({
              complete: (res) => {},
            })
          }
        })
        break;
        default:
      /** default:
        wx.offLocationChange((res) => {})
        wx.stopLocationUpdate({
          complete: (res) => {},
        })
        TODO: arrange the storage of trace records in the local storage */
          break;
    }

  },



  // 开始后台记录，若失败则弹出提示，返回false
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
    console.log(success)
    return success;
  },

  _makeRouteList(routeplan){
    var polyline = [];
    var d = routeplan;
    for(var j=0;j<d.length;j++){
      var points = [];
      var item = d[j];
      for(var i of item.routePath.coordinates){
        var cor = {};
        cor['longitude']=i[0];
        cor['latitude']=i[1];
        points.push(cor);
      }
      switch (item.type) {
        case "HELLOBIKE":
          polyline.push({
            points: points,
            width: 8,
            color: '#0099FF'
          });
          break;
        case "E100":
          polyline.push({
            points: points,
            width: 8,
            color: '#408000'
          });
          break;
        case "WALK": case "PARK": case "FIND":
          polyline.push({
            points: points,
            width: 6,
            dottedLine: true,
            color: '#404040'
          });
          break;
        case "BUS":
          polyline.push({
            points: points,
            width: 8,
            color: '#997300'
          });
          break;
        case "CLOUDMOTOR":
          polyline.push({
            points: points,
            width: 8,
            color: '#ec9613'
          });
          break;
        default:
          break;
      }     
    }
    return polyline;
  },

  _makeMapMarker(strategy){
    var markers = [];
    

    /** begin */
    var beginPoint = strategy.beginDetail 
    markers.push({
      iconPath: "/images/pin_begin.png",
      id: 0,
      latitude: beginPoint.location.coordinates[1],
      longitude: beginPoint.location.coordinates[0],
      width: 50,
      height: 50
    })

    /** end */
    var endPoint = strategy.endDetail 
    markers.push({
      iconPath: "/images/pin_arrive.png",
      id: 99,
      latitude: endPoint.location.coordinates[1],
      longitude: endPoint.location.coordinates[0],
      width: 50,
      height: 50
    })

    var passcnt = 0
    strategy.passDetail.forEach(point => {
      passcnt += 1
      markers.push({
        iconPath: "/images/pin_pass.png",
        id: passcnt,
        latitude: point.location.coordinates[1],
        longitude: point.location.coordinates[0],
        width: 40,
        height: 40
      })
    });
    return markers;
  },


  /** 
    * 自定义post函数，返回Promise
    * +-------------------
    * @param {String}      url 接口网址
    * @param {arrayObject} data 要传的数组对象
    * @param {String} method POST/GET
    * +-------------------
    * @return {Promise}    promise 返回promise供后续操作
    */
  request: function(url, data, method){
    var promise = new Promise((resolve, reject) => {
       //init
       var postData = data;
       /*
       //自动添加签名字段到postData，makeSign(obj)是一个自定义的生成签名字符串的函数
       postData.signature = that.makeSign(postData);
       */
       //网络请求
       wx.request({
          url: url,
          data: postData,
          method: method,
          header: { 'content-type': 'application/json' },
          success: function (res) {//服务器返回数据
             if (res.data) {//res.data 为 后台返回数据, 这里假设不为空则合法
                resolve( res.data );
             } else {//返回错误提示信息
                reject( res.data);
             }
          },
          error: function (e) {
             reject('网络出错');
          }
       })
    });
    return promise;
  },

  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
})
