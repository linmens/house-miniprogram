import {
  getCurrentCachedData,
  downloadAndOpenFile,
} from '../../utils/util'
import dayjs from 'dayjs'

import {
  chanquanTypes,
  orderTypes,
  tabs,
}
from '../../utils/constants';
import NP from 'number-precision'
import {
  sendBehavior
} from './send'
import {
  basicBehavior
} from './basic'
import {
  extendBehavior
} from './extend'
import {
  marryBehavior
} from './marry'
import {
  divorceBehavior
} from './divorce'
import {
  newerBehavior
} from './new'
import {
  tudizengzhishuiBehavior
} from './tudizengzhishui'
import {
  geshuiBehavior
} from './geshui'
import {
  shangdaiBehavior
} from './shangdai'
import {
  gongjijinBehavior
} from './gongjijin'
import {
  payStepsBehavior
} from './pay-steps'
import {
  documentsGroupBykey
} from '../../constants/taxList'
import BigNumber from 'bignumber.js';

Page({
  options: {},
  /**
   * 页面的初始数据
   */
  behaviors: [sendBehavior, basicBehavior, extendBehavior, marryBehavior, divorceBehavior, newerBehavior, tudizengzhishuiBehavior, geshuiBehavior, shangdaiBehavior, gongjijinBehavior, payStepsBehavior],
  data: {
    orderTypes,
    tabs,
    chanquanTypes,
    // 计税依据
    taxListObj: documentsGroupBykey,
    taxTab: 'geshui',
    calcTab: 0,
    calcTabs: [{
        label: '简要信息',
        value: 0
      },
      {
        label: '费用明细',
        value: 1
      },
      {
        label: '贷款信息',
        value: 2
      },
      // {
      //   label: '支付节点',
      //   value: 3
      // },
      // {
      //   label: '计税依据',
      //   value: 4
      // }
    ],
    sectionTops: [],
    scrollTop: 0,
    heightArr: [],
    distance: 0,
    calcForm: {},
    list: [{
      index: 1,
    }],
    // 税费比率
    shuifeiRate: {
      // 增值税
      zengzhishuiRate: 0.05,
      // 城市维护建设税 
      // 纳税人所在地在市区的，税率为百分之七；
      // 纳税人所在地在县城、镇的，税率为百分之五；
      // 纳税人所在地不在市区、县城或者镇的，税率为百分之一。
      cityRate: 0.07,
      // 教育税附加
      eduRate: 0.03,
      // 地方教育附加
      localeduRate: 0.02,
      // 印花税
      yinhuaRate: 0.0005 * 0.5,
      // 土地增值税
      tudizengzhiRate: 0,
      // 个税
      geshuiRate: 0.01,
      // 差额个税比例
      ceGeshuiRate: 0.2,
      // 契税
      qishuiRate: 0.01
    },
    shuifeiDesc: {
      yinhuaDesc: {
        0: [{
          label: '网签价 * 0.0005 * 0.5'
        }],
        1: [{
          label: '评估价 * 0.0005 * 0.5'
        }],
      }
    },
    result: {
      totalAll: 0,
      halfTotalAll: 0,
      realTotalAll: 0,
      halfRealTotalAll: 0,
      details: []
    },
    // 卖方费用
    seller: {
      geshui: {
        hdValue: 0,
        ceValue: 0,
      },
      zengzhishui: {
        hdValue: 0,
        ceValue: 0,
        cityshui: 0,
        edushui: 0,
        localshui: 0
      },
      yinhuashui: 0,
      details: [],
      total: 0,
      serviceFee: 0,
      custom: true,
      calcPrice: 0
    },
    // 买方费用
    buyer: {
      geshui: 0,
      qishui: {},
      type: 'buyer',
      withoutTotal: 0,
      total: 0,
      serviceFee: 0,
      details: [],
      custom: true
    },
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
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
    await this.initResult()
    this.calcTabItemHeight();
    if (this.data.calcForm.exchangeType === 0) {
      this.initPaySteps()
    }
    this.initResultSteps()

  },

  initResultSteps() {
    // 如果是全款并且是二手房买卖 税费、首付、交易费用合计应付
    // 如果是赠与、其他 税费合计应付 前期费用 赠与方
    // 如果是贷款并且是买卖 税费、首付、交易费用合计应付
    const {
      buyIndex,
      bankType,
      loanBackIndex,
      loanYear,
      loanPrice,
      loanGjjPrice,
      unit,
      exchangeType
    } = this.data.calcForm
    const {
      totalAll
    } = this.data.result
    const buyer = this.data.buyer
    const seller = this.data.seller
    const shangdai = this.data.shangdai
    const shangdaiDebx = this.data.shangdaiDebx
    const shangdaiDebj = this.data.shangdaiDebj
    const gongjijinDebx = this.data.gongjijinDebx
    const gongjijinDebj = this.data.gongjijinDebj
    const gongjijin = this.data.gongjijin
    let resultSteps = []
    let totalObj = {
      title: '前期费用',
      h2: exchangeType === 0 ? '税费、交易费用、首付合计应付' : '税费合计应付',
      details: [],
      price: totalAll
    }
    let bankObj = {
      title: '还款信息',
      h2: `${loanBackIndex?'首月应还':'每月应还'}`,
      tags: [`${loanBackIndex?'等额本金':'等额本息'}`, `贷${loanYear}年`],
      price: 0,
      lastMonthPayment: 0,
      extra: '',
      details: []
    }
    let loanResultInfo = {
      price: 0,
      monthlyDecrease: 0
    }

    if (exchangeType === 0) {
      // 买卖
      if (bankType !== 3) {
        // 贷款

        if (bankType === 0) {
          // 商业贷款
          bankObj.tags.splice(0, 0, `商贷${loanPrice}${unit}`)
          if (loanBackIndex === 0) {
            loanResultInfo.price = shangdaiDebx.monthlyPayment
          } else {
            loanResultInfo.price = shangdaiDebj.firstMonthPayment
            loanResultInfo.monthlyDecrease = shangdaiDebj.monthlyDecrease
            bankObj.lastMonthPayment = shangdaiDebj.lastMonthPayment
          }
        }
        if (bankType === 1) {
          // 公积金
          bankObj.tags.splice(0, 0, `公积金贷${loanGjjPrice}${unit}`)
          if (loanBackIndex === 0) {
            loanResultInfo.price = gongjijinDebx.monthlyPayment
          } else {
            loanResultInfo.price = gongjijinDebj.firstMonthPayment
            loanResultInfo.monthlyDecrease = gongjijinDebj.monthlyDecrease
            bankObj.lastMonthPayment = gongjijinDebj.lastMonthPayment
          }
        }
        if (bankType === 2) {
          // 组合贷
          bankObj.tags.splice(0, 0, `组合贷${loanPrice+loanGjjPrice}${unit}`)
          // bankObj.tags.splice(1, 0, `公积金贷${loanGjjPrice}${unit}`)
          if (loanBackIndex === 0) {
            loanResultInfo.price = new BigNumber(gongjijinDebx.monthlyPayment).plus(shangdaiDebx.monthlyPayment).toNumber()
            bankObj.details = [`${shangdaiDebx.monthlyPayment}${unit} (商贷)`, `${gongjijinDebx.monthlyPayment}${unit} (公积金贷)`]
          } else {
            loanResultInfo.price = new BigNumber(gongjijinDebj.firstMonthPayment).plus(shangdaiDebj.firstMonthPayment).toNumber()
            loanResultInfo.monthlyDecrease = new BigNumber(gongjijinDebj.monthlyDecrease).plus(shangdaiDebj.monthlyDecrease).toNumber()
            bankObj.details = [`${shangdaiDebj.firstMonthPayment}${unit} (商贷)`, `${gongjijinDebj.firstMonthPayment}${unit} (公积金贷)`]
            bankObj.lastMonthPayment = new BigNumber(gongjijinDebj.lastMonthPayment).plus(shangdaiDebj.lastMonthPayment).toNumber()
          }
        }
        resultSteps.splice(1, 0, bankObj)
      }
      if (buyIndex === 0) {
        // 二手房
        totalObj.details = [`${buyer.withoutTotal}${unit} (买方)`, `${seller.total}${unit} (卖方)`]
      }
      bankObj.price = loanResultInfo.price
      bankObj.monthlyDecrease = loanResultInfo.monthlyDecrease
      bankObj.extra = `${loanBackIndex?`每月还款金额递减${bankObj.monthlyDecrease}${unit}，其中每月还款的本金不变，利息逐月减少。`:'每月还款金额不变，其中还款的本金逐月递增，利息逐月递减。'}`
    }
    if (exchangeType === 1) {
      // 赠与

    }
    resultSteps.splice(0, 0, totalObj)
    console.log(resultSteps, bankObj, totalObj, loanResultInfo, bankType)
    this.setData({
      'result.steps': resultSteps
    })
  },
  createSelectorQuery(selector, all) {
    return new Promise((resolve) => {
      wx.createSelectorQuery()[all ? 'selectAll' : 'select'](selector).boundingClientRect((rect) => {
        resolve(rect)
      }).exec()
    })
  },

  async calcTabItemHeight() {
    let heightArr = [];
    let h = 0;
    const queryData = (await this.createSelectorQuery('.section', true))
    queryData.forEach((item) => {

      h += item.height
      heightArr.push(h)
    })
    this.setData({
      heightArr: heightArr
    })
  },


  /**
   * 计算结果
   */
  async initResult() {

    // 先判断角色
    const userIndexLocal = wx.getStorageSync('userIndex')
    const {
      buyIndex,
      wangqianPrice,
      pingguPrice,
      bankType,
      exchangeType
    } = this.data.calcForm
    let calcTabs = this.data.calcTabs
    if (bankType === 3 || exchangeType !== 0) {
      calcTabs.splice(2, 1)
    }

    this.setData({
      calcTabs: calcTabs
    })
    // if(buyIndex===0&&bankType===0){
    //   // 二手房商贷
    // }
    switch (buyIndex) {
      case 0:
        // 二手房
        // 判断用哪个金额计算税费
        if (pingguPrice) {
          if (pingguPrice > wangqianPrice) {
            // 评估价高于网签价
            this.setData({
              'seller.calcPrice': pingguPrice,
              'seller.calcName': '评估价'
            })
          } else {
            this.setData({
              'seller.calcPrice': wangqianPrice,
              'seller.calcName': '网签价'
            })
          }
        } else {
          this.setData({
            'seller.calcPrice': wangqianPrice,
            'seller.calcName': '网签价'
          })
        }


        // 计算税费
        console.log('开始计算二手房税费...')

        await this.calcShuifei();

        break;
      case 1:
        // 一手房
        this.setData({
          'seller.calcPrice': wangqianPrice,
          'seller.calcName': '网签价'
        })
        console.log('开始生成一手房基本信息')
        this.initNewBasicData()
        this.calcNewer()
        // 判断贷款方式
        if (bankType === 0) {
          this.startShangdai()
        }
        if (bankType === 1) {
          this.startGongjijin()
        }
        if (bankType === 2) {
          this.startShangdai()
          this.startGongjijin()
        }

        default:
          break;
    }
  },
  /**
   * 计算税费
   */
  async calcShuifei() {
    // 判断变更类型
    const {
      exchangeType,
      orderType,
      bankType
    } = this.data.calcForm
    switch (exchangeType) {
      case 0:
        // 买卖
        // 计算中介费
        if (orderType === 0) {
          this.calcService()
        }
        // 计算卖方税费
        await this.calcBuyer()
        await this.calcSeller()
        await this.calcTotal();
        this.initBuyList()
        // 判断贷款方式
        if (bankType === 0) {
          this.startShangdai()
        }
        if (bankType === 1) {
          this.startGongjijin()
        }
        if (bankType === 2) {
          this.startShangdai()
          this.startGongjijin()
        }
        break;
      case 1:
        // 赠与
        this.calcSender()
        this.calcGetter()
        this.calcSendAll()
        this.initSendList()
        break;
      case 2:
        // 继承
        await this.calcExtender()
        await this.calcExtenderAll()
        this.initExtendList()
        break;
      case 3:
        // 婚内更名
        await this.calcMarryer()
        await this.calcMarryerAll()
        this.initMarryList()
        break;
      case 4:
        // 离婚分割
        await this.calcDivorcer()
        await this.calaAnother()
        await this.calcDivorceAll()
        this.initDivorceList()
        break;
      default:
        break;
    }
  },
  /**
   * 计算居间费用
   */
  calcService() {
    const {
      servicePayerIndex,
      serviceFee,
      serviceBuyer,
      serviceSeller,
      bankPrice
    } = this.data.calcForm
    let items = [];
    let buyerDetails = this.data.buyer.details;
    let sellerDetails = this.data.seller.details
    switch (servicePayerIndex) {
      case 0:
        // 买卖双方各承担一半
        let halfserviceFee = NP.divide(serviceFee, 2)

        console.log('买卖双方各承担一半设置居间服务费：', halfserviceFee)

        items = [{
          label: '居间服务费',
          type: 0,
          value: halfserviceFee
        }]
        buyerDetails = buyerDetails.concat([...items, {
          label: '贷款服务费',
          value: bankPrice,
          type: 0
        }])
        sellerDetails = sellerDetails.concat(items)
        this.setData({
          'buyer.serviceFee': halfserviceFee,
          'seller.serviceFee': halfserviceFee,
          'buyer.details': buyerDetails,
          'seller.details': sellerDetails
        })

        break;
      case 1:
        // 买方承担
        items = [{
          label: '居间服务费',
          type: 0,
          value: serviceFee
        }]
        buyerDetails = buyerDetails.concat([...items, {
          label: '贷款服务费',
          value: bankPrice,
          type: 0
        }])
        this.setData({
          'buyer.serviceFee': serviceFee,
          'buyer.details': buyerDetails,
        })
        console.log('买方承担居间服务费：', serviceFee)
        break;
      case 2:
        // 卖方承担
        items = [{
          label: '居间服务费',
          type: 0,
          value: serviceFee
        }]
        sellerDetails = sellerDetails.concat(items)
        this.setData({
          'seller.serviceFee': serviceFee,
          'seller.details': sellerDetails,
        })
        console.log('卖方承担居间服务费：', serviceFee)
        break;
      case 3:
        // 买卖双方自定义居间服务费

        buyerDetails = buyerDetails.concat([{
          label: '居间服务费',
          value: serviceBuyer,
          type: 0
        }, {
          label: '贷款服务费',
          value: bankPrice,
          type: 0
        }])
        sellerDetails = sellerDetails.concat([{
          label: '居间服务费',
          value: serviceSeller,
          type: 0
        }, {
          label: '贷款服务费',
          value: bankPrice,
          type: 0
        }])
        this.setData({
          'buyer.serviceFee': serviceBuyer,
          'seller.serviceFee': serviceSeller,
          'buyer.details': buyerDetails,
          'seller.details': sellerDetails
        })
        console.log('买卖双方自定义居间服务费买方：', serviceBuyer)
        console.log('买卖双方自定义居间服务费卖方：', serviceSeller)
        break;
      default:
        break;
    }
  },
  /**
   * 计算买方
   */
  async calcBuyer() {
    const {
      houseType,
      pingguPrice,
      numPoint
    } = this.data.calcForm
    const {
      calcPrice,
      calcName
    } = this.data.seller
    const {
      yinhuaRate
    } = this.data.shuifeiRate
    const {
      yinhuaDesc
    } = this.data.shuifeiDesc
    await this.calcQishui()
    await this.setBuyerDetails()
    if (houseType === 1) {
      let yinhuashui = NP.round(NP.times(calcPrice, yinhuaRate), numPoint)
      let newDetails = this.data.buyer.details.concat([{
        label: '印花税',
        value: yinhuashui,
        type: 0,
        desc: [{
          label: `${calcName}*${0.05}%*0.5`
        }]
      }])
      this.setData({
        'buyer.details': newDetails,
        'buyer.yinhuashui': yinhuashui
      })
    }
  },
  setZengzhishui() {
    const {
      unit,

      oldPrice,
      numPoint,

    } = this.data.calcForm
    const {
      zengzhishuiRate,
      cityRate,
      eduRate,
      localeduRate,
    } = this.data.shuifeiRate
    const {
      calcPrice
    } = this.data.seller
    let zengzhishui = {
      value: 0,
      label: '增值税',
      type: 0,
      ceValue: 0,
      hdValue: 0
    }
    let result = {}
    let chaeResult = {}
    zengzhishui.hdValue = NP.round(NP.times(NP.divide(calcPrice, 1.05), zengzhishuiRate), numPoint)
    if (oldPrice) {
      zengzhishui.ceValue = NP.round(NP.times(NP.minus(calcPrice, oldPrice), zengzhishuiRate), numPoint)
      console.log('产权不满2年,差额计算增值税为：', zengzhishui.ceValue)
      if (zengzhishui.ceValue) {
        zengzhishui.cityshui = NP.round(NP.times(zengzhishui.ceValue, cityRate, 0.5), numPoint)
        zengzhishui.edushui = NP.round(NP.times(zengzhishui.ceValue, eduRate, 0.5), numPoint)
        zengzhishui.localshui = NP.round(NP.times(zengzhishui.ceValue, localeduRate, 0.5), numPoint)
        console.log('产权不满2年,差额计算', zengzhishui)
      }
    }

    if (zengzhishui.hdValue) {
      // 城市维护建设税
      zengzhishui.cityshui = NP.round(NP.times(zengzhishui.hdValue, cityRate, 0.5), numPoint)
      console.log('产权不满2年,城市维护建设税减半征收为：', zengzhishui.cityshui)

      // 教育税附加税
      zengzhishui.edushui = NP.round(NP.times(zengzhishui.hdValue, eduRate, 0.5), numPoint)
      console.log('产权不满2年,教育税附加税减半征收为：', zengzhishui.edushui)

      // 地方教育附加税
      zengzhishui.localshui = NP.round(NP.times(zengzhishui.hdValue, localeduRate, 0.5), numPoint)
      console.log('产权不满2年,地方教育附加税减半征收为：', zengzhishui.localshui)

      console.log('产权不满2年', zengzhishui)

    }
    this.setData({
      'seller.zengzhishui': zengzhishui
    })
  },
  /**
   * 计算卖方
   */
  async calcSeller() {
    // 判断产权持有年限
    const {
      chanquanYear,
      chanquanIndex,
      houseType
    } = this.data.calcForm
    if (houseType === 1) {
      this.setZengzhishui()
      this.setTudizengzhishui()
    }
    if (chanquanYear < 2) {
      this.setZengzhishui()
      this.setGeshui()
    } else if (chanquanYear >= 2 && chanquanYear < 5) {
      // 满2年及以上 不足5年
      // 个税
      this.setGeshui()
    } else if (chanquanYear >= 5) {
      // 满5年及以上
      if (chanquanIndex === 1) {
        // 非家庭唯一
        this.setGeshui()
      } else {
        console.log('产权满5年及以上家庭唯一,个税征收：', 0)
      }
    }

  },

  setBuyerDetails() {
    const {
      qishui,
      serviceFee,
      details
    } = this.data.buyer
    const {
      bankPrice,
      paymentPrice,
      loanPrice,
      unit,
      hukouWuyePrice,
      loanGjjPrice,
      houseType,
      isHouseOther,
      bankType
    } = this.data.calcForm
    // 除依法缴纳的税金外，不动产登记机构只收取不动产登记费。根据相关规定，其中住宅每件80元，非住宅每件550元，车库、车位、储藏室按住宅类每件80元收取
    let houseBookPrice = {
      value: 0,
      label: '房本制本费',
      desc: [{
        label: '住宅每件80元，非住宅每件550元，车库、车位、储藏室按住宅类每件80元收取'
      }]
    }
    if (houseType === 0) {
      houseBookPrice.value = unit === '元' ? 80 : 80 / 10000
    } else {
      if (isHouseOther) {
        houseBookPrice.value = unit === '元' ? 80 : 80 / 10000
      } else {
        houseBookPrice.value = unit === '元' ? 550 : 550 / 10000
      }
    }
    let newDetails = [...details, ...[qishui, {
      label: '首付（含定金2万）',
      value: paymentPrice,
      type: 0
    }, {
      label: '商业贷款',
      value: loanPrice,
      type: 0
    }, houseBookPrice, {
      label: '公积金贷款',
      value: loanGjjPrice,
      type: 0
    }, {
      label: '户口物业预留金额',
      value: hukouWuyePrice,
      type: 0
    }]]
    let total = NP.plus(qishui.value, serviceFee, bankPrice, loanPrice, paymentPrice, houseBookPrice.value, hukouWuyePrice, loanGjjPrice)
    let withoutTotal = NP.plus(qishui.value, serviceFee, bankPrice, paymentPrice, houseBookPrice.value, hukouWuyePrice)
    let totalList = [{
      tagOptions: {
        text: '总房款',
        type: 'primary'
      },
      value: total
    }]
    if (bankType !== 3) {
      totalList[1] = {
        tagOptions: {
          text: '不含贷款',
          type: 'success'
        },
        value: withoutTotal
      }
    }
    this.setData({
      'buyer.details': newDetails,
      'buyer.total': total,
      'buyer.withoutTotal': withoutTotal,
      'buyer.totalList': totalList,
      'buyer.houseBookPrice': houseBookPrice.value
    })
  },
  calcTotal() {
    const {
      serviceFee,
      calcPrice,
      calcName,
      tudizengzhishui,
      geshui,
      zengzhishui
    } = this.data.seller
    const {
      oldPrice,
      unit,
      houseType,
      numPoint
    } = this.data.calcForm
    const {
      eduRate,
      yinhuaRate,
      localeduRate
    } = this.data.shuifeiRate
    let result = {
      zengzhishui: 0
    }
    let seller = {
      total: 0,
      hdTotalAll: 0,
      ceTotal: 0,
      totalList: []
    }

    seller.hdTotal = NP.plus(zengzhishui.hdValue, geshui.hdValue, zengzhishui.edushui, zengzhishui.cityshui, zengzhishui.localshui, tudizengzhishui.hdValue, serviceFee)

    const withoutTotal = this.data.buyer.withoutTotal
    // 核定所有合计
    seller.hdTotalAll = NP.plus(seller.hdTotal, withoutTotal);

    let sellerDetails = this.data.seller.details
    if (oldPrice) {
      // 有原值
      // 差额所有前期合计
      seller.ceTotal = NP.plus(zengzhishui.ceValue, zengzhishui.cityshui, zengzhishui.edushui, geshui.ceValue, zengzhishui.localshui, tudizengzhishui.ceValue, serviceFee);
      seller.ceTotalAll = NP.plus(seller.ceTotal, withoutTotal)

      seller.totalList = [{
        tagOptions: {
          text: '核定',
          type: 'primary'
        },
        isCurrent: 0,
        value: seller.hdTotal
      }, {
        tagOptions: {
          text: '差额',
          type: 'warning'
        },
        isCurrent: 0,
        value: seller.ceTotal
      }]
      if (seller.hdTotal < seller.ceTotal) {
        // 推荐核定计算
        result.zengzhishui = zengzhishui.hdValue
        result.cityshui = zengzhishui.cityshui
        result.edushui = zengzhishui.edushui
        result.localshui = zengzhishui.localshui
        zengzhishui.value = zengzhishui.hdValue
        geshui.value = geshui.hdValue
        result.total = seller.hdTotalAll
        result.sellerTotal = seller.hdTotal
        tudizengzhishui.value = tudizengzhishui.hdValue
        result.tagOptions = {
          text: '核定',
          type: 'primary'
        }
        seller.totalList[0].isCurrent = 1
      } else {
        // 推荐差额计算
        result.zengzhishui = zengzhishui.ceValue
        result.cityshui = zengzhishui.cityshui
        result.edushui = zengzhishui.edushui
        result.localshui = zengzhishui.localshui
        result.sellerTotal = seller.ceTotal
        geshui.value = geshui.ceValue
        zengzhishui.value = zengzhishui.ceValue
        result.total = seller.ceTotalAll
        tudizengzhishui.value = tudizengzhishui.ceValue
        result.tagOptions = {
          text: '差额',
          type: 'warning'
        }
        seller.totalList[1].isCurrent = 1
      }

      result.zengzhiDesc = [{
        label: `核定计算 (${calcName}/1.05*5%) 结果为 ${zengzhishui.hdValue} ${unit}`,
        isLower: zengzhishui.hdValue < zengzhishui.ceValue
      }, {
        label: `差额计算 (${calcName}-原值)*5% 结果为 ${zengzhishui.ceValue} ${unit}`,
        isLower: zengzhishui.ceValue < zengzhishui.hdValue
      }]
    } else {
      result.sellerTotal = seller.hdTotal
      result.zengzhishui = zengzhishui.hdValue
      result.cityshui = zengzhishui.cityshui
      result.edushui = zengzhishui.edushui
      result.localshui = zengzhishui.localshui
      geshui.value = geshui.hdValue
      zengzhishui.value = zengzhishui.hdValue
      tudizengzhishui.value = tudizengzhishui.hdValue
      result.tagOptions = {
        text: '核定',
        type: 'primary'
      }
      result.zengzhiDesc = [{
        label: `${calcName}/1.05*5%`,
        isLower: zengzhishui.hdValue < zengzhishui.ceValue
      }]
      result.total = seller.hdTotalAll
      seller.totalList = [{
        tagOptions: {
          text: '核定',
          type: 'primary'
        },
        isCurrent: 1,
        value: seller.hdTotal
      }]
    }
    geshui.tagOptions = result.tagOptions
    tudizengzhishui.tagOptions = result.tagOptions
    sellerDetails = sellerDetails.concat([{
      label: '增值税',
      type: 0,
      value: result.zengzhishui,
      tagOptions: result.tagOptions,
      desc: result.zengzhiDesc
    }, {
      label: '城市维护建设税',
      value: result.cityshui,
      type: 0,
      desc: [{
        label: `增值税*0.07*0.5`
      }]
    }, {
      label: '教育税附加税',
      value: result.edushui,
      type: 0,
      desc: [{
        label: `增值税*${eduRate}*0.5`
      }]
    }, {
      label: '地方教育附加税',
      value: result.localshui,
      type: 0,
      desc: [{
        label: `增值税*${localeduRate}*0.5`
      }]
    }, tudizengzhishui, geshui])

    if (houseType === 1) {
      let yinhuashui = NP.round(NP.times(calcPrice, yinhuaRate), numPoint)
      // 非住房
      sellerDetails = sellerDetails.concat([{
        label: '印花税',
        value: yinhuashui,
        type: 0,
        desc: [{
          label: `${calcName}*0.05%*0.5`
        }]
      }])
      this.setData({
        'seller.yinhuashui': yinhuashui
      })
    }
    this.setData({
      'seller.total': result.sellerTotal,
      'seller.totalList': seller.totalList,
      'result.totalAll': result.total,
      'seller.details': sellerDetails
    })
    console.log('设置前期需支付合计seller', seller)
    console.log('设置前期需支付合计result', result)
  },
  setSellerDetails() {
    const {
      serviceFee,
      geshui,
      zengzhishui
    } = this.data.seller

    // 核定
    let hdTotal = NP.plus(geshui.hdValue, zengzhishui.cityshui, zengzhishui.edushui, zengzhishui.localshui, zengzhishui.hdValue, serviceFee)
    // 差额
    let ceTotal = NP.plus(geshui.ceValue, zengzhishui.cityshui, zengzhishui.edushui, zengzhishui.localshui, zengzhishui.ceValue, serviceFee)
    this.setData({
      'seller.hdTotal': hdTotal,
      'seller.ceTotal': ceTotal,
    })
  },
  async onTabsChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      calcTab: value
    })
    const headerOffset = await this.createSelectorQuery('.h-sticky', false)
    const currentItem = await wx.getSystemInfo()
    console.log(currentItem, headerOffset, 'currentItem')
    wx.pageScrollTo({
      offsetTop: -headerOffset.height,
      selector: `#section-${value}`,
      // scrollTop: currentItem.top
    })
  },
  onTaxTabChange(e) {
    const {
      value
    } = e.detail

    this.setData({
      taxTab: value,
    })
  },
  handleTaxItemClick(e) {
    const {
      taxTab
    } = this.data
    console.log(e)
    const {
      id,
      path,
      filetype,
      filename
    } = e.currentTarget.dataset

    downloadAndOpenFile(id, path, filename, filetype)
  },
  /**
   * 判断契税走哪个计算逻辑
   * @param checkIndex 0 90㎡ 以下 1 90㎡ 以上 2 购买非住房
   */
  checkQishuiIndex(checkIndex) {
    const {
      buyerIndex,
      wangqianPrice
    } = this.data.calcForm
    const {
      calcPrice,
      calcName
    } = this.data.seller
    let result = {
      label: '契税',
      value: 0,
      type: 0,
      desc: []
    }
    switch (checkIndex) {
      case 0:
        // 140㎡以下 
        if (buyerIndex === 0) {
          // 首套
          result.value = NP.times(calcPrice, 0.01);
          result.desc = [{
            label: `家庭首套140㎡及以下(${calcName}*0.01)`
          }]
          console.log('家庭首套140㎡及以下', result)
        }
        // 二套
        if (buyerIndex === 1) {
          result.value = NP.times(calcPrice, 0.01);
          result.desc = [{
            label: `家庭二套140㎡及以下(${calcName}*0.01)`
          }]
          console.log('家庭二套140㎡及以下', result)
        }
        // 三套及以上
        if (buyerIndex === 2) {
          result.value = NP.times(calcPrice, 0.03);
          result.desc = [{
            label: `家庭三套及以上(${calcName}*0.03)`
          }]
          console.log('家庭三套及以上', result)
        }
        break;
      case 1:
        // 140㎡以上
        if (buyerIndex === 0) {
          // 首套
          result.value = NP.times(calcPrice, 0.015);
          result.desc = [{
            label: `家庭首套140㎡以上(${calcName}*0.015)`
          }]
          console.log('家庭首套140㎡以上', result)
        }
        // 二套
        if (buyerIndex === 1) {
          result.value = NP.times(calcPrice, 0.02);
          result.desc = [{
            label: `家庭二套140㎡以上(${calcName}*0.02)`
          }]
          console.log('家庭二套140㎡以上', result)
        }
        // 三套及以上
        if (buyerIndex === 2) {
          result.value = NP.times(calcPrice, 0.03);
          result.desc = [{
            label: `家庭三套及以上140㎡以上(${calcName}*0.03)`
          }]
          console.log('家庭三套及以上140㎡以上', result)
        }
        break;
      case 2:
        result.value = NP.times(calcPrice, 0.03);
        result.desc = [{
          label: `购买非住房(${calcName}*0.03)`
        }]
        console.log('购买非住房', result)
        break;
      default:
        break;
    }
    this.setData({
      'buyer.qishui': result
    })
    console.log('设置交易结果-契税：', result)
  },
  /**
   * 计算契税 非北上广深
   */
  calcQishui() {
    const {
      areaIndex,
      buyerIndex,
      area,
      wangqianPrice,
      houseType
    } = this.data.calcForm
    if (houseType === 0) {
      switch (areaIndex) {
        case 0:
          this.checkQishuiIndex(0)
          break;
        case 1:
          this.checkQishuiIndex(1)
          break;
        case 2:
          // 自定义面积

          if (area <= 140) {
            this.checkQishuiIndex(0)
          }
          if (area > 140) {
            this.checkQishuiIndex(1)
          }
          break;
        default:
          break;
      }
    } else {
      this.checkQishuiIndex(2)
    }

  },
  onToTop(e) {
    console.log(e, 'onToTop')
  },
  onPageScroll(e) {
    const {
      calcTab,
      distance
    } = this.data;
    const {
      scrollTop
    } = e
    if (scrollTop >= distance) {
      if (calcTab + 1 < this.data.heightArr.length && scrollTop >= this.data.heightArr[calcTab]) {
        this.setData({
          calcTab: calcTab + 1
        })
      }
    } else {
      if (calcTab - 1 >= 0 && scrollTop < this.data.heightArr[calcTab - 1]) {
        this.setData({
          calcTab: calcTab - 1
        })
      }
    }

    this.setData({
      scrollTop: scrollTop,
      distance: scrollTop
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