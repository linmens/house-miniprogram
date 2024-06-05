 import {
   buyTypes,
   chanquanTypes,
   selfHouseTypes,
   unitTypes,
   areaTypes,

 } from '../utils/constants';
 import {
   getOldYearTimestamp,
   calculateBuiltYear,
 } from '../utils/util';
 const basicBehavior = Behavior({
   data: {
     buyTypes,
     chanquanTypes,
     selfHouseTypes,
     unitTypes,
     areaTypes,
     calcForm: {
       // 计价单位下标
       unitIndex: 0,
       // 金额换算值 元 1 || 万元 10000
       unitCount: 1,
       unit: '元',
       // 购房形式
       buyIndex: 0,
       // 产权情况下标
       chanquanIndex: 0,
       // 建筑面积下标
       areaIndex: 0,
       // 贷款方式 0 商业 1 公积金 2 组合贷 3 全款
       bankType: 0,
       // 房屋建成年份
       houseYear: new Date().getFullYear(),
       // 房屋年龄
       houseAge: '',
     }
   },
   observers: {
     'calcForm.unitIndex': function (unitIndex) {

       const {
         hukouWuyePrice,
         unitCount
       } = this.data.calcForm
       // 万元
       this.setData({
         'calcForm.hukouWuyePrice': unitIndex === 1 ? hukouWuyePrice / unitCount : 10000
       })

     }
   },
   methods: {
     /**
      * 元 万元 切换
      * @param {*} e 
      */
     onTypesChange(e) {
       const {
         label,
         index
       } = e.detail;

       const count = label === '元' ? 1 : 10000
       this.setData({
         'calcForm.unit': label,
         'calcForm.unitCount': count,
         'calcForm.unitIndex': index
       })
       this.setBankPrice()
     },
     /**
      * 购房形式
      * @param {*} e 
      */
     onBuyTypesChange(e) {
       const {
         index
       } = e.detail
       console.log(index, 'e');
       this.setData({
         'calcForm.buyIndex': index
       })
     },
     onAreaTypesChange(e) {

     },
     onHouseAgeChange(e) {
       const {
         value
       } = e.detail
       console.log(value, 'value')
       if (value) {
         const builtYear = calculateBuiltYear(value);
         console.log(builtYear, 'calculateBuiltYear')
         if (builtYear) {
           this.setData({
             'calcForm.houseYear': builtYear,
             'calcForm.loanIndex': 6,
             'calcForm.houseAge': value
           })
           this.setLoanYear()
         }
       }
     },
   },
 })
 export default basicBehavior