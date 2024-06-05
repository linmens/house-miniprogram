 import NP from 'number-precision'
 import Message from 'tdesign-miniprogram/message/index';

 import {
   calculatePlus,
   calculateLoan
 } from '../utils/util';
 const dealBehavior = Behavior({
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

         const loanRate = NP.minus(1, NP.divide(paymentRate, 100));

         let loanPrice = Math.floor(NP.divide(NP.times(wangqianPrice, loanRate), 10000)) * 10000

         if (unit === '万元') {
           loanPrice = Math.floor(NP.times(loanRate, wangqianPrice))
         }
         console.log(loanPrice, 'loanPrice')
         // 计算首付
         const paymentPrice = NP.minus(wangqianPrice, loanPrice)
         console.log(paymentPrice, 'paymentPrice')
         this.setData({
           'calcForm.totalPrice': NP.plus(wangqianPrice, hukouWuyePrice),
           'calcForm.loanPrice': loanPrice,
           'calcForm.paymentPrice': paymentPrice
         })
       }
     }
   },
   methods: {
     /**
      * 交易总价改变
      * @param {*} e 
      */
     onTotalPriceChange(e) {
       const {
         value
       } = e.detail
       const {
         wangqianPrice,
         hukouWuyePrice
       } = this.data.calcForm
       console.log(hukouWuyePrice, wangqianPrice, value, 'hukouWuyePrice')
       const result = calculatePlus(null, hukouWuyePrice, value);
       console.log(result, 'resultresultresult')
       this.setData({
         'calcForm.totalPrice': value,
         'calcForm.wangqianPrice': result.a,

       })
       this.setPaymentPrice()
       this.calculateServiceFee()
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
       this.setPaymentPrice()
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
       } else {
         rate = NP.round(NP.times(NP.divide(value, totalPrice), 100), 2)
       }

       this.setData({
         'calcForm.paymentRate': rate,
         'calcForm.paymentPrice': paymentPrice
       })
     },
     /**
      * 网签金额改变
      */
     onWangqianPriceChange(e) {
       const {
         value
       } = e.detail
       const {
         hukouWuyePrice
       } = this.data.calcForm
       //  const result = calculatePlus(value, hukouWuyePrice, null);
       //  console.log(result, value, 'onWangqianPriceChange')
       this.setData({
         //  'calcForm.totalPrice': result.c,
         'calcForm.wangqianPrice': value
       })
     },
     /**
      * 户口物业预留金额改变
      */
     onHukouWuyePriceChange(e) {
       const {
         value
       } = e.detail
       const {
         wangqianPrice,
       } = this.data.calcForm
       const result = calculatePlus(wangqianPrice, value, null);
       this.setData({
         'calcForm.hukouWuyePrice': value,
         'calcForm.totalPrice': result.c
       })
       console.log(result, wangqianPrice, 'onHukouWuyePriceChange')
     }
   }
 })
 export default dealBehavior