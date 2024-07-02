 import {
   buyTypes,
   chanquanTypes,
   exchangeTypes,
   areaTypes,
   orderTypes,
   tabs,
   fadingTypes
 }
 from '../../utils/constants';
 export const basicBehavior = Behavior({
   data: {
     // 动态生成的列表
     list: []
   },
   methods: {
     // 初始化买卖列表
     initBuyList() {
       const {
         bankType,
         orderType,
         buyIndex,
         areaIndex,
         area,
         chanquanIndex,
         chanquanYear,
         houseYear,
         houseAge,
         totalPrice,
         unit,
         wangqianPrice
       } = this.data.calcForm
       let list = [{
         label: '支付方式',
         value: tabs[bankType].label,
         show: 1
       }, {
         label: '成交方式',
         value: orderTypes[orderType].label,
         show: 1
       }, {
         label: '房屋新旧',
         value: buyTypes[buyIndex].label,
         show: 1
       }, {
         label: '建筑面积',
         value: areaIndex === 2 ? area : areaTypes[areaIndex].label,
         show: 1
       }, {
         label: '唯一住房',
         value: chanquanTypes[chanquanIndex].label,
         show: 1
       }, {
         label: '产证持有',
         value: chanquanYear + '年',
         show: chanquanYear ? 1 : 0
       }, {
         label: '建成年份',
         value: houseYear + '年',
         show: houseYear ? 1 : 0
       }, {
         label: '房屋年龄',
         value: houseAge + '年',
         show: houseAge ? 1 : 0
       }, {
         label: '交易总价',
         value: totalPrice + unit,
         show: totalPrice ? 1 : 0
       }, {
         label: '网签金额',
         value: wangqianPrice + unit,
         show: wangqianPrice ? 1 : 0
       }]
       this.setData({
         list: list
       })
     },
     // 初始化赠与列表
     initSendList() {
       const {
         buyIndex,
         unit,
         pingguPrice,
         exchangeType
       } = this.data.calcForm
       let list = [{
         label: '变更类型',
         value: exchangeTypes[exchangeType].label,
         show: 1
       }, {
         label: '房屋新旧',
         value: buyTypes[buyIndex].label,
         show: 1
       }, {
         label: '评估价格',
         value: pingguPrice + unit,
         show: pingguPrice ? 1 : 0
       }]
       this.setData({
         list: list
       })
     },
     // 初始化继承列表
     initExtendList() {
       const {
         buyIndex,
         unit,
         pingguPrice,
         exchangeType,
         fadingIndex
       } = this.data.calcForm
       let list = [{
         label: '变更类型',
         value: exchangeTypes[exchangeType].label,
         show: 1
       }, {
         label: '房屋新旧',
         value: buyTypes[buyIndex].label,
         show: 1
       }, {
         label: '继承类型',
         value: fadingTypes[fadingIndex].label,
         show: 1
       }, {
         label: '评估价格',
         value: pingguPrice + unit,
         show: pingguPrice ? 1 : 0
       }]
       this.setData({
         list: list
       })
     },
   }
 })