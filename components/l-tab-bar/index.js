// components/tabbar/tabbar.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  options: {
    virtualHost: true
  },
  lifetimes: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    value: 'label_1',
    list: [{
        value: 'pages/index/index',
        icon: 'home',
        ariaLabel: '首页'
      },
      {
        value: 'label_2',
        icon: 'control-platform',
        ariaLabel: '工具箱'
      },
      {
        value: 'pages/user/user',
        icon: 'user',
        ariaLabel: '我的'
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e) {
      const {
        value
      } = e.detail

      // this.setData({
      //   value: value
      // })
      wx.switchTab({
        url: "/" + value,
      })
    }
  }
})