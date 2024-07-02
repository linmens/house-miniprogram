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
Page({
  options: {},
  /**
   * 页面的初始数据
   */
  behaviors: [sendBehavior, basicBehavior, extendBehavior],
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
      trueGeshui: 0,
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
      // 是否有减半征收政策
      isHalf: 0,
      custom: true
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
    // 先判断角色
    const userIndexLocal = wx.getStorageSync('userIndex')
    const {
      forWhoIndex,
      bankType,
      orderType
    } = this.data.calcForm
    console.log(userIndexLocal)
    switch (userIndexLocal) {
      case 0:
        // 居间机构
        // 判断给客户 还是给业主
        if (forWhoIndex === 0) {
          // 给客户


          // 计算税费
          console.log('开始给客户计算税费...')
          await this.calcShuifei();

          // 判断贷款方式

          switch (bankType) {
            case 0:
              // 商业贷款
              // calcShangeye()
              break;
            case 1:
              // 公积金
              // calcGongjijin()
              break;
            case 2:
              // 组合贷
              // calcGroup()
              break;
            case 3:
              // 全款
              // calcNoBank()
              break;
            default:
              break;
          }
        } else {
          // 给业主
        }
        break;

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
        this.calcSeller()
        this.calcBuyer()
        this.calcTotal();
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
        this.calcExtender()
        this.calcExtenderAll()
        this.initExtendList()
        break;
      case 3:
        // 婚内更名
        break;
      case 3:
        // 离婚分割
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
    await this.calcQishui()
    this.setBuyerDetails()
  },
  setZengzhishui() {
    const {
      chanquanYear,
      wangqianPrice,
      chanquanIndex,
    } = this.data.calcForm
    const {
      zengzhishuiRate,
      cityRate,
      eduRate,
      localeduRate,
    } = this.data.shuifeiRate
    let sellerDetails = this.data.seller.details
    let result = {}
    result.zengzhishui = NP.times(wangqianPrice, zengzhishuiRate)
    console.log('产权不满2年,增值税为：', result.zengzhishui)
    if (result.zengzhishui) {
      // 城市维护建设税
      result.cityshui = NP.times(result.zengzhishui, cityRate);
      result.halfCityshui = NP.times(result.cityshui, 0.3)
      console.log('产权不满2年,城市维护建设税全额征收为：', result.cityshui)
      console.log('产权不满2年,城市维护建设税减半征收为：', result.halfCityshui)

      // 教育税附加税
      result.edushui = NP.times(result.zengzhishui, eduRate)
      result.halfEdushui = NP.times(result.edushui, 0.3)
      console.log('产权不满2年,教育税附加税全额征收为：', result.edushui)
      console.log('产权不满2年,教育税附加税减半征收为：', result.halfEdushui)

      // 地方教育附加税
      result.localshui = NP.times(result.zengzhishui, localeduRate)
      result.halfLocalshui = NP.times(result.localshui, 0.3)
      console.log('产权不满2年,地方教育附加税全额征收为：', result.localshui)
      console.log('产权不满2年,地方教育附加税减半征收为：', result.halfLocalshui)

      // 小计
      result.zengzhishuiTotal = NP.plus(result.zengzhishui, result.cityshui, result.edushui, result.localshui)
      result.halfZengzhishuiTotal = NP.plus(result.zengzhishui, result.halfCityshui, result.halfEdushui, result.halfLocalshui)
      console.log('产权不满2年,全额征收小计：', result.zengzhishuiTotal)
      console.log('产权不满2年,减半征收小计：', result.halfZengzhishuiTotal)



      console.log('产权不满2年', result)

      const {
        zengzhishui,
        cityshui,
        halfCityshui,
        edushui,
        halfEdushui,
        localshui,
        halfLocalshui
      } = result
      sellerDetails = sellerDetails.concat([{
        label: '增值税',
        type: 0,
        value: zengzhishui,
      }, {
        label: '城市维护建设税',
        type: 1,
        value: {
          default: cityshui,
          extra: halfCityshui
        },
      }, {
        label: '教育税附加税',
        type: 1,
        value: {
          default: edushui,
          extra: halfEdushui
        }
      }, {
        label: '地方教育附加税',
        type: 1,
        value: {
          default: localshui,
          extra: halfLocalshui
        }
      }])
      this.setData({
        'seller.zengzhishui': result.zengzhishui,
        'seller.cityshui': result.cityshui,
        'seller.halfCityshui': result.halfCityshui,
        'seller.edushui': result.edushui,
        'seller.halfEdushui': result.halfEdushui,
        'seller.localshui': result.localshui,
        'seller.halfLocalshui': result.halfLocalshui,
        'seller.zengzhishuiTotal': result.zengzhishuiTotal,
        'seller.halfZengzhishuiTotal': result.halfZengzhishuiTotal,
        'seller.details': sellerDetails
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
      wangqianPrice,
      chanquanIndex,
    } = this.data.calcForm

    const {
      zengzhishuiRate,
      cityRate,
      eduRate,
      localeduRate,
    } = this.data.shuifeiRate
    let result = {
      trueGeshui: 0
    }
    if (chanquanYear < 2) {
      this.setZengzhishui()
      this.setGeshui()
      this.setSellerDetails()
      this.setData({
        'seller.isHalf': 1
      })
    } else if (chanquanYear >= 2 && chanquanYear < 5) {
      // 满2年及以上 不足5年
      // 个税
      this.setGeshui()
      this.setSellerDetails()
    } else if (chanquanYear >= 5) {
      // 满5年及以上
      if (chanquanIndex === 1) {
        // 非家庭唯一
        this.setGeshui()
        this.setSellerDetails()
      } else {
        console.log('产权满5年及以上家庭唯一,个税征收：', 0)
        this.setSellerDetails()
      }
    }
  },
  setGeshui() {
    const {
      wangqianPrice,
      oldPrice
    } = this.data.calcForm
    const {
      geshuiRate
    } = this.data.shuifeiRate
    let sellerDetails = this.data.seller.details
    let result = {
      trueGeshui: 0
    };
    // 个税
    result.geshui = NP.times(wangqianPrice, geshuiRate)
    console.log('产权满5年及以上非家庭唯一,个税核定征收：', result.geshui)
    if (oldPrice) {
      result.trueGeshui = NP.times(NP.minus(wangqianPrice), 0.2)
      console.log('产权满5年及以上非家庭唯一,个税据实征收：', oldPrice, result.trueGeshui)

    }
    sellerDetails = sellerDetails.concat([{
      label: '个税',
      type: 2,
      value: {
        default: result.geshui,
        extra: result.trueGeshui
      },
    }])
    this.setData({
      'seller.geshui': result.geshui,
      'seller.trueGeshui': result.trueGeshui,
      'seller.details': sellerDetails
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
    this.setData({
      'buyer.details': newDetails,
      'buyer.total': total,
      'buyer.withoutTotal': withoutTotal
    })
  },
  calcTotal() {
    const {
      total,
      halfTotal,
      realTotal,
      halfrealTotal,
      isHalf
    } = this.data.seller
    const {
      oldPrice
    } = this.data.calcForm
    const buyerTotal = this.data.buyer.total
    const withoutTotal = this.data.buyer.withoutTotal
    // 核定所有合计
    let totalAll = NP.plus(total, withoutTotal)
    let halfTotalAll = NP.plus(halfTotal, withoutTotal)
    // 据实所有合计
    let realTotalAll = NP.plus(realTotal, withoutTotal)
    let halfRealTotalAll = NP.plus(halfrealTotal, withoutTotal)
    let totalDetails = [{
      title: '核定征收',
      theme: 'primary',
      show: 1,
      data: [{
        label: '全额',
        value: totalAll,
        show: 1
      }, {
        label: '减半',
        value: halfTotalAll,
        show: isHalf
      }]
    }, {
      title: '据实征收',
      theme: 'warning',
      show: oldPrice ? 1 : 0,
      data: [{
        label: '全额',
        value: realTotalAll,
        show: 1
      }, {
        label: '减半',
        value: halfRealTotalAll,
        show: isHalf
      }]
    }]
    this.setData({
      'result.totalAll': totalAll,
      'result.halfTotalAll': halfTotalAll,
      'result.realTotalAll': realTotalAll,
      'result.halfRealTotalAll': halfRealTotalAll,
      'result.details': totalDetails
    })
  },
  setSellerDetails() {
    const {
      geshui,
      trueGeshui,
      zengzhishui,
      cityshui,
      halfCityshui,
      edushui,
      halfEdushui,
      localshui,
      halfLocalshui,
      zengzhishuiTotal,
      qishui,
      halfZengzhishuiTotal,
      serviceFee,
      details
    } = this.data.seller

    console.log(zengzhishuiTotal, geshui, serviceFee)
    console.log(zengzhishuiTotal, trueGeshui, serviceFee)
    // 核定
    let total = NP.plus(zengzhishuiTotal, geshui, serviceFee)
    let halfTotal = NP.plus(halfZengzhishuiTotal, geshui, serviceFee)
    // 据实
    let realTotal = NP.plus(zengzhishuiTotal, trueGeshui, serviceFee)
    let halfrealTotal = NP.plus(halfZengzhishuiTotal, trueGeshui, serviceFee)
    this.setData({
      'seller.total': total,
      'seller.halfTotal': halfTotal,
      'seller.realTotal': realTotal,
      'seller.halfrealTotal': halfrealTotal
    })
  },
  /**
   * 判断契税走哪个计算逻辑
   * @param checkIndex 0 90㎡ 以下 1 90㎡ 以上
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
      wangqianPrice
    } = this.data.calcForm
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