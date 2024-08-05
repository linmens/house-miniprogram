Component({
  properties: {},
  options: {
    virtualHost: true
  },
  data: {
    theme: 'system', // 默认值
    themeStyle: {}
  },

  methods: {
    // 更新全局状态
    setTheme(theme) {
      this.setData({
        theme
      });
      getApp().globalData.theme = theme;
    },
  },

  lifetimes: {
    attached() {
      // 页面加载时，设置全局数据到组件中
      this.setData({
        theme: getApp().globalData.theme,
        themeStyle: getApp().globalData.themeStyle
      });
    },

  }
});