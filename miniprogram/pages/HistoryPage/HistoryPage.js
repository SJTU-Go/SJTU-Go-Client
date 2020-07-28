//index.js
const app = getApp()
Page({
  data:{
    orderList:[],
    statusMap:{
      "STARTED": "进行中",
      "ABORTED": "记录错误",
      "CANCELLED": "已取消",
      "FINISHED": "待评论",
      "COMMENTED": "已完成"
    }
  },

  onLoad:function(options){
    var that=this
    // 从localStorage初始化本页面的orderList
    var userID = wx.getStorageSync('userID')
    wx.request({
      url: 'https://api.ltzhou.com/user/history/get?userID='+userID,
      // url: 'https://api.ltzhou.com/user/history/get?userID=292',
      method:'POST',
      success(res){
        var data = res.data.reverse()
        wx.setStorage({
          key: 'historygained',
          data: data,
        })
        that.setData({orderList:data})
    }})
  },

  makeFeedback:function(e){
    var index=e.currentTarget.dataset.index
    wx.navigateTo({ url: '../feedback/feedback?RT='+index,})
  },

  indexback:function()
{
  wx.switchTab(
    {
  url: '../index/index'}
  )},

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  showRoute:function(e){
    var index=e.currentTarget.dataset.index
    wx.navigateTo({ url: '../historyDetail/historyDetail?index='+index})
  },
})

