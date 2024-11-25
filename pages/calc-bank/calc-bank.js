import {
  unitTypes,
  tabs,
  loanTypes,
  loanBackTypes,
} from '../../utils/constants';
import {
  validateLoanAmounts
} from '../../utils/validate'
import {
  addDataToCache
} from '../../utils/util'
import {
  writeHistory,
  readHistory
} from '../../utils/history'
import {
  getCurrentCachedData,
} from '../../utils/util'
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    unitTypes,
    loanTypes,
    loanBackTypes,
    tabs: [],
    // 贷款利率操作历史
    loanRateHistory: [],
    loanGjjRateHistory: [],
    calcForm: {
      type: 'bank',
      unit: '万元',
      unitIndex: 1,
      bankType: 0,
      loanYear: 30,
      loanIndex: 5,
      loanMaxYear: 30,
      loanBackIndex: 0,
      loanRate: 3.45,
      loanGjjRate: 2.85,
      loanPrice: '',
      loanGjjPrice: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, 'calc-bank')
    let calcForm = this.data.calcForm
    if (options.timestamp) {
      calcForm = getCurrentCachedData(options.timestamp)
    }
    const loanRateHistory = readHistory('loanrate_history')
    const loanGjjRateHistory = readHistory('loangjjrate_history')
    tabs.splice(3, 1)
    this.setData({
      tabs: tabs,
      loanRateHistory,
      loanGjjRateHistory,
      calcForm
    })
  },
  handleClickStart() {
    const {
      bankType,
      loanGjjPrice,
      loanPrice,
      loanRate,
      loanGjjRate,
    } = this.data.calcForm
    // 调用验证函数
    const isValid = validateLoanAmounts(bankType, loanPrice, loanGjjPrice);
    if (!isValid) {
      return; // 如果验证不通过，退出
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
      url: `/pages/result-bank/result-bank?timestamp=${timestamp}`,
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
  onLoanGjjRateChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      'calcForm.loanGjjRate': value
    })
  },
  onBankTypeChange(e) {
    const {
      index
    } = e.detail
    this.setData({
      'calcForm.bankType': index
    })
  },
  onTypesChange(e) {
    const {
      index,
      label
    } = e.detail
    const {
      loanPrice,
      loanGjjPrice
    } = this.data.calcForm

    if (label === '元') {
      if (loanPrice) {
        this.setData({
          'calcForm.loanPrice': loanPrice * 10000,
          'calcForm.loanGjjPrice': loanGjjPrice * 10000
        })
      }
    } else {
      if (loanPrice) {
        this.setData({
          'calcForm.loanPrice': loanPrice / 10000,
          'calcForm.loanGjjPrice': loanGjjPrice / 10000
        })
      }
    }
    this.setData({
      'calcForm.unit': label,
      'calcForm.unitIndex': index
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
  onLoanPriceChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      'calcForm.loanPrice': value
    })
  },
  onLoanGjjPriceChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      'calcForm.loanGjjPrice': value
    })
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