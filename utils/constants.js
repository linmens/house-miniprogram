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
  value: 0,
  label: '商业贷款'
}, {
  value: 1,
  label: '公积金'
}, {
  value: 2,
  label: '组合贷'
}, {
  value: 3,
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
// 分割条件
export const fengeTypes = [{
  value: 0,
  label: '夫妻共有房屋归属一方',
}, {
  value: 1,
  label: '夫妻一方的婚前房屋归属另一方'
}]
// 新房楼层电梯
export const newHouseTypes = [{
  value: 0,
  label: '7层以下，不配备电梯',
}, {
  value: 0,
  label: '7层以下，配备电梯',
}, {
  value: 0,
  label: '7层及以上',
}]
// 房屋类型
// {
//   value: 1,
//   label: '非普通住宅'
// },
export const houseTypes = [{
  value: 0,
  label: '普通住宅'
}, {
  value: 1,
  label: '非住宅'
}]
export const sexTypes = [{
  value: 0,
  label: '男'
}, {
  value: 1,
  label: '女'
}]
export const NoticeData = {
  yuanzhi: `
  1.商品房：购置该房屋时实际支付的房价款及交纳的相关税费。
  2.自建住房：实际发生的建造费用及建造和取得产权时实际交纳的相关税费。
  3.经济适用房（含集资合作建房、安居工程住房）：原购房人实际支付的房价款及相关税费，以及按规定交纳的土地出让金。
  4.已购公有住房：原购公有住房标准面积按当地经济适用房价格计算的房价款，加上原购公有住房超标准面积实际支付的房价款以及按规定向财政部门（或原产权单位）交纳的所得收益及相关税费。
  已购公有住房是指城镇职工根据国家和县级（含县级）以上人民政府有关城镇住房制度改革政策规定，按照成本价（或标准价）购买的公有住房。
  经济适用房价格按县级（含县级）以上地方人民政府规定的标准确定。
  5.城镇拆迁安置住房：根据《城市房屋拆迁管理条例》（国务院令第305号）和《建设部关于印发〈城市房屋拆迁估价指导意见〉的通知》（建住房〔2003〕234号）等有关规定，其原值分别为：
  （1）房屋拆迁取得货币补偿后购置房屋的，为购置该房屋实际支付的房价款及交纳的相关税费；
  （2）房屋拆迁采取产权调换方式的，所调换房屋原值为《房屋拆迁补偿安置协议》注明的价款及交纳的相关税费；
  （3）房屋拆迁采取产权调换方式，被拆迁人除取得所调换房屋，又取得部分货币补偿的，所调换房屋原值为《房屋拆迁补偿安置协议》注明的价款和交纳的相关税费，减去货币补偿后的余额；
  （4）房屋拆迁采取产权调换方式，被拆迁人取得所调换房屋，又支付部分货币的，所调换房屋原值为《房屋拆迁补偿安置协议》注明的价款，加上所支付的货币及交纳的相关税费。`,
  zhuangxiu: `支付的住房装修费用。 纳税人能提供实际支付装修费用的税务统一发票， 并且发票上所列付款人姓名与转让房屋产权人一致的， 经税务机关审核， 其转让的住房在转让前实际发生的装修费用， 可在以下规定比例内扣除：（ 1） 已购公有住房、 经济适用房： 最高扣除限额为房屋原值的15 % ；（2） 商品房及其他住房： 最高扣除限额为房屋原值的10 % 。
  纳税人原购房为装修房， 即合同注明房价款中含有装修费（ 铺装了地板， 装配了洁具、 厨具等） 的， 不得再重复扣除装修费用
    `,
  daikuanlixi: `支付的住房贷款利息。纳税人出售以按揭贷款方式购置的住房的，其向贷款银行实际支付的住房贷款利息，凭贷款银行出具的有效证明据实扣除。`,
  canyuanzhi: `对转让住房收入计算个人所得税应纳税所得额时，纳税人可凭原购房合同、发票等有效凭证，经税务机关审核后，允许从其转让收入中减除房屋原值、转让住房过程中缴纳的税金及有关合理费用。转让住房过程中缴纳的税金是指：纳税人在转让住房时实际缴纳的营业税、城市维护建设税、教育费附加、土地增值税、印花税等税金。合理费用是指：纳税人按照规定实际支付的住房装修费用、住房贷款利息、手续费、公证费等费用。`,
  pingguPrice: `房管局指定的评估公司出具的评估报告中的评估价格`
}