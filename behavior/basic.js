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
 export const basicBehavior = Behavior({
   data: {
     buyTypes,
     chanquanTypes,
     selfHouseTypes,
     unitTypes,
     areaTypes,
     // 显示隐藏年选择器
     yearVisible: false,

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
       // 建筑面积
       area: 0,
       // 建筑面积下标
       areaIndex: 0,
       // 贷款方式 0 商业 1 公积金 2 组合贷 3 全款
       bankType: 0,
       // 房屋建成年份
       houseYear: new Date().getFullYear(),
       // 房屋年龄
       houseAge: '',
       houseDescMsg: '',
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
       if (index === 1) {
         //  this.selectComponent('#basicRef').updateChildren()
       }

       this.setData({
         'calcForm.buyIndex': index
       })
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
         'calcForm.houseYear': value,
         'calcForm.houseAge': houseAge,
         'calcForm.loanIndex': 6,
         'calcForm.loanGjjIndex': 6
       });
       this.setLoanYear()
       this.setLoanGjjYear()
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
     onCustomAreaChange(e) {
       const {
         value
       } = e.detail
       this.setData({
         'calcForm.area': value
       })
     },
     onAreaTypesChange(e) {
       console.log('建筑面积改变：', e)
       const {
         index
       } = e.detail
       this.setData({
         'calcForm.areaIndex': index
       })
     },
     onHouseAgeChange(e) {
       const {
         value
       } = e.detail
       if (value) {
         const result = calculateBuiltYear(value);
         console.log(result, 'calculateBuiltYear')
         this.setData({
           'calcForm.houseYear': result.builtYear,
           'calcForm.houseAge': value,
           'calcForm.houseDescMsg': result.message,
           'calcForm.loanIndex': 6,
           'calcForm.loanGjjIndex': 6
         })
         this.setLoanYear()
         this.setLoanGjjYear()
       }
     },
   },
 })