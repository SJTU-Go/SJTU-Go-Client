//index.js
const app = getApp()
const db = wx.cloud.database()
var util = require("../../utils/util.js")
const formatDate = dateTime => {
  const date = new Date(dateTime);
  return `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};


Page({
 
  /**
   * 页面的初始数据
   * selectWeek 0代表的本周  1代表下一周  -1代表上一周   
   * timeBean 传递给组件的数据，数据的格式在一开始的工具类中明确
   */
  data: {
    
    disnotice:0,
    openid:'',
    repeat:1,
    empty:1,
    currentday:0,
    selectWeek:0,
    timeBean:{},
    depart:'',
    departid:'',
    departShow:'',
    arrive:'',
    arriveid:'',
    arriveShow:'',
    mHidden: true,
    selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectShow2: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['6时','7时','8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时','23时'],//下拉列表的数据
    selectData2: ['00','05','10','15','20','25','30','35','40','45','50','55'],
    showlist:new Array(),
    index: 0,//选择的下拉列表下标
    index2: 0,//选择的下拉列表下标  
    schedulename:'', 
    place:'',
    currentschedule:new Array(),
  },
 
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that =this

    wx.getStorage({
      key: 'storedschedule',
      success: function(res){   
        console.log(that.data)    
        that.setData({        
          currentschedule:res.data,
        })
        if(that.data. currentschedule.length==0){
          that.setData({
            status:false
          });
        }else{
          that.setData({
            status:true
          })
        }
        var currentdayy =  that.data.currentday ;
        console.log(currentdayy)
        console.log(that.data)
        var empty = that.data.currentschedule.every(function(value, index, array){
          return value.selectDay != currentdayy;
        })
        console.log(empty)
        that.setData({empty:empty})
        var showlist = that.data.currentschedule.filter(e=>e.selectDay == currentdayy)
        that.setData({showlist: showlist})
        console.log(that.data.showlist)
      },
      fail: function(res) {
        console.log(res+'aaaaa')
      }
    })
  },

  onShow: function (options) {
    var that =this

    wx.getStorage({
      key: 'storedschedule',
      success: function(res){   
        console.log(that.data)    
        that.setData({        
          currentschedule:res.data,
        })
        if(that.data. currentschedule.length==0){
          that.setData({
            status:false
          });
        }else{
          that.setData({
            status:true
          })
        }
        var currentdayy =  that.data.currentday ;
        console.log(currentdayy)
        console.log(that.data.timeBean)
        var empty = that.data.currentschedule.every(function(value, index, array){
          return value.selectDay != currentdayy;
        })
        console.log(empty)
        that.setData({empty:empty})
        var showlist = that.data.currentschedule.filter(e=>e.selectDay == currentdayy)
        that.setData({showlist: showlist})
        console.log(that.data.showlist)
        var showw=that.data.showlist
        for(var index=0;index<showw.length;++index){
          var month = Number(showw[index].yearMonth.substring(5))
          var year = Number(showw[index].yearMonth.substring(0,4))
          var minutes = Number(showw[index].timeminute)
          var d = new Date(year, month, showw[index].selectDay, showw[index].timehour, minutes, 0, 0);
          if(d <= new Date().getTime()){
            console.log("outdate")
            showw[index].outdate=true
          }
          else(console.log("not outdate"))
        }
        that.setData({showlist:showw})
      },
      fail: function(res) {
        console.log(res+'aaaaa')
      }
    })
  },


  searchPage:function(e)
  {var that=this
    console.log(e)
    console.log(this.data)
    var index = e.currentTarget.dataset.index
    var hour = ''
    if ( that.data.showlist[index].timehour < 10 ){
      hour = '0' + String(that.data.showlist[index].timehour)
    }
    else {
      hour = String(that.data.showlist[index].timehour)
    }
    var day = ''
    if ( that.data.showlist[index].selectDay < 10 ){
      day = '0' + String(that.data.showlist[index].selectDay)
    }
    else {
      day = String(that.data.showlist[index].selectDay)
    }
    var month = that.data.showlist[index].yearMonth.substring(5)
    var yearm = that.data.showlist[index].yearMonth.replace("-","/") 
    if (Number(month)<10){
      yearm = yearm.replace('/',"/0") 
    } 
    var starttime = yearm +'/'+ day +' '+ hour +':'+that.data.showlist[index].timeminute + ':00'
    console.log(starttime)
     wx.setStorage({
    data:'',
    key: 'arrive',
  })  
  wx.setStorage({
    data:starttime,
    key: 'startT',
  })  
  wx.setStorage({
    data:'',
    key: 'pass',
  })  
  wx.setStorage({
    data:'',
    key: 'depart',
  })  
    wx.navigateTo({
    url: '../searcha/searcha?arrive='+JSON.stringify(that.data.showlist[index].arrive)+'&arriveShow='+JSON.stringify(that.data.showlist[index].arriveShow)+'&depart='+JSON.stringify(that.data.showlist[index].depart)+'&departShow='+JSON.stringify(that.data.showlist[index].departShow)+'&startTime='+starttime,
  })
  },
  addschedule:function(){
  this.setData({mHidden:false})
  },


  notice:function(e){
    var that=this
    console.log(e)
    var index=e.currentTarget.dataset.index

    var hour = ''
    if ( that.data.showlist[index].timehour < 10 ){
      hour = '0' + String(that.data.showlist[index].timehour)
    }
    else {
      hour = String(that.data.showlist[index].timehour)
    }
    var day = ''
    if ( that.data.showlist[index].selectDay < 10 ){
      day = '0' + String(that.data.showlist[index].selectDay)
    }
    else {
      day = String(that.data.showlist[index].selectDay)
    }
    var month = that.data.showlist[index].yearMonth.substring(5)
    var yearm = that.data.showlist[index].yearMonth.replace("-","/") 
    if (Number(month)<10){
      yearm = yearm.replace('/',"/0") 
    } 
    var starttime = yearm +'/'+ day +' '+ hour +':'+that.data.showlist[index].timeminute + ':00'
    var jumpurl = 'pages/searcha/searcha?arrive='+JSON.stringify(that.data.showlist[index].arrive)+'&arriveShow='+JSON.stringify(that.data.showlist[index].arriveShow)+'&depart='+JSON.stringify(that.data.showlist[index].depart)+'&departShow='+JSON.stringify(that.data.showlist[index].departShow)+'&startTime='+starttime
    var showw=that.data.showlist
    showw[index].disnotice=true
    var name = showw[index].schedulename
    var arrive = showw[index].arriveShow
    var depart = showw[index].departShow
    var month = Number(showw[index].yearMonth.substring(5))-1
    var year = Number(showw[index].yearMonth.substring(0,4))
    var minutes = Number(showw[index].timeminute)
    var d = new Date(year, month, showw[index].selectDay, showw[index].timehour, minutes, 0, 0);
    var time = showw[index].yearMonth+'-'+String(showw[index].selectDay)+' '+String(showw[index].timehour)+':'+showw[index].timeminute
    var hour = String(showw[index].timehour)
    if (showw[index].timehour < 10){
      hour = '0'+hour
    }
    var daytime = showw[index].yearMonth.replace("-","年") +'月'+String(showw[index].selectDay)+'日 '+ hour +':'+showw[index].timeminute    
    that.setData({showlist:showw})
    console.log(that.data)
    console.log(month,year,minutes,time,daytime,d)
    var subscribeList = [
      {
        
        startTime: d,
        title: name,
        arrivePlace: arrive,
        description: '起点：'+depart,
      },
    ].map(mes => ({
      ...mes,
      startTimeString: formatDate(mes.startTime),
    }));
    var item = subscribeList[0]
      var c=that.data.currentschedule
      var t=0
      for(var ii=0;ii<=c.length;++ii){
        if (c[ii].selectDay==this.data.currentday){t+=1}
        if(t==index+1){
          c[ii].disnotice=true
          that.setData({currentschedule:c})
          wx.setStorage({
            data: c,
            key: 'storedschedule',
          })          
          var ress = c;
          var postitem = {}
          var posti={}
          posti.schedule=ress
          postitem.schedule = posti
          wx.getStorage({
            key: 'userID',
       success(res11){
         postitem.userID = res11.data
         console.log(postitem)
         wx.request({      
          url: 'https://api.ltzhou.com/user/updateScheduleInfo',   
          method:"POST",  
          data:postitem,   
          success(res){console.log(res)}     
        }) 
        }
        })
          break
        }
      }
     
      wx.requestSubscribeMessage({
        tmplIds: ['r8jfie6yErUPKU1Kn0Ing0msxlcjMSJ9bHzPt1hPwDg'],
        success (res) {console.log(1) 
          wx.request({
            url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxde82431f805562ef&secret=40fb5700a5742cdf2d744ef87df8da98',
            method:'GET',
            header: {
              'content-type': 'application/json'
            },
          
          success (res1){
          
          console.log(res1)
          var a_token=res1.data.access_token

          if (res.errMsg === 'requestSubscribeMessage:ok') {

            db.collection('messages').add({

              data: {
                ...item,
                data: {
                  thing1: {value: item.title},
                  time2: {value: daytime},
                  thing5: {value: item.arrivePlace},
                  thing6: {value: item.description},
                },
                templateId: "r8jfie6yErUPKU1Kn0Ing0msxlcjMSJ9bHzPt1hPwDg",
                access_token: a_token,
                page:jumpurl,
                done:false
              },
              success: function(res) {

                console.log(res)
              }
            })
          }              
          }          
          })
        },
        fail (res) {console.log(res) }
      })

    
    },


  modalcancelled:function(){
    this.setData({mHidden:true})
    },
  changeModal:function(event){
    var that= this
    console.log(that.data)
    if (!this.data.depart|!this.data.arrive|!this.data.arrive|!this.data.repeat|!this.data.schedulename){
      wx.showToast({ 
        title: '输入错误', 
        icon: 'loading', 
        duration: 2000 
      })
    }
    else
    {
    for (var ii=0;ii<this.data.repeat;++ii) {
    var selectWeek = ii;
    var timeBean = util.getWeekDayList(selectWeek)
    var result = {
        yearMonth:timeBean.yearMonth,
        selectDay:timeBean.weekDayList[parseInt(this.data.timeBean.selectDay)].day,
        timehour:this.data.index+6,
        timeminute:this.data.selectData2[this.data.index2],
        schedulename:this.data.schedulename,
        depart:this.data.depart,
        departShow:this.data.departShow,
        arrive:this.data.arrive,
        arriveShow:this.data.arriveShow};
    var ress = this.data.currentschedule;
    this.setData({mHidden:true});
    ress.push(result);
    var postitem = {}
    var posti={}
    posti.schedule=ress
    postitem.schedule = posti
    var showw=ress
    for(var index=0;index<showw.length;++index){
      var month = Number(showw[index].yearMonth.substring(5))
      var year = Number(showw[index].yearMonth.substring(0,4))
      var minutes = Number(showw[index].timeminute)
      var d = new Date(year, month-1, showw[index].selectDay, showw[index].timehour, minutes, 0, 0);
      var dd =new Date().getTime()
      console.log(year, month-1, showw[index].selectDay, showw[index].timehour, minutes,d,formatDate(dd))

      if(d <= dd){
        console.log("outdate")
        showw[index].outdate=true
      }
      else(console.log("not outdate"))
    }
    that.setData({showlist:showw})
    wx.setStorage({ key:'storedschedule',
    data:ress,

  success(res){
    wx.getStorage({
      key: 'userID',
 success(res1){
   postitem.userID = res1.data
   console.log(postitem)
   wx.request({

    url: 'https://api.ltzhou.com/user/updateScheduleInfo',

    method:"POST",

    data:postitem,

    success(res){console.log(res)}

  })  
  
  
  }
  
  
  })
  }
  })
  }
this.onShow()

}
    },
  /**
   * 点击了上一周，选择周数字减一，然后直接调用工具类中一个方法获取到数据
   */
  scheduleNameInput:function(e)
  {    this.setData({schedulename:e.detail.value})

  },
  placeInput:function(e)
  {    this.setData({place:e.detail.value})

  },
  scheduleRepeatInput:function(e)
  {    this.setData({repeat:e.detail.value})

  },
  lastWeek:function(e){   
    var selectWeek = --this.data.selectWeek;
    var timeBean = this.data.timeBean
    timeBean = util.getWeekDayList(selectWeek)
 
    if (selectWeek != 0) {
      timeBean.selectDay = 0;
    }
 
    this.setData({
      timeBean,
      selectWeek
    })
    this.setData({currentday:this.data.timeBean.weekDayList[parseInt(this.data.timeBean.selectDay)].day,})
    var currentdayy =  this.data.currentday ;
    var empty = this.data.currentschedule.every(function(value, index, array){
      return value.selectDay != currentdayy;})
    this.setData({empty:empty})
    var showlist = this.data.currentschedule.filter(e=>e.selectDay == currentdayy)
    this.setData({showlist: showlist})
    console.log(this.data.showlist)
  },
 
  /**
   * 点击了下一周，选择周数字加一，然后直接调用工具类中一个方法获取到数据
   */
  depart:function(e){
    var that=this
    wx.navigateTo({
      url: '../extendsearch/depart/depart',
    })
    wx.getStorage({
      key: 'depart',
    success:function(res){
      that.setData({depart:res.data.name,departid : 'DT'+res.data.id})

    
    } })
  },
  arrive:function(e){
    var that=this
    wx.navigateTo({
      url: '../extendsearch/arrive/arrive',
    })
    wx.getStorage({
      key: 'arrive',
    success:function(res){
      console.log(res.data)
      if(res.data.id){
        if(res.data.id[0]=='P' && res.data.id[1]=='K'){that.setData({arrive:res.data.name,place:res.data.name,arriveid :res.data.id})}
        else{that.setData({arrive:res.data.name,place:res.data.name,arriveid :'DT'+res.data.id})}}
    
      else{that.setData({arrive:res.data.name,place:res.data.name,arriveid :res.data.name})}
      console.log(this.data)
    }

    
    })
  },
  nextWeek:function(e){
    var selectWeek = ++this.data.selectWeek;
    var timeBean = this.data.timeBean
    timeBean = util.getWeekDayList(selectWeek)
 
    if (selectWeek != 0){
      timeBean.selectDay = 0;
    }
 
    this.setData({
      timeBean,
      selectWeek
    })
    this.setData({currentday:this.data.timeBean.weekDayList[parseInt(this.data.timeBean.selectDay)].day,})
    var currentdayy =  this.data.currentday ;
    var empty = this.data.currentschedule.every(function(value, index, array){
      return value.selectDay != currentdayy;})
    this.setData({empty:empty})
    var showlist = this.data.currentschedule.filter(e=>e.selectDay == currentdayy)
    this.setData({showlist: showlist})
    console.log(this.data.showlist)
  },
 
  /**
   * 选中了某一日，改变selectDay为选中日
   */ 
  dayClick:function(e){
    var that=this
    var timeBean = this.data.timeBean
    timeBean.selectDay = e.detail;
    console.log(e)
    this.setData({
      timeBean,
    })
    console.log(this.data)
    this.setData({currentday:this.data.timeBean.weekDayList[parseInt(this.data.timeBean.selectDay)].day,})
    var currentdayy =  this.data.currentday ;
    var empty = this.data.currentschedule.every(function(value, index, array){
      return value.selectDay != currentdayy;})
    this.setData({empty:empty})
    var showlist = this.data.currentschedule.filter(e=>e.selectDay == currentdayy)
    this.setData({showlist: showlist})
    console.log(this.data.showlist)
    var showw=that.data.showlist
        for(var index=0;index<showw.length;++index){
          var month = Number(showw[index].yearMonth.substring(5))
          var year = Number(showw[index].yearMonth.substring(0,4))
          var minutes = Number(showw[index].timeminute)
          var d = new Date(year, month-1, showw[index].selectDay, showw[index].timehour, minutes, 0, 0);
          var dd =new Date().getTime()
          console.log(year, month-1, showw[index].selectDay, showw[index].timehour, minutes,d,formatDate(dd))

          if(d <= dd){
            console.log("outdate")
            showw[index].outdate=true
          }
          else(console.log("not outdate"))
        }
        that.setData({showlist:showw})
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      timeBean: util.getWeekDayList(this.data.selectWeek)
    })
    this.setData({currentday:this.data.timeBean.weekDayList[parseInt(this.data.timeBean.selectDay)].day,})
  },
  selectTap() {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  selectTap2() {
    this.setData({
      selectShow2: !this.data.selectShow2
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      selectShow: !this.data.selectShow
    });
  },
  optionTap2(e) {
    let Index2 = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index2: Index2,
      selectShow2: !this.data.selectShow2
    });
  }
 
})
