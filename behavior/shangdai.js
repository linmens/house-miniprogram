  import NP from 'number-precision'
  import {
    calculateLoan
  } from '../utils/util.js'
  export const shangdaiBehavior = Behavior({
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
        loanPrice: '',
        // 贷款已还期数 业主计算时显示
        loanPaid: 0,
        // 提前还款方式
        loanPaidTypeIndex: 0
      },

    },
    methods: {
      /**
       * 设置贷款金额
       * @param type 0 当改变首付金额时 1 网签*贷款比例 2 组合贷款金额 - 公积金贷款金额
       */
      setLoanPrice(type) {
        const {
          paymentPrice,
          paymentRate,
          unit,
          bankType,
          loanGroupPrice,
          loanGjjPrice,
          pingguPrice
        } = this.data.calcForm
        let loanPrice = 0
        let wangqianPrice = this.data.calcForm.wangqianPrice
        console.log('开始使用网签价计算商贷贷款金额...')
        if (pingguPrice) {
          wangqianPrice = pingguPrice
          console.log('开始使用评估价计算商贷贷款金额...')
        }
        switch (type) {
          case 0:
            loanPrice = NP.minus(wangqianPrice, paymentPrice)
            console.log('开始计算商贷贷款金额(网签-首付):', loanPrice)
            break;
          case 1:
            loanPrice = calculateLoan(wangqianPrice, paymentRate, unit)
            console.log('开始计算商贷贷款金额(网签*贷款比例):', loanPrice)
            break;
          case 2:
            loanPrice = NP.minus(loanGroupPrice, loanGjjPrice)
            console.log('开始计算商贷贷款金额(组合贷款金额 - 公积金贷款金额):', loanPrice)
            break;
          default:
            break;
        }
        this.setData({
          'calcForm.loanPrice': loanPrice
        })
        console.log('设置商贷贷款金额:', loanPrice)
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

        this.setData({
          'calcForm.loanYear': loanYear,
          'calcForm.loanIndex': 6
        })
      },
      onCustomLoanYearInputValChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanYear': value
        })
      },
      /**
       * 提前还款方式改变
       * @param {*} e 
       */
      onLoanPaidTypeIndexChange(e) {
        const {
          index
        } = e.detail
        this.setData({
          'calcForm.loanPaidTypeIndex': index
        })
      },
      onLoanPaidChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanPaid': value
        })
      },
      /**
       * 贷款年限改变
       * @param {*} e 
       */
      onLoanTypesChange(e) {
        console.log(e, 'e')
        const {
          value,
          index
        } = e.detail
        this.setData({
          'calcForm.loanYear': value,
          'calcForm.loanIndex': index
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
      async onLoanPriceChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanPrice': value,
        })
        await this.setLoanGjjPrice(2);
        this.setPaymentPrice()
        this.setPaymentRate()
      }
    },
  })