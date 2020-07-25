// components/routeDetail/routeDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isHistory: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    routeplan:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  
  lifetimes: {
    ready:function(){
      var pages = getCurrentPages();
      var that = pages[pages.length-1];
      console.log(that.data)
      this.setData({
        routeplan:that.data.routeplan
      })
    }
  }
})
