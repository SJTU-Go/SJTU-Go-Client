//index.js
const app = getApp()
var util = require("../../utils/util.js")
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
    arrive:'',
    arriveid:'',
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
  onShow: function (options) {
    var that =this
    /*wx.getStorage({
      key: 'openid',
      success:function(res){
        that.setData({
        
          openid:res.data,
        })
      }
    })*/
    wx.getStorage({
      key: 'storedschedule',
      success: function(res){
       
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
      },
      fail: function(res) {
      console.log(res+'aaaaa')
      }
      })
      

  },
  searchPage:function(e)
  {var that=this
    console.log(e)
    var index=e.currentTarget.dataset.index
     wx.setStorage({
    data:{name:this.data.showlist[index].place,
        
    },
    key: 'arrive',
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
    url: '../searchindex/searchindex',
  })
  },
  addschedule:function(){
  this.setData({mHidden:false})
  },
  notice:function(e){
    var that=this
    console.log(e)
    var index=e.currentTarget.dataset.index
    var showw=that.data.showlist
    showw[index].disnotice=true
    that.setData({showlist:showw})
    console.log(that.data)
    
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
          
          break
        }
      }
     
      wx.requestSubscribeMessage({
        tmplIds: ['r8jfie6yErUPKU1Kn0Ing0msxlcjMSJ9bHzPt1hPwDg'],
        success (res) {console.log(1) },
        fail (res) {console.log(res) }
      })
      
      var u="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxde82431f805562ef&secret=APPSECRET"
wx.request({
  url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxde82431f805562ef&secret=40fb5700a5742cdf2d744ef87df8da98',
method:'GET',
header: {
'content-type': 'application/json'
},
//data:{
//id:that.data.cuFeedback.tripID
//},

success (res1){

console.log(res1)
var ll=res1.data.access_token
var pp=that.data.showlist[index].place
wx.setStorage({
  data:{name:pp,
      
  },
  key: 'arrive',
})  
wx.setStorage({
  data:'',
  key: 'pass',
})  
wx.setStorage({
  data:'',
  key: 'depart',
})
var op='oOABA5YiEomr3PO01DRjvqZUXnWY'
wx.request({
  url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token='+ll,
  method:"POST",
  touser: op,
template_id: 'r8jfie6yErUPKU1Kn0Ing0msxlcjMSJ9bHzPt1hPwDg',
page: "pages/searchindex/searchindex",
miniprogram_state:"developer",
lang:"zh_CN",
data: {
"thing1": {
  "value": "测试"
},
"time2": {
  "value": "2015年01月05日 15:01"
},
"thing5": {
  "value": "东上院"
} ,
"thing6": {
  "value": "一个测试~~~"
}
},
  
  success(res){console.log(res)}
})


}

})
    
    },
  modalcancelled:function(){
    this.setData({mHidden:true})
    },
  changeModal:function(event){
    for (var ii=0;ii<this.data.repeat;++ii) {
    var selectWeek = ii;
    var timeBean = util.getWeekDayList(selectWeek)
    var result = {
        yearMonth:timeBean.yearMonth,
        selectDay:timeBean.weekDayList[parseInt(this.data.timeBean.selectDay)].day,
        timehour:this.data.index+6,
        timeminute:this.data.selectData2[this.data.index2],
        schedulename:this.data.schedulename,
        place:this.data.arrive};
    var ress = this.data.currentschedule;
    this.setData({mHidden:true});
    ress.push(result);
    var postitem = {}
    var posti={}
    posti.schedule=ress
    postitem.schedule = posti
  
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
      if(res.data.id){
        if(res.data.id[0]=='P' && res.data.id[1]=='K'){that.setData({arrive:res.data.name,place:res.data.name,arriveid :res.data.id})}
        else{that.setData({arrive:res.data.name,place:res.data.name,arriveid :'DT'+res.data.id})}}
    
      else{that.setData({arrive:res.data.name,place:res.data.name,arriveid :res.data.name})}
    
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
    var timeBean = this.data.timeBean
    timeBean.selectDay = e.detail;
    this.setData({
      timeBean,
    })
    console.log(this.data.timeBean)
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
