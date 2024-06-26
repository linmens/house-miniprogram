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
  /**
   * 组件的初始数据
   */
  data: {
    value: 'label_1',
    list: [{
        value: 'label_1',
        icon: 'calculator-1',
        ariaLabel: '房产计算'
      },
      {
        value: 'label_2',
        icon: 'control-platform',
        ariaLabel: '工具箱'
      },
      {
        value: 'label_4',
        icon: 'user',
        ariaLabel: '我的'
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})