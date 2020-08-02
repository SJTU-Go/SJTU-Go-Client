// miniprogram/pages/vipPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {value: 'h', name: '哈罗单车'}
    ],
    userID:0
  },
  checkboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)

    var items = this.data.items
    var values = e.detail.value
    var vl = new Array()
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].checked = true
          vl.push(items[i].name)
          break
        }
      }
    }


    this.setData({
      items:items
    })
    wx.setStorage({
      data: items,
      key: 'vip',
    })
    console.log(vl)
    var vipl = ''
    for(var i in vl){vipl = vipl+vl[i]+","}
    wx.request({
      url: 'https://api.ltzhou.com/user/vip/add',
      data:{
        viplist: vipl,
        userID: this.data.userID
      },
      method:"POST",
      success(res){console.log(res.data)}
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
var that=this
wx.getStorage({
  key: 'vip',
  success(res){
    console.log(res)
    that.setData({items:res.data})
  }
})
wx.getStorage({
  key: 'userID',
  success(res){
    console.log(res)
    that.setData({userID:res.data})
  }
})
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