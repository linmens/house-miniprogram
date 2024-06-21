import {
  tabs,
  loanTypes,
  loanBackTypes,
  loanRateTypes
} from '../../utils/constants';
import {
  getOldYearTimestamp,
  calculateLoan
} from '../../utils/util';
import {
  basicBehavior,
  dealBehavior,
  serviceBehavior,
  gongjijinBehavior,
  shangdaiBehavior
} from '../../behavior/index'

import NP from 'number-precision'

Component({
  behaviors: [basicBehavior, dealBehavior, serviceBehavior, gongjijinBehavior, shangdaiBehavior],
  options: {
    styleIsolation: 'apply-shared',
  },
  lifetimes: {

  },
  data: {
    priceError: false,
    showCustomAreaInput: false,
    currentYear: new Date().getFullYear(),
    defaultDate: new Date().getTime(),
    mineDate: getOldYearTimestamp(50),
    maxDate: getOldYearTimestamp(0),
    customAreaInputVal: '',
    calcForm: {
      // 组合贷款合计金额
      loanGroupPrice: 0,
    },
    tabs,
    loanTypes,
    loanBackTypes,
    loanRateTypes
  },
  observers: {
    'calcForm.loanPrice,calcForm.loanGjjPrice': function (loanPrice, loanGjjPrice) {
      // const {
      //   bankType
      // } = this.data.calcForm
      // if (bankType === 2) {
      //   let loanGroupPrice = NP.plus(loanPrice, loanGjjPrice)
      //   this.setData({
      //     'calcForm.loanGroupPrice': loanGroupPrice
      //   })
      //   console.log('设置组合贷合计贷款金额：', loanGroupPrice)
      // }

    }
  },
  methods: {
    // 贷款方式 0 商业贷款 1 公积金 2组合贷 3全款
    onBankTypeChange(e) {
      const {
        value
      } = e.detail
      this.setData({
        'calcForm.bankType': value,
      })
      console.log('贷款方式发生改变')
      console.log('设置贷款方式：', value)
      // this.setBankPrice()
      this.startCalc()
    },
    /**
     * 开始计算
     */
    async startCalc() {
      const {
        wangqianPrice,
        unit,
        paymentRate,
        bankType,
        buyIndex
      } = this.data.calcForm;

      switch (bankType) {
        case 0:
          console.log('开始计算商业贷款部分...')
          await this.setLoanPrice(1)

          break;
        case 1:
          console.log('开始计算公积金贷款部分...')
          console.log('开始计算公积金贷款金额...')
          this.setLoanGjjPrice(0)
          break;
        case 2:
          console.log('开始计算组合贷部分...')
          console.log('开始计算组合贷金额...')
          await this.setLoanGjjPrice(0);
          const groupLoanPrice = calculateLoan(wangqianPrice, paymentRate, unit)
          const {
            loanGjjPrice,
          } = this.data.calcForm
          let newLoanPrice = NP.minus(groupLoanPrice, loanGjjPrice)
          this.setData({
            'calcForm.loanGroupPrice': groupLoanPrice,
            'calcForm.loanPrice': newLoanPrice
          })
          console.log('设置组合贷总金额', groupLoanPrice)
          console.log('设置组合贷商业贷款部分', newLoanPrice)
          break;
        default:
          break;
      }
      if (buyIndex === 0) {
        await this.setBankPrice()
        await this.setServiceFee()
      }
      await this.setPaymentPrice()
      // this.setPaymentRate()
    },
    showDialog(e) {
      const {
        key
      } = e.currentTarget.dataset;
      this.setData({
        [key]: true,
        dialogKey: key
      });
    },
    closeDialog() {
      const {
        dialogKey
      } = this.data;
      this.setData({
        [dialogKey]: false
      });
    },
    onCustomAreaInputValChange(e) {
      const {
        value
      } = e.detail
      this.setData({
        customAreaInputVal: value
      })
    },
    
  },
});