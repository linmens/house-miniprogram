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
import Toast from 'tdesign-miniprogram/toast/index';

Component({
  behaviors: [basicBehavior, dealBehavior, serviceBehavior, gongjijinBehavior, shangdaiBehavior],
  options: {
    styleIsolation: 'apply-shared',
  },
  lifetimes: {

  },
  data: {
    userList: ['居间机构', '购房者', '业主', '新房置业顾问'],
    userIndex: 0,
    userIndexRember: false,
    userListVisible: false,
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

  },
  lifetimes: {
    async ready() {
      let t = this
      // 获取本地userIndex
      const userIndexLocal = await wx.getStorageSync('userIndex')
      if (userIndexLocal !== '') {
        this.setData({
          userIndex: userIndexLocal
        })
      }
      wx.getStorage({
        key: 'userIndexRember',
        success(res) {
          const data = res.data

          t.setData({
            userIndexRember: data
          })
          if (!data) {
            // 首次加载如果记住角色选择不是true
            t.setData({
              userListVisible: true
            })
          }
        }
      })
    }
  },
  methods: {
    onUserListVisibleChange(e) {
      this.setData({
        userListVisible: e.detail.visible,
      });
    },
    onUserIndexRemberChange(e) {
      const {
        checked
      } = e.detail
      this.setData({
        userIndexRember: checked
      })
      wx.setStorageSync('userIndexRember', checked)
    },
    onUserChange(e) {
      console.log('角色改变：', e)
      const {
        value
      } = e.detail
      this.setData({
        userIndex: value
      })
      Toast({
        context: this,
        selector: '#t-toast',
        message: '切换成功',
        theme: 'success',
        direction: 'column',
      });
      this.setData({
        userListVisible: false
      })
      wx.setStorageSync('userIndex', value)
    },
    /**
     * 打开角色列表弹框
     */
    showUserList() {
      this.setData({
        userListVisible: true
      })
    },
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
        buyIndex,
        loanIndex,
        loanGjjIndex
      } = this.data.calcForm;

      switch (bankType) {
        case 0:
          console.log('开始计算商业贷款部分...')
          await this.setLoanPrice(1)
          // 设置贷款年限
          if (loanIndex === 6) {
            await this.setLoanYear();
          }
          break;
        case 1:
          console.log('开始计算公积金贷款部分...')
          console.log('开始计算公积金贷款金额...')
          await this.setLoanGjjPrice(0)
          // 设置贷款年限
          if (loanGjjIndex === 6) {
            await this.setLoanGjjYear();
          }

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
          // 设置贷款年限
          if (loanIndex === 6) {
            await this.setLoanYear();
          }
          if (loanGjjIndex === 6) {
            await this.setLoanGjjYear();
          }

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