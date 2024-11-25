  import {
    buyerTypes
  } from '../../../utils/constants';
  export const buyerBehavior = Behavior({
    data: {
      calcForm: {
        // 买方家庭
        buyerIndex: 0,

      },
      buyerTypes
    },
    methods: {

      onBuyerTypesChange(e) {
        const {
          index
        } = e.detail

        this.setData({
          'calcForm.buyerIndex': index,
        })
        // this.startCalc()
      }
    }
  })