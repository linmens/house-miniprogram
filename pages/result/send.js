 import NP from 'number-precision'
 export const sendBehavior = Behavior({
   data: {
     // 赠与方
     sender: {
       yinhuaShui: 0,
       details: [],
       total: 0
     },
     // 受赠方
     getter: {
       qishui: 0,
       yinhuaShui: 0,
       total: 0
     }
   },
   methods: {
     calcSendAll() {

       let totalAll = NP.plus(this.data.sender.total, this.data.getter.total)
       //  let details = [{
       //    title: '核定征收',
       //    theme: 'primary',
       //    show: 1,
       //    data: [{
       //      label: '全额',
       //      value: totalAll,
       //      show: 1
       //    }, ]
       //  }]
       this.setData({
         'result.totalAll': totalAll
       })
     },
     calcSender() {
       const {
         pingguPrice,
         numPoint
       } = this.data.calcForm
       const {
         yinhuaRate
       } = this.data.shuifeiRate
       const {
         yinhuaDesc
       } = this.data.shuifeiDesc
       let yinhuaShui = NP.round(NP.times(pingguPrice, yinhuaRate), numPoint)
       let details = [{
         label: '印花税',
         value: yinhuaShui,
         type: 0,
         desc: yinhuaDesc[1]
       }]

       this.setData({
         'sender.yinhuaShui': yinhuaShui,
         'sender.details': details,
         'sender.total': yinhuaShui
       })
       console.log('设置赠与方税费：',
         yinhuaShui)
     },
     calcGetter() {
       const {
         pingguPrice,
         numPoint
       } = this.data.calcForm
       const {
         yinhuaRate
       } = this.data.shuifeiRate
       const {
         yinhuaDesc
       } = this.data.shuifeiDesc
       let yinhuaShui = NP.round(NP.times(pingguPrice, yinhuaRate), numPoint)
       let qishui = NP.times(pingguPrice, 0.03)
       let details = [{
         label: '契税',
         value: qishui,
         type: 0,
         desc: [{
           label: '评估价 * 0.03'
         }]
       }, {
         label: '印花税',
         value: yinhuaShui,
         type: 0,
         desc: yinhuaDesc[1]
       }]
       let total = NP.plus(qishui, yinhuaShui)
       this.setData({
         'getter.qishui': qishui,
         'getter.yinhuaShui': yinhuaShui,
         'getter.details': details,
         'getter.total': total
       })
       console.log('设置受赠方契税：',
         qishui)
       console.log('设置受赠方印花税：',
         yinhuaShui)

     }
   }
 })