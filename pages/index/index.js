import Toast from 'tdesign-miniprogram/toast/index';
import Message from 'tdesign-miniprogram/message/index';
// import {
//   createClient
// }
// from 'supabase-wechat-stable-v2'
Page({

  options: {
    styleIsolation: 'apply-shared',
  },

  data: {
    currentYear: new Date().getFullYear(),

    userList: ['居间机构', '购房者', '业主', '新房置业顾问'],
    userIndex: '',
    userIndexRember: false,
    userListVisible: false,
    // 显示隐藏计算说明
    showNotice: false,
    noticeContent: '',
    confirmBtn: {
      content: '知道了',
      variant: 'base'
    },
    priceError: false,
    showCustomAreaInput: false,

    customAreaInputVal: '',
    calcForm: {
      // 组合贷款合计金额
      loanGroupPrice: 0,
      // 0 给客户算 1 给业主算
      forWhoIndex: 0,
      // 保留小数位数
      numPoint: 4,

    },

  },
  onShow() {
    const page = getCurrentPages().pop();
    this.selectComponent("#tabbar").setData({
      value: page.route
    })
  },
  onLoad() {
    // const supabaseUrl = 'https://cq29rba5g6h0s3o5amt0.baseapi.memfiredb.com'
    // const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiZXhwIjozMjk2NzY3MTQ5LCJpYXQiOjE3MTk5NjcxNDksImlzcyI6InN1cGFiYXNlIn0.RWr3S2joN1HS8kCHWi38pZ6p9kcFAb9yfAh6c7ollUM"
    // const supabase = createClient(supabaseUrl, supabaseKey)
    // console.log(supabase, 'supabase')
  },

  handleNavbarLeft() {
    // wx.showToast({
    //   title: '其他区域暂未适配,敬请期待',
    // })

    Message.info({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content: '其他区域暂未适配,敬请期待！',
    });
  },
  handleClickNoticebar(e) {
    this.setData({
      showNotice: true
    })
  },
  onForWhoIndexChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      'calcForm.forWhoIndex': value
    })
  },
  onSwitchUser() {
    const {
      userIndex
    } = this.data
    switch (userIndex) {
      case 0:
        // 居间机构
        this.setData({
          'calcForm.buyIndex': 0
        })
        break;
      case 1:
        // 购房者
        this.setData({
          'calcForm.buyIndex': 0
        })
        break;
      case 2:
        // 业主
        this.setData({
          'calcForm.buyIndex': 0
        })
        break;
      case 3:
        // 新房置业顾问
        this.setData({
          'calcForm.buyIndex': 1,
          'calcForm.hukouWuyePrice': 0,
          'calcForm.areaIndex': 2
        })
        break;
      default:

        break;
    }
  },
  onUserListVisibleChange(e) {
    this.setData({
      userListVisible: e.detail.visible,
    });
  },
  onUserIndexRemberChange(e) {
    const {
      checked
    } = e.detail
    this.setData({
      userIndexRember: checked
    })
    wx.setStorageSync('userIndexRember', checked)
  },
  onUserChange(e) {
    console.log('角色改变：', e)
    const {
      value
    } = e.detail
    this.setData({
      userIndex: value
    })
    Toast({
      context: this,
      selector: '#t-toast',
      message: '切换成功',
      theme: 'success',
      direction: 'column',
    });
    this.setData({
      userListVisible: false
    })
    this.onSwitchUser()
    wx.setStorageSync('userIndex', value)
  },
  /**
   * 打开角色列表弹框
   */
  showUserList(e) {
    console.log(e, 's')
    this.setData({
      userListVisible: true
    })
  },


  showDialog(e) {
    const {
      key,
      contentKey
    } = e.currentTarget.dataset;
    console.log(contentKey, 'contentKey')
    this.setData({
      [key]: true,
      dialogKey: key,
      noticeContent: NoticeData[contentKey]
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
  onCustomAreaInputValChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      customAreaInputVal: value
    })
  },
});