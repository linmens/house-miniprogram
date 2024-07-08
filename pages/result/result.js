import {
  getCurrentCachedData
} from '../../utils/util'
import {
  buyTypes,
  chanquanTypes,
  selfHouseTypes,
  unitTypes,
  areaTypes,
  orderTypes,
  tabs
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
import Toast, {
  hideToast
} from 'tdesign-miniprogram/toast/index';
Page({
  options: {},
  /**
   * 页面的初始数据
   */
  behaviors: [sendBehavior, basicBehavior, extendBehavior, marryBehavior, divorceBehavior, newerBehavior],
  data: {
    orderTypes,
    tabs,
    chanquanTypes,
    calcForm: {},
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
      yinhuaRate: 0,
      // 土地增值税
      tudizengzhiRate: 0,
      // 个税
      geshuiRate: 0.01,
      // 差额个税比例
      ceGeshuiRate: 0.2,
      // 契税
      qishuiRate: 0.01
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
      zengzhishui: 0,
      zengzhishuiTotal: 0,
      halfZengzhishuiTotal: 0,
      geshui: 0,
      localshui: 0,
      halfLocalshui: 0,
      cityshui: 0,
      halfCityshui: 0,
      edushui: 0,
      halfEdushui: 0,
      details: [],
      total: 0,
      type: 'seller',
      serviceFee: 0,
      custom: true,
    },
    // 买方费用
    buyer: {
      geshui: 0,
      qishui: 0,
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
  onLoad(options) {
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
    this.initResult()
  },
  /**
   * 计算结果
   */
  async initResult() {
    // Toast({
    //   context: this,
    //   selector: '#t-toast',
    //   message: '加载中...',
    //   theme: 'loading',
    //   direction: 'column',
    // });
    // 先判断角色
    const userIndexLocal = wx.getStorageSync('userIndex')
    const {
      forWhoIndex,
      bankType,
      orderType,
      buyIndex
    } = this.data.calcForm
    console.log(userIndexLocal)
    switch (buyIndex) {
      case 0:
        // 二手房
        // 计算税费
        console.log('开始计算二手房税费...')
        await this.calcShuifei();

        break;
      case 1:
        // 新房

        console.log('开始生成新房基本信息')
        this.initNewBasicData()
        this.calcNewer()
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
      orderType
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

      wangqianPrice
    } = this.data.calcForm
    await this.calcQishui()
    await this.setBuyerDetails()
    if (houseType === 1) {
      let newDetails = this.data.buyer.details.concat([{
        label: '印花税',
        value: NP.times(wangqianPrice, 0.00005),
        type: 0
      }])
      console.log(newDetails, 'newDetails')
      this.setData({
        'buyer.details': newDetails
      })
    }
  },
  setZengzhishui() {
    const {
      unit,
      wangqianPrice,
      oldPrice,
    } = this.data.calcForm
    const {
      zengzhishuiRate,
      cityRate,
      eduRate,
      localeduRate,
    } = this.data.shuifeiRate
    let sellerDetails = this.data.seller.details
    let result = {}
    let chaeResult = {}
    result.zengzhishui = NP.round(NP.times(NP.divide(wangqianPrice, 1.05), zengzhishuiRate), 4);

    // 核定结果

    // zengzhiDescItem = {
    //   label: `核定计算 (网签价/1.05*5%) 结果为 ${zengzhishui} ${unit}`,
    // }
    // 差额结果

    // console.log('产权不满2年,增值税为：', result.)
    if (oldPrice) {
      chaeResult.zengzhishui = NP.round(NP.times(NP.divide(NP.minus(wangqianPrice, oldPrice), 1.05), zengzhishuiRate), 4)
      // cezengzhiDescItem = {
      //   label: `差额计算 (网签价-上次价)/1.05*5% 结果为 ${cezengzhishui} ${unit}`
      // }
      // if (zengzhishui < cezengzhishui) {
      //   // 核定小于差额计算结果
      //   zengzhiDescItem.tagOptions = {
      //     type: 'success',
      //     text: '较低'
      //   }

      // } else {
      //   cezengzhiDescItem.tagOptions = {
      //     type: 'success',
      //     text: '较低'
      //   }
      // }

      // console.log('产权不满2年,核定计算增值税为：', chaeResult)
      console.log('产权不满2年,差额计算增值税为：', chaeResult)
      if (chaeResult.zengzhishui) {
        chaeResult.cityshui = NP.round(NP.times(chaeResult.zengzhishui, cityRate, 0.5), 4)
        chaeResult.edushui = NP.round(NP.times(chaeResult.zengzhishui, eduRate, 0.5), 4)
        chaeResult.localshui = NP.round(NP.times(chaeResult.zengzhishui, localeduRate, 0.5), 4)
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
      result.cityshui = NP.round(NP.times(result.zengzhishui, cityRate, 0.5), 4)
      console.log('产权不满2年,城市维护建设税减半征收为：', result.cityshui)

      // 教育税附加税
      result.edushui = NP.round(NP.times(result.zengzhishui, eduRate, 0.5), 4)
      console.log('产权不满2年,教育税附加税减半征收为：', result.edushui)

      // 地方教育附加税
      result.localshui = NP.round(NP.times(result.zengzhishui, localeduRate, 0.5), 4)
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
    } = this.data.calcForm
    if (chanquanYear < 2) {
      this.setZengzhishui()
      this.setGeshui()
      // this.setSellerDetails()

    } else if (chanquanYear >= 2 && chanquanYear < 5) {
      // 满2年及以上 不足5年
      // 个税
      this.setGeshui()
      // this.setSellerDetails()
    } else if (chanquanYear >= 5) {
      // 满5年及以上
      if (chanquanIndex === 1) {
        // 非家庭唯一
        this.setGeshui()
        // this.setSellerDetails()
      } else {
        console.log('产权满5年及以上家庭唯一,个税征收：', 0)
        // this.setSellerDetails()
      }
    }
  },
  setGeshui() {
    const {
      wangqianPrice,
      oldPrice,
      oldBankPrice,
      oldHouseStylePrice,
      oldOtherPrice,
      houseType,
      unit
    } = this.data.calcForm
    const {
      ceZengzhishui,
      ceCityshui,
      ceEdushui,
      ceLocalshui
    } = this.data.seller
    const {
      geshuiRate,
      ceGeshuiRate
    } = this.data.shuifeiRate
    let result = {
      value: 0,
      label: ''
    };
    let ceResult = {
      geshui: 0
    }
    let peroldHouseStylePrice = 0

    if (oldPrice) {
      // 按差额 = 网签 - 历史成交价 - 原始税费 - 贷款利息 等合理费用
      // 转让住房过程中缴纳的税金是指：纳税人在转让住房时实际缴纳的营业税、城市维护建设税、教育费附加、土地增值税、印花税等税金。
      if (oldHouseStylePrice) {
        const maxoldHouseStylePrice = NP.times(oldPrice, 0.1)
        if (oldHouseStylePrice >= maxoldHouseStylePrice) {
          peroldHouseStylePrice = maxoldHouseStylePrice
        } else {
          peroldHouseStylePrice = oldHouseStylePrice
        }
        console.log('不超过原值10%的住房装修费用', peroldHouseStylePrice)
      }
      let minprice = NP.minus(wangqianPrice, oldPrice, peroldHouseStylePrice, oldOtherPrice, oldBankPrice, ceZengzhishui, ceCityshui, ceEdushui, ceLocalshui)
      console.log('当前网签价-原值-合理费用-转让住房过程中缴纳的税金', minprice)
      if (minprice < 0) {
        ceResult.value = 0
        ceResult.label = `网签价-原值-合理费用-转让住房过程中缴纳的税金低于0`
      } else {
        ceResult.value = NP.times(minprice, ceGeshuiRate)
        ceResult.label = `差额计算 (网签价-原值-合理费用-转让住房过程中缴纳的税金)*${ceGeshuiRate} 结果为 ${ceResult.value} ${unit}`
      }
      console.log('产权满5年及以上非家庭唯一,个税按差额征收：', ceResult)
      if (houseType === 0) {
        result.value = NP.times(wangqianPrice, geshuiRate)
        result.label = `网签价*${geshuiRate} 结果为 ${result.value} ${unit}`
      } else {
        result.value = NP.times(wangqianPrice, ceGeshuiRate)
        result.label = `网签价*${ceGeshuiRate} 结果为 ${result.value} ${unit}`
      }
    } else {
      ceResult.value = NP.times(wangqianPrice, ceGeshuiRate)
      ceResult.label = `网签价*${ceGeshuiRate} 结果为 ${ceResult.value} ${unit}`
      if (houseType === 0) {
        result.label = `网签价*${geshuiRate}`
        result.value = NP.times(wangqianPrice, geshuiRate)
      } else {
        result.value = NP.times(wangqianPrice, ceGeshuiRate)
        result.label = `网签价*${ceGeshuiRate}`
      }
      console.log('产权满5年及以上非家庭唯一,普通住宅个税核定征收：', result)
    }
    this.setData({
      'seller.hdGeshui': result,
      'seller.ceGeshui': ceResult,
    })


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
      loanGjjPrice
    } = this.data.calcForm
    // 除依法缴纳的税金外，不动产登记机构只收取不动产登记费。根据相关规定，其中住宅每件80元，非住宅每件550元，车库、车位、储藏室按住宅类每件80元收取
    let houseBookPrice = unit === '元' ? 80 : 80 / 10000
    let newDetails = [...details, ...[{
      label: '契税',
      type: 0,
      value: qishui
    }, {
      label: '首付',
      value: paymentPrice,
      type: 0
    }, {
      label: '商业贷款',
      value: loanPrice,
      type: 0
    }, {
      label: '公积金贷款',
      value: loanGjjPrice,
      type: 0
    }, {
      label: '房本制本费',
      value: houseBookPrice,
      type: 0
    }, {
      label: '户口物业预留金额',
      value: hukouWuyePrice,
      type: 0
    }]]
    let total = NP.plus(qishui, serviceFee, bankPrice, loanPrice, paymentPrice, houseBookPrice, hukouWuyePrice, loanGjjPrice)
    let withoutTotal = NP.plus(qishui, serviceFee, bankPrice, paymentPrice, houseBookPrice, hukouWuyePrice)
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
      ceZengzhishui
    } = this.data.seller
    const {
      oldPrice,
      unit
    } = this.data.calcForm
    const {
      eduRate,
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
    seller.hdTotal = NP.plus(hdZengzhishui, hdGeshui.value, hdEdushui, hdCityshui, hdLocalshui, serviceFee)

    const withoutTotal = this.data.buyer.withoutTotal
    // 核定所有合计
    seller.hdTotalAll = NP.plus(seller.hdTotal, withoutTotal);

    let sellerDetails = this.data.seller.details
    if (oldPrice) {
      // 有原值
      // 差额所有前期合计
      seller.ceTotal = NP.plus(ceZengzhishui, ceCityshui, ceEdushui, ceGeshui.value, ceLocalshui, serviceFee);
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
        result.geshui = hdGeshui.value
        result.total = seller.hdTotalAll
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
        result.geshui = ceGeshui.value
        result.total = seller.ceTotalAll
        result.tagOptions = {
          text: '差额',
          type: 'warning'
        }
        seller.totalList[1].isCurrent = 1
      }

      result.zengzhiDesc = [{
        label: `核定计算 (网签价/1.05*5%) 结果为 ${hdZengzhishui} ${unit}`,
        isLower: hdZengzhishui < ceZengzhishui
      }, {
        label: `差额计算 (网签价-上次价)/1.05*5% 结果为 ${ceZengzhishui} ${unit}`,
        isLower: ceZengzhishui < hdZengzhishui
      }]
      result.geshuiDesc = [{
        label: hdGeshui.label,
        isLower: hdGeshui.value < ceGeshui.value
      }, {
        label: ceGeshui.label,
        isLower: ceGeshui.value < hdGeshui.value
      }]
    } else {
      result.zengzhishui = hdZengzhishui
      result.cityshui = hdCityshui
      result.edushui = hdEdushui
      result.localshui = hdLocalshui
      result.geshui = hdGeshui.value
      result.tagOptions = {
        text: '核定',
        type: 'primary'
      }
      result.zengzhiDesc = [{
        label: `网签价/1.05*5%`,
        isLower: hdZengzhishui < ceZengzhishui
      }]
      result.geshuiDesc = [{
        label: hdGeshui.label
      }]
      result.total = seller.hdTotalAll
    }
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
    }, {
      label: '个税',
      value: result.geshui,
      tagOptions: result.tagOptions,
      type: 0,
      desc: result.geshuiDesc
    }])

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
  /**
   * 判断契税走哪个计算逻辑
   * @param checkIndex 0 90㎡ 以下 1 90㎡ 以上 2 购买非住房
   */
  checkQishuiIndex(checkIndex) {
    const {
      buyerIndex,
      wangqianPrice
    } = this.data.calcForm
    let result = 0
    switch (checkIndex) {
      case 0:
        // 90㎡以下 
        if (buyerIndex === 0) {
          // 首套
          result = NP.times(wangqianPrice, 0.01);
          console.log('家庭首套90㎡及以下', result)
        }
        // 二套
        if (buyerIndex === 1) {
          result = NP.times(wangqianPrice, 0.01);
          console.log('家庭二套90㎡及以下', result)
        }
        // 三套及以上
        if (buyerIndex === 2) {
          result = NP.times(wangqianPrice, 0.03);
          console.log('家庭三套及以上90㎡及以下', result)
        }
        break;
      case 1:
        // 90㎡以上
        if (buyerIndex === 0) {
          // 首套
          result = NP.times(wangqianPrice, 0.015);
          console.log('家庭首套90㎡以上', result)
        }
        // 二套
        if (buyerIndex === 1) {
          result = NP.times(wangqianPrice, 0.02);
          console.log('家庭二套90㎡以上', result)
        }
        // 三套及以上
        if (buyerIndex === 2) {
          result = NP.times(wangqianPrice, 0.03);
          console.log('家庭三套及以上90㎡以上', result)
        }
        break;
      case 2:
        result = NP.times(wangqianPrice, 0.03);
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