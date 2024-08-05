 import {
   calculateEqualPrincipalAndInterest,
   calculateEqualPrincipal,
   isBeyondRetirementExtension
 } from '../../utils/util'
 import {
   sexTypes
 } from '../../utils/constants'
 import NP from 'number-precision'
 import _ from 'lodash'
 export const gongjijinBehavior = Behavior({
   data: {
     gongjijin: [],
     gongjijinInfo: {
       totalList: []
     },
     gongjijinDebx: {

     },
     gongjijinDebj: {

     },
     gjjMaxPrice: 0,
     noticeInfo: {
       content: [],
       theme: 'primary'
     }
   },
   methods: {
     calcSexResult(loanGjjAge, loanGjjMaxAge, sexResult, noticeInfo) {

       if (loanGjjAge <= loanGjjMaxAge) {
         // 不超过60岁
         sexResult.tagOptions = {
           type: 'success',
           text: '符合条件'
         }
         sexResult.desc = [{
           label: `借款人申请个人住房公积金贷款时年龄未超过其法定退休年龄${loanGjjMaxAge}岁。`
         }]
       } else {

         sexResult.desc = [{
           label: `借款人申请个人住房公积金贷款时年龄超过其法定退休年龄${loanGjjMaxAge}岁。`,

         }]
         sexResult.tagOptions = {
           type: 'danger',
           text: '不符合条件'
         }
         if (noticeInfo) {
           noticeInfo.content = ['建议使用全款购买', ...noticeInfo.content]
         }
       }
     },
     calcJiaocunResult(monthlyPayment, gjjMaxPrice, noticeInfo, unit, jiaocunResult) {
       if (monthlyPayment < gjjMaxPrice) {
         // 月供未超过基数的50%
         jiaocunResult.desc = [{
           label: `月均还款为${monthlyPayment}${unit}<${gjjMaxPrice}${unit}(缴存基数之和*50%),个人住房公积金贷款月偿还贷款本息额未超过借款人及配偶缴存基数之和的50%。`
         }]
         jiaocunResult.tagOptions = {
           type: 'success',
           text: '符合条件'
         }

       } else {
         jiaocunResult.desc = [{
           label: `月均还款为${monthlyPayment}${unit}>${gjjMaxPrice}${unit}(缴存基数*50%),个人住房公积金贷款月偿还贷款本息额超过借款人及配偶缴存基数之和的50%。`,

         }]
         jiaocunResult.tagOptions = {
           type: 'danger',
           text: '不符合条件'
         }
         if (noticeInfo) {
           noticeInfo.content = ['建议降低公积金贷款金额', ...noticeInfo.content]
         }
       }
     },
     calcYearsResult(age, year, result, noticeInfo) {
       let maleloanEndYear = age + year
       let maleLoanisBeyond = isBeyondRetirementExtension(maleloanEndYear, 60)

       if (maleLoanisBeyond) {
         result.tagOptions = {
           text: '不符合条件',
           type: 'danger'
         }
         result.desc = [{
           label: `个人住房公积金贷款最长期限不得超过 30 年，且借款到期日不超过借款申请人法定退休时间后 5 年。`
         }]
         if (noticeInfo) {
           noticeInfo.content = ['建议缩短贷款年限', ...noticeInfo.content]
         }
       } else {
         result.tagOptions = {
           text: '符合条件',
           type: 'success'
         }
         result.desc = [{
           label: `个人住房公积金贷款最长期限不得超过 30 年，且借款到期日不超过借款申请人法定退休时间后 5 年。`
         }]
       }
     },
     // 计算商贷结果
     startGongjijin() {
       const {
         loanBackIndex,
         loanYear,
         loanGjjPrice,
         loanGjjRate,
         unit,
         loanGjjSaveIndex,
         loanGjjSexIndex,
         loanGjjBasicPrice,
         loanGjjAge,
         loanGjjMaleBasicPrice,
         loanGjjFemaleBasicPrice,
         loanGjjMaleAge,
         loanGjjFemaleAge
       } = this.data.calcForm
       const debxResult = calculateEqualPrincipalAndInterest(loanGjjPrice, loanGjjRate / 100, loanYear, unit)
       const debjResult = calculateEqualPrincipal(loanGjjPrice, loanGjjRate / 100, loanYear, unit)
       console.log(debxResult, debjResult, 'result')
       let gongjijin = [{
         title: '等额本息',
         icon: loanBackIndex === 0 ? 'check-circle' : '',
         ...debxResult
       }, {
         title: '等额本金',
         icon: loanBackIndex === 1 ? 'check-circle' : '',
         ...debjResult
       }]
       let sex = sexTypes[loanGjjSexIndex].label
       let gongjijinInfo = {
         details: [],
         totalList: [{
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
           value: loanGjjRate,
           unit: '%'
         }, {
           tagOptions: {
             text: '贷款金额',
             type: 'primary'
           },
           value: loanGjjPrice,
           unit: unit
         }]
       }

       let gjjMaxPrice = 0
       let noticeInfo = {
         content: '',
         theme: ''
       }


       if (loanGjjSaveIndex === 0 || loanGjjSaveIndex === 2) {
         // 单人符合贷款条件
         let jiaocunResult = {
           label: '缴存基数',
           value: loanGjjBasicPrice,
           type: 0,
         }
         let sexResult = {
           label: '年龄',
           value: loanGjjAge,
           type: 0,
           unit: '岁'
         }
         let yearResult = {
           label: '贷款年限',
           value: loanYear,
           type: 0,
           unit: '年'
         }
         if (loanGjjBasicPrice) {

           let loanGjjMaxAge = loanGjjSexIndex === 0 ? 60 : 55
           this.calcSexResult(loanGjjAge, loanGjjMaxAge, sexResult, noticeInfo)
           this.calcJiaocunResult(gongjijin[loanBackIndex].monthlyPayment, loanGjjBasicPrice * 0.5, noticeInfo, unit, jiaocunResult)
           this.calcYearsResult(loanGjjAge, loanYear, yearResult, noticeInfo)
           gongjijinInfo.details = gongjijinInfo.details.concat([{
               label: '性别',
               value: sex,
               type: 0,
               hideUnit: true
             }, sexResult,
             yearResult,
             jiaocunResult
           ])
         }

       }
       if (loanGjjSaveIndex === 1 || loanGjjSaveIndex === 3) {
         // 双人符合贷款条件
         let maleJiaocunResult = {
           label: '男方缴存基数',
           value: loanGjjMaleBasicPrice,
           type: 0
         }

         let femaleJiaocunResult = {
           label: '女方缴存基数',
           value: loanGjjFemaleBasicPrice,
           type: 0
         }
         let maleAge = {
           label: '男方年龄',
           value: loanGjjMaleAge,
           type: 0,
           unit: '岁'
         }
         let femaleAge = {
           label: '女方年龄',
           value: loanGjjFemaleAge,
           type: 0,
           unit: '岁'
         }
         let maleYears = {
           label: '男方贷款年限',
           value: loanYear,
           type: 0,
           unit: '年'
         }
         let femaleYears = {
           label: '女方贷款年限',
           value: loanYear,
           type: 0,
           unit: '年'
         }
         this.calcYearsResult(loanGjjMaleAge, loanYear, maleYears, noticeInfo)
         this.calcYearsResult(loanGjjFemaleAge, loanYear, femaleYears, noticeInfo)

         this.calcSexResult(loanGjjFemaleAge, 55, femaleAge, noticeInfo)
         this.calcSexResult(loanGjjMaleAge, 60, maleAge, noticeInfo)
         if (loanGjjMaleBasicPrice) {
           this.calcJiaocunResult(gongjijin[loanBackIndex].monthlyPayment, NP.plus(loanGjjMaleBasicPrice, loanGjjFemaleBasicPrice) * 0.5, noticeInfo, unit, maleJiaocunResult)
           this.calcJiaocunResult(gongjijin[loanBackIndex].monthlyPayment, NP.plus(loanGjjMaleBasicPrice, loanGjjFemaleBasicPrice) * 0.5, noticeInfo, unit, femaleJiaocunResult)
         }



         gongjijinInfo.details = gongjijinInfo.details.concat([maleAge, femaleAge, maleJiaocunResult, femaleJiaocunResult, maleYears, femaleYears])
       }
       console.log(noticeInfo.content)
       noticeInfo.content = _.uniq(noticeInfo.content)
       this.setData({
         gongjijin: gongjijin,
         'gongjijinInfo': gongjijinInfo,
         gongjijinDebx: gongjijin[0],
         gongjijinDebj: gongjijin[1],
         noticeInfo: noticeInfo
       })
     }
   }
 })