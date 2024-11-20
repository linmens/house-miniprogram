// 计算历史
import {
  getCachedData
} from '../../utils/util'
import dayjs from 'dayjs'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const localData = getCachedData()

    // 转换为符合要求的格式并排序
    const objectToArray = Object.entries(localData)
      .map(([timestamp, values]) => {
        const timeInMs = timestamp.length === 13 ? Number(timestamp) : Number(timestamp) * 1000;
        return {
          timestamp: timeInMs,
          formattedTimestamp: dayjs(timeInMs).format('YYYY-MM-DD HH:mm:ss'),
          ...values
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp); // 按时间戳降序排序
    this.setData({
      list: objectToArray
    })
    console.log(localData, objectToArray, 'localData')
  },
  onResultBtnClick(e) {
    const {
      index
    } = e.currentTarget.dataset
    let currentItem = this.data.list[index]
    if (currentItem) {
      if (currentItem.type === 'bank') {
        wx.navigateTo({
          url: `/pages/result-bank/result-bank?timestamp=${currentItem.timestamp}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/result/result?timestamp=${currentItem.timestamp}`,
        })
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