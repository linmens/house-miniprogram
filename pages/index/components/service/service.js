Component({

  /**
   * 组件的属性列表
   */
  properties: {
    calcForm: Object,
  },
  lifetimes: {

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
    onServiceFeeRateChange(e) {
      this.triggerEvent('serviceFeeRateChange', e.detail)
    },
    onServiceFeeChange(e) {
      this.triggerEvent('serviceFeeChange', e.detail)
    }
  }
})