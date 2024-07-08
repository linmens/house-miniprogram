  import {
    buyerTypes
  } from '../utils/constants';
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
        let rate = 15
        switch (index) {
          case 1:
            rate = 25
            break;
          case 2:
            rate = 25
            break;
          default:
            break;
        }
        this.setData({
          'calcForm.buyerIndex': index,
          'calcForm.paymentRate': rate
        })
      }
    }
  })