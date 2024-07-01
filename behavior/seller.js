   import {
     canGiveOldpriceTypes
   } from '../utils/constants';
   export const sellerBehavior = Behavior({
     data: {
       canGiveOldpriceTypes,
       calcForm: {
         // 产权证持有年限
         chanquanYear: 0,
         // 是否唯一住房
         chanquanIndex: 1,
         // 能否提供原值下标
         oldPriceIndex: 1,
         // 原值
         oldPrice: 0
       }
     },
     methods: {
       onOldPriceChange(e) {
         const {
           value
         } = e.detail
         this.setData({
           'calcForm.oldPrice': value
         })
       },
       onCanGiveOldpriceTypesChange(e) {
         const {
           index
         } = e.detail
         this.setData({
           'calcForm.oldPriceIndex': index,
           'calcForm.oldPrice': 0
         })
       },
       handleChanquanYearChange(e) {
         const {
           value
         } = e.detail
         this.setData({
           'calcForm.chanquanYear': value
         })
       }
     }
   })