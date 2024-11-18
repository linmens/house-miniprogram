import {
  getCurrentCachedData,
  calculateLoanDetails,
  createSelectorQuery
} from '../../utils/util'
import {
  setWatcher
} from '../../utils/watch'

import dayjs from 'dayjs'
import {
  shangdaiBehavior
} from './shangdai'
import {
  gongjijinBehavior
} from './gongjijin'
import BigNumber from 'bignumber.js';

Page({
  behaviors: [shangdaiBehavior, gongjijinBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    resultStep: {},
    isFooterFloating: false,
    scrollTopArr: [],
    activeFloatingKey: null, // 当前悬浮的卡片
    _height: 0,
    groupTop: [],
    stickyOffset: 20
  },
  watch: {
    foo(val) {
      console.log('foo变化了，变化后的值是', val)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let data = {}
    if (options.timestamp) {
      data = getCurrentCachedData(options.timestamp)
      options.time = dayjs(Number(options.timestamp)).format('YYYY-MM-DD')
    }
    if (options.data) {
      data = JSON.parse(options.data)
    }
    this.groupTop = []
    this.setData({
      calcForm: data,
      options
    })
    this.initResult()
    if (this.data._height === 0) {
      this.setHeight();
    }
  },
  async initResult() {
    const {
      bankType,
      loanBackIndex,
      loanYear,
      unit,
      loanPrice,
      loanGjjPrice,
      loanRate
    } = this.data.calcForm
    let bankDetails = []
    let bankObj = {
      title: '还款信息',
      h2: `${loanBackIndex?'首月应还':'每月应还'}`,
      tags: [`${loanBackIndex?'等额本金':'等额本息'}`, `贷${loanYear}年`],
      price: 0,
      lastMonthPayment: 0,
      extra: '',
      details: [],
      totalPayment: 0,
      loan: {
        price: 0,
        shangdai: 0,
        gongjijin: 0,
        rate: 0
      },
      total: {
        price: 0,
        shangdai: 0,
        gongjijin: 0
      },
      totalInterest: {
        price: 0,
        shangdai: 0,
        gongjijin: 0,
        rate: 0
      }
    }
    if (bankType === 0) {
      await this.startShangdai()
      const shangdaiDebx = this.data.shangdaiDebx
      const shangdaiDebj = this.data.shangdaiDebj
      // 商业贷款
      bankObj.tags.splice(0, 0, `商贷${loanPrice}${unit}`)


      if (loanBackIndex === 0) {
        bankObj.price = shangdaiDebx.monthlyPayment
        bankObj.total.price = shangdaiDebx.totalPayment.toFixed(2)
        bankObj.totalInterest = {
          price: shangdaiDebx.totalInterest.toFixed(2),
          rate: new BigNumber(shangdaiDebx.totalInterest).div(bankObj.total.price).toNumber().toFixed(2) * 100
        }
      } else {
        bankObj.price = shangdaiDebj.firstMonthPayment
        bankObj.monthlyDecrease = shangdaiDebj.monthlyDecrease
        bankObj.lastMonthPayment = shangdaiDebj.lastMonthPayment
        bankObj.total.price = shangdaiDebj.totalPayment.toFixed(2)
        bankObj.totalInterest = {
          price: shangdaiDebj.totalInterest.toFixed(2),
          rate: new BigNumber(shangdaiDebj.totalInterest).div(bankObj.total.price).toNumber().toFixed(2) * 100
        }
      }
      bankObj.loan = {
        price: loanPrice,
        shangdai: loanPrice,
        gongjijin: loanGjjPrice,
        rate: new BigNumber(loanPrice).div(bankObj.total.price).toNumber().toFixed(2) * 100
      }

    }
    if (bankType === 1) {
      // 公积金
      await this.startGongjijin()
      const gongjijinDebx = this.data.gongjijinDebx
      const gongjijinDebj = this.data.gongjijinDebj
      bankObj.tags.splice(0, 0, `公积金贷${loanGjjPrice}${unit}`);

      if (loanBackIndex === 0) {
        bankObj.price = gongjijinDebx.monthlyPayment
        bankObj.total.price = gongjijinDebx.totalPayment.toFixed(2)

        bankObj.totalInterest = {
          price: gongjijinDebx.totalInterest.toFixed(2),
          rate: new BigNumber(gongjijinDebx.totalInterest).div(bankObj.total.price).toNumber().toFixed(2) * 100
        }
      } else {
        bankObj.price = gongjijinDebj.firstMonthPayment
        bankObj.monthlyDecrease = gongjijinDebj.monthlyDecrease
        bankObj.lastMonthPayment = gongjijinDebj.lastMonthPayment
        bankObj.total.price = gongjijinDebj.totalPayment.toFixed(2)
        bankObj.totalInterest = {
          price: gongjijinDebj.totalInterest.toFixed(2),
          rate: new BigNumber(gongjijinDebj.totalInterest).div(bankObj.total.price).toNumber().toFixed(2) * 100
        }
      }
      bankObj.loan = {
        price: loanGjjPrice,
        shangdai: loanPrice,
        gongjijin: loanGjjPrice,
        rate: new BigNumber(loanGjjPrice).div(bankObj.total.price).toNumber().toFixed(2) * 100
      }
    }
    if (bankType === 2) {
      await this.startShangdai()
      await this.startGongjijin()
      // 组合贷
      const shangdaiDebx = this.data.shangdaiDebx
      const shangdaiDebj = this.data.shangdaiDebj
      const gongjijinDebx = this.data.gongjijinDebx
      const gongjijinDebj = this.data.gongjijinDebj
      bankObj.tags.splice(0, 0, `组合贷${new BigNumber(loanPrice).plus(loanGjjPrice)}${unit}`)

      if (loanBackIndex === 0) {
        bankObj.price = new BigNumber(gongjijinDebx.monthlyPayment).plus(shangdaiDebx.monthlyPayment).toNumber()


        bankObj.total = {
          price: new BigNumber(gongjijinDebx.totalPayment).plus(shangdaiDebx.totalPayment).toNumber().toFixed(2),
          shangdai: shangdaiDebx.totalPayment.toFixed(2),
          gongjijin: gongjijinDebx.totalPayment.toFixed(2)
        }
        bankObj.totalInterest = {
          price: new BigNumber(gongjijinDebx.totalInterest).plus(shangdaiDebx.totalInterest).toNumber().toFixed(2),
          shangdai: shangdaiDebx.totalInterest.toFixed(2),
          gongjijin: gongjijinDebx.totalInterest.toFixed(2),
          rate: new BigNumber(gongjijinDebx.totalInterest).plus(shangdaiDebx.totalInterest).div(bankObj.total.price).toNumber().toFixed(2) * 100
        }
        bankObj.details = [`${shangdaiDebx.monthlyPayment}${unit} (商贷)`, `${gongjijinDebx.monthlyPayment}${unit} (公积金贷)`]
      } else {
        bankObj.price = new BigNumber(gongjijinDebj.firstMonthPayment).plus(shangdaiDebj.firstMonthPayment).toNumber()
        bankObj.monthlyDecrease = new BigNumber(gongjijinDebj.monthlyDecrease).plus(shangdaiDebj.monthlyDecrease).toNumber()

        bankObj.total = {
          price: new BigNumber(gongjijinDebj.totalPayment).plus(shangdaiDebj.totalPayment).toNumber().toFixed(2),
          shangdai: shangdaiDebj.totalPayment.toFixed(2),
          gongjijin: gongjijinDebj.totalPayment.toFixed(2)
        }
        bankObj.totalInterest = {
          price: new BigNumber(gongjijinDebj.totalInterest).plus(shangdaiDebj.totalInterest).toNumber().toFixed(2),
          shangdai: shangdaiDebj.totalInterest.toFixed(2),
          gongjijin: gongjijinDebj.totalInterest.toFixed(2),
          rate: new BigNumber(gongjijinDebj.totalInterest).plus(shangdaiDebj.totalInterest).div(bankObj.total.price).toNumber().toFixed(2) * 100
        }
        bankObj.details = [`${shangdaiDebj.firstMonthPayment}${unit} (商贷)`, `${gongjijinDebj.firstMonthPayment}${unit} (公积金贷)`]
        bankObj.lastMonthPayment = new BigNumber(gongjijinDebj.lastMonthPayment).plus(shangdaiDebj.lastMonthPayment).toNumber()
      }
      bankObj.loan = {
        price: new BigNumber(loanPrice).plus(loanGjjPrice).toNumber(),
        shangdai: loanPrice,
        gongjijin: loanGjjPrice,
        rate: new BigNumber(loanPrice).plus(loanGjjPrice).div(bankObj.total.price).toNumber().toFixed(2) * 100
      }
    }

    bankObj.extra = `${loanBackIndex?`每月还款金额递减${bankObj.monthlyDecrease}${unit}，其中每月还款的本金不变，利息逐月减少。`:'每月还款金额不变，其中还款的本金逐月递增，利息逐月递减。'}`

    console.log(bankObj)
    this.setData({
      'resultStep': bankObj
    })
  },
  async calcCardScrollTop() {
    let scrollTopArr = [];
    const queryData = (await createSelectorQuery('.card-section', true))
    queryData.forEach((item) => {
      scrollTopArr.push(item.top)
    })
    this.setData({
      scrollTopArr: scrollTopArr
    })
  },

  getCardPositions() {
    const query = wx.createSelectorQuery();
    query.select('#shangdaiInfo').boundingClientRect();
    // query.select('#shangdaiInfo-bottom').boundingClientRect();
    query.select('#gongjijinInfo').boundingClientRect();
    // query.select('#gongjijinInfo-bottom').boundingClientRect();

    query.exec((res) => {
      console.log(res, 'getCardPositions')
      this.setData({
        shangdaiTop: res[0].top,
        gongjijinTop: res[1].top
      });
    });
  },

  checkFloatingButton(scrollTop) {
    const {
      cardPositions
    } = this.data;
    let activeKey = null;
    const {
      shangdaiTop,
      gongjijinTop,
      shangdaiInfo,
      gongjijinInfo
    } = this.data;
    // 判断元素是否进入视野
    let windowHeight = wx.getSystemInfoSync().windowHeight
    const isShangdaiInView = scrollTop + windowHeight >= shangdaiTop && scrollTop <= shangdaiTop + windowHeight;
    const isGongjijinInView = scrollTop + windowHeight >= gongjijinTop && scrollTop <= gongjijinTop + windowHeight;
    console.log(scrollTop, isShangdaiInView, isGongjijinInView, 'this.data.activeFloatingKey')
    if (isShangdaiInView && shangdaiInfo.showAll && !this.data.shangdaiIsFloating) {
      this.setData({
        shangdaiIsFloating: true,
        gongjijinIsFloating: false
      });
    } else if (isGongjijinInView && gongjijinInfo.showAll && !this.data.gongjijinIsFloating) {
      this.setData({
        gongjijinIsFloating: true,
        shangdaiIsFloating: false
      });
    } else if (!isShangdaiInView && !isGongjijinInView) {
      this.setData({
        shangdaiIsFloating: false,
        gongjijinIsFloating: false
      });
    }
  },
  toggleShowAll(e) {
    const {
      loanBackIndex
    } = this.data.calcForm
    const key = e.currentTarget.dataset.key;
    const currentShowAll = this.data[key].showAll;
    const data = this.data[key === 'shangdaiInfo' ? 'shangdai' : 'gongjijin'][loanBackIndex].paymentDetails
    this.setData({
      [`${key}.showAll`]: !currentShowAll,
      activeFloatingKey: !currentShowAll ? key : null,
    }, () => {
      if (!currentShowAll) {
        // this.initObservers(key);
        this.setData({
          [`${key}.details`]: data,
          // [`${key}.isFloating`]: true
        });

      } else {
        this.setData({
          [`${key}.details`]: data.slice(0, 3),
          // [`${key}.isFloating`]: false
        });
        // this.disconnectObserver(key);
      }
    });
    this.getCardPositions();
  },

  onTabsChange(e) {
    const {
      value
    } = e.detail
    this.setData({
      'calcForm.loanBackIndex': value
    })
    this.initResult()
  },
  setHeight(height) {
    if (!height) {
      const {
        windowHeight
      } = wx.getSystemInfoSync();
      height = windowHeight;
    }
    this.setData({
      _height: height,
    }, () => {
      this.getAllRect();
    });
  },
  async getAllRect() {
    await this.getAnchorsRect()
    this.groupTop.forEach((item, index) => {
      const next = this.groupTop[index + 1];
      item.totalHeight = ((next === null || next === void 0 ? void 0 : next.top) || Infinity) - item.top;
    });
    console.log(this.groupTop)
    this.setAnchorOnScroll(0);
    // this.getSidebarRect();
  },
  async getAnchorsRect() {

    const res = await createSelectorQuery('.card-section', true)

    this.groupTop = res.map((item, index) => {
      return {
        height: item.height,
        top: item.top,
        index,
      }
    })
    console.log(this.groupTop, 'getAnchorsRect')
    //  return Promise.all(this.$children.map((child) => getRect(child, `.${name}-anchor`).then((rect) => {
    //    this.groupTop.push({
    //      height: rect.height,
    //      top: rect.top,
    //      anchor: child.data.index,
    //    });
    //  })));
  },
  setAnchorOnScroll(scrollTop) {
    if (!this.groupTop) {
      return;
    }
    const {
      stickyOffset,
    } = this.data;
    scrollTop += stickyOffset;
    const curIndex = this.groupTop.findIndex((group) => scrollTop >= group.top - group.height && scrollTop <= group.top + group.totalHeight - group.height);
    console.log(curIndex, 'curIndex')
    if (curIndex === -1)
      return;
    const curGroup = this.groupTop[curIndex];
    console.log(curGroup, 'curGroup')
    const offset = curGroup.top - scrollTop;
    const betwixt = offset < curGroup.height && offset > 0 && scrollTop > stickyOffset;
    console.log(betwixt, 'betwixt')
    this.$children.forEach((child, index) => {
      if (index === curIndex) {
        const sticky = scrollTop > stickyOffset;
        const anchorStyle = `transform: translate3d(0, ${betwixt ? offset : 0}px, 0); top: ${stickyOffset}px`;
        if (anchorStyle !== child.data.anchorStyle || sticky !== child.data.sticky) {
          child.setData({
            sticky,
            active: true,
            style: `height: ${curGroup.height}px`,
            anchorStyle,
          });
        }
      } else if (index + 1 === curIndex) {
        const anchorStyle = `transform: translate3d(0, ${betwixt ? offset - curGroup.height : 0}px, 0); top: ${stickyOffset}px`;
        if (anchorStyle !== child.data.anchorStyle) {
          child.setData({
            sticky: true,
            active: true,
            style: `height: ${curGroup.height}px`,
            anchorStyle,
          });
        }
      } else {
        child.setData({
          active: false,
          sticky: false,
          anchorStyle: ''
        });
      }
    });
  },
  onPageScroll(e) {
    const {
      scrollTop
    } = e
    this.setAnchorOnScroll(scrollTop);
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
    this.disconnectAllObservers();
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