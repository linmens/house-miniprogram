Component({

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
    },
    note: {
      type: String
    }
  },
  options: {
    multipleSlots: true,
    virtualHost: true
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})