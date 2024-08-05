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
  sexTypes,
  NoticeData
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
  addDataToCache,
  createSelectorQuery,
  createSelectViewport
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
    options: {},
    // 显示隐藏计算说明
    showNotice: false,
    noticeContent: '',
    confirmBtn: {
      content: '知道了',
      variant: 'base'
    },
    guideCurrent: -1,
    guideSteps: [],
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
    this.initGuide()

  },
  initGuide() {
    const isGuideSkip = wx.getStorageSync('guide-skip')
    if (!isGuideSkip) {
      const {
        buyIndex
      } = this.data.calcForm
      const {
        stepIndex
      } = this.data
      if (buyIndex === 0) {
        this.setData({
          guideCurrent: 0,
          guideSteps: [{
              element: () =>
                createSelectorQuery(`#guide--step-0`, false),

              title: '输入建筑面积',
              body: '此次交易的房屋产证面积。',
              placement: 'top'
            },
            {
              element: () =>
                createSelectorQuery(`#guide--step-1`, false),
              title: '选择买方家庭属性',
              body: '此次购买第几套房产。',
              placement: 'top'
            },
            {
              element: () =>
                createSelectorQuery(`#guide--step-2`, false),
              title: '选择卖方属性',
              body: '此次卖方的房屋是否家庭唯一住房、产证持有年限、是否有契税购房发票等信息。',
              placement: 'top'
            },
            {
              element: () =>
                createSelectorQuery(`#guide--step-3`, false),
              title: '录入交易信息',
              body: '录入交易总价或网签金额，如有户口预留金额请修改金额，默认为10000元。如有银行出具的评估价格，请在评估价格处录入，此次贷款将按网签价与评估价孰低原则计价，默认以网签价计算。',
              placement: 'bottom'
            },
            {
              element: () =>
                createSelectorQuery(`#guide--step-4`, false),
              title: '选择支付方式',
              body: '选择此次购买房产如何支付房款，目前支持商业贷款、公积金、组合贷、全款，如贷款请完善对应贷款信息，系统默认会以现行政策自动计算出此次交易的贷款金额、首付金额、贷款年限、贷款利率等，如需调整请修改即可。',
              placement: 'bottom'
            },
            {
              element: () =>
                createSelectorQuery(`#guide--step-5`, false),
              title: '选择成交方式',
              body: '选择此次购买房产通过何种方式成交，默认为三方成交，目前支持选择三方成交（买卖双方、居间方）、自行成交（买卖双方），如选择三方成交，请完善居间机构信息，居间服务费比例（默认3%）、费用承担方（默认买卖双方各一半,支持选择全部由买方或者卖方承担,或者自定义各方承担的具体金额）。',
              placement: 'top'
            },
            {
              element: () =>
                createSelectorQuery(`#guide--step-5`, false),
              title: '开始计算',
              body: '已经知道怎么操作了，开始尝试计算一次吧！',
              placement: 'top'
            }
          ],
        });
      }
      if (buyIndex === 1) {
        this.setData({
          guideCurrent: 0,
          guideSteps: [{
            element: () =>
              createSelectorQuery(`#guide--step-0`, false),

            title: '输入建筑面积',
            body: '此次交易的房屋产证面积。',
            placement: 'top'
          }, {
            element: () =>
              createSelectorQuery(`#guide--step-1`, false),
            title: '选择买方家庭属性',
            body: '此次购买第几套房产。',
            placement: 'top'
          }, {
            element: () =>
              createSelectorQuery(`#guide--step-3`, false),
            title: '录入交易信息',
            body: '录入交易总价。',
            placement: 'bottom'
          }, {
            element: () =>
              createSelectorQuery(`#guide--step-4`, false),
            title: '选择支付方式',
            body: '选择此次购买房产如何支付房款，目前支持商业贷款、公积金、组合贷、全款，如贷款请完善对应贷款信息，系统默认会以现行政策自动计算出此次交易的贷款金额、首付金额、贷款年限、贷款利率等，如需调整请修改即可。',
            placement: 'bottom'
          }, {
            element: () =>
              createSelectorQuery(`#guide--step-4`, false),
            title: '开始计算',
            body: '已经知道怎么操作了，开始尝试计算一次吧！',
            placement: 'bottom'
          }]
        })
      }
    }
  },
  async guideChange(e) {
    const {
      current
    } = e.detail
    // const rect = await createSelectViewport(`#guide--step-${current}`, false)
    // console.log(rect, '`#guide--step-${current}`')
  },
  guideBack() {
    this.setData({
      guideCurrent: 0,
      stepIndex: 0
    });
  },
  guideSkip() {
    wx.setStorageSync('guide-skip', true)
    this.guideFinish()
  },
  async guideNextClick(e) {

    const {
      current,
      next,
      total
    } = e.detail
    const {
      buyIndex
    } = this.data.calcForm
    console.log(current,
      next,
      total, 's')
    if (buyIndex === 0) {
      if (current === 2) {
        this.setData({
          stepIndex: 1
        })
      }
      if (current === 3) {
        this.setData({
          stepIndex: 2
        })
      }
    }
    if (buyIndex === 1) {
      if (current === 1) {
        this.setData({
          stepIndex: 1
        })
      }
      if (current === 2) {
        this.setData({
          stepIndex: 2
        })
      }
    }
  },
  guideFinish() {
    this.setData({
      guideCurrent: -1,
      stepIndex: 0
    });
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
      buyerIndex,
      loanYear,
      wangqianPrice
    } = this.data.calcForm
    let tabs = this.data.tabs
    if (value === 1 && houseType === 1) {

      Message.info({
        context: this,
        offset: [0, 32],
        duration: 3000,
        content: '非住宅暂不支持公积金计算',
      });
      return
    }
    if (loanYear <= 0) {
      Message.info({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '该房屋房龄过旧,仅支持全款购买',
      });
      tabs[0].disabled = true
      tabs[1].disabled = true
      tabs[2].disabled = true
      this.setData({
        tabs: tabs
      })
      return
    }
    if (value === 2 && houseType === 1) {

      Message.info({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '非住宅暂不支持组合贷计算',
      });
      return
    }
    if (value !== 3 && buyerIndex === 2) {

      Message.info({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '买方家庭3套及以上无法贷款',
      });
      return
    }
    if (value === 3) {
      this.setData({
        'calcForm.bankPrice': 0,
        'calcForm.loanPrice': 0,
        'calcForm.loanGjjPrice': 0,
        'calcForm.paymentPrice': wangqianPrice
      })
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
    this.setData({
      stepIndex: stepIndex - 1
    })
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
      oldPrice,
      loanYear
    } = this.data.calcForm
    let tabs = this.data.tabs
    return new Promise((resolve, reject) => {
      if (!area) {
        Message.info({
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
          Message.info({
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
      wangqianPrice,
      loanYear
    } = this.data.calcForm
    let tabs = this.data.tabs
    return new Promise(async (resolve, reject) => {
      if (!totalPrice || totalPrice <= 0) {
        Message.info({
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
      if (loanYear <= 0) {
        Message.info({
          context: this,
          offset: [90, 32],
          duration: 3000,
          content: '该房屋房龄过旧,仅支持全款购买',
        });
        tabs[0].disabled = true
        tabs[1].disabled = true
        tabs[2].disabled = true
        this.setData({
          'calcForm.bankType': 3,
          tabs: tabs
        })
      }
      if (wangqianPrice <= 0 || !wangqianPrice) {
        Message.info({
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
      // 一手房
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
        // if (loanGjjIndex === 6) {
        //   await this.setLoanGjjYear();
        // }
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
        // if (loanGjjIndex === 6) {
        //   await this.setLoanGjjYear();
        // }
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
  showDialog(e) {
    const {
      key,
      contentKey
    } = e.currentTarget.dataset;
    console.log(contentKey, 'contentKey')
    this.setData({
      [key]: true,
      dialogKey: key,
      noticeContent: NoticeData[contentKey]
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