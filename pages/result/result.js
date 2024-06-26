import {
  getCurrentCachedData
} from '../../utils/util'
import {
  buyTypes,
  chanquanTypes,
  selfHouseTypes,
  unitTypes,
  areaTypes,
  orderTypes
}
from '../../utils/constants';
import NP from 'number-precision'
Page({
  options: {},
  /**
   * 页面的初始数据
   */
  data: {
    orderTypes,
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
      geshui: 0,
      qishui: 0,
      zengzhishui: 0
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
  initResult() {
    // 先判断角色
    const userIndexLocal = wx.getStorageSync('userIndex')
    const {
      forWhoIndex,
      bankType
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
          this.calcShuifei()
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
  calcShuifei() {
    // 判断变更类型
    const {
      exchangeType
    } = this.data.calcForm
    switch (exchangeType) {
      case 0:
        // 买卖
        // 计算卖方税费
        this.calcSeller()
        break;
      case 1:
        // 赠与
        break;
      case 2:
        // 继承
        break;
      case 3:
        // 婚内更名
        break;
      case 4:
        // 离婚分割
        break;
      default:
        break;
    }
  },
  calcSeller() {
    // 判断产权持有年限
    const {
      chanquanYear,
      wangqianPrice,
      oldPrice
    } = this.data.calcForm
    const {
      zengzhishuiRate,
      cityRate,
      eduRate,
      localeduRate,
      geshuiRate
    } = this.data.shuifeiRate
    if (chanquanYear < 2) {
      // 产权不满2年
      const zengzhishui = NP.round(NP.times(wangqianPrice, zengzhishuiRate), 0);
      console.log('产权不满2年,增值税为：', zengzhishui)
      const cityshui = NP.round(NP.times(zengzhishui, cityRate), 0);
      const hedingCityshui = NP.round(NP.times(cityshui, 0.5), 0)
      console.log('产权不满2年,城市维护建设税全额征收为：', cityshui)
      console.log('产权不满2年,城市维护建设税减半征收为：', hedingCityshui)
      const edushui = NP.round(NP.times(zengzhishui, eduRate), 0)
      const hedingEdushui = NP.round(NP.times(edushui, 0.5), 0)
      console.log('产权不满2年,教育税附加税全额征收为：', edushui)
      console.log('产权不满2年,城市维护建设税减半征收为：', hedingEdushui)
      const localshui = NP.round(NP.times(zengzhishui, localeduRate), 0)
      const hedingLocalshui = NP.round(NP.times(localshui, 0.5), 0)
      console.log('产权不满2年,地方教育附加税全额征收为：', localshui)
      console.log('产权不满2年,城市维护建设税减半征收为：', hedingLocalshui)
      const zengzhishuiTotal = NP.plus(zengzhishui, cityshui, edushui, localshui)
      const hedingZengzhishuiTotal = NP.plus(zengzhishui, hedingCityshui, hedingEdushui, hedingLocalshui)
      console.log('产权不满2年,全额征收小计：', zengzhishuiTotal)
      console.log('产权不满2年,减半征收小计：', hedingZengzhishuiTotal)
      const geshui = NP.round(NP.times(wangqianPrice, geshuiRate), 0)
      console.log('产权不满2年,个税核定征收：', geshui)
      if (oldPrice) {
        const trueGeshui = NP.round(NP.times(NP.minus(wangqianPrice, oldPrice), 0.2), 0)
        console.log('产权不满2年,个税据实征收：', trueGeshui)
      }

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