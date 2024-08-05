import {
  getCurrentCachedData,
} from '../../utils/util'
import dayjs from 'dayjs'
import {
  shangdaiBehavior
} from './shangdai'
import {
  gongjijinBehavior
} from './gongjijin'
import BigNumber from 'bignumber.js';
Page({
  behaviors: [shangdaiBehavior, gongjijinBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    resultStep: {

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let data = {}
    if (options.timestamp) {
      data = getCurrentCachedData(options.timestamp)
      options.time = dayjs(Number(options.timestamp)).format('YYYY-MM-DD')
    }
    if (options.data) {
      data = JSON.parse(options.data)
    }
    this.setData({
      calcForm: data,
      options
    })
    this.initResult()
  },
  async initResult() {
    const {
      bankType,
      loanBackIndex,
      loanYear,
      unit,
      loanPrice,
      loanGjjPrice
    } = this.data.calcForm

    let bankObj = {
      title: '还款信息',
      h2: `${loanBackIndex?'首月应还':'每月应还'}`,
      tags: [`${loanBackIndex?'等额本金':'等额本息'}`, `贷${loanYear}年`],
      price: 0,
      lastMonthPayment: 0,
      extra: '',
      details: []
    }
    if (bankType === 0) {
      await this.startShangdai()
      const shangdaiDebx = this.data.shangdaiDebx
      const shangdaiDebj = this.data.shangdaiDebj
      // 商业贷款
      bankObj.tags.splice(0, 0, `商贷${loanPrice}${unit}`)
      if (loanBackIndex === 0) {
        bankObj.price = shangdaiDebx.monthlyPayment
      } else {
        bankObj.price = shangdaiDebj.firstMonthPayment
        bankObj.monthlyDecrease = shangdaiDebj.monthlyDecrease
        bankObj.lastMonthPayment = shangdaiDebj.lastMonthPayment
      }
    }
    if (bankType === 1) {
      // 公积金
      await this.startGongjijin()
      const gongjijinDebx = this.data.gongjijinDebx
      const gongjijinDebj = this.data.gongjijinDebj
      bankObj.tags.splice(0, 0, `公积金贷${loanGjjPrice}${unit}`)
      if (loanBackIndex === 0) {
        bankObj.price = gongjijinDebx.monthlyPayment
      } else {
        bankObj.price = gongjijinDebj.firstMonthPayment
        bankObj.monthlyDecrease = gongjijinDebj.monthlyDecrease
        bankObj.lastMonthPayment = gongjijinDebj.lastMonthPayment
      }
    }
    if (bankType === 2) {
      await this.startShangdai()
      await this.startGongjijin()
      // 组合贷
      const shangdaiDebx = this.data.shangdaiDebx
      const shangdaiDebj = this.data.shangdaiDebj
      const gongjijinDebx = this.data.gongjijinDebx
      const gongjijinDebj = this.data.gongjijinDebj
      bankObj.tags.splice(0, 0, `组合贷${new BigNumber(loanPrice).plus(loanGjjPrice)}${unit}`)
      // bankObj.tags.splice(1, 0, `公积金贷${loanGjjPrice}${unit}`)
      if (loanBackIndex === 0) {
        bankObj.price = new BigNumber(gongjijinDebx.monthlyPayment).plus(shangdaiDebx.monthlyPayment).toNumber()
        bankObj.details = [`${shangdaiDebx.monthlyPayment}${unit} (商贷)`, `${gongjijinDebx.monthlyPayment}${unit} (公积金贷)`]
      } else {
        bankObj.price = new BigNumber(gongjijinDebj.firstMonthPayment).plus(shangdaiDebj.firstMonthPayment).toNumber()
        bankObj.monthlyDecrease = new BigNumber(gongjijinDebj.monthlyDecrease).plus(shangdaiDebj.monthlyDecrease).toNumber()
        bankObj.details = [`${shangdaiDebj.firstMonthPayment}${unit} (商贷)`, `${gongjijinDebj.firstMonthPayment}${unit} (公积金贷)`]
        bankObj.lastMonthPayment = new BigNumber(gongjijinDebj.lastMonthPayment).plus(shangdaiDebj.lastMonthPayment).toNumber()
      }
    }
    bankObj.extra = `${loanBackIndex?`每月还款金额递减${bankObj.monthlyDecrease}${unit}，其中每月还款的本金不变，利息逐月减少。`:'每月还款金额不变，其中还款的本金逐月递增，利息逐月递减。'}`
    console.log(bankObj)
    this.setData({
      'resultStep': bankObj
    })
  },
  initResultSteps() {


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