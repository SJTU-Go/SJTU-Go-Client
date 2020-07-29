//index.js
const app = getApp()
var dateTimePicker = require('../../utils/dateTimePicker.js');
Page({
  data:{
    /** 本页面可获取的配置信息 */
    date: '2020-07-12',
    time: '12:00',
    startT:'2020/05/11 12:05:12',
    dateTimeArray: null,
    dateTime: null,
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
    
    /** 可传参 */
    depart:null, // 将放入request的内容
    departShow:null, // 显示的内容
    arrive:null,
    arriveShow:null,
    currentData:0,


    passnum:0,
    pass:new Array(),
    passShow:new Array(),

    /** 从用户个人设置(localStorage)中获取的信息 */
    preference:["步行","校园巴士","共享单车","旋风E100"], // 用户偏好，若为空则默认
    choices:["walk","bus","car","bike"], // 所有可用API接口的二级地址


    /** 查询请求与返回的结果信息，更新strategyLength数组可使页面刷新 */
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

    console.log(options)
    var that = this 
    wx.setStorage({
      data: false,
      key: 'settime',
    })
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    obj.dateTimeArray.pop();
    obj.dateTime.pop();
    that.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
    });
    
    if (options.depart && options.departShow){
      this.setData({
        depart:options.depart,
        departShow:options.departShow
      })
    }
    if (options.arrive && options.arriveShow){
      this.setData({
        arrive:options.arrive,
        arriveShow:options.arriveShow
      })
    }
    wx.getStorage({
      key: 'preference',
      success:function(res){
        that.setData({preference:res.data})
    }})
    console.log(this.data.strategyLength)
    console.log(this.data.currentData==0)
    if (this._updateRequestBody()){
      //console.log(this.data)
      this.doSearch(
        function(){
          that.setData({currentData: 0});
          that._filterByPreference();
          that._sortByPreference() // 默认情况下标签亮在偏好排序
        })
    }
    // 调试用：
   
  },

  
  checkboxChange: function(e) {
    var that=this
    // console.log(e)
    // console.log(e.detail.value.length)
    var jamm=0
    var timm=0
    for (var i =0;i< e.detail.value.length;++i){
    //console.log(this.data.avoidjam)
      if(e.detail.value[i]=='jam')
        { jamm+=1 }
      else if (e.detail.value[i]=='tim')
        { timm+=1 }
    }
    if (jamm==0){
      this.setData({avoidjam:false})
      var cc=that.data.checkInfo
      cc[0].checked=false
      this.setData({checkInfo:cc})
    } else {
      this.setData({avoidjam:true})
      var cc=that.data.checkInfo
      cc[0].checked=true
      this.setData({checkInfo:cc})
    }
    if (timm==0){
      this.setData({settim:false})
      var cc=that.data.checkInfo
      cc[1].checked=false
      wx.setStorage({
        data: false,
        key: 'settime',
      })
      this.setData({checkInfo:cc})
    } else {
      this.setData({settim:true})
      var cc=that.data.checkInfo
      cc[1].checked=true
      wx.setStorage({
        data: true,
        key: 'settime',
      })
      this.setData({checkInfo:cc})
    }
      // console.log(this.data.avoidjam)
  },
  changeDateTime(e){
    var that=this
    this.setData({ dateTime: e.detail.value });
    console.log(this.data)
    console.log(1+1)
    var startTime=this.data.dateTimeArray[0][this.data.dateTime[0]]+'/'+that.data.dateTimeArray[1][that.data.dateTime[1]]+'/'+that.data.dateTimeArray[2][that.data.dateTime[2]]+' '+that.data.dateTimeArray[3][that.data.dateTime[3]]+':'+that.data.dateTimeArray[4][that.data.dateTime[4]]
    console.log(startTime)
    that.setData({startT:startTime+':00'})
    wx.setStorage({
      data: startTime+':00',
      key: 'startT',
    })
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


  /** 跳转到地图页，选择地点 */
  pass:function(e){
    wx.navigateTo({
      url: '../extendsearch/pass/pass?passidx='+e.currentTarget.dataset.passidx,
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

  /** 在每次修改完地址、或勾选框option后调用该私有函数更新要post的内容 */
  _updateRequestBody:function(){
    
    if (this.data.arrive && this.data.depart){
      console.log('yyyeeesss')
      this.setData({
        "navigateRequest":{
          "arrivePlace": this.data.arrive,
          "beginPlace": this.data.depart,
          "departTime": this.data.startT, /**TODO: 对接时间 */
          "passPlaces": this.data.pass,
          "avoidTraffic": this.data.avoidjam,
      }})
      return true
    } else {
      return false
    }
    
  },



  doSearch:function(callback){
    var strategyList = [];
    const app = getApp();
    var choicecpy = Array.from(this.data.choices)
    var tmpResult = new Array();
    this._recSearch(choicecpy,tmpResult,callback)
  },


  onReady:function(){
    // 页面渲染完成
  },
  
  onHide:function(){
    // 页面隐藏
  },


  formSubmit: function (e) {
    var that = this;
    if (!this.data.depart|!this.data.arrive){
      wx.showToast({ 
        title: '输入错误', 
        icon: 'error', 
        duration: 2000 
      })
    }
    else
    {
      this._updateRequestBody();
      this.doSearch(function(){
        that.setData({currentData: 0});
        that._filterByPreference();
        that._sortByPreference() // TODO 此处应该有排序方式按实际调整
      });
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
  },


  /** 按当前requestBody，以用户preference顺序依次执行查询，将成功结果存入strategies列表，不会重新渲染页面 */
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
        console.log(res)
        if (res.data.type){
          resultList.push(res.data)
        } else {
          console.log("获取"+method+"失败")
        }
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


  /** 对strategies，按照可选项过滤，该私有函数一般在doSearch之后调用，做到过滤出用户支持的选项，修改this.data.strategy，并且渲染显示 */
  _filterByPreference(){
    // TODO 过滤出用户支持的选项
    var that = this
    that.setData({currentData : 0})
    var curResult = this.data.strategies;
    var arr = this.data.strategies;
    for(var j=0;j<arr.length;j++){
      var item = arr[j];
      if(item.type=="校园巴士"){
        wx.setStorage({
          data: item,
          key: 'bus',
        })       
      }
      if(item.type=="步行"){
        wx.setStorage({
          data: item,
          key: 'walk',
        })
      }
      if(item.type=="共享单车"){
        wx.setStorage({
          data: item,
          key: 'bike',
        })
      }
      if(item.type=="旋风E100"){
        wx.setStorage({
          data: item,
          key: 'car',
        })
      }
      }
    var newResult = new Array()
    var pre = that.data.preference
    wx.getStorage({
      key: 'vip',
      success:function(res){
        var flag = (res.data[0].checked)
        for ( var j = 0;j < curResult.length; ++j){
          if ( curResult[j].type == "共享单车"){
            if(flag){
              curResult[j].cost = 0              
            }
            break
          }
        }
        for ( var i = 0; i < pre.length; ++i){
          for ( var j = 0;j < curResult.length; ++j){
            if ( curResult[j].type == pre[i] ){
              newResult.push(curResult[j])
              break
            }
          }
        }
        that.setData({
          strategyLength:[]
        })
        that.setData({
          strategies:newResult,
          strategyLength:Array.from(Array(newResult.length).keys())
        })
      }
    })    
  },


  // TODO封装下列排序私有函数，使得调用私有函数同时，做到切换标签时同时改变标签为蓝色、下划线

  /** 将strategies排序, 重新渲染显示 */
  _sortByPreference(){
  // TODO
    var that = this
    that.setData({currentData : 0})
    var curResult = this.data.strategies;
    var newResult = new Array()
    var pre = that.data.preference
    for ( var i = 0; i < pre.length; ++i){
      for ( var j = 0;j < curResult.length; ++j){
        if ( curResult[j].type == pre[i] ){
          newResult.push(curResult[j])
          break
        }
      }
    }
    that.setData({
      strategyLength:[]
    })
    that.setData({
      strategies:newResult,
      strategyLength:Array.from(Array(newResult.length).keys())
    })
    console.log(that.data)
  },

  _sortByTime(){
    var that = this
    that.setData({currentData : 1})
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
    var that = this
    that.setData({currentData : 2})
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
    var that = this
    that.setData({currentData : 3})
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
 


})

