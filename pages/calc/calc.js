import {
  unitTypes,
  houseTypes,
  orderTypes,
  buyerTypes,
  serviceFeeTypes,
  tabs,
  loanTypes,
  chanquanTypes,
  loanBackTypes,
  newHouseTypes,
  sexTypes
} from '../../utils/constants';
import Message from 'tdesign-miniprogram/message/index';
import {
  basicBehavior,
  dealBehavior,
  serviceBehavior,
  gongjijinBehavior,
  shangdaiBehavior,
  sellerBehavior,
  buyerBehavior
} from './behavior/index'
import {
  getOldYearTimestamp,
  calculateLoan,
  addDataToCache
} from '../../utils/util';
import NP from 'number-precision'
Page({
  behaviors: [basicBehavior, dealBehavior, serviceBehavior, gongjijinBehavior, sellerBehavior,
    buyerBehavior, shangdaiBehavior
  ],
  /**
   * 页面的初始数据
   */
  data: {
    tabs,
    unitTypes,
    houseTypes,
    orderTypes,
    buyerTypes,
    serviceFeeTypes,
    loanTypes,
    chanquanTypes,
    loanBackTypes,
    newHouseTypes,
    sexTypes,
    stepIndex: 0,
    calcForm: {
      // 组合贷款合计金额
      loanGroupPrice: 0,
      // 保留小数位数
      numPoint: 4,
    },
    currentYear: '',
    mineDate: getOldYearTimestamp(50),
    maxDate: getOldYearTimestamp(0),
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const {
      buyIndex
    } = options
    this.setData({
      currentYear: new Date().getFullYear().toString(),
      options: options,
      'calcForm.buyIndex': Number(buyIndex)
    })
  },
  /**
   * 设置组合贷贷款总金额
   * @param type 0 网签*贷款比例 1 网签-首付
   */
  setLoanGroupPrice(type) {
    return new Promise((resolve, reject) => {
      const {
        pingguPrice,
        paymentPrice,
        paymentRate,
        unit,
        loanGjjMaxPrice
      } = this.data.calcForm
      let loanGroupPrice = 0
      let loanLowPrice = 0
      let wangqianPrice = this.data.calcForm.wangqianPrice
      if (pingguPrice) {
        wangqianPrice = pingguPrice
        console.log('开始使用评估价计算组合贷总贷款金额...')
      }
      switch (type) {
        case 0:
          loanGroupPrice = calculateLoan(wangqianPrice, paymentRate, unit)

          console.log('设置组合贷总金额(网签*贷款比例)', loanGroupPrice)
          break;
        case 1:
          loanGroupPrice = NP.minus(wangqianPrice, paymentPrice)

          console.log('设置组合贷总金额(网签-首付)', loanGroupPrice)
          break;
        default:
          break;
      }
      loanLowPrice = NP.minus(loanGroupPrice, loanGjjMaxPrice)
      if (loanLowPrice < 0) {
        loanLowPrice = 0
      }
      if (loanGroupPrice < loanGjjMaxPrice) {
        this.setData({
          'calcForm.loanGjjMaxPrice': loanGroupPrice
        })
      }
      this.setData({
        'calcForm.loanGroupPrice': loanGroupPrice,
        'calcForm.loanLowPrice': loanLowPrice
      })
      resolve()
    })
  },
  // 贷款方式 0 商业贷款 1 公积金 2组合贷 3全款
  async onBankTypeChange(e) {
    const {
      value
    } = e.detail
    const {
      houseType,
      buyerIndex
    } = this.data.calcForm

    if (value === 1 && houseType === 1) {

      Message.warning({
        context: this,
        offset: [0, 32],
        duration: 3000,
        content: '非住宅暂不支持公积金计算',
      });
      return
    }
    if (value === 2 && houseType === 1) {

      Message.warning({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '非住宅暂不支持组合贷计算',
      });
      return
    }
    if (value !== 3 && buyerIndex === 2) {

      Message.warning({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '买方家庭3套及以上无法贷款',
      });
      return
    }
    this.setData({
      'calcForm.bankType': value,
    })
    console.log('贷款方式发生改变', tabs)
    console.log('设置贷款方式：', value)
    await this.setBankPrice()
    await this.setPaymentRate()
    this.switchBankType()
  },
  handleClickStart() {

    const timestamp = new Date().getTime();
    addDataToCache(this.data.calcForm, timestamp)

    wx.navigateTo({
      url: `/pages/result/result?timestamp=${timestamp}`,
    })
  },
  handlePrev() {
    const {
      stepIndex
    } = this.data
    if (stepIndex >= 0) {
      this.setData({
        stepIndex: stepIndex - 1
      })
    }
  },
  async handleNext() {
    const {
      stepIndex
    } = this.data

    if (stepIndex === 0) {
      // 基本信息点击下一步
      await this.stepBasic()
    }
    if (stepIndex === 1) {
      // 交易信息点击下一步
      await this.stepDeal()
    }
    this.setData({
      stepIndex: stepIndex + 1
    })
  },
  stepBasic() {
    const {
      area,
      buyerIndex,
      houseType,
      exchangeType,
      oldPriceIndex,
      oldPrice
    } = this.data.calcForm
    let tabs = this.data.tabs
    return new Promise((resolve, reject) => {
      if (!area) {
        Message.warning({
          context: this,
          offset: [90, 32],
          duration: 3000,
          content: '请输入建筑面积',
        });
        reject({
          code: 0,
          msg: '请输入建筑面积'
        })
      }
      if (oldPriceIndex === 0 && exchangeType === 0) {
        if (!oldPrice) {
          Message.warning({
            context: this,
            offset: [90, 32],
            duration: 3000,
            content: '请输入原值',
          });
          reject({
            code: 0,
            msg: '请输入原值'
          })
          return
        }
      }
      if (buyerIndex === 2) {
        // 买方家庭3套及以上
        tabs[0].disabled = true
        tabs[1].disabled = true
        tabs[2].disabled = true
        this.setData({
          'calcForm.bankType': 3,
          tabs: tabs
        })
      }
      if (houseType === 1) {
        tabs[1].disabled = true
        tabs[2].disabled = true
        this.setData({
          tabs: tabs
        })
      }

      resolve()
    })
  },
  stepDeal() {
    const {
      buyIndex,
      totalPrice,
      wangqianPrice
    } = this.data.calcForm
    return new Promise(async (resolve, reject) => {
      if (!totalPrice || totalPrice <= 0) {
        Message.warning({
          context: this,
          offset: [90, 32],
          duration: 3000,
          content: '请输入正确的交易总价！',
        });
        reject({
          code: 0,
          msg: '请输入正确的交易总价！'
        })
        return
      }
      if (wangqianPrice <= 0 || !wangqianPrice) {
        Message.warning({
          context: this,
          offset: [90, 32],
          duration: 3000,
          content: '请输入正确的网签价格！',
        });
        reject({
          code: 0,
          msg: '请输入正确的网签价格！'
        })
        return
      }
      // 如果是二手房
      if (buyIndex === 0) {
        await this.setPaymentRate()
        await this.switchBankType()
        // 设置居间服务费
        await this.setBankPrice()
        await this.setServiceFee()
      }
      // 新房
      if (buyIndex === 1) {
        await this.setPaymentRate()
        await this.switchBankType()
      }
      resolve()
    })
  },
  /**
   * 支付方式切换
   */
  async switchBankType() {
    const {
      bankType,
      paymentRate,
      loanIndex,
      loanGjjIndex,
      pingguPrice,
      unit
    } = this.data.calcForm
    switch (bankType) {
      case 0:
        console.log('开始计算商业贷款部分...')
        await this.setLoanPrice(1)
        // 设置贷款年限
        if (loanIndex === 6) {
          await this.setLoanYear();
        }
        this.setPaymentPrice()
        break;
      case 1:
        console.log('开始计算公积金贷款部分...')
        console.log('开始计算公积金贷款金额...')
        this.setLoanGjjMaxPrice()
        await this.setLoanGjjPrice(0)
        // 设置贷款年限
        if (loanGjjIndex === 6) {
          await this.setLoanGjjYear();
        }
        this.setPaymentPrice()
        break;
      case 2:
        console.log('开始计算组合贷部分...')
        console.log('开始计算组合贷金额...')
        this.setLoanGjjMaxPrice()
        await this.setLoanGroupPrice(0)
        await this.setLoanGjjPrice(2);

        this.setLoanPrice(2)
        // console.log('设置组合贷商业贷款部分', newLoanPrice)
        // 设置贷款年限
        if (loanIndex === 6) {
          await this.setLoanYear();
        }
        if (loanGjjIndex === 6) {
          await this.setLoanGjjYear();
        }
        this.setPaymentPrice()
        break;
      default:
        break;
    }
    // console.log('计算条件', {
    //   '网签金额': wangqianPrice,
    //   '首付比例': paymentRate,
    //   '贷款方式': bankType,
    //   '房屋新旧': buyIndex
    // })

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