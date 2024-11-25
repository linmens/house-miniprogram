// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideSkip: false,
    // 当前占用缓存大小
    currentSize: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let guideSkip = wx.getStorageSync('guide-skip')

    // if (guideSkip === "") {
    //   wx.setStorageSync('guide-skip', true)
    //   guideSkip = true
    // }
    this.setData({
      guideSkip
    })
    this.getLocalSize()
  },
  guideSkipChange(e) {
    const {
      value
    } = e.detail
    wx.setStorageSync('guide-skip', value)
    this.setData({
      guideSkip: value
    })
  },
  getLocalSize() {
    const currentSize = wx.getStorageInfoSync().currentSize
    console.log(currentSize)
    this.setData({
      currentSize
    })
  },
  clearLocalStorage() {
    const that = this;

    wx.showModal({
      title: '清理缓存',
      content: '确定要清理缓存吗？',
      success(res) {
        if (res.confirm) {
          try {
            const info = wx.getStorageInfoSync();
            const excludeKey = 'guide-skip'; // 要排除的键

            info.keys.forEach((key) => {
              if (key !== excludeKey) {
                wx.removeStorageSync(key); // 删除非排除键的缓存
              }
            });

            wx.showToast({
              title: '缓存清理成功',
              icon: 'success',
            });

            that.getLocalSize(); // 更新缓存信息
          } catch (error) {
            console.error('清理缓存失败:', error);
            wx.showToast({
              title: '缓存清理失败',
              icon: 'none',
            });
          }
        }
      },
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