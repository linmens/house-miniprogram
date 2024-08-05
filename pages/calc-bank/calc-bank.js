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
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    unitTypes,
    loanTypes,
    loanBackTypes,
    tabs: [],
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
    tabs.splice(3, 1)
    this.setData({
      tabs: tabs
    })
  },
  handleClickStart() {
    const {
      bankType,
      loanGjjPrice,
      loanPrice
    } = this.data.calcForm
    // 调用验证函数
    const isValid = validateLoanAmounts(bankType, loanPrice, loanGjjPrice);
    if (!isValid) {
      return; // 如果验证不通过，退出
    }
    const timestamp = new Date().getTime();
    addDataToCache(this.data.calcForm, timestamp)

    wx.navigateTo({
      url: `/pages/result-bank/result-bank?timestamp=${timestamp}`,
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