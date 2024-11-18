 import {
   calculateEqualPrincipalAndInterest,
   calculateEqualPrincipal
 } from '../../utils/util'
 export const shangdaiBehavior = Behavior({
   data: {
     shangdai: [],
     shangdaiInfo: {
       totalList: [],
       details: []
     },
     shangdaiDebx: {

     },
     shangdaiDebj: {

     },
   },
   methods: {
     // 计算商贷结果
     startShangdai() {
       const {
         loanBackIndex,
         loanYear,
         loanPrice,
         loanRate,
         unit
       } = this.data.calcForm
       const debxResult = calculateEqualPrincipalAndInterest(loanPrice, loanRate / 100, loanYear, unit)
       const debjResult = calculateEqualPrincipal(loanPrice, loanRate / 100, loanYear, unit)
       let details = loanBackIndex === 0 ? debxResult.paymentDetails.slice(0, 3) : debjResult.paymentDetails.slice(0, 3)
       console.log(debxResult, debjResult, 'result')
       let shangdai = [{
         title: '等额本息',
         icon: loanBackIndex === 0 ? 'check-circle' : '',
         ...debxResult
       }, {
         title: '等额本金',
         icon: loanBackIndex === 1 ? 'check-circle' : '',
         ...debjResult
       }]

       let shangdaiInfoDetails = [{
         tagOptions: {
           text: '贷款月数',
           type: 'success'
         },
         value: loanYear * 12,
         unit: '月'
       }, {
         tagOptions: {
           text: '贷款利率',
           type: 'default'
         },
         value: loanRate,
         unit: '%'
       }, {
         tagOptions: {
           text: '贷款金额',
           type: 'primary'
         },
         value: loanPrice,
         unit: unit
       }]
       this.setData({
         shangdai: shangdai,
         'shangdaiInfo.totalList': shangdaiInfoDetails,
         shangdaiDebx: shangdai[0],
         shangdaiDebj: shangdai[1],
         'shangdaiInfo.details': details
       })
     }
   }
 })