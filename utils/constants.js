export const buyTypes = [{
    value: 1,
    label: '二手房'
  },
  {
    value: 2,
    label: '新房'
  }
];

export const chanquanTypes = [{
    value: 0,
    label: '家庭唯一'
  },
  {
    value: 1,
    label: '非家庭唯一'
  },
];

export const selfHouseTypes = [{
    value: 1,
    label: '首套'
  },
  {
    value: 2,
    label: '已有1套90平及以下房产'
  },
  {
    value: 3,
    label: '已有1套90至144平房产'
  },
  {
    value: 4,
    label: '已有1套144平以上房产'
  },
  {
    value: 5,
    label: '已有1套但贷款未结清'
  }
];

export const unitTypes = [{
    value: 1,
    label: '元'
  },
  {
    value: 2,
    label: '万元'
  }
];

export const areaTypes = [{
    value: 1,
    label: '90㎡以下'
  },
  {
    value: 2,
    label: '90㎡以上'
  },
  {
    value: 3,
    label: '自定义'
  }
];

export const tabs = [{
  value: 1,
  label: '商业贷款'
}, {
  value: 2,
  label: '公积金'
}, {
  value: 3,
  label: '组合贷'
}, {
  value: 4,
  label: '全款'
}]

export const loanTypes = [{
  value: 5,
  label: "5年"
}, {
  value: 10,
  label: '10年'
}, {
  value: 15,
  label: '15年'
}, {
  value: 20,
  label: '20年'
}, {
  value: 25,
  label: '25年'
}, {
  value: 30,
  label: '30年'
}, {
  value: 5,
  label: '自定义'
}]
export const loanBackTypes = [{
  value: 1,
  label: '等额本息'
}, {
  value: 2,
  label: '等额本金'
}]
export const loanRateTypes = [{
  value: 1,
  label: '3.55'
}, {
  value: 2,
  label: '3.95'
}, {
  value: 2,
  label: '3.95'
}, {
  value: 2,
  label: '3.95'
}, {
  value: 2,
  label: '3.95'
}, {
  value: 2,
  label: '3.95'
}, {
  value: 2,
  label: '3.95'
}]
export const loanGjjHomeTypes = [{
  value: 1,
  label: '单人连续足额缴存',
  max: {
    0: 650000,
    1: 65
  },
  desc: '借款人单人连续足额缴存住房公积金的，贷款额度最高不超过65万元;'
}, {
  value: 2,
  label: '借款人及配偶同时连续足额缴存',
  max: {
    0: 850000,
    1: 85
  },
  desc: '借款人及配偶同时连续足额缴存住房公积金的，贷款额度最高不超过85万元。'
}, {
  value: 3,
  label: '多子女家庭',
  max: {
    0: 780000,
    1: 78
  },
  desc: '2024年5月9日起，多子女家庭(抚养至少有一个未成年子女的二孩及以上家庭)使用公积金贷款购买住房的，贷款最高额度在现行信贷政策基础上提高至1.2倍，即78万元。'
}, {
  value: 4,
  label: '双缴存职工多子女家庭',
  max: {
    0: 1020000,
    1: 102
  },
  desc: '双缴存职工多子女家庭最高贷款额度提高至102万元。'
}]
// 提前还款方式
export const loanPaidTypes = [{
  value: 0,
  label: '全部提前还款'
}, {
  value: 1,
  label: '部分提前还款'
}]
// 成交方式
export const orderTypes = [{
  value: 0,
  label: '三方成交'
}, {
  value: 1,
  label: '自行成交'
}]
// 变更类型
export const exchangeTypes = [{
  value: 0,
  label: '买卖'
}, {
  value: 1,
  label: '赠与'
}, {
  value: 2,
  label: '继承'
}, {
  value: 3,
  label: '婚内更名'
}, {
  value: 4,
  label: '离婚分割'
}]
// 买方属性
export const buyerTypes = [{
  value: 0,
  label: '首套'
}, {
  value: 1,
  label: '二套'
}, {
  value: 2,
  label: '三套及以上'
}]
// 能否提供原值凭证
export const canGiveOldpriceTypes = [{
  value: 0,
  label: '可以提供'
}, {
  value: 1,
  label: '不可以提供'
}]
// 居间服务费支付方式
export const serviceFeeTypes = [{
  value: 3,
  label: '买卖双方各承担一半'
}, {
  value: 0,
  label: '买方承担'
}, {
  value: 1,
  label: '卖方承担'
}, {
  value: 2,
  label: '买卖双方承担自定义'
}]
// 税费承担方
export const shuifeiTypes = [{
  value: 0,
  label: '买方承担'
}, {
  value: 1,
  label: '卖方承担'
}]
// 是否法定继承
export const fadingTypes = [{
  value: 0,
  label: '法定继承',
}, {
  value: 1,
  label: '非法定继承'
}]