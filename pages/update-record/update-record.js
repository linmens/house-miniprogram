import updateRecords from './updateRecords.js'; // 导入升级记录
Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [{
      version: '1.0.8',
      date: '2024-11-25',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '优化功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '优化版本管理升级',
          type: 'text'
        }]
      }]
    }, {
      version: '1.0.7',
      date: '2024-11-25',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '修复继承计算问题、新增重新计算功能',
          type: 'text'
        }]
      }]
    }, {
      version: '1.0.6',
      date: '2024-11-22',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '修复功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '修复贷款计算利率不生效的问题',
          type: 'text'
        }]
      }]
    }, {
      version: '1.0.5',
      date: '2024-11-21',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '新增贷款利率操作历史、复制清单、个税、增值税承担方自定义功能',
          type: 'text'
        }]
      }]
    }, {
      version: '1.0.4',
      date: '2024-11-20',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '新增历史计算功能',
          type: 'text'
        }]
      }]
    }, {
      version: '1.0.3',
      date: '2024-11-20',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '优化功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '优化贷款计算结果滚动',
          type: 'text'
        }]
      }]
    }, {
      version: '1.0.2',
      date: '2024-11-19',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '修复功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '修复契税计算逻辑，调整贷款年限逻辑',
          type: 'text'
        }]
      }]
    }, {
      version: '1.0.1',
      date: '2024-11-18',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '优化细节,完善契税新政策计算逻辑',
          type: 'text'
        }]
      }]
    }, {
      version: '1.0.0',
      date: '2024-08-05',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '新增房贷计算结果，贷款明细',
          type: 'text'
        }]
      }]
    }, {
      version: '0.9.0',
      date: '2024-08-01',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '新增一手房、二手房计算结果生成相应的支付节点',
          type: 'text'
        }]
      }]
    }, {
      version: '0.8.0',
      date: '2024-07-29',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '其他',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '优化公积金、组合贷业务逻辑',
          type: 'text'
        }]
      }]
    }, {
      version: '0.7.0',
      date: '2024-07-25',
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
        theme: 'success',
        data: [{
          text: '首页新增模块快捷计算入口',
          type: 'text'
        }]
      }]
    }, {
      classname: 'h3',
      title: '其他',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '二手房、一手房交易费用计算整体计算流程调整为步骤计算模式',
          type: 'text'
        }]
      }]
    }, {
      version: '0.6.0',
      date: '2024-07-22',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '添加公积金计算结果贷款预贷款校验',
          type: 'text'
        }]
      }, {
        text: '系统',
        theme: 'success',
        data: [{
          text: '添加联系开发者功能',
          type: 'text'
        }]
      }, {
        text: '系统',
        theme: 'success',
        data: [{
          text: '添加隐私协议弹框功能',
          type: 'text'
        }]
      }]
    }, {
      version: '0.5.0',
      date: '2024-07-19',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '添加计算结果快捷滑动至指定模块',
          type: 'text'
        }]
      }]
    }, {
      classname: 'h3',
      title: '其他',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '调整公积金贷款利率生成规则、首付比例逻辑',
          type: 'text'
        }]
      }]
    }, {
      version: '0.4.0',
      date: '2024-07-18',
      classname: 'h2',
      title: '',
      icon: 'send'
    }, {
      classname: 'h3',
      title: '新增功能',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '新增商业贷款月供、利息等结果计算逻辑',
          type: 'text'
        }]
      }]
    }, {
      classname: 'h3',
      title: '其他',
    }, {
      classname: 'ul',
      list: [{
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '调整文档查看方式,优化缓存文档逻辑',
          type: 'text'
        }]
      }, {
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '调整非住宅不可使用公积金、组合贷',
          type: 'text'
        }]
      }]
    }, {
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
        theme: 'success',
        data: [{
          text: '新增联系开发者、反馈入口',
          type: 'text'
        }]
      }, {
        text: '个人房产计算',
        theme: 'primary',
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
        theme: 'success',
        data: [{
          text: '新增关于功能',
          type: 'text'
        }]
      }, {
        text: '系统',
        theme: 'success',
        data: [{
          text: '新增暗黑模式适配',
          type: 'text'
        }]
      }, {
        text: '系统',
        theme: 'success',
        data: [{
          text: '新增更新日志功能',
          type: 'text'
        }]
      }, {
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '新增一手房、二手房相关计算逻辑'
        }]
      }, {
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '新增商业贷款、公积金贷款、组合贷款计算逻辑'
        }]
      }, {
        text: '个人房产计算',
        theme: 'primary',
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
        theme: 'success',
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
        theme: 'primary',
        data: [{
          text: '支持商业贷款、公积金、组合贷、全款切换',
          type: 'text',
        }]
      }, {
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '支持计算单位元、万切换',
          type: 'text'
        }]
      }, {
        text: '个人房产计算',
        theme: 'primary',
        data: [{
          text: '支持买卖、赠与、继承、婚内更名税费计算',
          type: 'text'
        }]
      }, {
        text: '个人房产计算',
        theme: 'primary',
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

    // 将升级记录批量插入到 records
    updateRecords.forEach((record) => {
      this.addVersionUpdate(record);
    });
  },
  addVersionUpdate({
    version,
    date,
    title = '新增功能',
    icon = 'send',
    features = []
  }) {

    let records = JSON.parse(JSON.stringify(this.data.records)); // 深拷贝数据
    const newUpdate = [{
        version,
        date,
        classname: 'h2',
        title: '',
        icon,
      },
      {
        classname: 'h3',
        title,
      },
      {
        classname: 'ul',
        list: features.map(({
          text,
          theme,
          subFeatures
        }) => ({
          text,
          theme,
          data: subFeatures.map(({
            text,
            type
          }) => ({
            text,
            type
          })),
        })),
      },
    ];
    records.unshift(...newUpdate)
    this.setData({
      records
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