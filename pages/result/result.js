import {
  getCurrentCachedData,
  downloadAndOpenFile
} from '../../utils/util'

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
  documentsGroupBykey
} from '../../constants/taxList'
console.log(documentsGroupBykey, 'documentsGroupBykey..documentsGroupBykey')
import Toast, {
  hideToast
} from 'tdesign-miniprogram/toast/index';
Page({
  options: {},
  /**
   * 页面的初始数据
   */
  behaviors: [sendBehavior, basicBehavior, extendBehavior, marryBehavior, divorceBehavior, newerBehavior, tudizengzhishuiBehavior, geshuiBehavior, shangdaiBehavior, gongjijinBehavior],
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
        label: '税费信息',
        value: 1
      },
      {
        label: '贷款信息',
        value: 2
      },
      {
        label: '计税依据',
        value: 3
      },
      // {
      //   label: '支付节点',
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
      hdZengzhishui: 0,
      hdGeshui: {
        value: 0,
        label: '个税'
      },
      hdLocalshui: 0,
      hdCityshui: 0,
      hdEdushui: 0,
      ceGeshui: {
        value: 0,
        label: '个税'
      },
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
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let data = {}
    if (options.timestamp) {
      data = getCurrentCachedData(options.timestamp)
    }
    if (options.data) {
      data = JSON.parse(options.data)
    }
    console.log(options, data, 'options')
    this.setData({
      calcForm: data
    })
    await this.initResult()
    this.calcTabItemHeight();

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
        // 新房
        this.setData({
          'seller.calcPrice': wangqianPrice,
          'seller.calcName': '网签价'
        })
        console.log('开始生成新房基本信息')
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

    let wangqianPrice = this.data.calcForm.wangqianPrice

    const {
      yinhuaRate
    } = this.data.shuifeiRate
    const {
      yinhuaDesc
    } = this.data.shuifeiDesc
    await this.calcQishui()
    await this.setBuyerDetails()
    if (houseType === 1) {
      let newDetails = this.data.buyer.details.concat([{
        label: '印花税',
        value: NP.round(NP.times(calcPrice, yinhuaRate), numPoint),
        type: 0,
        desc: [{
          label: `${calcName}*${0.05}%*0.5`
        }]
      }])
      this.setData({
        'buyer.details': newDetails
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
    let result = {}
    let chaeResult = {}
    result.zengzhishui = NP.round(NP.times(NP.divide(calcPrice, 1.05), zengzhishuiRate), numPoint)
    if (oldPrice) {
      chaeResult.zengzhishui = NP.round(NP.times(NP.minus(calcPrice, oldPrice), zengzhishuiRate), numPoint)
      console.log('产权不满2年,差额计算增值税为：', chaeResult)
      if (chaeResult.zengzhishui) {
        chaeResult.cityshui = NP.round(NP.times(chaeResult.zengzhishui, cityRate, 0.5), numPoint)
        chaeResult.edushui = NP.round(NP.times(chaeResult.zengzhishui, eduRate, 0.5), numPoint)
        chaeResult.localshui = NP.round(NP.times(chaeResult.zengzhishui, localeduRate, 0.5), numPoint)
        console.log('产权不满2年,差额计算', chaeResult)
        this.setData({
          'seller.ceZengzhishui': chaeResult.zengzhishui,
          'seller.ceCityshui': chaeResult.cityshui,
          'seller.ceEdushui': chaeResult.edushui,
          'seller.ceLocalshui': chaeResult.localshui,
        })
      }
    }

    if (result.zengzhishui) {
      // 城市维护建设税
      result.cityshui = NP.round(NP.times(result.zengzhishui, cityRate, 0.5), numPoint)
      console.log('产权不满2年,城市维护建设税减半征收为：', result.cityshui)

      // 教育税附加税
      result.edushui = NP.round(NP.times(result.zengzhishui, eduRate, 0.5), numPoint)
      console.log('产权不满2年,教育税附加税减半征收为：', result.edushui)

      // 地方教育附加税
      result.localshui = NP.round(NP.times(result.zengzhishui, localeduRate, 0.5), numPoint)
      console.log('产权不满2年,地方教育附加税减半征收为：', result.localshui)

      console.log('产权不满2年', result)
      this.setData({
        'seller.hdZengzhishui': result.zengzhishui,
        'seller.hdCityshui': result.cityshui,
        'seller.hdEdushui': result.edushui,
        'seller.hdLocalshui': result.localshui,
      })
    }
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
      isHouseOther
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
      label: '首付',
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
        text: '落地房价',
        type: 'primary'
      },
      value: total
    }, {
      tagOptions: {
        text: '不含贷款',
        type: 'success'
      },
      value: withoutTotal
    }]
    this.setData({
      'buyer.details': newDetails,
      'buyer.total': total,
      'buyer.withoutTotal': withoutTotal,
      'buyer.totalList': totalList
    })
  },
  calcTotal() {
    const {
      hdZengzhishui,
      hdGeshui,
      hdCityshui,
      hdEdushui,
      hdLocalshui,
      serviceFee,
      ceCityshui,
      ceEdushui,
      ceGeshui,
      ceLocalshui,
      ceZengzhishui,
      calcPrice,
      calcName,
      tudizengzhishui,
      geshui
    } = this.data.seller
    const {
      oldPrice,
      unit,
      houseType,
      wangqianPrice
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

    seller.hdTotal = NP.plus(hdZengzhishui, geshui.hdValue, hdEdushui, hdCityshui, hdLocalshui, tudizengzhishui.hdValue, serviceFee)

    const withoutTotal = this.data.buyer.withoutTotal
    // 核定所有合计
    seller.hdTotalAll = NP.plus(seller.hdTotal, withoutTotal);

    let sellerDetails = this.data.seller.details
    if (oldPrice) {
      // 有原值
      // 差额所有前期合计
      seller.ceTotal = NP.plus(ceZengzhishui, ceCityshui, ceEdushui, geshui.ceValue, ceLocalshui, tudizengzhishui.ceValue, serviceFee);
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
        result.zengzhishui = hdZengzhishui
        result.cityshui = hdCityshui
        result.edushui = hdEdushui
        result.localshui = hdLocalshui
        geshui.value = geshui.hdValue
        result.total = seller.hdTotalAll
        tudizengzhishui.value = tudizengzhishui.hdValue
        result.tagOptions = {
          text: '核定',
          type: 'primary'
        }
        seller.totalList[0].isCurrent = 1
      } else {
        // 推荐差额计算
        result.zengzhishui = ceZengzhishui
        result.cityshui = ceCityshui
        result.edushui = ceEdushui
        result.localshui = ceLocalshui
        geshui.value = geshui.ceValue
        result.total = seller.ceTotalAll
        tudizengzhishui.value = tudizengzhishui.ceValue
        result.tagOptions = {
          text: '差额',
          type: 'warning'
        }
        seller.totalList[1].isCurrent = 1
      }

      result.zengzhiDesc = [{
        label: `核定计算 (${calcName}/1.05*5%) 结果为 ${hdZengzhishui} ${unit}`,
        isLower: hdZengzhishui < ceZengzhishui
      }, {
        label: `差额计算 (${calcName}-原值)*5% 结果为 ${ceZengzhishui} ${unit}`,
        isLower: ceZengzhishui < hdZengzhishui
      }]
      // result.geshuiDesc = [{
      //   label: hdGeshui.label,
      //   isLower: hdGeshui.value < ceGeshui.value
      // }, {
      //   label: ceGeshui.label,
      //   isLower: ceGeshui.value < hdGeshui.value
      // }]
    } else {
      // 
      result.zengzhishui = hdZengzhishui
      result.cityshui = hdCityshui
      result.edushui = hdEdushui
      result.localshui = hdLocalshui
      geshui.value = geshui.hdValue
      tudizengzhishui.value = tudizengzhishui.hdValue
      result.tagOptions = {
        text: '核定',
        type: 'primary'
      }
      result.zengzhiDesc = [{
        label: `${calcName}/1.05*5%`,
        isLower: hdZengzhishui < ceZengzhishui
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
      // 非住房
      sellerDetails = sellerDetails.concat([{
        label: '印花税',
        value: NP.times(calcPrice, yinhuaRate),
        type: 0,
        desc: [{
          label: `${calcName}*0.05%*0.5`
        }]
      }])
    }
    this.setData({
      'seller.totalList': seller.totalList,
      'result.totalAll': result.total,
      'seller.details': sellerDetails,
    })
    console.log('设置前期需支付合计seller', seller)
    console.log('设置前期需支付合计result', result)
  },
  setSellerDetails() {
    const {
      serviceFee,
      hdGeshui,
      hdCityshui,
      hdEdushui,
      hdLocalshui,
      hdZengzhishui,
      ceGeshui,
      ceCityshui,
      ceEdushui,
      ceLocalshui,
      ceZengzhishui
    } = this.data.seller

    // 核定
    let hdTotal = NP.plus(hdGeshui, hdCityshui, hdEdushui, hdLocalshui, hdZengzhishui, serviceFee)
    // 差额
    let ceTotal = NP.plus(ceGeshui, ceCityshui, ceEdushui, ceLocalshui, ceZengzhishui, serviceFee)
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
        // 90㎡以下 
        if (buyerIndex === 0) {
          // 首套
          result.value = NP.times(calcPrice, 0.01);
          result.desc = [{
            label: `家庭首套90㎡及以下(${calcName}*0.01)`
          }]
          console.log('家庭首套90㎡及以下', result)
        }
        // 二套
        if (buyerIndex === 1) {
          result.value = NP.times(calcPrice, 0.01);
          result.desc = [{
            label: `家庭二套90㎡及以下(${calcName}*0.01)`
          }]
          console.log('家庭二套90㎡及以下', result)
        }
        // 三套及以上
        if (buyerIndex === 2) {
          result.value = NP.times(calcPrice, 0.03);
          result.desc = [{
            label: `家庭三套及以上90㎡及以下(${calcName}*0.03)`
          }]
          console.log('家庭三套及以上90㎡及以下', result)
        }
        break;
      case 1:
        // 90㎡以上
        if (buyerIndex === 0) {
          // 首套
          result.value = NP.times(calcPrice, 0.015);
          result.desc = [{
            label: `家庭首套90㎡以上(${calcName}*0.015)`
          }]
          console.log('家庭首套90㎡以上', result)
        }
        // 二套
        if (buyerIndex === 1) {
          result.value = NP.times(calcPrice, 0.02);
          result.desc = [{
            label: `家庭二套90㎡以上(${calcName}*0.02)`
          }]
          console.log('家庭二套90㎡以上', result)
        }
        // 三套及以上
        if (buyerIndex === 2) {
          result.value = NP.times(calcPrice, 0.03);
          result.desc = [{
            label: `家庭三套及以上90㎡以上(${calcName}*0.03)`
          }]
          console.log('家庭三套及以上90㎡以上', result)
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

          if (area <= 90) {
            this.checkQishuiIndex(0)
          }
          if (area > 90) {
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