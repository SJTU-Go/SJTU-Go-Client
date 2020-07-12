//index.js
const app = getApp()
var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({

  data:{
    date: '2020-07-12',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2020,
    endYear: 2050,
    settim:false,
    totop:65,
    height:350,
    checkInfo: [
      {name: 'jam',value: '避开拥堵'},
      {name: 'tim',value: '设置出发时间'}
    ],
    avoidjam : false,
    step :0,
    car:{},
    bus:{},
    walk:{},
    pass:'',
    passid:'',
    depart:'',
    departid:'',
    arrive:'',
    arriveid:'',
    index:['walk','bus'],
    value : new Array(),
    method:["步行","校园巴士","共享单车","旋风E100"],
    preference:[],
    preferencelist: new Array(),
    searchtxt:'',
    datares: new Array(),
    passnum:0
  }  ,
    onLoad:function(options){
      var that = this
      wx.setStorage({
        data: that.data.checkInfo,
        key: 'checkInfo',
      })
      // 获取完整的年月日 时分秒，以及默认显示的数组
var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
// 精确到分的处理，将数组的秒去掉
obj.dateTimeArray.pop();
 obj.dateTime.pop();
 obj1.dateTimeArray.pop();
 obj1.dateTime.pop();
 that.setData({
  dateTime: obj.dateTime,
  dateTimeArray: obj.dateTimeArray,
  dateTimeArray1: obj1.dateTimeArray,
  dateTime1: obj1.dateTime

});
      wx.getStorage({
        key: 'preference',
      success:function(res){
        that.setData({preference:res.data})

      
      } })
      wx.getStorage({
        key: 'depart',
      success:function(res){
        that.setData({depart:res.data.name,departid : 'DT'+res.data.id})

      
      } })
      wx.getStorage({
        key: 'pass',
      success:function(res){if(res.data.name){that.setData({pass:res.data.name,passid :'DT'+res.data.id})}} })
      wx.getStorage({
        key: 'arrive',
      success:function(res){
        if(res.data.id){
          if(res.data.id[0]=='P' && res.data.id[1]=='K'){that.setData({arrive:res.data.name,arriveid :res.data.id})}
          else{that.setData({arrive:res.data.name,arriveid :'DT'+res.data.id})}}
      
        else{that.setData({arrive:res.data.name,arriveid :res.data.name})}
      
      }

      
      })

},


    pass:function(){
wx.navigateTo({
  url: '../extendsearch/pass/pass',
})
    },
    depart:function(e){
      wx.navigateTo({
        url: '../extendsearch/depart/depart',
      })
    },
    arrive:function(e){
      wx.navigateTo({
        url: '../extendsearch/arrive/arrive',
      })
    },
    indexback: function(e)
    {wx.switchTab({
      url: '../index/index',})
    },
    formSubmit: function (e) {
      var avoidTraffic=this.data.avoidjam
      console.log(avoidTraffic)
      if (!this.data.depart|!this.data.arrive){        wx.showToast({ 
        title: '输入错误', 
        icon: 'loading', 
        duration: 2000 
        }) }
      else
      {
        var depart
          depart=String( this.data.departid)
          if (depart=="DT404"){console.log("404"),depart=this.data.depart}
        var arrive
          arrive=String( this.data.arriveid)
          if (arrive=="DT404"){console.log("404"),arrive=this.data.arrive}
        var pass
          pass=String( this.data.passid)
          if (pass=="DT404"){console.log("404"),pass=this.data.pass}
  
      var arrivename = this.data.arrive
      var departname = this.data.depart
      var passname = this.data.pass
      var passlist=[];
      console.log("传入数据")
        console.log(depart)
        console.log(arrive)
        console.log(pass)
      var that =this;
      var tem;
      var valuetem=new Array();
      var pre = new Array();
      var i;
      var j = 0;
      var preres = new Array();
      if(pass){
        passlist.push(pass)};
      console.log({
        "arrivePlace": arrive,
        "beginPlace": depart,
        "departTime": "2020/05/11 12:05:12",
        "passPlaces": passlist,})
      
        //busrequest
  
      wx.request({
        url: 'https://api.ltzhou.com/navigate/bus',
        method:'POST',
        header: {
        'content-type': 'application/json'
        },
        data:{
        "arrivePlace": arrive,
        "beginPlace": depart,
        "departTime": "2020/05/11 12:05:12",
        "passPlaces": passlist,
        "avoidTraffic":avoidTraffic,
      },
  
        success (res) {
          tem = res.data
          console.log(tem)
          that.setData({bus:tem})
          valuetem.push(tem)
          //walkrequest
          wx.request({
            url: 'https://api.ltzhou.com/navigate/walk',
            method:'POST',
            header: {
            'content-type': 'application/json'},
          data:{
            "arrivePlace": arrive,
            "beginPlace": depart,
            "passPlaces": passlist,
            "avoidTraffic":avoidTraffic,
            },
            success (res) {
              tem = res.data
              console.log(tem)
              valuetem.push(tem)
      wx.request({
        url: 'https://api.ltzhou.com/navigate/bike',
        method:'POST',
        header: {
        'content-type': 'application/json'},
      data:{
        "arrivePlace": arrive,
        "beginPlace": depart,
        "passPlaces": passlist,
        "avoidTraffic":avoidTraffic,
        },
        success (res) {
          tem = res.data
          console.log(tem)
          valuetem.push(tem)
          // 旋风100
          wx.request({
            url: 'https://api.ltzhou.com/navigate/car',
            method:'POST',
            header: {
            'content-type': 'application/json'},
          data:{
            "arrivePlace": arrive,
            "beginPlace": depart,
            "passPlaces": passlist,
            "avoidTraffic":avoidTraffic,
            },
            success (res) {
              tem = res.data
              console.log(tem)
              valuetem.push(tem)
          that.setData({value:valuetem})
          console.log(that.data.value)
          console.log("1")
          for(j=0;j<that.data.preference.length;j++){
            for (i=0;i<that.data.value.length;i++){
              if(that.data.value[i].type==that.data.preference[j]){pre.push(i)}}}
          for (i=0;i<pre.length;i++){preres.push(that.data.value[pre[i]])}
          console.log(preres)
          var ressss = new Array()
          ressss.push(preres)
          ressss.push(valuetem)
          ressss.push(that.data.bus.routeplan)
          ressss.push(departname)
          ressss.push(passname)
          ressss.push(arrivename)
  
  
          that.setData({datares:ressss})
          console.log("coming resuuuu")
          console.log(that.data.datares)
  
          wx.navigateTo({
            url: '../searcha/searcha?RT='+JSON.stringify(that.data.datares),
            //success:function(res){that.setData({step:0})}
          
          },
  
            )
  
        }})
        
        
        }
      })        
  
  
         
  
            }}
              )             
    }})}
  
  },
  navigatePage:function()
  {    this.setData({step:1})
  },
  searchInput:function(e)
  {    app.globalData.search =e.detail.value
    
  },
  search:function()
  {    
  },
  changeDateTime(e){
    var that=this
    this.setData({ dateTime: e.detail.value });
    console.log(this.data)
    console.log(1+1)
    var startTime=this.data.dateTimeArray[0][this.data.dateTime[0]]+'/'+that.data.dateTimeArray[1][that.data.dateTime[1]]+'/'+that.data.dateTimeArray[2][that.data.dateTime[2]]+' '+that.data.dateTimeArray[3][that.data.dateTime[3]]+':'+that.data.dateTimeArray[4][that.data.dateTime[4]]
    console.log(startTime)
    wx.setStorage({
      data: that.data.dateTime,
      key: 'dateTime',
    })
  },
  changeDateTimeColumn(e){
    var that=this
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray: dateArr,
      
    });
    wx.setStorage({
      data: this.data.dateTimeArray,
      key: 'dateTimeArray',
    })
    console.log(this.data)
    console.log(1+1000)
  },
  addpass:function()
  {this.setData({passnum:this.data.passnum+1})
  this.setData({height:this.data.height+120})
  this.setData({totop:this.data.totop+60})
  },
