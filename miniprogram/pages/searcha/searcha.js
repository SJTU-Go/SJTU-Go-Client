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
    pass:'',
    passid:'',
    depart:'',
    departid:'',
    arrive:'',
    arriveid:'',
    currentData : 0,
    value : new Array(),
    walklist:new Array(),
    costlist:new Array(),
    method:["步行","校园巴士","共享单车","旋风E100"],
    preference:["步行","校园巴士","共享单车","旋风E100"],
    preferencelist: new Array(),
    choices:["walk","bus","car","bike"],
    routeplan:new Array(),
    arrive:'',
    pass:'',
    depart:'',
    bus:new Array(),
    walk:new Array(),
    bike:new Array(),
    car : new Array(),
    passnum:0,
    navigateRequest: {
      "arrivePlace": "DT137246",
      "avoidTraffic": false,
      "beginPlace": "DT137251",
      "departTime": "2020/05/11 12:05:12",
      "passPlaces": [
        "学生服务中心"
      ]
    },
    strategies: new Array(),
    strategyLength:new Array(),



    /**
     * 配置文件、图片文件目录
     */
  },
  onLoad:function(options){ 
    var that = this 
    
    wx.getStorage({
      key: 'checkInfo',
      success(res){
        console.log(res)
        that.setData({checkInfo:res.data})
      }
    })  
    wx.getStorage({
      key: 'dateTimeArray',
      success(res){
        console.log(res)
        that.setData({dateTimeArray:res.data})
      }
    }) 
    wx.getStorage({
      key: 'avoidjam',
      success(res){
        console.log(res)
        that.setData({avoidjam:res.data})
      }
    }) 
    wx.getStorage({
      key: 'settim',
      success(res){
        console.log(res)
        that.setData({settim:res.data})
      }
    })
    wx.getStorage({
      key: 'dateTime',
      success(res){
        console.log(res)
        that.setData({dateTime:res.data})
      }
    }) 
    console.log(options)
    // that.setData({
    //   preferencelist: JSON.parse(options.RT)[0],
    //   routeplan:JSON.parse(options.RT)[2],
    // })
    wx.getStorage({
      key: 'preference',
      success:function(res){
        that.setData({preference:res.data})
      }})

      
    /*
    for(var j=0;j<that.data.preferencelist.length;j++){
      var item = that.data.preferencelist[j];
      if(item.type=="校园巴士"){
        that.setData({bus:item})
        console.log(item)
      }
      if(item.type=="步行"){
        that.setData({walk:item})
      }
      if(item.type=="共享单车"){
        that.setData({bike:item})
      }
      if(item.type=="旋风E100"){
        that.setData({car:item})
      }
      }
    var arr = JSON.parse(options.RT)[1]
    var compare = function (obj1, obj2) {
      var val1 = obj1.travelTime;
      var val2 = obj2.travelTime;
      if (val1 < val2) {
          return -1;
      } else if (val1 > val2) {
          return 1;
      } else {
          return 0;
      }            
  } 

  this.setData({value:arr.sort(compare)})


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

    if(res.data.id[0]=='P' && res.data.id[1]=='K'){that.setData({arrive:res.data.name,arriveid :res.data.id})}
    else{that.setData({arrive:res.data.name,arriveid :'DT'+res.data.id})}

}


})
*/

  // this._updateRequestBody(); 
  /**TODO:空值错误处理 */
  var that = this;
  this.doSearch(
    function(){
      that.setData({currentData: 1});
      that._sortByTime();
    });
  },

  
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
  pass:function(){
    console.log("pass")
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

  /** 在每次修改完后调用该私有函数更新要post的内容 */
  _updateRequestBody:function(){
    this.setData({
      "navigateRequest":{
        "arrivePlace": arrive,
        "beginPlace": depart,
        "departTime": "2020/05/11 12:05:12", /**TODO: 对接时间 */
        "passPlaces": passlist,
        "avoidTraffic": avoidTraffic,
    }})
  },

  /** 按当前requestBody，以用户preference顺序依次执行查询，将成功结果存入strategies列表 */
  _recSearch:function(remainList,resultList,callback){
    var that = this;
    // console.log(remainList)
    // console.log(resultList)
    if (remainList.length==0){
      // console.log(remainList)
      that.setData({
        strategies:resultList
      })
      callback();
      return
    }
    var method = remainList.pop()
    wx.request({
      url: 'https://api.ltzhou.com/navigate/'+method,
      data: this.data.navigateRequest,
      method: 'POST',
      success: function(res){
        resultList.push(res.data)
      },
      fail: function(errMsg){
        console.log(errMsg)
        console.log("获取"+method+"失败")
      },
      complete:function(){
        return that._recSearch(remainList,resultList,callback)
      }
    })
  },

  doSearch:function(callback){
    var strategyList = [];
    const app = getApp();
    var choicecpy = Array.from(this.data.choices)
    var tmpResult = new Array();
    this._recSearch(choicecpy,tmpResult,callback)
  },

  /** 对strategies，按照可选项过滤 */
  _filterByPreference(){
    

  },

  /** 将strategies排序 */
  _sortByPreference(){

  },

  _sortByTime(){
    var curResult = this.data.strategies;
    var newResult =
        curResult.sort(function(obj1,obj2) {
        var val1 = obj1.travelTime;
        var val2 = obj2.travelTime;
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    })
    this.setData({
      strategyLength:[]
    })
    this.setData({
      strategies:newResult,
      strategyLength:Array.from(Array(newResult.length).keys())
    })
  },

  _sortByWalk(){
    var curResult = this.data.strategies;
    var newResult =
        curResult.sort(function(obj1,obj2) {
        var val1 = obj1.distance;
        var val2 = obj2.distance;
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    })
    this.setData({
      strategyLength:[]
    })
    this.setData({
      strategies:newResult,
      strategyLength:Array.from(Array(newResult.length).keys())
    })
  },

  _sortByCost(){
    var curResult = this.data.strategies;
    var newResult =
        curResult.sort(function(obj1,obj2) {
        var val1 = obj1.cost;
        var val2 = obj2.cost;
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    })
    this.setData({
      strategyLength:[]
    })
    this.setData({
      strategies:newResult,
      strategyLength:Array.from(Array(newResult.length).keys())
    })
  },


  checkCurrent:function(e){
    const that = this;
 
    if (that.data.currentData === e.target.dataset.current){
        return false;
    }else{
 
      that.setData({
        currentData: e.target.dataset.current
      })
    }

    this.doSearch();
  },
  

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  formSubmit: function (e) {
    var avoidTraffic=this.data.avoidjam
    if (!this.data.depart|!this.data.arrive){
      wx.showToast({ 
        title: '输入错误', 
        icon: 'loading', 
        duration: 2000 
      })
    }
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

    /** 
    var arrivename = this.data.arrive
    var departname = this.data.depart
    var passname = this.data.pass
    var passlist=[]; */
    /** TODO: 填充 */
    // console.log("传入数据")
    // console.log(depart)
    // console.log(arrive)
    // console.log(pass)
    /**
    var navigateRequest = {
      "arrivePlace": arrive,
      "beginPlace": depart,
      "departTime": "2020/05/11 12:05:12",
      "passPlaces": passlist,
      "avoidTraffic": avoidTraffic,
    } */
    
    this._updateRequestBody();
    this.doSearch();
    
    }
  },
  addpass:function(){
    this.setData({passnum:this.data.passnum+1})
    this.setData({height:this.data.height+120})
    this.setData({totop:this.data.totop+60})
  },

  deletepass:function(){
    this.setData({passnum:this.data.passnum-1})
    this.setData({height:this.data.height-120})
    this.setData({totop:this.data.totop-60})
  },
  
  indexback:function(){
    this.setData({step:1})
    wx.switchTab({
      url: '../index/index',})
  }, 
  
  onUnload:function(){
    // 页面关闭
  }

})

