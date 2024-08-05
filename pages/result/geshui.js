 import NP from 'number-precision'
 export const geshuiBehavior = Behavior({
   data: {
     seller: {
       geshui: {
         label: '个税',
         value: 0,
         hdValue: 0,
         ceValue: 0,
         desc: [],
         tagOptions: {},
         type: 0,
       }
     }
   },
   methods: {
     setGeshui() {
       const {
         oldPrice,
         oldBankPrice,
         oldHouseStylePrice,
         oldOtherPrice,
         unit,

       } = this.data.calcForm
       const {
         zengzhishui,
         calcPrice,
         calcName,
         tudizengzhishui
       } = this.data.seller
       const {
         geshuiRate,
         ceGeshuiRate
       } = this.data.shuifeiRate
       let geshui = this.data.seller.geshui

       let peroldHouseStylePrice = 0
       geshui.hdValue = NP.times(calcPrice, geshuiRate)
       if (oldPrice) {
         // 按差额 = 网签 - 历史成交价 - 原始税费 - 贷款利息 等合理费用
         // 转让住房过程中缴纳的税金是指：纳税人在转让住房时实际缴纳的营业税、城市维护建设税、教育费附加、土地增值税、印花税等税金。
         if (oldHouseStylePrice) {
           const maxoldHouseStylePrice = NP.times(oldPrice, 0.1)
           if (oldHouseStylePrice >= maxoldHouseStylePrice) {
             peroldHouseStylePrice = maxoldHouseStylePrice
           } else {
             peroldHouseStylePrice = oldHouseStylePrice
           }
           console.log('不超过原值10%的住房装修费用', peroldHouseStylePrice)
         }
         let minprice = NP.minus(calcPrice, oldPrice, peroldHouseStylePrice, oldOtherPrice, oldBankPrice, zengzhishui.ceValue, zengzhishui.cityshui, zengzhishui.edushui, zengzhishui.localshui, tudizengzhishui.ceValue)
         console.log(`${calcName}-原值-合理费用-转让住房过程中缴纳的税金`, minprice)
         if (minprice < 0) {
           geshui.ceValue = 0
           geshui.desc = [{
             label: `${calcName}-原值-合理费用-转让住房过程中缴纳的税金低于0`
           }]
         } else {
           geshui.ceValue = NP.times(minprice, ceGeshuiRate)
           geshui.desc = [{
             label: `差额计算 (${calcName}-原值-合理费用-转让住房过程中缴纳的税金)*${ceGeshuiRate} 结果为 ${geshui.ceValue} ${unit}`,
             isLower: geshui.ceValue < geshui.hdValue
           }]
         }
         console.log('产权满5年及以上非家庭唯一,个税按差额征收：', geshui)

         geshui.desc = [{
           label: `${calcName}*${geshuiRate} 结果为 ${geshui.ceValue} ${unit}`,
           isLower: geshui.hdValue < geshui.ceValue
         }, ...geshui.desc]

       } else {
         //  ceResult.value = NP.times(calcPrice, ceGeshuiRate)
         //  ceResult.label = `${calcName}*${ceGeshuiRate} 结果为 ${ceResult.value} ${unit}`
         geshui.desc = [{
           label: `${calcName}*${geshuiRate}`
         }]
         console.log('产权满5年及以上非家庭唯一,普通住宅个税核定征收：', geshui)
       }
       this.setData({
         'seller.geshui': geshui,
       })
     },
   }
 })