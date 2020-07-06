//index.js
const app = getApp()

Page({
  preferenceNavigate:function()
  {wx.navigateTo({url: '../preferencePage/preferencePage', })},
  scheduleNavigate:function()
  {wx.navigateTo({url: '../schedulePage/schedulePage', })},
  historyNavigate:function()
  {wx.navigateTo({url: '../HistoryPage/HistoryPage', })},
  accessLocationNavigate:function()
  {wx.navigateTo({
    url: '../accessLocationPage/accessLocationPage',
  })}
})
