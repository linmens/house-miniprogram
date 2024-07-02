import {
  tabs,
  loanTypes,
  loanBackTypes,
  loanRateTypes,
  loanPaidTypes,
  serviceFeeTypes,
  shuifeiTypes
} from '../../utils/constants';
import {
  getOldYearTimestamp,
  calculateLoan,
  addDataToCache
} from '../../utils/util';
// import SellerMethods from './seller'
import {
  basicBehavior,
  dealBehavior,
  serviceBehavior,
  gongjijinBehavior,
  shangdaiBehavior,
  sellerBehavior,
  buyerBehavior
} from '../../behavior/index'

import NP from 'number-precision'
import Toast from 'tdesign-miniprogram/toast/index';
import Message from 'tdesign-miniprogram/message/index';
Component({
  behaviors: [basicBehavior, dealBehavior, serviceBehavior, gongjijinBehavior, shangdaiBehavior, sellerBehavior, buyerBehavior],
  options: {
    styleIsolation: 'apply-shared',
  },
  lifetimes: {

  },
  data: {
    userList: ['居间机构', '购房者', '业主', '新房置业顾问'],
    userIndex: '',
    userIndexRember: false,
    userListVisible: false,
    // 显示隐藏计算说明
    showNotice: false,
    confirmBtn: {
      content: '知道了',
      variant: 'base'
    },
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
      // 0 给客户算 1 给业主算
      forWhoIndex: 0,

    },
    tabs,
    loanTypes,
    loanBackTypes,
    loanRateTypes,
    loanPaidTypes,
    serviceFeeTypes,
    shuifeiTypes
  },
  observers: {

  },
  lifetimes: {
    async ready() {
      let t = this
      // 获取本地userIndex
      const userIndexLocal = await wx.getStorageSync('userIndex')
      const userIndexRemberLocal = await wx.getStorageSync('userIndexRember')
      console.log(userIndexRemberLocal, 'userIndexRemberLocal')
      if (userIndexLocal === '' || !userIndexRemberLocal) {
        this.setData({
          userListVisible: true,
        })
      }
      this.setData({
        userIndex: userIndexLocal,
        userIndexRember: userIndexRemberLocal
      })
      this.onSwitchUser()

    }
  },
  methods: {
    handleClickStart() {
      const timestamp = new Date().getTime();
      addDataToCache(this.data.calcForm, timestamp)
      const {
        oldPriceIndex,
        oldPrice
      } = this.data.calcForm
      if (oldPriceIndex === 0) {
        if (!oldPrice) {
          Message.warning({
            context: this,
            offset: [90, 32],
            duration: 5000,
            content: '请输入原始购买价格',
          });
          return
        }
      }
      wx.navigateTo({
        url: `/pages/result/result?timestamp=${timestamp}`,
      })
    },
    handleClickNoticebar(e) {
      this.setData({
        showNotice: true
      })
    },
    onForWhoIndexChange(e) {
      const {
        value
      } = e.detail
      this.setData({
        'calcForm.forWhoIndex': value
      })
    },
    onSwitchUser() {
      const {
        userIndex
      } = this.data
      switch (userIndex) {
        case 0:
          // 居间机构
          this.setData({
            'calcForm.buyIndex': 0
          })
          break;
        case 1:
          // 购房者
          this.setData({
            'calcForm.buyIndex': 0
          })
          break;
        case 2:
          // 业主
          this.setData({
            'calcForm.buyIndex': 0
          })
          break;
        case 3:
          // 新房置业顾问
          this.setData({
            'calcForm.buyIndex': 1
          })
          break;
        default:

          break;
      }
    },
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
      this.onSwitchUser()
      wx.setStorageSync('userIndex', value)
    },
    /**
     * 打开角色列表弹框
     */
    showUserList(e) {
      console.log(e, 's')
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
          this.setLoanGjjMaxPrice()
          await this.setLoanGjjPrice(0)
          this.setData({
            'calcForm.loanPrice': 0
          })
          // 设置贷款年限
          if (loanGjjIndex === 6) {
            await this.setLoanGjjYear();
          }

          break;
        case 2:
          console.log('开始计算组合贷部分...')
          console.log('开始计算组合贷金额...')
          this.setLoanGjjMaxPrice()
          const groupLoanPrice = calculateLoan(wangqianPrice, paymentRate, unit)
          this.setData({
            'calcForm.loanGroupPrice': groupLoanPrice,
          })
          console.log('设置组合贷总金额', groupLoanPrice)
          await this.setLoanGjjPrice(0);
          const {
            loanGjjPrice,
          } = this.data.calcForm

          let newLoanPrice = NP.minus(groupLoanPrice, loanGjjPrice)
          this.setData({
            'calcForm.loanPrice': newLoanPrice
          })

          console.log('设置组合贷商业贷款部分', newLoanPrice)
          // 设置贷款年限
          if (loanIndex === 6) {
            await this.setLoanYear();
          }
          if (loanGjjIndex === 6) {
            await this.setLoanGjjYear();
          }

          break;
        case 3:
          // 全款
          this.setData({
            'calcForm.loanPrice': 0,
            'calcForm.loanGjjPrice': 0
          })
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
      console.log(e, 'sshowDialog')
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