// miniprogram/pages/accessLocationPage/accessLocationPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    radioItems: [
      {name: '不允许', value: '0', checked: true},
      {name: '仅在小程序使用期间（不推荐）', value: '1'},
      {name: '允许后台运行', value: '2'},
    ],
    rules: [{
      name: 'radio',
      rules: {required: true, message: '单选列表是必选项'},
    }],
    formData: {
    }
  },

  radioChange: function(e){
      console.log(e.detail.value)
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