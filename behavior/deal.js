 import NP from 'number-precision'
 import Message from 'tdesign-miniprogram/message/index';

 import {
   calculatePlus,
   calculateLoan
 } from '../utils/util';
 export const dealBehavior = Behavior({
   data: {
     calcForm: {
       // 房屋总价
       totalPrice: '',
       // 网签金额
       wangqianPrice: '',
       // 户口物业预留金额
       hukouWuyePrice: 10000,
       // 首付比例
       paymentRate: 15,
       // 首付金额
       paymentPrice: '',
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
     /**
      * 根据tabs设置对应条件的贷款金额
      */
     async setLoanAllPrice() {
       const {
         bankType,
         wangqianPrice,
         unit,
         paymentRate
       } = this.data.calcForm
       console.log('根据bankType开始计算贷款金额...')
       switch (bankType) {
         case 0:
           console.log('根据bankType开始计算贷款金额:商业贷款')
           this.setLoanPrice(1)
           break;
         case 1:
           console.log('根据bankType开始计算贷款金额:公积金贷款')
           this.setLoanGjjPrice(0)
           break;
         case 2:
           // 如果是组合贷 
           console.log('根据bankType开始计算贷款金额:组合贷款')
           //  this.setLoanPrice(1)
           await this.setLoanGjjPrice(0)
           const groupLoanPrice = calculateLoan(wangqianPrice, paymentRate, unit)

           const {
             loanGjjPrice,
           } = this.data.calcForm
           let newLoanPrice = NP.minus(groupLoanPrice, loanGjjPrice)
           this.setData({
             'calcForm.loanGroupPrice': groupLoanPrice,
             'calcForm.loanPrice': newLoanPrice
           })

           console.log('根据bankType开始计算贷款金额:组合贷款设置组合贷款总金额', groupLoanPrice)
           console.log('根据bankType开始计算贷款金额:组合贷款设置组合贷款商业贷款部分', newLoanPrice)
           break;
         default:
           break;
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
         bankType
       } = this.data.calcForm
       switch (bankType) {
         case 0:
           bankPrice = 3000 / unitCount
           break;
         case 1:
           bankPrice = 4000 / unitCount
           break;
         case 2:
           bankPrice = 5000 / unitCount
           break;
         default:
           break;
       }
       this.setData({
         'calcForm.bankPrice': bankPrice
       })
     },
     /**
      * 设置首付比例
      * @param type 0 首付/网签
      */
     setPaymentRate(type) {
       const {
         loanGjjIsFirst,
         bankType,
         paymentPrice,
         wangqianPrice
       } = this.data.calcForm
       const paymentRate = NP.round(NP.times(NP.divide(paymentPrice, wangqianPrice), 100), 0)
       this.setData({
         'calcForm.paymentRate': paymentRate
       })
       console.log('设置首付比例:', paymentRate)
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
       this.setData({
         'calcForm.paymentPrice': result
       })
       console.log('设置首付金额', result)
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
         wangqianPrice,
         hukouWuyePrice
       } = this.data.calcForm

       const result = calculatePlus(null, hukouWuyePrice, value);

       this.setData({
         'calcForm.totalPrice': value,
         'calcForm.wangqianPrice': result.a,
       })
       console.log('交易总价改变-设置交易总价：', value)
       console.log('交易总价改变-设置网签总价：', result.a)
       await this.startCalc()
       this.setPaymentPrice()
       this.setServiceFee()

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
       this.setLoanPrice(1)
       this.setPaymentPrice(0)
       console.log('首付比例改变', e)
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
     onWangqianPriceChange(e) {
       const {
         value
       } = e.detail
       const {
         bankType
       } = this.data.calcForm
       this.setData({
         'calcForm.wangqianPrice': value
       });

       this.setTotalPrice(0)
       this.setServiceFee()
       if (bankType === 0) {
         this.setLoanPrice(1)
       }
       if (bankType === 1) {
         this.setLoanGjjPrice(0)
       }
       this.setPaymentPrice(0)
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
       this.setTotalPrice(0)
     }
   }
 })