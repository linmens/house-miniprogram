import {
  tabs,
  buyTypes,
  chanquanTypes,
  selfHouseTypes,
  unitTypes,
  areaTypes
} from '../../utils/constants';
Component({
  options: {
    styleIsolation: 'apply-shared',
  },
  data: {
    priceError: false,
    calcForm: {
      // 计价单位下标
      unitIndex: 0,
      unit: '元',
      buyIndex: 0,
      // 金额换算值 元 0 || 万元 10000
      unitCount: 0,
      // 贷款方式 0 商业 1 公积金 2 组合贷 3 全款
      bankType: 0,
      // 贷款服务费金额
      bankPrice: 3000,
    },
    tabs,
    buyTypes,
    chanquanTypes,
    selfHouseTypes,
    unitTypes,
    areaTypes
  },
  methods: {
    onChange(e) {
      this.setData({
        value: e.detail.value
      });
    },
    //
    onBankTypeChange(e) {
      const {
        value
      } = e.detail
      this.setBankPrice(value)
    },
    setBankPrice(value) {
      let bankPrice = 0
      switch (value) {
        case 0:
          bankPrice = 3000
          break;
        case 1:
          bankPrice = 4000
          break;
        case 2:
          bankPrice = 5000
          break;
        default:
          break;
      }
      this.setData({
        'calcForm.bankType': value,
        'calcForm.bankPrice': bankPrice
      })
    },
    // 元 万元 切换
    onTypesChange(e) {
      const {
        label
      } = e.detail;
      const count = label === '元' ? 0 : 10000
      this.setData({
        'calcForm.unit': label,
        'calcForm.unitCount': count
      })
    },
    onBuyTypesChange() {

    },
    onAreaTypesChange() {

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
      console.log(number, 'number')
      const isValid = isNumber && number >= 0 && number <= 100;

      this.setData({
        priceError: !isValid,

      });
    },
  },
});