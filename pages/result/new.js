 import NP from 'number-precision'
 export const newerBehavior = Behavior({
   data: {
     // 新房买方
     newder: {
       qishui: 0,
       details: [],
       total: 0
     },
   },
   methods: {
     calcNewAll() {
       const {
         total
       } = this.data.newder

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
     calcNewer() {
       const {
         pingguPrice,
         unit,
         paymentPrice,
         loanPrice,
         loanGjjPrice,
         floorIndex,
         area,
         houseType
       } = this.data.calcForm
       console.log('开始计算新房税费...')
       this.calcQishui()
       let houseBookPrice = unit === '元' ? 80 : 80 / 10000
       switch (houseType) {
         case 0:

           break;
         case 1:
           houseBookPrice = unit === '元' ? 550 : 550 / 10000
           break;
         case 2:

           break;
         default:
           break;
       }
       let floorPrice = 0;
       let floorDesc = []
       // 商品房，含经济适用房、集资建房的维修资金交存标准
       switch (floorIndex) {
         case 0:
           // 7层以下，不配备电梯的多层住宅，每平方米60元；
           floorPrice = NP.times(area, unit === '元' ? 60 : 60 / 10000);
           floorDesc = [{
             label: '7层以下，不配备电梯的多层住宅，每平方米60元'
           }]
           break;
         case 1:
           // 7层以下，配备电梯的多层住宅，每平方米90元；
           floorPrice = NP.times(area, unit === '元' ? 90 : 90 / 10000)
           floorDesc = [{
             label: '7层以下，配备电梯的多层住宅，每平方米90元'
           }]
           break;
         case 2:
           // 7层以上，含7层的小高层、高层住宅，每平方米145元。
           floorPrice = NP.times(area, unit === '元' ? 145 : 145 / 10000)
           floorDesc = [{
             label: '7层以上，含7层的小高层、高层住宅，每平方米145元'
           }]
         default:
           break;
       }

       let details = [this.data.buyer.qishui, {
         label: '房本制本费',
         value: houseBookPrice,
         type: 0
       }, {
         label: '首付',
         value: paymentPrice,
         type: 0
       }, {
         label: '商业贷款',
         value: loanPrice,
         type: 0
       }, {
         label: '公积金贷款',
         value: loanGjjPrice,
         type: 0
       }, {
         label: '住宅专项维修资金',
         value: floorPrice,
         type: 0,
         desc: floorDesc
       }]

       let total = NP.plus(this.data.buyer.qishui.value, houseBookPrice, paymentPrice, loanPrice, loanGjjPrice, floorPrice)
       let withoutTotal = NP.plus(this.data.buyer.qishui.value, paymentPrice, houseBookPrice, floorPrice)
       let totalList = [{
         tagOptions: {
           text: '落地房价',
           type: 'primary'
         },
         value: total
       }, {
         tagOptions: {
           text: '不含贷款',
           type: 'success'
         },
         value: withoutTotal
       }]
       this.setData({
         'buyer.details': details,
         'buyer.total': total,
         'buyer.withoutTotal': withoutTotal,
         'result.totalAll': withoutTotal,
         'buyer.totalList': totalList
       })
     },
   }
 })