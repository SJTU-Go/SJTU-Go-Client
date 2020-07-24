// miniprogram/pages/routeDetail/routeDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idx:0,
    strategy:null,
    lat:0,
    lon:0,
    routeplan:[],
    polyline:[],
    time:0,
    depart:'',
    arrive:'',
    pass:'',
    storage:'',
    extendType:["共享单车","旋风E100"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      idx:options.idx,
    })
    var pages = getCurrentPages()
    var prevPage = pages[pages.length-2]
    var curStrategy = prevPage.data.strategies[this.data.idx]
    this.setData({
      strategy:curStrategy
    })
    this.setData({
      routeplan: curStrategy.routeplan,
      time: curStrategy.travelTime,
    })
    var polyline = [];
    var d = curStrategy.routeplan;
    for(var j=0;j<d.length;j++){
      var line = {};
      var points = [];
      var item = d[j];
      for(var i of item.routePath.coordinates){
        this.setData({lon:i[0],lat:i[1]})
        var cor = {};
        cor['longitude']=i[0];
        cor['latitude']=i[1];
        points.push(cor);
      }
      if(item.type=="HELLOBIKE"){
        line['color']='#0099FF';
      }
      if(item.type=="FIND"){
        line['color']='#FFCC33';
      }
      else{line['color']='#00CC33'}
      line['points']=points;
      //line['color']='#808080';
      line['width']=4;
      //line['dottedLine']=true;
      //console.log(line);
      polyline.push(line);
    }
    //console.log(polyline)
    this.setData({
      polyline:polyline
    })
    var that=this  
    that.setData({
      depart:curStrategy.depart,
      arrive:curStrategy.arrive,
      pass:curStrategy.pass,
    })

    that.setData({
      isExtendType:this.data.extendType.includes(this.data.strategy.type)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})