// pages/index/components/shangdai/shangdai.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    calcForm: Object,
    loanTypes: Array,
    loanBackTypes: Array,
    loanRateTypes: Array,
    loanPaidTypes: Array
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
    onLoanPriceChange(e) {
      this.triggerEvent('onLoanPriceChange', e.detail)
    },
    onLoanTypesChange(e) {
      this.triggerEvent('onLoanTypesChange', e.detail)
    },
    onCustomLoanYearInputValChange(e) {
      this.triggerEvent('onCustomLoanYearInputValChange', e.detail)
    },
    onLoanPaidTypeIndexChange(e) {
      this.triggerEvent('onLoanPaidTypeIndexChange', e.detail)
    },
    onLoanPaidChange(e) {
      this.triggerEvent('onLoanPaidChange', e.detail)
    }
  }
})