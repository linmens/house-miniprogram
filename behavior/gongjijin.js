  import NP from 'number-precision'
  import {
    loanGjjHomeTypes
  } from '../utils/constants'
  export const gongjijinBehavior = Behavior({
    lifetimes: {
      ready() {
        console.log(this.data)
        const {
          unit,

        } = this.data.calcForm

        this.setData({
          'calcForm.loanGjjMaxPrice': unit === '元' ? 650000 : 65,


        })
      }
    },
    data: {
      loanGjjHomeTypes,
      calcForm: {
        // 公积金缴存情况
        loanGjjSaveIndex: 0,
        // 公积金贷款年限下标
        loanGjjIndex: 5,
        // 公积金贷款年限（年）
        loanGjjYear: 30,
        // 公积金还款方式
        loanGjjBackIndex: 0,
        // 公积金贷款利率
        loanGjjRate: 3.55,
        // 公积金贷款金额
        loanGjjPrice: '',
        // 是否首次使用公积金
        loanGjjIsFirst: true,
        // 最大贷款额度
        loanGjjMaxPrice: 650000,

      },
    },
    methods: {
      /**
       * 更新公积金贷款利率
       */
      setLoanGjjRate() {
        const {
          bankType,
          loanGjjYear,
          loanGjjIsFirst
        } = this.data.calcForm
        let loanGjjRate = 0
        if (bankType === 1 || bankType === 2) {
          if (loanGjjIsFirst) {
            // 首次使用
            loanGjjRate = loanGjjYear <= 5 ? 2.35 : 2.85
          } else {
            // 二次使用
            loanGjjRate = loanGjjYear <= 5 ? 2.775 : 3.325
          }
        }
        this.setData({
          'calcForm.loanGjjRate': loanGjjRate
        })
      },
      /**
       * 更新公积金贷款金额
       * @param type 0 网签金额*贷款比例 1 首付改变 2 组合贷款金额 - 商贷金额
       */
      setLoanGjjPrice(type) {
        const {
          unit,
          wangqianPrice,
          paymentRate,
          bankType,
          loanGjjSaveIndex,
          loanGroupPrice,
          loanPrice,
          paymentPrice
        } = this.data.calcForm
        const loanGjjMaxPrice = loanGjjHomeTypes[loanGjjSaveIndex].max
        console.log('设置公积金贷款最大金额:' + type, loanGjjMaxPrice, )
        let _loanGjjPrice = 0
        switch (type) {
          case 0:
            if (wangqianPrice) {
              const rate = NP.minus(100, paymentRate) / 100
              _loanGjjPrice = Math.floor(rate * wangqianPrice / 10000) * 10000

            }

            break;
          case 1:
            _loanGjjPrice = NP.minus(wangqianPrice, paymentPrice)

            break;
          case 2:
            _loanGjjPrice = NP.minus(loanGroupPrice, loanPrice)
            break;
          default:
            break;
        }
        if (_loanGjjPrice > loanGjjMaxPrice) {
          _loanGjjPrice = loanGjjMaxPrice
        } else if (_loanGjjPrice >= loanGjjMaxPrice) {
          _loanGjjPrice = loanGjjMaxPrice
        } else if (_loanGjjPrice < 0) {
          _loanGjjPrice = 0
        }
        this.setData({
          'calcForm.loanGjjPrice': _loanGjjPrice
        })
        console.log(`设置公积金贷款金额-${type}:`, _loanGjjPrice)
      },
      /**
       * 更新贷款年限
       */
      setLoanGjjYear(value) {
        this.setData({
          'calcForm.loanGjjYear': value
        })
      },
      /**
       * 公积金贷款金额改变时
       * @param {*} e 
       */
      async onLoanGjjPriceChange(e) {
        console.log('公积金贷款金额发生改变')
        const {
          bankType
        } = this.data.calcForm
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjPrice': value
        })
        console.log('设置公积金贷款金额：', value)
        if (bankType === 2) {
          await this.setLoanPrice(2)
        }
        this.setPaymentPrice()
        this.setPaymentRate()
      },
      handleLoanGjjIsFirstChange(e) {
        const {
          value
        } = e.detail

        this.setData({
          'calcForm.loanGjjIsFirst': value
        })
        this.setPaymentRate()
        this.setLoanGjjPrice()
        this.setLoanGjjRate()
      },
      /**
       * 家庭缴存情况改变
       * @param {*} e 
       */
      onLoanGjjHomeTypesChange(e) {
        console.log(e, 'onLoanGjjHomeTypesChange')
        const {
          index,
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjSaveIndex': index
        })
        this.setLoanGjjPrice(0)
        this.setPaymentPrice()
        this.setPaymentRate(0)
      },
      /**
       * 公积金贷款年限下标改变
       * @param {*} e 
       */
      onLoanGjjIndexChange(e) {
        console.log(e, 'onLoanGjjIndexChange')
        const {
          value,
          index
        } = e.detail
        this.setData({
          'calcForm.loanGjjIndex': index
        })
        this.setLoanGjjYear(value)
        this.setLoanGjjRate()
      }
    }
  })