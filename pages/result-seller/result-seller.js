import {
  getCurrentCachedData,
} from '../../utils/util'
import {
  tabs,
  loanBackTypes
}
from '../../utils/constants';
import dayjs from 'dayjs';
import NP from 'number-precision'
import {
  calculateLoan,
  calculateLoanDetails
} from './loan.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs,
    loanBackTypes,
    nowDate: dayjs().format('YYYY-MM-DD'),
    calcForm: {},
    result: {
      // 已支出供暖费
      useGongnuanFee: 0,
      // 已支出物业费
      useWuyeFee: 0,
      paymentPrice: 0,
      loanAllDetails: {
        remainingInterest: 0,
        remainingPrincipal: 0,
        totalPaidInterest: 0,
        totalPaidPrincipal: 0
      },
      loanGjjAllDetails: {
        remainingInterest: 0,
        remainingPrincipal: 0,
        totalPaidInterest: 0,
        totalPaidPrincipal: 0
      },
      loanGjjFirstDetails: {
        firstInterest: 0,
        firstPrincipal: 0,
        remainingInterest: 0,
        remainingPrincipal: 0
      },
      loanFirstDetails: {
        firstInterest: 0,
        firstPrincipal: 0,
        remainingInterest: 0,
        remainingPrincipal: 0
      },
      loanTotal: 0,
      endTotal: 0,
      loanFirstTotal: 0,
      remainingPrincipal: 0
    },
    basicList: [],
    lastList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let data = {}
    if (options.timestamp) {
      data = getCurrentCachedData(options.timestamp)
    }
    if (options.data) {
      data = JSON.parse(options.data)
    }

    this.setData({
      calcForm: data,
      options
    })
    this.initBasicList()
    this.calcResult()
  },
  // 初始化基本信息列表
  initBasicList() {
    const {
      area,
      buyDate,
      bankType,
      loanYear,
      loanPrice,
      unit,
      loanGjjPrice,
      lastPrice,
      totalPrice
    } = this.data.calcForm
    let basicList = this.data.basicList

    if (area) {
      basicList = basicList.concat([{
        label: '建筑面积',
        value: area + '㎡'
      }])
    }
    // if (buyDate) {
    //   basicList = basicList.concat([{
    //     label: '购买日期',
    //     value: buyDate
    //   }])
    // }

    // basicList = basicList.concat([{
    //   label: '支付方式',
    //   value: this.data.tabs[bankType].label
    // }])
    // if (loanYear) {
    //   basicList = basicList.concat([{
    //     label: '贷款年限',
    //     value: loanYear + '年'
    //   }])
    // }
    // if (loanPrice) {
    //   basicList = basicList.concat([{
    //     label: '商业贷款',
    //     value: loanPrice + unit
    //   }])
    // }
    // if (loanGjjPrice) {
    //   basicList = basicList.concat([{
    //     label: '公积金贷款',
    //     value: loanGjjPrice + unit
    //   }])
    // }
    if (lastPrice) {
      basicList = basicList.concat([{
        label: '上次购入价',
        value: lastPrice + unit
      }])
    }
    if (totalPrice) {
      basicList = basicList.concat([{
        label: '本次售房价',
        value: totalPrice + unit
      }])
    }
    this.setData({
      basicList
    })
  },
  // 初始化结果
  calcResult() {
    const {
      bankType
    } = this.data.calcForm
    // 计算自住年、月
    this.calcUseDate()
    if (bankType === 0 || bankType === 1 || bankType === 2) {
      // 计算首次还款相关
      this.calcFirstLoan()
      // 计算截止目前的所有贷款信息
      this.calcAllLoan()
    }

    // 计算上次交易支付首付款
    this.calcPaymentPrice()
    // 计算上次交易支出小计
    this.calcLastTotal()
    // 计算本次能拿多少钱
    this.calcEndToal()
  },

  calcEndToal() {
    // 本次净得 = 本次售出价格 - 已支出费用
    let {
      totalPrice,
      buyFee,
      otherFee,
      unit
    } = this.data.calcForm
    let result = this.data.result
    let {
      lastTotal,
      loanTotal,
      useGongnuanFee,
      useWuyeFee
    } = result
    if (unit === '万元') {
      lastTotal = lastTotal * 10000
      buyFee = buyFee * 10000
      otherFee = otherFee * 10000
      totalPrice = totalPrice * 10000
    }
    console.log({
      lastTotal,
      loanTotal,
      buyFee,
      otherFee,
      totalPrice
    })
    console.log(result, 'result.usePayPrice ')
    result.usePayPrice = NP.plus(lastTotal, loanTotal, useGongnuanFee, useWuyeFee, buyFee,
      otherFee, result.remainingPrincipal)

    result.endTotal = NP.minus(totalPrice, result.usePayPrice)
    result.endTotalFormat = NP.divide(result.endTotal, 10000).toFixed(4)
    result.usePayPriceFormat = NP.divide(result.usePayPrice, 10000).toFixed(4)
    this.setData({
      result
    })
  },
  calcAllLoan() {
    const {
      loanPrice,
      loanGjjPrice,
      loanYear,
      loanRate,
      loanGjjRate,
      loanBackIndex,
      unit,
      loanBackFirstDate
    } = this.data.calcForm
    let result = this.data.result
    result.loanAllDetails = calculateLoanDetails(loanBackIndex, loanPrice, loanRate, loanYear, loanBackFirstDate, unit)
    result.loanGjjAllDetails = calculateLoanDetails(loanBackIndex, loanGjjPrice, loanGjjRate, loanYear, loanBackFirstDate, unit)
    result.loanTotal = NP.plus(result.loanAllDetails.totalPaidPrincipal, result.loanAllDetails.totalPaidInterest, result.loanGjjAllDetails.totalPaidPrincipal, result.loanGjjAllDetails.totalPaidInterest)
    // 剩余本金
    result.remainingPrincipal = NP.plus(result.loanAllDetails.remainingPrincipal, result.loanGjjAllDetails.remainingPrincipal)
    this.setData({
      result
    })
  },
  calcLastTotal() {
    const {
      lastBuyFee,
      zhuangxiuFee,
      lastOtherFee
    } = this.data.calcForm
    let result = this.data.result
    result.lastTotal = NP.plus(result.paymentPrice, lastBuyFee, zhuangxiuFee, lastOtherFee)
    this.setData({
      result
    })
  },
  calcFirstLoan() {
    const {
      loanPrice,
      loanGjjPrice,
      loanYear,
      loanRate,
      loanGjjRate,
      loanBackIndex,
      unit
    } = this.data.calcForm
    let result = this.data.result
    result.loanFirstDetails = calculateLoan(loanBackIndex, loanPrice, loanRate, loanYear, unit)
    result.loanGjjFirstDetails = calculateLoan(loanBackIndex, loanGjjPrice, loanGjjRate, loanYear, unit)
    result.loanFirstTotal = NP.plus(result.loanFirstDetails.firstPrincipal, result.loanFirstDetails.firstInterest, result.loanGjjFirstDetails.firstPrincipal, result.loanGjjFirstDetails.firstInterest)

    this.setData({
      result
    })
  },
  calcPaymentPrice() {
    const {
      lastPrice,
      loanPrice,
      loanGjjPrice
    } = this.data.calcForm
    let result = this.data.result
    result.paymentPrice = NP.minus(lastPrice, loanPrice, loanGjjPrice)
    this.setData({
      result
    })
  },
  calcUseDate() {
    let {
      buyDate,
      gongnuanFee,
      wuyeFeeStandard,
      area
    } = this.data.calcForm
    let result = this.data.result
    const now = dayjs(); // 获取当前时间

    // 计算年差和月差
    result.useYear = now.diff(buyDate, 'year');
    result.useMonth = now.diff(buyDate, 'month');
    // 计算供暖期
    // 初始化供暖开始和结束日期
    const startDate = dayjs(buyDate)

    let heatingPeriods = 0;
    // 遍历年份，统计供暖期
    let currentYear = startDate.year();
    while (dayjs(`${currentYear}-11-15`).isBefore(now)) {
      const startOfHeating = dayjs(`${currentYear}-11-15`);
      const endOfHeating = dayjs(`${currentYear + 1}-03-15`);
      if (startOfHeating.isAfter(startDate) || startDate.isBefore(endOfHeating)) {
        heatingPeriods++;
      }
      currentYear++;
    }
    console.log(`从 ${buyDate} 到 ${now.format('YYYY-MM-DD')} 一共跨过 ${heatingPeriods} 个供暖期`);
    result.heatingPeriods = heatingPeriods
    // 计算供暖费
    result.useGongnuanFee = NP.times(gongnuanFee, heatingPeriods)
    // 计算物业费 = 物业费单价 × 房屋建筑面积 × 月数
    result.useWuyeFee = NP.times(wuyeFeeStandard, area, result.useMonth)
    this.setData({
      result
    })

  },
  initLastList() {
    let lastList = this.data.lastList
    const {
      useWuyeFee,
      useMonth
    } = this.data.result
    const {
      unit,
      area,
      wuyeFeeStandard
    } = this.data.calcForm
    if (useWuyeFee) {
      lastList = lastList.concat([{
        label: '累积使用物业费',
        value: useWuyeFee + '元',
        desc: `物业费 = 物业费单价 × 建筑面积 × 已使用月数(${wuyeFeeStandard} * ${area} * ${useMonth})`
      }])
    }
    this.setData({
      lastList
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