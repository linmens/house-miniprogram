 import NP from 'number-precision'
 const serviceBehavior = Behavior({
   data: {
     calcForm: {
       // 居间服务费
       serviceFee: 0,
       // 服务比例
       serviceFeeRate: 1.5,
       // 贷款服务费金额
       bankPrice: 3000,
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
         serviceFeeRate
       } = this.data.calcForm

       // 计算服务费 = 交易总价 * (居间服务比例/100)
       if (totalPrice) {
         const serviceFee =
           NP.round(NP.times(totalPrice, NP.divide(serviceFeeRate, 100)), 4)
         this.setData({
           'calcForm.serviceFee': serviceFee
         })
       }
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
 export default serviceBehavior