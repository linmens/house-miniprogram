 import {
   buyTypes,
   chanquanTypes,
   selfHouseTypes,
   unitTypes,
   areaTypes,
   orderTypes,
   exchangeTypes,
   fadingTypes,
   fengeTypes,
   newHouseTypes,
   houseTypes,
   sexTypes
 } from '../utils/constants';
 import {
   calculateBuiltYear,
 } from '../utils/util';
 export const basicBehavior = Behavior({
   data: {
     buyTypes,
     chanquanTypes,
     selfHouseTypes,
     unitTypes,
     areaTypes,
     orderTypes,
     exchangeTypes,
     fadingTypes,
     fengeTypes,
     newHouseTypes,
     houseTypes,
     sexTypes,
     // 显示隐藏年选择器
     yearVisible: false,

     calcForm: {
       // 计价单位下标
       unitIndex: 1,
       // 金额换算值 元 1 || 万元 10000
       unitCount: 1,
       unitRate: 0.0001,
       unit: '万元',
       // 房屋新旧
       buyIndex: 0,
       // 是否法定继承人下标
       fadingIndex: 0,
       // 分割条件
       fengeIndex: 0,
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
       // 成交方式 0 三方成交 1 自行成交
       orderType: 0,
       // 变更类型
       exchangeType: 0,
       // 楼层电梯
       floorIndex: 2,
       // 房屋类型
       houseType: 0,
       // 是否为房屋附属设施
       isHouseOther: 0
     }
   },
   observers: {
     'calcForm.unitIndex': function (unitIndex) {

       //  const {
       //    hukouWuyePrice,
       //    unitCount
       //  } = this.data.calcForm
       //  // 万元
       //  this.setData({
       //    'calcForm.hukouWuyePrice': unitIndex === 1 ? hukouWuyePrice / unitCount : 10000
       //  })

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
           // 万元
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
     setAllPrice() {
       const {
         unitIndex,
         bankPrice,
         hukouWuyePrice,
         loanGjjMaxPrice,
         oldPrice,
         unit,
         pingguPrice,
         wangqianPrice,
         totalPrice
       } = this.data.calcForm

       if (unitIndex === 0) {
         // 当计算单位为元时换算
         this.setData({
           'calcForm.bankPrice': bankPrice * 10000,

           'calcForm.totalPrice': totalPrice * 10000,
           'calcForm.wangqianPrice': wangqianPrice * 10000,
           'calcForm.pingguPrice': pingguPrice * 10000,
           //  'calcForm.oldPrice': oldPrice * 10000,
           //  'calcForm.paymentPrice': paymentPrice * 10000
         })
       } else {
         this.setData({
           'calcForm.bankPrice': bankPrice / 10000,

           'calcForm.totalPrice': totalPrice / 10000,
           'calcForm.wangqianPrice': wangqianPrice / 10000,
           'calcForm.pingguPrice': pingguPrice / 10000,
           //  'calcForm.oldPrice': oldPrice / 10000,
           //  'calcForm.paymentPrice': paymentPrice / 10000
         })
       }
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
     onHouseTypesChange(e) {
       const {
         index
       } = e.detail
       this.setData({
         'calcForm.houseType': index,
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
      * 元 万元 切换
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
       })
       // 设置所有相关金额的数值
       this.setAllPrice()
       this.setHukouWuyePrice()

       this.startCalc()
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
         label,
         unit
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