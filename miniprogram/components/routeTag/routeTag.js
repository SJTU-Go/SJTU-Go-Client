// components/routeTag/routeTag.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /** 传入参数 */
    index: {
      type: Number
    },


    /** 以下是返回结果 */
    type: {
      type: String
    },

    depart: {
      type: String,
    },

    arrive: {
      type: String,
    },

    pass: {
      type: Array,
      value: [],
    },

    distance: {
      type: Number,
      value: 0
    },

    preference: {
      type: String
    },

    travelTime: {
      type: Number,
    },

    routePlan: {
      type: Object
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    /**
     * 配置文件、图片文件目录
     */
    strategyTypeToIcon: {
      "步行": "/images/foot.png",
      "校园巴士":  "/images/bus1.png",
      "共享单车": "/images/bike.png",
      "旋风E100": "/images/car.png",
    },

    strategyTypeToCaption: {
      "步行": "walkbutton",
      "校园巴士":  "busbutton",
      "共享单车": "bikebutton",
      "旋风E100": "carbutton",
    }

  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  lifetimes: {
    /**
     * 初始化，传入数据
     */
    attached: function (){
      console.log(this.properties.index)
      var pages = getCurrentPages();
      var curPage = pages[pages.length-1];
      // console.log(curPage.data.navigateRequest)
      var requestResult = curPage.data.strategies[this.properties.index]
      console.log(requestResult)
      this.setData(requestResult);
    }
  }
})
