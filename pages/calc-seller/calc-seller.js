import {
  gongnuanTypes,
  tabs,
  loanBackTypes,
  loanTypes,
  loanStatusTypes
} from '../../utils/constants';
import NP from 'number-precision'
import Message from 'tdesign-miniprogram/message/index';
import deaultCalcConfig from '../../utils/deaultCalcConfig'
import {
  writeHistory,
  readHistory
} from '../../utils/history'
import {
  validateLoanAmounts
} from '../../utils/validate'
import {
  showMessage,
  showSuccessMessage
}
from '../../utils/message'
import {
  addDataToCache,
  getCurrentCachedData
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gongnuanTypes,
    loanBackTypes,
    loanTypes,
    loanStatusTypes,
    tabs,
    confirmBtn: {
      content: '确定',
      variant: 'text'
    },
    cancelBtn: {
      content: '取消',
      variant: 'text'
    },
    dialogKey: '',
    datePickerKey: '',
    datePickerForm: '',
    mode: '',
    buyDateVisible: false,
    prePaymentVisible: false,
    prePaymentForm: {
      isFullRepayment: false,
      amount: 0,
      bankTypeName: '商业贷款',
      plan: 0
    },
    prePayBankTypes: [{
      value: '商业贷款',
      label: '商业贷款'
    }, {
      value: '公积金贷款',
      label: '公积金贷款'
    }],

    calcForm: {
      ...deaultCalcConfig,
      type: 'seller',
      totalPrice: '',
      // 上次购入价
      lastPrice: '',
      // 上次交易费用
      lastBuyFee: '',
      lastOtherFee: '',
      zhuangxiuFee: '',
      // 供暖费标准
      gongnuanFeeStandard: 5.8,
      gongnuanFee: 0,
      gongnuanFeeIndex: 0,
      // 首次还款日期
      loanBackFirstDate: '',
      // 已使用年数
      useYear: 0,
      // 购入日期
      buyDate: '',
      bankType: 0,
      // 每月物业费
      monthWuyeFee: 0,
      wuyeFeeStandard: 1.5,
      // 提前还款清单列表
      prePaymentList: [],
      buyFee: '',
      otherFee: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const loanRateHistory = readHistory('loanrate_history')
    const loanGjjRateHistory = readHistory('loangjjrate_history')
    this.setData({
      loanRateHistory,
      loanGjjRateHistory
    })
    let calcForm = this.data.calcForm
    if (options.timestamp) {
      calcForm = getCurrentCachedData(options.timestamp)
      this.setData({
        calcForm
      })
    }
  },
  handleClickStart() {
    const {
      bankType,
      loanGjjPrice,
      loanPrice,
      loanRate,
      loanGjjRate,
      totalPrice,
      lastPrice,
      buyDate,
      area,
      loanBackFirstDate
    } = this.data.calcForm
    if (!area) {
      showMessage('请输入房屋建筑面积！')
      return
    }
    if (!totalPrice) {
      showMessage('请输入本次售房价格！')
      return
    }

    if (!lastPrice) {
      showMessage('请输入上次购入价格！')
      return
    }
    // 调用验证函数
    const isValid = validateLoanAmounts(bankType, loanPrice, loanGjjPrice);
    if (!isValid) {
      return; // 如果验证不通过，退出
    }

    if (!buyDate) {
      showMessage('请选择一个购入日期！')
      return
    }
    if (!loanBackFirstDate && bankType !== 3) {
      showMessage('请选择一个首次还款日期！')
      return
    }
    const timestamp = new Date().getTime();
    addDataToCache(this.data.calcForm, timestamp)

    if (bankType === 0) {
      writeHistory('loanrate_history', {
        label: `${loanRate}%`,
        value: loanRate
      })
    }
    if (bankType === 1) {
      writeHistory('loangjjrate_history', {
        label: `${loanGjjRate}%`,
        value: loanGjjRate
      })
    }
    if (bankType === 2) {
      writeHistory('loanrate_history', {
        label: `${loanRate}%`,
        value: loanRate
      })
      writeHistory('loangjjrate_history', {
        label: `${loanGjjRate}%`,
        value: loanGjjRate
      })
    }
    wx.navigateTo({
      url: `/pages/result-seller/result-seller?timestamp=${timestamp}`,
    })
  },
  showPicker(e) {
    const {
      mode,
      key,
      form
    } = e.currentTarget.dataset;
    this.setData({
      mode,
      [`${mode}Visible`]: true,
      datePickerKey: key,
      datePickerForm: form
    });
  },
  onCommonDataChange(e) {
    const {
      value
    } = e.detail
    const {
      key
    } = e.currentTarget.dataset
    this.setData({
      [`calcForm.${key}`]: value
    })
  },
  resetLoanInfo() {
    let calcForm = this.data.calcForm
    let bankType = calcForm.bankType
    switch (bankType) {
      case 0:
        calcForm.loanGjjPrice = ''
        break;
      case 1:
        calcForm.loanPrice = ''
        break;
      case 3:
        calcForm.loanPrice = ''
        calcForm.loanGjjPrice = ''
        calcForm.loanBackFirstDate = ''
        break;
      default:
        break;
    }
    this.setData({
      calcForm
    })
  },
  onloanRateHistory(e) {
    const {
      value
    } = e.currentTarget.dataset
    this.setData({
      'calcForm.loanRate': value
    })
  },
  onloanGjjRateHistory(e) {
    const {
      value
    } = e.currentTarget.dataset
    this.setData({
      'calcForm.loanGjjRate': value
    })
  },
  // 计算供暖费
  calcGongnuanFee() {
    const {
      area,
      gongnuanFeeStandard
    } = this.data.calcForm
    let gongnuanFee = NP.times(gongnuanFeeStandard, area, 4)
    this.setData({
      'calcForm.gongnuanFee': gongnuanFee
    })
  },
  onisFullRepaymentChange(event) {
    const {
      value
    } = event.detail;

    this.setData({
      'prePaymentForm.isFullRepayment': value
    });
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
  sortByDate(dataArray) {
    return dataArray.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB; // 升序排序，改为 `dateB - dateA` 即降序排序
    });
  },
  onPrePaymentConfirm(e) {
    console.log(e, 'onPrePaymentConfirm')
    const {
      date,
      isFullRepayment,
      bankTypeName,
      amount
    } = this.data.prePaymentForm
    if (!date) {
      Message.info({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '请选择一个还款日期！',
      });
      return
    }
    if (!isFullRepayment && !amount) {
      // 部分提前还款
      Message.info({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '请输入一个还款金额！',
      });
      return
    }
    console.log(this.data.prePaymentForm)
    let calcForm = this.data.calcForm
    calcForm.prePaymentList.push(this.data.prePaymentForm);
    calcForm.prePaymentList = this.sortByDate(calcForm.prePaymentList)
    this.setData({
      calcForm
    })
    console.log(this.data.calcForm, '添加还款记录')
    this.closeDialog()
    this.resetPrePaymentForm()
    showSuccessMessage('添加成功！')
  },
  deletePrepayment(e) {
    console.log(e, '删除还款记录')
    const {
      index
    } = e.currentTarget.dataset
    let calcForm = this.data.calcForm
    calcForm.prePaymentList.splice(index, 1);
    this.setData({
      calcForm
    })
  },
  resetPrePaymentForm() {
    this.setData({
      prePaymentForm: {
        isFullRepayment: false,
        amount: 0,
        bankTypeName: '商业贷款',
        plan: 0
      }
    })
  },
  // 提前还款框 还款金额改变
  onPrePaymentAmountChange(e) {
    console.log(e, 'onPrePaymentAmountChange')
    const {
      value
    } = e.detail
    this.setData({
      'prePaymentForm.amount': value
    })
  },
  onPrePaymentPlanChange(e) {
    console.log(e, 'onPrePaymentPlanChange')
    const {
      value
    } = e.detail
    this.setData({
      'prePaymentForm.plan': value
    })
  },
  onTabsChange(e) {
    console.log(e, 'onTabsChange')
    const {
      label
    } = e.detail
    this.setData({
      'prePaymentForm.bankTypeName': label
    })
  },
  onBankTypeChange(e) {
    const {
      index
    } = e.detail
    this.setData({
      'calcForm.bankType': index
    })
    this.resetLoanInfo()
  },
  onLoanTypesChange(e) {
    const {
      value,
      index
    } = e.detail

    this.setData({
      'calcForm.loanIndex': index
    })
    if (index !== 6) {
      this.setData({
        'calcForm.loanYear': value,
      })
    }
  },
  onLoanBackTypesChange(e) {
    const {
      index
    } = e.detail
    this.setData({
      'calcForm.loanBackIndex': index
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

  onAreaChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      'calcForm.area': value
    })
    this.calcGongnuanFee()
  },
  ongongnuanTypesChange(e) {
    const {
      value,
      index
    } = e.detail
    this.setData({
      'calcForm.gongnuanFeeStandard': value,
      'calcForm.gongnuanFeeIndex': index
    })
    this.calcGongnuanFee()
  },
  onDateConfirm(e) {
    console.log(e, 's')
    let curDate = e.detail.value
    // let calcForm = this.data.calcForm
    // calcForm[this.data.datePickerKey] = curDate
    const {
      datePickerForm,
      datePickerKey
    } = this.data
    this.setData({
      [`${datePickerForm}.${datePickerKey}`]: curDate
    })
  },
  onwuyeFeeStandardChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      'calcForm.wuyeFeeStandard': value
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})