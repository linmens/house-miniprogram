  import NP from 'number-precision'
  import {
    loanGjjHomeTypes
  }
  from '../../../utils/constants'
  import {
    calculateLoan,
    downloadAndOpenFile,
    getDownPaymentRatio
  } from '../../../utils/util'
  import {
    findByKeyname
  }
  from '../../../constants/taxList'
  export const gongjijinBehavior = Behavior({
    lifetimes: {
      ready() {

        const {
          unit,

        } = this.data.calcForm

        this.setData({
          'calcForm.loanGjjMaxPrice': unit === '元' ? 650000 : 65,


        })
      }
    },
    data: {
      loanGjjHomeTypes,
      loanGjjRightConfig: {
        content: '个人住房公积金贷款业务指南',
        suffixIcon: 'file-pdf',
        theme: 'primary'
      },
      calcForm: {
        // 公积金缴存情况
        loanGjjSaveIndex: 0,
        // 公积金贷款年限下标
        loanGjjIndex: 5,
        // 公积金贷款年限（年）
        loanGjjYear: 30,
        // 公积金还款方式
        loanGjjBackIndex: 0,
        // 公积金贷款利率
        loanGjjRate: 2.85,
        // 公积金贷款金额
        loanGjjPrice: '',
        // 是否首次使用公积金
        loanGjjIsFirst: true,
        // 最大贷款额度
        loanGjjMaxPrice: 65,
        // 性别男女
        loanGjjSexIndex: 0,
        // 借款人年龄
        loanGjjAge: 18,
        // 借款人缴存基数
        loanGjjBasicPrice: 0,
        // 女方年龄
        loanGjjFemaleAge: 18,
        // 男方年龄
        loanGjjMaleAge: 18,
        // 男方缴存基数
        loanGjjMaleBasicPrice: 0,
        // 女方缴存基数
        loanGjjFemaleBasicPrice: 0
      },
    },
    methods: {
      setLoanGjjMaxPrice() {
        const {
          unit,
          unitIndex,
          unitRate,
          unitCount,
          loanGjjSaveIndex
        } = this.data.calcForm
        let gjjMaxPrice = loanGjjHomeTypes[loanGjjSaveIndex].max[unitIndex]
        this.setData({
          'calcForm.loanGjjMaxPrice': gjjMaxPrice
        })
        console.log('设置公积金贷款最大金额:', gjjMaxPrice)
      },
      /**
       * 更新公积金贷款利率
       */
      setLoanGjjRate() {
        const {
          bankType,
          loanGjjYear,
          buyerIndex
        } = this.data.calcForm
        let loanGjjRate = 0
        if (bankType === 1 || bankType === 2) {
          if (buyerIndex) {
            // 首套房
            loanGjjRate = loanGjjYear <= 5 ? 2.35 : 2.85
          } else {
            // 二套房
            loanGjjRate = loanGjjYear <= 5 ? 2.775 : 3.325
          }
        }
        this.setData({
          'calcForm.loanGjjRate': loanGjjRate
        })
      },
      /**
       * 更新公积金贷款金额
       * @param type 0 网签金额*贷款比例 1  2 组合贷款金额 - 商贷金额
       */
      setLoanGjjPrice(type) {
        const {
          unit,
          unitCount,
          unitRate,
          wangqianPrice,
          paymentRate,
          bankType,
          loanGjjSaveIndex,
          loanGroupPrice,
          loanPrice,
          paymentPrice,
          loanGjjMaxPrice,
          loanGjjPrice,
          loanLowPrice
        } = this.data.calcForm
        let _loanGjjPrice = 0
        // const loanGjjMaxPrice = loanGjjHomeTypes[loanGjjSaveIndex].max * unitCount
        // console.log('设置公积金贷款最大金额:', loanGjjMaxPrice)
        switch (type) {
          case 0:
            _loanGjjPrice = calculateLoan(wangqianPrice, paymentRate, unit)
            console.log('开始计算公积金贷款金额(网签*贷款比例):', _loanGjjPrice)
            console.log('开始计算公积金贷款金额(网签金额):', wangqianPrice)
            console.log('开始计算公积金贷款金额(首付比例):', paymentRate)
            break;
            // case 2:
            //   _loanGjjPrice = NP.minus(wangqianPrice, paymentPrice)
            //   console.log('开始计算公积金贷款金额(首付改变):', wangqianPrice, paymentPrice, _loanGjjPrice)
            //   break;
          case 2:

            _loanGjjPrice = loanGroupPrice
            // _loanGjjPrice = NP.minus(loanGroupPrice, loanPrice)
            console.log('开始计算公积金贷款金额(组合贷款金额):', _loanGjjPrice, '组合贷合计金额' + loanGroupPrice, '商贷金额' + loanPrice)
            break;
          case 3:
            _loanGjjPrice = NP.minus(loanGroupPrice, loanPrice)
            break;
          default:
            break;
        }
        if (_loanGjjPrice >= loanGjjMaxPrice) {
          _loanGjjPrice = loanGjjMaxPrice
        } else if (_loanGjjPrice < 0) {
          _loanGjjPrice = 0
        }
        this.setData({
          'calcForm.loanGjjPrice': _loanGjjPrice
        })
        console.log(`设置公积金贷款金额:`, _loanGjjPrice)
      },
      /**
       * 更新贷款年限
       */
      setLoanGjjYear() {
        const {
          houseAge,
          loanGjjIndex
        } = this.data.calcForm

        if (houseAge) {
          let loanGjjYear = NP.minus(40, houseAge);
          if (loanGjjYear > 30) {
            loanGjjYear = 30
          }
          this.setData({
            'calcForm.loanGjjYear': loanGjjYear,
          })

        }
      },
      /**
       * 公积金贷款金额改变时
       * @param {*} e 
       */
      async onLoanGjjPriceChange(e) {
        console.log('公积金贷款金额发生改变')
        const {
          bankType
        } = this.data.calcForm
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjPrice': value
        })
        console.log('设置公积金贷款金额：', value)
        if (bankType === 2) {
          await this.setLoanPrice(2)
        }
        this.setPaymentPrice()
        this.setPaymentRate()
      },
      handleLoanGjjTitleRightClick(e) {
        const findByKeynameRes = findByKeyname('title', this.data.loanGjjRightConfig.content)
        console.log(findByKeynameRes, 'findByKeynameRes')
        if (findByKeynameRes) {
          downloadAndOpenFile(findByKeynameRes.id, findByKeynameRes.prefixPath, findByKeynameRes.title, findByKeynameRes.fileType)
        }
      },
      handleLoanGjjIsFirstChange(e) {
        const {
          value,

        } = e.detail

        this.setData({
          'calcForm.loanGjjIsFirst': value
        })
        this.setPaymentRate()
        this.setLoanGjjRate()
        this.startCalc()
      },
      onLoanGjjRateChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjRate': value
        })
      },
      onLoanGjjBackTypesChange(e) {
        const {
          index
        } = e.detail
        this.setData({
          'calcForm.loanGjjBackIndex': index
        })
      },
      /**
       * 家庭缴存情况改变
       * @param {*} e 
       */
      onLoanGjjHomeTypesChange(e) {

        const {
          index,
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjSaveIndex': index
        })

        this.switchBankType()
      },
      onLoanGjjBasicPriceChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjBasicPrice': value
        })
      },
      onLoanGjjMaleBasicPriceChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjMaleBasicPrice': value
        })
      },
      onLoanGjjFemaleBasicPriceChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjFemaleBasicPrice': value
        })
      },
      onLoanGjjMaleAgeChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjMaleAge': value
        })
      },
      onLoanGjjFemaleAgeChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjFemaleAge': value
        })
      },
      onLoanGjjAgeChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjAge': value
        })
      },
      onSexTypesChange(e) {
        const {
          index
        } = e.detail
        this.setData({
          'calcForm.loanGjjSexIndex': index
        })
      },
      /**
       * 公积金贷款年限下标改变
       * @param {*} e 
       */
      onLoanGjjIndexChange(e) {
        const {
          value,
          index
        } = e.detail
        this.setData({
          'calcForm.loanGjjIndex': index,
          'calcForm.loanGjjYear': value
        })
        // this.setLoanGjjYear()
        // this.setLoanGjjRate()
      },
      onCustomLoanGjjYearChange(e) {
        const {
          value
        } = e.detail
        this.setData({
          'calcForm.loanGjjYear': value
        })
      }
    }
  })