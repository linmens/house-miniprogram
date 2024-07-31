 import NP from 'number-precision'
 import Message from 'tdesign-miniprogram/message/index';

 import {
   getDownPaymentRatio,
   getLoanDetails
 } from '../../../utils/util';
 const loanRateEnum = {
   0: 3.45,
   1: 3.85
 }
 // 首付比例 0首套 1二套
 const paymentRateEnum = {
   0: 15,
   1: 25
 }
 const loanRateGjjEnum = {
   0: 2.85,
   1: 3.325
 }
 const paymentRateGjjEnum = {
   0: 20,
   1: 25
 }
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
   observers: {},
   methods: {
     setWangqianPrice() {
       const {
         totalPrice,
         hukouWuyePrice,
         buyIndex
       } = this.data.calcForm

       if (totalPrice) {
         let wangqian = NP.minus(totalPrice, hukouWuyePrice)
         if (buyIndex === 1) {
           wangqian = totalPrice
         }

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
      * @param 0  商业贷款 1公积金 2 组合贷 3全款
      * @param from paymentPrice 首付金额字段改变 
      */
     setPaymentRate(from) {
       const {
         bankType,
         buyerIndex,
         paymentPrice,
         wangqianPrice
       } = this.data.calcForm
       if (from === 'paymentPrice') {
         let rate = NP.round(NP.times(NP.divide(paymentPrice, wangqianPrice), 100), 0)
         this.setData({
           'calcForm.paymentRate': rate
         })
         return
       }
       switch (bankType) {
         case 0:
           this.setData({
             'calcForm.paymentRate': paymentRateEnum[buyerIndex],
             'calcForm.loanRate': loanRateEnum[buyerIndex]
           })
           console.log('设置商业贷款首付比例:', paymentRateEnum[buyerIndex])
           console.log('设置商业贷款贷款利率:', loanRateEnum[buyerIndex])
           break;
         case 1:

           this.setData({
             'calcForm.paymentRate': paymentRateGjjEnum[buyerIndex],
             'calcForm.loanGjjRate': loanRateGjjEnum[buyerIndex]
           })
           console.log('设置公积金贷款首付比例:', paymentRateGjjEnum[buyerIndex])
           console.log('设置公积金贷款贷款利率:', loanRateGjjEnum[buyerIndex])
           break;
         case 2:

           this.setData({
             'calcForm.paymentRate': paymentRateGjjEnum[buyerIndex],
             'calcForm.loanRate': loanRateEnum[buyerIndex],
             'calcForm.loanGjjRate': loanRateGjjEnum[buyerIndex]
           })
           console.log('设置组合贷贷款首付比例为公积金首付比例:', paymentRateGjjEnum[buyerIndex])
           console.log('设置组合贷公积金贷款贷款利率:', loanRateGjjEnum[buyerIndex])
           console.log('设置组合贷商业贷款贷款利率:', loanRateEnum[buyerIndex])
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

     },
     /**
      * 交易总价改变
      * @param {*} e 
      */
     async onTotalPriceChange(e) {
       const {
         value
       } = e.detail

       this.setData({
         'calcForm.totalPrice': value,
       })
       console.log('交易总价改变-设置交易总价：', value)

       this.setWangqianPrice()
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

       this.switchBankType()
     },
     /**
      * 首付金额改变
      */
     async onPaymentPriceChange(e) {
       const {
         value
       } = e.detail

       const {
         totalPrice,
         bankType,
         paymentRate,
         wangqianPrice
       } = this.data.calcForm
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
       this.setPaymentRate('paymentPrice')

       if (bankType === 0) {
         this.setLoanPrice(0)
       }
       if (bankType === 2) {

         await this.setLoanGroupPrice(1)
         await this.setLoanGjjPrice(0);
         this.setLoanPrice(2)
       }
       //  this.switchBankType()
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
       this.setWangqianPrice()
     }
   }
 })