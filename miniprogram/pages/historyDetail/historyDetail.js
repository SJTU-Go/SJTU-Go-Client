Page({
  data: {
    polyline:[],
    routeplan:[]
  },

  onLoad: function (options) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    var index =options.index
    var app = getApp()
    this.setData({
      routeplan: prevPage.data.orderList[index].strategy.routeplan,
      polyline: app._makeRouteList(prevPage.data.orderList[index].strategy.routeplan),
      strategy: prevPage.data.orderList[index].strategy
    })
  },

  formSubmit:function(e){
    wx.showToast({
       title: '评论提交成功',
       icon: 'success',
       duration: 2000,
       success: function () {
       setTimeout(function () {
       wx.navigateTo({
       url: '../HistoryPage/HistoryPage',
       })
       }, 2000);
       }
      })
  },

  //显示弹框
  showModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  //隐藏弹框
  hideModal: function () {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
})
