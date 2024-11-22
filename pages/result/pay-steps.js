  import NP from 'number-precision'
  import dayjs from 'dayjs'
  import businessDays from 'dayjs-business-days';
  // 使用插件
  dayjs.extend(businessDays);

  export const payStepsBehavior = Behavior({
    data: {
      paySteps: []
    },
    methods: {
      initPaySteps() {
        const {
          buyIndex,
          bankType,
          bankPrice,
          paymentPrice,
          unit,
          hukouWuyePrice,
          zengzhishuichengdanIndex
        } = this.data.calcForm
        let calcTabs = this.data.calcTabs
        calcTabs.splice(3, 0, {
          label: '支付节点',
          value: 3
        })
        let dingjin = unit === '元' ? 20000 : 2

        let paySteps = []
        let basicTime = this.data.options.time
        // 购审、挂牌、网签时间
        let step2time = dayjs(basicTime).businessDaysAdd(7).format('YYYY-MM-DD')
        // 交易房屋现值评估
        let step3time = dayjs(step2time).businessDaysAdd(7).format('YYYY-MM-DD')
        // 办理贷款
        let step4time = dayjs(step3time).businessDaysAdd(10).format('YYYY-MM-DD')
        // 银行放款
        let step5time = dayjs(step4time).businessDaysAdd(15).format('YYYY-MM-DD')
        // 缴税过户及物业交割
        let step6time = dayjs(step5time).businessDaysAdd(10).format('YYYY-MM-DD')
        // 二手房贷款流程
        let buyer = this.data.buyer
        let seller = this.data.seller
        const commonSteps = [{
          title: '签约买卖合同',
          time: this.data.options.time,
          list: [{
            tagText: '买方支付',
            tagTheme: 'primary',
            total: NP.plus(buyer.serviceFee, bankPrice, dingjin),
            details: [{
              label: '居间服务费（支付至居间机构）',
              value: buyer.serviceFee,
            }, {
              label: '贷款服务费（支付至居间机构）',
              value: bankPrice,
            }, {
              label: '定金（支付至卖方）',
              value: dingjin,
            }]
          }, {
            tagText: '卖方支付',
            tagTheme: 'success',
            total: seller.serviceFee,
            details: [{
              label: '居间服务费',
              value: seller.serviceFee,
            }]
          }]
        }, {
          title: '购审、挂牌、网签',
          time: `${step2time}前完成`
        }]
        if (buyIndex === 0 && bankType !== 3) {
          paySteps = [...commonSteps, {
            title: '交易房屋现值评估',
            time: `${step3time}前完成`
          }, {
            title: '办理贷款、资金监管',
            time: `${step4time}前完成`,
            list: [{
              tagText: '买方支付',
              tagTheme: 'primary',
              total: paymentPrice - dingjin,
              details: [{
                label: '首付（存入资金监管账户）',
                value: paymentPrice - dingjin,
              }]
            }, {
              tagText: '卖方支付',
              tagTheme: 'success',
              total: dingjin,
              details: [{
                label: '定金（存入资金监管账户）',
                value: dingjin,
              }]
            }]
          }, {
            title: '银行发放贷款至监管账户',
            time: `${step5time}前完成`
          }, {
            title: '缴税过户及物业交割',
            time: `${step6time}前完成`,
            list: [{
              tagText: '买方支付',
              tagTheme: 'primary',
              total: NP.plus(buyer.qishui.value, buyer.geshui.value, buyer.houseBookPrice.value, hukouWuyePrice, buyer.zengzhishui.value, buyer.zengzhishui.edushui, buyer.zengzhishui.cityshui, buyer.zengzhishui.localshui),
              details: [{
                label: '契税',
                value: buyer.qishui.value,
              }, {
                label: '房本制本费',
                value: buyer.houseBookPrice.value
              }, {
                label: '个税',
                value: buyer.geshui.value
              }, {
                label: '增值税及附加',
                value: NP.plus(buyer.zengzhishui.value, buyer.zengzhishui.edushui, buyer.zengzhishui.cityshui, buyer.zengzhishui.localshui)
              }, {
                label: '户口物业预留金额（支付至卖方）',
                value: hukouWuyePrice
              }, {
                label: '印花税',
                value: buyer.yinhuashui
              }]
            }, {
              tagText: '卖方支付',
              tagTheme: 'success',
              total: NP.plus(seller.zengzhishui.value, seller.geshui.value, seller.zengzhishui.cityshui, seller.zengzhishui.edushui, seller.zengzhishui.localshui, seller.tudizengzhishui.value),
              details: [{
                label: '个税',
                value: seller.geshui.value
              }, {
                label: '增值税',
                value: seller.zengzhishui.value
              }, {
                label: '城市维护建设税',
                value: seller.zengzhishui.cityshui
              }, {
                label: '教育附加税',
                value: seller.zengzhishui.edushui
              }, {
                label: '地方教育附加税',
                value: seller.zengzhishui.localshui
              }, {
                label: '土地增值税',
                value: seller.tudizengzhishui.value
              }, {
                label: '印花税',
                value: seller.yinhuashui
              }]
            }]
          }, {
            title: '领取房产证'
          }]
        }
        // 二手房全款流程
        if (buyIndex === 0 && bankType === 3) {
          paySteps = [...commonSteps, {
            title: '办理贷款、资金监管',
            time: `${step3time}前完成`,
            list: [{
              tagText: '买方支付',
              tagTheme: 'primary',
              total: paymentPrice - dingjin,
              details: [{
                label: '首付（存入资金监管账户）',
                value: paymentPrice - dingjin,
              }]
            }, {
              tagText: '卖方支付',
              tagTheme: 'success',
              total: dingjin,
              details: [{
                label: '定金（存入资金监管账户）',
                value: dingjin,
              }]
            }]
          }, {
            title: '缴税过户及物业交割',
            time: `${step4time}前完成`,
            list: [{
              tagText: '买方支付',
              tagTheme: 'primary',
              total: buyer.qishui.value + buyer.houseBookPrice + hukouWuyePrice,
              details: [{
                label: '契税',
                value: buyer.qishui.value,
              }, {
                label: '房本制本费',
                value: buyer.houseBookPrice
              }, {
                label: '户口物业预留金额（支付至卖方）',
                value: hukouWuyePrice
              }]
            }, {
              tagText: '卖方支付',
              tagTheme: 'success',
              total: NP.plus(seller.zengzhishui.value, seller.geshui.value, seller.zengzhishui.cityshui, seller.zengzhishui.edushui, seller.zengzhishui.localshui, seller.tudizengzhishui.value),
              details: [{
                label: '个税',
                value: seller.geshui.value
              }, {
                label: '增值税',
                value: seller.zengzhishui.value
              }, {
                label: '城市维护建设税',
                value: seller.zengzhishui.cityshui
              }, {
                label: '教育附加税',
                value: seller.zengzhishui.edushui
              }, {
                label: '地方教育附加税',
                value: seller.zengzhishui.localshui
              }, {
                label: '土地增值税',
                value: seller.tudizengzhishui.value
              }]
            }]
          }, {
            title: '领取房产证'
          }]
        }
        // 一手房贷款流程
        if (buyIndex === 1) {
          paySteps = [{
            title: '选房',
            time: this.data.options.time
          }, {
            title: '定房',
            time: this.data.options.time,
            list: [{
              tagText: '买方支付',
              tagTheme: 'primary',
              total: dingjin,
              details: [{
                label: '定金',
                value: dingjin
              }]
            }]
          }, {
            title: '购审、资审',
            time: dayjs(this.data.options.time).businessDaysAdd(5).format('YYYY-MM-DD') + '前完成',
          }, {
            title: '签约购房合同',
            time: dayjs(this.data.options.time).businessDaysAdd(10).format('YYYY-MM-DD') + '前完成',
            list: [{
              tagText: '买方支付',
              tagTheme: 'primary',
              total: paymentPrice - dingjin,
              details: [{
                label: '首付',
                value: paymentPrice - dingjin
              }]
            }]
          }, {
            title: '交房办理房产证',
            time: dayjs(this.data.options.time).add(720, 'day').format('YYYY-MM-DD') + '前完成',
            list: [{
              tagText: '买方支付',
              tagTheme: 'primary',
              total: NP.plus(buyer.qishui.value, buyer.floorPrice),
              details: [{
                label: '契税',
                value: buyer.qishui.value
              }, {
                label: '住宅专项维修资金',
                value: buyer.floorPrice
              }]
            }]
          }]
          if (bankType !== 3) {
            paySteps.splice(4, 0, {
              title: '办贷款',
              time: dayjs(this.data.options.time).businessDaysAdd(15).format('YYYY-MM-DD') + '前完成',
            })
          }
        }

        this.setData({
          paySteps,
          calcTabs
        })
      }
    }
  })