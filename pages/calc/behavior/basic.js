import {
  calculateBuiltYear,
} from '../../../utils/util';
export const basicBehavior = Behavior({

  data: {
    // 显示隐藏年选择器
    yearVisible: false,
    calcForm: {
      // 计价单位下标
      unitIndex: 1,
      // 金额换算值 元 1 || 万 10000
      unitCount: 1,
      unitRate: 0.0001,
      unit: '万元',
      // 0二手房 1一手房
      buyIndex: 0,
      // 是否法定继承人下标
      fadingIndex: 0,
      // 分割条件
      fengeIndex: 0,
      // 建筑面积
      area: '',
      // 建筑面积下标
      areaIndex: 2,
      // 贷款方式 0 商业 1 公积金 2 组合贷 3 全款
      bankType: 0,
      // 房屋建成年份
      houseYear: new Date().getFullYear().toString(),
      // 房屋年龄
      houseAge: '',
      houseDescMsg: '',
      // 成交方式 0 三方成交 1 自行成交
      orderType: 0,
      // 变更类型 0 买卖 1赠与 2继承 3婚内更名 4离婚分割
      exchangeType: 0,
      // 楼层电梯
      floorIndex: 2,
      // 房屋类型
      houseType: 0,
      // 是否为房屋附属设施
      isHouseOther: 0
    }
  },

  methods: {
    setHukouWuyePrice() {
      const {
        unit,
        buyIndex,
        houseType,
        hukouWuyePrice
      } = this.data.calcForm
      let price = 0
      if (buyIndex === 0 && houseType === 0) {
        // 需要户口物业金额
        if (unit === '元') {
          if (hukouWuyePrice) {
            price = hukouWuyePrice * 10000
          } else {
            price = 10000
          }

        } else {
          // 万
          if (hukouWuyePrice) {
            price = hukouWuyePrice / 10000
          } else {
            price = 1
          }
        }
        this.setData({
          'calcForm.hukouWuyePrice': price
        })
      } else {
        this.setData({
          'calcForm.hukouWuyePrice': 0
        })
      }
    },
    fixPrice(property) {
      const {
        unitIndex
      } = this.data.calcForm
      let price = this.data.calcForm[property]
      if (price) {
        let fixedPrice = unitIndex === 1 ? price / 10000 : price * 10000;
        this.setData({
          [`calcForm.${property}`]: fixedPrice
        });
      }
    },
    setAllPrice() {

      this.fixPrice('totalPrice')
      this.fixPrice('wangqianPrice')
      this.fixPrice('pingguPrice')
      this.fixPrice('bankPrice')

    },
    onIsHouseOtherChange(e) {
      const {
        value
      } = e.detail
      this.setData({
        'calcForm.isHouseOther': value
      })
    },
    onExchangeTypeChange(e) {
      const {
        index
      } = e.detail
      this.setData({
        'calcForm.exchangeType': index,
        'calcForm.buyIndex': 0
      })
    },
    /**
     * 房屋类型
     * @param {*} e 
     */
    onHouseTypesChange(e) {
      const {
        index
      } = e.detail

      this.setData({
        'calcForm.houseType': index,
        'calcForm.bankType': 0
      })
      this.setHukouWuyePrice()
      this.startCalc()
    },
    onNewHouseTypesChange(e) {
      const {
        index
      } = e.detail
      this.setData({
        'calcForm.floorIndex': index,
      })
    },
    onOrderTypesChange(e) {
      const {
        index
      } = e.detail
      this.setData({
        'calcForm.orderType': index,
      })
      this.setServiceFee()
      this.setBankPrice()
    },
    /**
     * 元 万 切换
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
      this.setAllPrice()
      this.setHukouWuyePrice()
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
     * 房屋新旧
     * @param {*} e 
     */
    onBuyTypesChange(e) {
      const {
        index,
      } = e.detail

      this.setData({
        'calcForm.buyIndex': index,
        'calcForm.areaIndex': 2
      })
      this.setHukouWuyePrice()
      this.startCalc()
    },
    // 显示隐藏年份选择器
    showYearPicker() {
      this.setData({
        yearVisible: true
      })
    },
    // 确认选择年份
    onYearConfirm(e) {
      const {
        value
      } = e.detail;

      const currentYear = new Date().getFullYear()
      // 计算房龄
      const houseAge = currentYear - value;
      this.setData({
        yearVisible: false,
        currentYear: value,
        'calcForm.houseYear': value,
        'calcForm.houseAge': houseAge,

      });

      if (houseAge > 0) {
        this.setData({
          'calcForm.loanIndex': 6,
          'calcForm.loanGjjIndex': 6
        })
        this.setLoanYear()
        // this.setLoanGjjYear()
      }

    },
    handleConfirmCustomArea(e) {

      const {
        customAreaInputVal,
        areaTypes
      } = this.data
      const {
        areaIndex
      } = this.data.calcForm
      console.log('自定义面积输入确认：', areaTypes, e, this.data.customAreaInputVal)
      areaTypes[areaIndex].label = `自定义（${customAreaInputVal}㎡ ）`
      areaTypes[areaIndex].value = customAreaInputVal
      this.setData({
        'areaTypes': areaTypes
      })
      this.closeDialog()
      this.selectComponent('#basicRef').initTrack()
    },
    onAreaChange(e) {
      const {
        value
      } = e.detail
      console.log(e, 's')
      this.setData({
        'calcForm.area': value
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
    onAreaTypesChange(e) {
      console.log('建筑面积改变：', e)
      const {
        index,
        label
      } = e.detail
      this.setData({
        'calcForm.areaIndex': index,
        'calcForm.areaName': label
      })
    },
    onChanquanTypesChange(e) {
      const {
        index,
        label
      } = e.detail
      this.setData({
        'calcForm.chanquanIndex': index,
        'calcForm.chanquanName': label
      })
    },
    onHouseAgeChange(e) {
      const {
        value
      } = e.detail
      if (value) {
        const result = calculateBuiltYear(value);

        let builtYear = result.builtYear.toString()
        console.log(result, builtYear, 'onHouseAgeChange')
        this.setData({
          'calcForm.houseYear': builtYear,
          'calcForm.houseAge': value,
          'calcForm.houseDescMsg': result.message,
        })
        if (value > 0) {
          this.setData({
            'calcForm.loanIndex': 6,
            'calcForm.loanGjjIndex': 6
          })
          this.setLoanYear()
          // this.setLoanGjjYear()
        }
      }
    },
  },
})