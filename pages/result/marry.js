 import NP from 'number-precision'
 export const marryBehavior = Behavior({
   data: {
     // 继承人
     marryder: {
       yinhuaShui: 0,
       details: [],
       total: 0
     },
   },
   methods: {
     calcMarryerAll() {
       const {
         total
       } = this.data.marryder

       let details = [{
         title: '核定征收',
         theme: 'primary',
         show: 1,
         data: [{
           label: '全额',
           value: total,
           show: 1
         }, ]
       }]
       this.setData({
         'result.details': details,
       })
     },
     calcMarryer() {
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
         'marryder.yinhuaShui': yinhuaShui,
         'marryder.details': details,
         'marryder.total': total
       })
     },
   }
 })