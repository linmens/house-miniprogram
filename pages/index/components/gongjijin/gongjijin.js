// pages/index/components/gongjijin/gongjijin.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    calcForm: Object,
    loanTypes: Array,
    loanBackTypes: Array,
    loanRateTypes: Array,
    loanGjjHomeTypes: Array
  },
  options: {
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
    handleLoanGjjIsFirstChange(e) {
      this.triggerEvent('handleLoanGjjIsFirstChange', e.detail)
    },
    onLoanGjjPriceChange(e) {
      this.triggerEvent('loanPriceChange', e.detail)
    },
    onLoanGjjHomeTypesChange(e) {
      this.triggerEvent('onLoanGjjHomeTypesChange', e.detail)
    },
    onLoanGjjIndexChange(e) {
      this.triggerEvent('onLoanGjjIndexChange', e.detail)
    },
    onCustomLoanGjjYearChange(e) {
      this.triggerEvent('onCustomLoanGjjYearChange', e.detail)
    }
  }
})