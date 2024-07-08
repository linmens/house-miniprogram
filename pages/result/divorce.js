 import NP from 'number-precision'
 export const divorceBehavior = Behavior({
   data: {
     // 离婚分割 夫妻双方
     divorcer: {
       yinhuaShui: 0,
       details: [],
       total: 0
     },
     // 房屋权属变更后的一方
     another: {
       yinhuaShui: 0,
       qishui: 0,
       details: [],
       total: 0
     }
   },
   methods: {
     calcDivorceAll() {

       let totalAll = NP.plus(this.data.divorcer.total, this.data.another.total)
       //  let details = [{
       //    title: '核定征收',
       //    theme: 'primary',
       //    show: 1,
       //    data: [{
       //      label: '全额',
       //      value: total,
       //      show: 1
       //    }, ]
       //  }]
       this.setData({
         'result.totalAll': totalAll,
       })
     },
     calcDivorcer() {
       const {
         pingguPrice,
       } = this.data.calcForm
       let yinhuaShui = NP.times(pingguPrice, NP.divide(5, 10000))
       let details = [{
         label: '印花税',
         value: yinhuaShui,
         type: 0
       }]

       let total = NP.plus(yinhuaShui)
       this.setData({
         'divorcer.yinhuaShui': yinhuaShui,
         'divorcer.details': details,
         'divorcer.total': total
       })
     },
     calaAnother() {
       const {
         pingguPrice,
         fengeIndex
       } = this.data.calcForm
       let yinhuaShui = NP.times(pingguPrice, NP.divide(5, 10000))
       let qishui = 0
       let details = [{
         label: '印花税',
         value: yinhuaShui,
         type: 0
       }]
       if (fengeIndex === 1) {
         qishui = NP.times(pingguPrice, 0.03)
         details = [{
           label: '契税',
           value: qishui,
           type: 0
         }, ...details]
       }
       let total = NP.plus(yinhuaShui, qishui)
       this.setData({
         'another.yinhuaShui': yinhuaShui,
         'another.qishui': qishui,
         'another.details': details,
         'another.total': total
       })
     }
   }
 })