// pages/update-record/update-record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [{
      version: '0.3.0',
      date: '2024-07-16',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '系统',
        classname: 'highlight',
        data: [{
          text: '新增联系开发者、反馈入口',
          type: 'text'
        }]
      }, {
        text: '个人房产计算',
        classname: 'highlight',
        data: [{
          text: '新增公积金借款人性别、年龄、基数自定义',
          type: 'text'
        }]
      }]
    }, {
      version: '0.2.0',
      date: '2024-07-01',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '系统',
        classname: 'highlight',
        data: [{
          text: '新增关于功能',
          type: 'text'
        }]
      }, {
        text: '系统',
        classname: 'highlight',
        data: [{
          text: '新增暗黑模式适配',
          type: 'text'
        }]
      }, {
        text: '系统',
        classname: 'highlight',
        data: [{
          text: '新增更新日志功能',
          type: 'text'
        }]
      }, {
        text: '个人房产计算',
        classname: 'highlight',
        data: [{
          text: '新增新房、二手房相关计算逻辑'
        }]
      }, {
        text: '个人房产计算',
        classname: 'highlight',
        data: [{
          text: '新增商业贷款、公积金贷款、组合贷款计算逻辑'
        }]
      }, {
        text: '个人房产计算',
        classname: 'highlight',
        data: [{
          text: '新增计算结果、费用明细、计算依据'
        }]
      }]
    }, {
      classname: 'h3',
      title: '其他',
    }, {
      classname: 'ul',
      list: [{
        text: '系统',
        classname: 'highlight',
        data: [{
          text: '初始化系统功能'
        }]
      }]
    }, {
      version: '0.1.0',
      date: '2024-06-16',
      classname: 'h2 h2-last',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        classname: 'highlight',
        data: [{
          text: '支持商业贷款、公积金、组合贷、全款切换',
          type: 'text',
        }]
      }, {
        text: '个人房产计算',
        classname: 'highlight',
        data: [{
          text: '支持计算单位元、万元切换',
          type: 'text'
        }]
      }, {
        text: '个人房产计算',
        classname: 'highlight',
        data: [{
          text: '支持买卖、赠与、继承、婚内更名税费计算',
          type: 'text'
        }]
      }, {
        text: '个人房产计算',
        classname: 'highlight',
        data: [{
          text: '支持交易总价、网签金额、户口物业预留金额、首付比例、原值、产证持有、是否唯一住房、买方家庭、居间服务费比例、贷款服务费自定义',
          type: 'text'
        }]
      }]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取页面实例
    const page = this;

    // 使用选择器获取最后一个 .h2 元素
    const query = wx.createSelectorQuery();
    query.selectAll('.timeline .h2').boundingClientRect(function (res) {
      console.log(res, 's')
      // 找到最后一个 .h2 元素
      if (res.length > 0) {
        const lastH2Index = res.length - 1;
        const lastH2 = res[lastH2Index].id;

        // 动态为最后一个 .h2 元素添加类名
        page.setData({
          lastH2: lastH2
        });
      }
    }).exec();
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