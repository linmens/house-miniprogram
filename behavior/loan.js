import NP from 'number-precision'
const loanBehavior = Behavior({
  data: {
    calcForm: {
      // 贷款年限下标
      loanIndex: 5,
      // 贷款年限（年）
      loanYear: 30,
      // 还款方式
      loanBackIndex: 0,
      // 贷款利率
      loanRate: 3.55,
      // 贷款金额
      loanPrice: ''
    },

  },
  methods: {
    /**
     * 设置贷款金额
     * @param type 0 当改变首付金额时
     */
    setLoanPrice(type) {
      const {
        wangqianPrice,
        paymentPrice
      } = this.data.calcForm
      let loanPrice = 0
      switch (type) {
        case 0:
          loanPrice = NP.minus(wangqianPrice, paymentPrice)
          break;

        default:
          break;
      }

      this.setData({
        'calcForm.loanPrice': loanPrice
      })
    },
    /**
     * 设置商贷贷款年限
     */
    setLoanYear() {
      const {
        houseAge,
        loanIndex
      } = this.data.calcForm
      const {
        loanTypes
      } = this.data
      let loanYear = NP.minus(40, houseAge);
      if (loanYear > 30) {
        loanYear = 30
      }
      loanTypes[loanIndex].label = `自定义(${loanYear}年)`
      loanTypes[loanIndex].value = loanYear
      this.setData({
        'calcForm.loanYear': loanYear,
        'loanTypes': loanTypes
      })
      this.selectComponent('#loanTabs').initTrack()
    },
    /**
     * 贷款年限改变
     * @param {*} e 
     */
    onLoanTypesChange(e) {
      console.log(e, 'e')
      const {
        value
      } = e.detail
      this.setData({
        'calcForm.loanYear': value
      })
    },
    /**
     * 贷款利率改变
     */
    onLoanRateChange(e) {
      const {
        value
      } = e.detail
      this.setData({
        'calcForm.loanRate': value
      })
    },
    /**
     * 贷款金额改变时
     */
    onLoanPriceChange(e) {
      const {
        value
      } = e.detail
      const {
        wangqianPrice
      } = this.data.calcForm
      let paymentPrice = ''
      if (wangqianPrice) {
        // 计算首付金额 = 网签金额 - 贷款金额
        paymentPrice = NP.minus(wangqianPrice, value)
      }
      this.setData({
        'calcForm.loanPrice': value,
        'calcForm.paymentPrice': paymentPrice
      })
    }
  },
})
export default loanBehavior