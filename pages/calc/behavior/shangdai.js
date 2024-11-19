  import NP from 'number-precision'
  import {
    calculateLoan
  }
  from '../../../utils/util'
  import Message from 'tdesign-miniprogram/message/index';
  export const shangdaiBehavior = Behavior({
    data: {
      calcForm: {
        // 贷款年限下标
        loanIndex: 5,
        // 贷款年限（年）
        loanYear: 30,
        // 最高贷款年限
        loanMaxYear: 30,
        // 还款方式
        loanBackIndex: 0,
        // 贷款利率
        loanRate: 3.55,
        // 贷款金额
        loanPrice: '',
        // 贷款最低金额
        loanLowPrice: 0,
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
      async setLoanPrice(type) {
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
        console.log('开始使用网签价计算商贷贷款金额...', wangqianPrice)
        if (pingguPrice) {
          wangqianPrice = pingguPrice
          console.log('开始使用评估价计算商贷贷款金额...', wangqianPrice)
        }
        switch (type) {
          case 0:
            loanPrice = NP.minus(wangqianPrice, paymentPrice)
            console.log('开始计算商贷贷款金额(网签-首付):', loanPrice)
            break;
          case 1:
            loanPrice = await calculateLoan(wangqianPrice, paymentRate, unit)
            console.log('开始计算商贷贷款金额,当前网签金额:', wangqianPrice)
            console.log('开始计算商贷贷款金额,当前贷款比例:', paymentRate)
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
          loanIndex,
          bankType
        } = this.data.calcForm
        const {
          loanTypes
        } = this.data
        if (bankType === 1 || bankType === 2) {
          console.log('使用公积金贷款或者组合贷时计算可贷年限')
          let loanYear = NP.minus(40, houseAge);
          if (loanYear > 30) {
            loanYear = 30
          }
          if (loanYear <= 0) {
            loanYear = 0;
            this.setData({
              'calcForm.bankType': 3,
            })
          }
          if (loanYear >= 0) {
            this.setData({
              'calcForm.loanYear': loanYear,
              'calcForm.loanIndex': 6,
              'calcForm.loanMaxYear': loanYear
            })
          }
        } else {
          // 初始化贷款年限最高贷款年限
          this.setData({
            'calcForm.loanYear': 30,
            'calcForm.loanIndex': 5,
            'calcForm.loanMaxYear': 30
          })
        }


      },
      onCustomLoanYearInputValChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanYear': value
        })
      },
      onLoanBackTypesChange(e) {
        const {
          index
        } = e.detail
        this.setData({
          'calcForm.loanBackIndex': index
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
        const {
          value,
          index
        } = e.detail
        const {
          loanMaxYear
        } = this.data.calcForm
        let loanTypes = this.data.loanTypes
        if (value > loanMaxYear) {
          Message.info({
            context: this,
            offset: [90, 32],
            duration: 3000,
            content: '当前最大贷款年限为' + loanMaxYear + '年',
          });
          loanTypes[index].disabled = true
          this.setData({
            loanTypes: loanTypes
          })
          return
        }
        this.setData({
          'calcForm.loanIndex': index
        })
        if (index !== 6) {
          this.setData({
            'calcForm.loanYear': value,
          })
        }
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
        await this.setLoanGjjPrice(3);
        this.setPaymentPrice()
        this.setPaymentRate()
      }
    },
  })