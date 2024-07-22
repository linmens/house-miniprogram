 import NP from 'number-precision'
 import Message from 'tdesign-miniprogram/message/index';

 import {
   getDownPaymentRatio,
   getLoanDetails
 } from '../utils/util';
 export const dealBehavior = Behavior({
   data: {
     showHukouWuyeNotice: false,
     calcForm: {
       // 评估金额
       pingguPrice: '',
       // 房屋总价
       totalPrice: '',
       // 网签金额
       wangqianPrice: '',
       // 户口物业预留金额
       hukouWuyePrice: 1,
       // 首付比例
       paymentRate: 15,
       // 首付金额
       paymentPrice: '',
       // 税费承担方
       shuifeiIndex: 0
     }
   },
   observers: {

     'calcForm.wangqianPrice': function (wangqianPrice) {
       if (wangqianPrice) {
         const {
           unit,
           unitCount,
           hukouWuyePrice,
           paymentRate
         } = this.data.calcForm

         //  const loanRate = NP.minus(1, NP.divide(paymentRate, 100));

         //  let loanPrice = Math.floor(NP.divide(NP.times(wangqianPrice, loanRate), 10000)) * 10000

         //  if (unit === '万元') {
         //    loanPrice = Math.floor(NP.times(loanRate, wangqianPrice))
         //  }
         //  console.log(loanPrice, 'loanPrice')
         // 计算首付
         //  const paymentPrice = NP.minus(wangqianPrice, loanPrice)
         //  console.log(paymentPrice, 'paymentPrice')
         //  this.setData({
         //    'calcForm.totalPrice': NP.plus(wangqianPrice, hukouWuyePrice),
         //    'calcForm.loanPrice': loanPrice,
         //    'calcForm.paymentPrice': paymentPrice
         //  })
       }

     }
   },
   methods: {
     setWangqianPrice() {
       const {
         totalPrice,
         hukouWuyePrice,
         buyIndex
       } = this.data.calcForm
       if (totalPrice) {
         let wangqian = NP.minus(totalPrice, hukouWuyePrice)
         this.setData({
           'calcForm.wangqianPrice': wangqian
         })
         console.log('设置网签金额:', wangqian)
       }

     },
     /**
      * 设置交易总价
      * @param type 0 网签+户口预留
      */
     setTotalPrice(type) {
       let total = 0
       const {
         wangqianPrice,
         hukouWuyePrice
       } = this.data.calcForm
       switch (type) {
         case 0:
           total = NP.plus(wangqianPrice, hukouWuyePrice)
           console.log('设置交易总价0：', total)
           break;
         default:
           break;
       }
       this.setData({
         'calcForm.totalPrice': total
       })
     },
     /**
      * 设置贷款服务费
      */
     setBankPrice() {
       let bankPrice = 0
       const {
         unitCount,
         unitRate,
         bankType,
         orderType
       } = this.data.calcForm
       if (orderType === 0) {
         switch (bankType) {
           case 0:
             bankPrice = 3000 * unitRate
             console.log('设置商业贷款服务费：', bankPrice)
             break;
           case 1:
             bankPrice = 4000 * unitRate
             console.log('设置公积金贷款服务费：', bankPrice)
             break;
           case 2:
             bankPrice = 5000 * unitRate
             console.log('设置组合贷款服务费：', bankPrice)
             break;
           case 3:
             bankPrice = 0
             console.log('设置全款贷款服务费：', bankPrice)
             break;
           default:
             break;
         }
       } else {
         bankPrice = 0
       }

       this.setData({
         'calcForm.bankPrice': bankPrice
       })
     },
     /**
      * 设置首付比例
      * @param type 0  商业贷款 1公积金 2 组合贷 3全款
      */
     setPaymentRate() {
       const {
         bankType,
         buyerIndex,
         paymentPrice,
         wangqianPrice,
         loanGjjIsFirst,
         loanYear,
         loanGjjYear
       } = this.data.calcForm
       let paymentRate = 0
       let loanRate = 0
       let loanGjjRate = 0
       let loanDetails = {}
       // paymentRate = NP.round(NP.times(NP.divide(paymentPrice, wangqianPrice), 100), 0)
       // break;
       switch (bankType) {
         case 0:
           //  paymentRate = getDownPaymentRatio(bankType, buyerIndex);
           loanDetails = getLoanDetails(bankType, buyerIndex, loanYear, loanGjjYear)
           paymentRate = loanDetails.commercial.downPaymentRatio
           loanRate = loanDetails.commercial.interestRate
           this.setData({
             'calcForm.paymentRate': paymentRate,
             'calcForm.loanRate': loanRate
           })
           console.log('设置商业贷款首付比例:', paymentRate)
           console.log('设置商业贷款贷款利率:', loanRate)
           break;
         case 1:
           loanDetails = getLoanDetails(bankType, loanGjjIsFirst ? 0 : 1, loanYear, loanGjjYear)
           paymentRate = loanDetails.providentFund.downPaymentRatio
           loanGjjRate = loanDetails.providentFund.interestRate
           this.setData({
             'calcForm.paymentRate': paymentRate,
             'calcForm.loanGjjRate': loanGjjRate
           })
           console.log('设置公积金贷款首付比例:', paymentRate)
           console.log('设置公积金贷款贷款利率:', loanGjjRate)
           break;
         case 2:
           loanDetails = getLoanDetails(bankType, loanGjjIsFirst ? 0 : 1, loanYear, loanGjjYear)
           paymentRate = loanDetails.providentFund.downPaymentRatio
           loanRate = loanDetails.commercial.interestRate
           loanGjjRate = loanDetails.providentFund.interestRate
           this.setData({
             'calcForm.paymentRate': paymentRate,
             'calcForm.loanRate': loanRate,
             'calcForm.loanGjjRate': loanGjjRate
           })
           console.log('设置组合贷贷款首付比例为公积金首付比例:', paymentRate)
           console.log('设置组合贷公积金贷款贷款利率:', loanGjjRate)
           console.log('设置组合贷商业贷款贷款利率:', loanRate)
           break;
         case 3:
           break;
         default:
           break;
       }


     },
     /**
      * 设置首付金额
      * @param type 0 网签-贷款金额 1 
      */
     setPaymentPrice(type) {
       const {
         totalPrice,
         paymentRate,
         wangqianPrice,
         loanPrice,
         loanGjjPrice,
         loanGroupPrice,
         bankType
       } = this.data.calcForm
       let result = 0
       console.log('开始计算首付...')
       if (wangqianPrice && loanPrice && bankType === 0) {
         result = NP.minus(wangqianPrice, loanPrice)
         console.log('计算首付商业贷款', result)
       }
       if (wangqianPrice && loanGjjPrice && bankType === 1) {
         result = NP.minus(wangqianPrice, loanGjjPrice)
         console.log('计算首付公积金贷款', result)
       }
       if (wangqianPrice && loanGroupPrice && bankType === 2) {
         result = NP.minus(wangqianPrice, loanGroupPrice)
         console.log('计算首付组合贷款', {
           bankType,
           result,
           wangqianPrice,
           loanGroupPrice
         })
       }
       if (bankType === 3) {
         result = wangqianPrice
       }
       this.setData({
         'calcForm.paymentPrice': result
       })
       console.log('设置首付金额', result)
     },

     onPingguPriceChange(e) {
       const {
         value
       } = e.detail
       this.setData({
         'calcForm.pingguPrice': value
       })
       if (this.data.calcForm.exchangeType === 0) {
         this.startCalc()
       }
     },
     /**
      * 交易总价改变
      * @param {*} e 
      */
     async onTotalPriceChange(e) {
       const {
         value
       } = e.detail
       const {
         hukouWuyePrice
       } = this.data.calcForm

       //  const result = calculatePlus(null, hukouWuyePrice, value);
       //  const wangqianPrice = NP.minus(value,hukouWuyePrice, )
       this.setData({
         'calcForm.totalPrice': value,
         //  'calcForm.wangqianPrice': result.a,
       })
       console.log('交易总价改变-设置交易总价：', value)
       //  console.log('交易总价改变-设置网签总价：', result.a)
       await this.startCalc()


     },
     /**
      * 首付比例改变
      * @param {*} e 
      */
     onPaymentRateChange(e) {
       const {
         priceError
       } = this.data;
       const value = e.detail.value;

       const isNumber = /^\d+(\.\d+)?$/.test(value);
       const number = parseFloat(value);
       const isValid = isNumber && number >= 0 && number <= 100;

       this.setData({
         priceError: !isValid,
         'calcForm.paymentRate': value
       });
       console.log('设置首付比例：', value)
       //  this.setLoanPrice(1)
       //  this.setPaymentPrice(0)
       this.startCalc()
     },
     /**
      * 首付金额改变
      */
     onPaymentPriceChange(e) {
       const {
         value
       } = e.detail

       const {
         totalPrice,
         bankType,
         paymentRate
       } = this.data.calcForm
       let rate = paymentRate
       let paymentPrice = value

       if (!totalPrice) {
         Message.info({
           context: this,
           offset: [48, 32],
           content: '请输入总价！',
         });
         paymentPrice = ''
       }
       this.setData({
         'calcForm.paymentPrice': paymentPrice,
       })
       this.setPaymentRate(0)
       if (bankType === 0) {
         this.setLoanPrice(1)
       }
       if (bankType === 1) {
         this.setLoanGjjPrice(0)
       }

     },
     /**
      * 网签金额改变
      */
     async onWangqianPriceChange(e) {
       const {
         value
       } = e.detail
       const {
         bankType
       } = this.data.calcForm
       this.setData({
         'calcForm.wangqianPrice': value
       });

       await this.setTotalPrice(0)
       this.startCalc()

     },
     /**
      * 户口物业预留金额改变
      */
     onHukouWuyePriceChange(e) {
       const {
         value
       } = e.detail
       this.setData({
         'calcForm.hukouWuyePrice': value,
       })
       //  this.setTotalPrice(0)
       this.startCalc()
     }
   }
 })