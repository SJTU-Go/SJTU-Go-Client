// components/routeDetail/routeDetail.js

var util = require('../../utils/util.js');

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
    routeplan:[],
    strategy:{},
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
      var now = (new Date()).getTime()
      var timediff = 0
      this.setData({
        routeplan:that.data.routeplan.map(
          plan => {
            var curTime = new Date(now + 1000*timediff);
            plan.time = curTime.getHours() + ":" + (curTime.getMinutes() < 10 ? "0"+curTime.getMinutes() : curTime.getMinutes())
            timediff += plan.routeTime;
            return plan
          }
        ),
        strategy:that.data.strategy
      })
    }
  }
})
