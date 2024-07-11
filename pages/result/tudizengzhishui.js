 import NP from 'number-precision'
 export const tudizengzhishuiBehavior = Behavior({
   data: {
     seller: {
       hdTudizengzhishui: {
         value: 0,
         label: '网签价/1.05*0.05'
       },
       ceTudizengzhishui: {

       }
     }
   },
   methods: {
     getRateLevelInfo(percent) {
       let result = {
         level: 0,
         rate: 0,
         susuanRate: 0
       }
       if (percent <= 50) {
         result.level = 1
         result.rate = 0.3
         result.susuanRate = 0
       } else if (percent > 50 && percent <= 100) {
         result.level = 2
         result.rate = 0.4
         result.susuanRate = 0.05
       } else if (percent > 100 && percent <= 200) {
         result.level = 3
         result.rate = 0.5
         result.susuanRate = 0.15
       } else {
         result.level = 4
         result.rate = 0.6
         result.susuanRate = 0.35
       }

       return result
     },
     setTudizengzhishui() {
       const {
         pingguPrice,
         oldPrice,
         chanquanYear,
         wangqianPrice,
         unit
       } = this.data.calcForm
       const {
         yinhuaRate
       } = this.data.shuifeiRate
       const {
         ceZengzhishui,
         ceCityshui,
         ceEdushui,
         ceLocalshui,
         calcName,
         calcPrice
       } = this.data.seller
       const {
         numPoint
       } = this.data.calcForm

       let sellerDetails = this.data.seller.details
       let canMinusYear = NP.times(oldPrice, NP.plus(1, NP.times(0.05, chanquanYear)))
       let result = {}
       result.tudizengzhishui = NP.times(wangqianPrice, 0.05)

       if (pingguPrice && oldPrice) {
         //有评估并且有原值
         result.canMinusPrice = NP.plus(oldPrice, ceCityshui, ceEdushui, ceLocalshui)
         result.tudizengzhie = NP.minus(pingguPrice, result.canMinusPrice)
         result.tudizengzhiRate = NP.round(NP.times(NP.divide(result.tudizengzhie, result.canMinusPrice), 100), numPoint)
         result.tudizengzhiRateInfo = this.getRateLevelInfo(result.tudizengzhiRate)
         result.cetudizengzhishui = NP.round(NP.minus(NP.times(result.tudizengzhie, result.tudizengzhiRateInfo.rate), NP.times(result.canMinusPrice, result.tudizengzhiRateInfo.susuanRate)), numPoint)
         console.log('有评估并且有原值', result)
         result.desc = [{
           label: '有评估并且有原值',
           isLower: result.cetudizengzhishui < result.tudizengzhishui
         }, {
           label: `1.可扣除项目金额=重置成本*成新度折扣率+本次税金（城市维护建设税、教育税附加、地方教育附加税、印花税）结果为${result.canMinusPrice} ${unit}`
         }, {
           label: `2.土地增值额=${calcName}-可扣除项目金额 结果为 ${result.tudizengzhie} ${unit}`
         }, {
           label: `3.增值率=土地增值额/可扣除项目金额*100% 结果为 ${result.tudizengzhiRate} ${unit}`
         }, {
           label: `4.应纳税额=增值额*税率(${result.tudizengzhiRateInfo.rate})-可扣除项目金额*速算扣除系数(${result.tudizengzhiRateInfo.susuanRate}) 结果为 ${result.cetudizengzhishui} ${unit}`
         }]
       }
       if (!pingguPrice && !oldPrice) {
         // 无评估价并且无原值 

       }
       if (!pingguPrice && oldPrice) {

         // 无评估价 并且 有原值 原值*（1+5%*产权持有年限)+上次契税+本次税金（增值税、增值税附加、印花税）
         result.canMinusPrice = NP.round(NP.plus(canMinusYear, ceCityshui, ceEdushui, ceLocalshui, wangqianPrice * yinhuaRate), numPoint)
         // 土地增值额=网签价-可扣除金额
         result.tudizengzhie = NP.minus(wangqianPrice, result.canMinusPrice)
         if (result.tudizengzhie < 0) {
           result.tudizengzhie = 0
           result.tudizengzhishui = 0
           return
         }
         // 增值率 = 土地增值额/可扣除金额*100%
         result.tudizengzhiRate = NP.round(NP.times(NP.divide(result.tudizengzhie, result.canMinusPrice), 100), 2)
         // 应纳税额 = 增值额*税率-扣除项目金额*速算扣除系数
         result.tudizengzhiRateInfo = this.getRateLevelInfo(result.tudizengzhiRate)
         console.log('无评估价 并且 有原值 获取税率', result.tudizengzhiRateInfo)
         result.cetudizengzhishui = NP.minus(NP.times(result.tudizengzhie, result.tudizengzhiRateInfo.rate), NP.times(result.canMinusPrice, result.tudizengzhiRateInfo.susuanRate))
         console.log('无评估价 并且 有原值 原值*（1+5%*产权持有年限)+上次契税+本次税金（增值税、增值税附加、印花税）', result)

         result.desc = [{
           label: '差额计算无评估价并且有原值',
           isLower: result.cetudizengzhishui < result.tudizengzhishui
         }, {
           label: `1.可扣除项目金额=原值*（1+5%*产权持有年限)+上次契税+本次税金（城市维护建设税、教育税附加、地方教育附加税、印花税）结果为${result.canMinusPrice} ${unit}`
         }, {
           label: `2.土地增值额=${calcName}-可扣除项目金额 结果为 ${result.tudizengzhie} ${unit}`
         }, {
           label: `3.增值率=土地增值额/可扣除项目金额*100% 结果为 ${result.tudizengzhiRate} ${unit}`
         }, {
           label: `4.应纳税额=增值额*税率(${result.tudizengzhiRateInfo.rate})-可扣除项目金额*速算扣除系数(${result.tudizengzhiRateInfo.susuanRate}) 结果为 ${result.cetudizengzhishui} ${unit}`
         }]
       }

       result.desc = [{
         label: `核定计算 网签价*0.05 结果为 ${result.tudizengzhishui} ${unit}`,
         isLower: result.tudizengzhishui < result.cetudizengzhishui
       }, ...result.desc]
       this.setData({
         'seller.tudizengzhishui': result
       })
     }
   }
 })