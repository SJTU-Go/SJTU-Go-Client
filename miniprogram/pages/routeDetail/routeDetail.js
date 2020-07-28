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
    
    var that=this  
    that.setData({
      depart:curStrategy.depart,
      arrive:curStrategy.arrive,
      pass:curStrategy.pass,
    })
    var app = getApp()
    this.setData({
      polyline:app._makeRouteList(curStrategy.routeplan)
    })
    this.setData({
      lon:curStrategy.routeplan[0].routePath.coordinates[0][0],
      lat:curStrategy.routeplan[0].routePath.coordinates[0][1]
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

  },

  startTrip: function() {
    var userID = '0';
    var app = getApp();
    var that = this;
    wx.getStorageSync({
      key: 'userID',
      success (res) {
        userID = res
      }
    })
    wx.request({
      url: 'https://api.ltzhou.com/trip/start',
      method:"POST",
      data:{
        "strategy": that.data.strategy,
        "userID": userID,
      },
      success(res){
        var tripID = res;
        app.onLocateTrip(tripID, that.data.routeplan)
        // 开始后台记录行程
        wx.showToast({
          title: '行程已开始记录',
          icon: 'none',
          duration: 3000,
          success: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 10,
                complete: (res) => {},
              })}, 2000);
          }
        })
      }
    })



  },


})