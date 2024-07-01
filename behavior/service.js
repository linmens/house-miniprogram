 import NP from 'number-precision'
 export const serviceBehavior = Behavior({
   data: {
     calcForm: {
       // 居间服务费
       serviceFee: 0,
       // 服务比例
       serviceFeeRate: 3,
       // 贷款服务费金额
       bankPrice: 0.3,
       // 支付方下标
       servicePayerIndex: 0,
       // 买方承担费用
       serviceBuyer: 0,
       // 卖方承担费用
       serviceSeller: 0
     },
   },
   methods: {
     /**
      * 计算居间服务费
      */
     setServiceFee() {
       const {
         totalPrice,
         unitCount,
         serviceFeeRate,
         orderType
       } = this.data.calcForm

       // 计算服务费 = 交易总价 * (居间服务比例/100)
       let serviceFee = 0
       if (orderType === 0) {
         serviceFee = NP.times(totalPrice, NP.divide(serviceFeeRate, 100))
       }
       this.setData({
         'calcForm.serviceFee': serviceFee
       })
       console.log('设置居间服务费:', serviceFee)
     },
     onServicePayerIndexChange(e) {
       const {
         index
       } = e.detail
       const {
         serviceFee
       } = this.data.calcForm
       let defaultFee = NP.divide(serviceFee, 2)
       this.setData({
         'calcForm.servicePayerIndex': index,
         'calcForm.serviceBuyer': defaultFee,
         'calcForm.serviceSeller': defaultFee
       })
     },
     onServiceSellerChange(e) {
       const {
         value
       } = e.detail
       const {
         serviceFee
       } = this.data.calcForm
       const serviceBuyer = NP.minus(serviceFee, value)
       this.setData({
         'calcForm.serviceSeller': value,
         'calcForm.serviceBuyer': serviceBuyer
       })
     },
     onServiceBuyerChange(e) {
       const {
         value
       } = e.detail
       const {
         serviceFee
       } = this.data.calcForm
       const serviceSeller = NP.minus(serviceFee, value)
       this.setData({
         'calcForm.serviceBuyer': value,
         'calcForm.serviceSeller': serviceSeller
       })
     },
     /**
      * 居间服务比例更改
      * @param {*} e 
      */
     onServiceFeeRateChange(e) {
       const {
         value
       } = e.detail;

       this.setData({
         'calcForm.serviceFeeRate': value
       });
       this.setServiceFee()
     },
     /**
      * 计算居间服务费比例
      */
     setServiceFeeRate() {
       const {
         totalPrice,
         serviceFee
       } = this.data.calcForm
       if (totalPrice && serviceFee) {
         const serviceFeeRate = NP.round(NP.times(NP.divide(serviceFee, totalPrice), 100), 2)
         this.setData({
           'calcForm.serviceFeeRate': serviceFeeRate
         })
       }

     },
     /**
      * 居间服务费改变
      */
     onServiceFeeChange(e) {
       const {
         value
       } = e.detail
       this.setData({
         'calcForm.serviceFee': value
       })
       // 计算服务费比例
       this.setServiceFeeRate()
     },
   }
 })