deletepass:function(){this.setData({passnum:this.data.passnum-1})
this.setData({height:this.data.height-120})
this.setData({totop:this.data.totop-60})},
checkboxChange: function(e) {
  var that=this
  console.log(e)
  console.log(e.detail.value.length)
  var jamm=0
  var timm=0
  for (var i =0;i< e.detail.value.length;++i){
  //console.log(this.data.avoidjam)
  if(e.detail.value[i]=='jam')
  {console.log("jamming") 
  jamm+=1
    }
    else if (e.detail.value[i]=='tim'){console.log("tim") 
    timm+=1
      }
   
    }
    if (jamm==0){this.setData({avoidjam:false})
    var cc=that.data.checkInfo
    cc[0].checked=false
    this.setData({checkInfo:cc})}
    else{this.setData({avoidjam:true})
    var cc=that.data.checkInfo
    cc[0].checked=true
    this.setData({checkInfo:cc})}
    if (timm==0){this.setData({settim:false})
    var cc=that.data.checkInfo
    cc[1].checked=false
    this.setData({checkInfo:cc})}
    else{this.setData({settim:true})
    var cc=that.data.checkInfo
    cc[1].checked=true
    this.setData({checkInfo:cc})}
    wx.setStorage({
      data: that.data.checkInfo,
      key: 'checkInfo',
    })
    wx.setStorage({
      data: that.data.settim,
      key: 'settim',
    })
    wx.setStorage({
      data: that.data.avoidjam,
      key: 'avoidjam',
    })
     // console.log(this.data.avoidjam)
}

})
