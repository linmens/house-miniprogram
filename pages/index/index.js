import {
  tabs,

  loanTypes,
  loanBackTypes,
  loanRateTypes
} from '../../utils/constants';
import {
  getOldYearTimestamp,
} from '../../utils/util';
import {
  loanBehavior,
  basicBehavior,
  dealBehavior,
  serviceBehavior
} from '../../behavior/index'

import NP from 'number-precision'

Component({

  behaviors: [loanBehavior, basicBehavior, dealBehavior, serviceBehavior],
  options: {
    styleIsolation: 'apply-shared',
  },
  lifetimes: {

  },
  data: {
    priceError: false,
    // 显示隐藏年选择器
    yearVisible: false,
    defaultDate: new Date().getTime(),
    mineDate: getOldYearTimestamp(50),
    maxDate: getOldYearTimestamp(0),

    tabs,
    loanTypes,
    loanBackTypes,
    loanRateTypes
  },
  methods: {
    onChange(e) {
      this.setData({
        value: e.detail.value
      });
    },
    // 贷款方式 0 商业贷款 1 公积金 2组合贷 3全款
    onBankTypeChange(e) {
      const {
        value
      } = e.detail
      this.setData({
        'calcForm.bankType': value,
      })
      this.setBankPrice()
    },
    /**
     * 设置首付金额
     */
    setPaymentPrice() {
      const {
        totalPrice,
        paymentRate
      } = this.data.calcForm
      if (totalPrice && paymentRate) {

        const paymentPrice = NP.times(totalPrice, NP.divide(paymentRate, 100))
        this.setData({
          'calcForm.paymentPrice': paymentPrice
        })
      }

    },
    // 设置贷款服务费
    setBankPrice() {
      let bankPrice = 0
      const {
        unitCount,
        bankType
      } = this.data.calcForm
      switch (bankType) {
        case 0:
          bankPrice = 3000 / unitCount
          break;
        case 1:
          bankPrice = 4000 / unitCount
          break;
        case 2:
          bankPrice = 5000 / unitCount
          break;
        default:
          break;
      }
      this.setData({
        'calcForm.bankPrice': bankPrice
      })
    },


    onChange1(e) {
      this.setData({
        value1: e.detail.value
      });
    },

    // 显示隐藏年份选择器
    showYearPicker() {
      this.setData({
        yearVisible: true
      })
    },
    // 确认选择年份
    onYearConfirm(e) {
      const {
        value
      } = e.detail;
      console.log('confirm', value);
      const {
        defaultDate
      } = this.data
      const currentYear = new Date().getFullYear()


      // 计算房龄
      const houseAge = currentYear - value;
      this.setData({
        yearVisible: false,
        'calcForm.houseYear': value,
        'calcForm.houseAge': houseAge,
        'calcForm.loanIndex': 6
      });
      this.setLoanYear()
    },







  },
});