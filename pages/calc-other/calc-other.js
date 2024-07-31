import {
  unitTypes,
  fadingTypes,
  fengeTypes,
} from '../../utils/constants';
import Message from 'tdesign-miniprogram/message/index';
import {
  addDataToCache,
  fixPrice
} from '../../utils/util';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unitTypes,
    fadingTypes,
    fengeTypes,
    calcForm: {
      unitIndex: 1,
      unit: '万元',
      pingguPrice: '',
      exchangeType: 1,
      buyIndex: 0,
      numPoint: 4,
      // 是否法定继承人下标
      fadingIndex: 0,
      // 分割条件
      fengeIndex: 0,
    },
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const {
      exchangeType
    } = options
    this.setData({
      options: options,
      'calcForm.exchangeType': Number(exchangeType)
    })
  },
  onFengeTypeChange(e) {
    const {
      index
    } = e.detail
    this.setData({
      'calcForm.fengeIndex': index
    })
  },
  onFadingTypeChange(e) {
    const {
      index
    } = e.detail
    this.setData({
      'calcForm.fadingIndex': index
    })
  },
  /**
   * 元 万元 切换
   * @param {*} e 
   */
  onTypesChange(e) {
    const {
      label,
      index
    } = e.detail;

    const count = label === '元' ? 1 : 10000
    const rate = label === '元' ? 1 : 0.0001
    this.setData({
      'calcForm.unit': label,
      'calcForm.unitCount': count,
      'calcForm.unitIndex': index,
      'calcForm.unitRate': rate,
      'calcForm.numPoint': label === '元' ? 2 : 4
    })
    // 设置所有相关金额的数值
    fixPrice('pingguPrice',this)
  },
  onPingguPriceChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      'calcForm.pingguPrice': value
    })
  },
  handleClickStart() {
    const {
      pingguPrice
    } = this.data.calcForm
    if (!pingguPrice) {
      Message.warning({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '请输入一个评估价格',
      });
      return
    }
    const timestamp = new Date().getTime();
    addDataToCache(this.data.calcForm, timestamp)

    wx.navigateTo({
      url: `/pages/result/result?timestamp=${timestamp}`,
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