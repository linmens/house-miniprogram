import Message from 'tdesign-miniprogram/message/index';
import envConfig from '../../env.config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    miniProgram: {},
    showDeveloper: false,
    envConfig: envConfig
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const appInfo = wx.getAccountInfoSync()
    this.setData({
      miniProgram: appInfo.miniProgram
    })
  },
  handleCopy(e) {
    const {
      copy
    } = e.currentTarget.dataset
    console.log(copy)
    let t = this
    wx.setClipboardData({
      data: copy,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data, '2') // data
          }
        })
      },
      fail(res) {
        console.log(res)
      }
      // success: () => {
      //   console.log(Message)
      //   Message.success({
      //     context: t,
      //     offset: [90, 32],
      //     duration: 5000,
      //     content: '复制成功！',
      //   });
      // }
    })
  },
  showDialog(e) {
    const {
      key,
      contentKey
    } = e.currentTarget.dataset;
    this.setData({
      [key]: true,
      dialogKey: key,
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
    const page = getCurrentPages().pop();
    this.selectComponent("#tabbar").setData({
      value: page.route
    })
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