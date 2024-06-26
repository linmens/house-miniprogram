// pages/index/components/deal/deal.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    calcForm: Object,
  },
  options: {
    virtualHost: true
  },
  /**
   * 组件的初始数据
   */
  data: {
    showHukouWuyeNotice: false,
    confirmBtn: {
      content: '知道了',
      variant: 'base'
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTotalPriceChange(e) {
      this.triggerEvent('totalPriceChange', e.detail)
    },
    onWangqianPriceChange(e) {
      this.triggerEvent('wangqianPriceChange', e.detail)
    },
    onHukouWuyePriceChange(e) {
      this.triggerEvent('hukouWuyePriceChange', e.detail)
    },
    onPaymentRateChange(e) {
      this.triggerEvent('paymentRateChange', e.detail)
    },
    onPaymentPriceChange(e) {
      this.triggerEvent('paymentPriceChange', e.detail)
    },
    handleHukouWuyeTitleRight(e) {
      this.setData({
        showHukouWuyeNotice: true
      })
      this.triggerEvent('handleHukouWuyeTitleRight', e.detail)
    },
    closeDialog() {
      this.setData({
        showHukouWuyeNotice: false
      })
    }
  }
})