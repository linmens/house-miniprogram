import {
  tabs,
  buyTypes,
  chanquanTypes,
  selfHouseTypes,
  unitTypes,
  areaTypes,
  loanTypes,
  loanBackTypes,
  loanRateTypes
} from '../../utils/constants';
import {
  getOldYearTimestamp,
  calculateBuiltYear
} from '../../utils/util';

import NP from 'number-precision'

Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    priceError: false,
    // 显示隐藏年选择器
    yearVisible: false,
    defaultDate: new Date().getTime(),
    mineDate: getOldYearTimestamp(50),
    maxDate: getOldYearTimestamp(0),
    calcForm: {
      // 房屋总价
      totalPrice: '',
      // 首付比例
      paymentRate: 15,
      // 首付金额
      paymentPrice: '',
      // 居间服务费
      serviceFee: 0,
      // 服务比例
      serviceFeeRate: 1.5,
      // 计价单位下标
      unitIndex: 0,
      unit: '元',
      // 购房形式
      buyIndex: 0,
      // 金额换算值 元 1 || 万元 10000
      unitCount: 1,
      // 贷款方式 0 商业 1 公积金 2 组合贷 3 全款
      bankType: 0,
      // 贷款服务费金额
      bankPrice: 3000,
      // 房屋建成年份
      houseYear: new Date().getFullYear(),
      // 房屋年龄
      houseAge: '',
      // 贷款年限下标
      loanIndex: 5,
      // 贷款年限（年）
      loanYear: 30,
      // 还款方式
      loanBackIndex: 0,
      // 贷款利率
      loanRate: 3.55
    },
    tabs,
    buyTypes,
    chanquanTypes,
    selfHouseTypes,
    unitTypes,
    areaTypes,
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
    // 元 万元 切换
    onTypesChange(e) {
      const {
        label
      } = e.detail;
      const count = label === '元' ? 1 : 10000
      this.setData({
        'calcForm.unit': label,
        'calcForm.unitCount': count
      })
      this.setBankPrice()
    },
    // 购房形式
    onBuyTypesChange(e) {
      const {
        index
      } = e.detail
      console.log(index, 'e');
      this.setData({
        'calcForm.buyIndex': index
      })
    },
    onAreaTypesChange(e) {

    },
    onChange1(e) {
      this.setData({
        value1: e.detail.value
      });
    },
    onPriceInput(e) {
      const {
        priceError
      } = this.data;
      const value = e.detail.value;

      const isNumber = /^\d+(\.\d+)?$/.test(value);
      const number = parseFloat(value);
      const isValid = isNumber && number >= 0 && number <= 100;

      this.setData({
        priceError: !isValid,
        'calcForm.paymentRate': value
      });
      this.setPaymentPrice()
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
    onHouseAgeChange(e) {

      const {
        value
      } = e.detail
      if (value) {
        const builtYear = calculateBuiltYear(value);
        console.log(builtYear, 'calculateBuiltYear')
        if (builtYear) {
          this.setData({
            'calcForm.houseYear': builtYear,
            'calcForm.loanIndex': 6
          })
          this.setLoanYear()
        }

      }
    },
    /**
     * 计算居间服务费
     */
    calculateServiceFee() {
      const {
        totalPrice,
        unitCount,
        serviceFeeRate
      } = this.data.calcForm

      // 计算服务费 = 交易总价 * (居间服务比例/100)
      if (totalPrice) {

        const serviceFee =
          NP.round(NP.times(totalPrice, NP.divide(serviceFeeRate, 100)), 4)
        console.log(serviceFee, 'serviceFee')
        this.setData({
          'calcForm.serviceFee': serviceFee
        })
      }

    },
    // 交易总价改变
    onTotalPriceChange(e) {
      const {
        value
      } = e.detail
      this.setData({
        'calcForm.totalPrice': value
      })
      this.setPaymentPrice()
      this.calculateServiceFee()
    },
    /**
     * 首付金额改变
     */
    onPaymentPriceChange(e) {
      const {
        value
      } = e.detail
      if (value) {
        const {
          totalPrice
        } = this.data.calcForm
        const paymentRate = NP.round(NP.times(NP.divide(value, totalPrice), 100), 2)
        this.setData({
          'calcForm.paymentRate': paymentRate
        })
      }
    },
    /**
     * 计算居间服务费比例
     */
    setServiceFeeRate() {
      const {
        totalPrice,
        serviceFee
      } = this.data.calcForm
      if (totalPrice && serviceFee) {
        const serviceFeeRate = NP.round(NP.times(NP.divide(serviceFee, totalPrice), 100), 2)

        console.log(serviceFeeRate, 'serviceFeeRate')
        this.setData({
          'calcForm.serviceFeeRate': serviceFeeRate
        })
      }

    },
    onServiceFeeRateChange(e) {
      const {
        value
      } = e.detail;

      this.setData({
        'calcForm.serviceFeeRate': value
      });
      this.calculateServiceFee()
    },
    /**
     * 居间服务费改变
     */
    onServiceFeeChange(e) {
      const {
        value
      } = e.detail
      this.setData({
        'calcForm.serviceFee': value
      })
      // 计算服务费比例
      this.setServiceFeeRate()
    },
    /**
     * 贷款年限改变
     * @param {*} e 
     */
    onLoanTypesChange(e) {
      console.log(e, 'e')
    },
    /**
     * 设置商贷贷款年限
     */
    setLoanYear() {
      const {
        houseAge,
        loanIndex
      } = this.data.calcForm
      let loanYear = NP.minus(40, houseAge);
      if (loanYear > 30) {
        loanYear = 30
      }
      loanTypes[loanIndex].label = `自定义(${loanYear}年)`
      this.setData({
        'calcForm.loanYear': loanYear,
        'loanTypes': loanTypes
      })
      this.selectComponent('#loanTabs').initTrack()

    }
  },
});