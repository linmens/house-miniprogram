 import NP from 'number-precision'
 export const extendBehavior = Behavior({
   data: {
     // 继承人
     extender: {
       yinhuaShui: 0,
       qishui: 0,
       details: [],
       total: 0
     },
   },
   methods: {
     calcExtenderAll() {
       const {
         total
       } = this.data.extender

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
     calcExtender() {
       const {
         pingguPrice,
         fadingIndex
       } = this.data.calcForm
       let yinhuaShui = NP.times(pingguPrice, NP.divide(5, 10000))
       let qishui = 0
       let details = [{
         label: '印花税',
         value: yinhuaShui,
         type: 0
       }]
       if (fadingIndex === 1) {
         qishui = NP.times(pingguPrice, 0.03)
         details = [{
           label: '契税',
           value: qishui,
           type: 0
         }, ...details]
       }
       let total = NP.plus(qishui, yinhuaShui)
       this.setData({
         'extender.yinhuaShui': yinhuaShui,
         'extender.qishui': qishui,
         'extender.details': details,
         'extender.total': total
       })

     },

   }
 })