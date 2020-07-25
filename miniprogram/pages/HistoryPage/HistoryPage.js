//index.js
const app = getApp()
Page({
  data:{
    orderList:[]
  },

  onLoad:function(options){
    var that=this
    // 从localStorage初始化本页面的orderList
    wx.getStorage({
      key: 'historygained',
      success:function(res){
        that.setData({orderList:res.data})
      }
    })
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

