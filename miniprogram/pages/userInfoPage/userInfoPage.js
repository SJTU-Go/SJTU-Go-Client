//index.js
const app = getApp()

Page({
  data: {
    haveid:0
  },
  vip:function()
  {wx.navigateTo({url: '../vipPage/vipPage', })},
  preferenceNavigate:function()
  {wx.navigateTo({url: '../preferencePage/preferencePage', })},
  scheduleNavigate:function()
  {wx.navigateTo({url: '../schedulePage/schedulePage', })},
  historyNavigate:function()
  {wx.navigateTo({url: '../HistoryPage/HistoryPage', })},
  accessAbout:function()
  {wx.navigateTo({url: '../about/about', })},
  accessLocationNavigate:function()
  {wx.openSetting({
    complete: (res) => {},
  })},
  bindGetUserInfo: function(e){
    var that = this;
    //此处授权得到userInfo
    console.log(e.detail.userInfo);
    //接下来写业务代码
    var dataset = {}
    wx.login({
      success (res) {
        console.log(res)
        if (res.code) {
          dataset.code = res.code
          // console.log(res.code)
          var code = res.code; //返回code
          // console.log(code);
          // var appId = 'wxde82431f805562ef';
          // var secret = '40fb5700a5742cdf2d744ef87df8da98';
          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
          //   data: {},
          //   header: {
          //     'content-type': 'json'
          //   },
          //   success: function (res) {
          //     var openid = res.data.openid //返回openid
          //     console.log('openid为' + openid);
          //     wx.setStorage({
          //       data: openid,
          //       key: 'openid',
          //     })
          //   }
          // })
          
          wx.getUserInfo({
            success: function(res) {
              // console.log(res.userInfo)
              dataset.name = res.userInfo.nickName
       
          // console.log(dataset)
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
            url: 'https://api.ltzhou.com/user/vip/get?userID='+res.data.userID,
            method:'POST',
            success(res){if(res.data){
              var viplist=res.data.viplist.split(",")
              for(var i = 0;i<viplist.length;i++){
                if(viplist[i]==''||viplist[i]==null||typeof(viplist[i])==undefined){
                  viplist.splice(i,1);
                    i=i-1;
                }
              }
              console.log(viplist)              
              if(viplist.length>0){
                var vip=new Array()
                var v=new Object()
                v.value="h"  
                v.name="哈罗单车"
                v.checked=true
                vip.push(v)
                wx.setStorage({
                  data: vip,
                  key: 'vip',
                })
              }
              else{
                var vip=new Array()
                var v=new Object()
                v.value="h"  
                v.name="哈罗单车"
                v.checked=false
                vip.push(v)
                wx.setStorage({
                  data: vip, 
                  key: 'vip',
                })           
              }
            }}
          })  


          wx.request({
            // url: 'https://api.ltzhou.com/user/history/get?userID='+res.data.userID,
            url: 'https://api.ltzhou.com/user/history/get?userID=292',
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
  
  
          }
          })
        
        
        },
     
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
    //最后，记得返回刚才的页面
    
    this.onShow();
   },
  onShow: function() {
    var that=this
    // 查看是否授权
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          that.setData({"haveid":1})
          
        }
        else{
          var dataset = {}
   
        }
      }
    })
  },
})
