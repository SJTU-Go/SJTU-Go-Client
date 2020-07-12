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
  {var dataset = {}
    wx.login({
    success (res) {
      if (res.code) {
        dataset.code = res.code
        console.log(res.code)

        wx.getUserInfo({
          success: function(res) {
            console.log(res.userInfo)
            dataset.name = res.userInfo.nickName
     
        console.log(dataset)
        //发起网络请求
        wx.request({
          url: 'https://api.ltzhou.com/user/login',
          method:'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          data:dataset,
          success(res){console.log("returningcode");console.log(res.data)
        wx.setStorage({
          data:res.data.userID,
          key: 'userID',
        })

        wx.request({
          url: 'https://api.ltzhou.com/user/preference/get?userID='+res.data.userID,
          method:'POST',
          success(res){if(res.data){
            var preelist=res.data.preferencelist.split(",")
            for(var i = 0;i<preelist.length;i++){
              if(preelist[i]==''||preelist[i]==null||typeof(preelist[i])==undefined){
                preelist.splice(i,1);
                  i=i-1;
              }
          }
            console.log(preelist)
            var bannlist=res.data.banlist.split(",")
            for(var i = 0;i<bannlist.length;i++){
              if(bannlist[i]==''||bannlist[i]==null||typeof(bannlist[i])==undefined){
                bannlist.splice(i,1);
                  i=i-1;
              }
          }


            console.log(bannlist)
            if(preelist){wx.setStorage({
            data: preelist,
            key: 'preference',
          })}
          if(bannlist){wx.setStorage({
            data:bannlist, 
            key: 'banned',
          })}
        }
        else{wx.setStorage({
          data:[], 
          key: 'banned',
        })
        wx.setStorage({
          data:[],
          key: 'preference',
        })
      }
        }})

        wx.request({
          url: 'https://api.ltzhou.com/user/history/get?userID='+res.data.userID,
          method:'POST',
          success(res){wx.setStorage({
            key: 'historygained',
            data: res.data,
          })
        }})

wx.request({
  url: 'https://api.ltzhou.com/user/getScheduleInfo?userID='+res.data.userID,
  method:'POST',
  success(res){var a =JSON.parse(res.data.schedule)
  wx.setStorage({
    data: a.schedule,
    key: 'storedschedule',
  })
  }

})

wx.switchTab({url: '../index/index', })
        }
        })
      
      
      },
      fail: function () {
        //获取用户信息失败后。请跳转授权页面
        wx.showModal({
         title: '警告',
         content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
         success: function (res) {
          if (res.confirm) {
           console.log('用户点击确定')
           wx.navigateTo({
            url: '../tologin/tologin',
           })
          }
         }
        })
       }
    })
      }// if res
      
      else {
        console.log('登录失败！' + res.errMsg)
        wx.showToast({ 
          title: '登录失败', 
          icon: 'loading', 
          duration: 2000 
          }) 
          
      }
    }
    
  }
  )



},
  onLoad: function() {
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  bindGetUserInfo (e) {
    console.log(e.detail.userInfo)
  }})