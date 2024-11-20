 import NP from 'number-precision'
 import BigNumber from 'bignumber.js'

 import _ from 'lodash'

 const formatTime = date => {
   const year = date.getFullYear()
   const month = date.getMonth() + 1
   const day = date.getDate()
   const hour = date.getHours()
   const minute = date.getMinutes()
   const second = date.getSeconds()

   return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
 }

 const formatNumber = n => {
   n = n.toString()
   return n[1] ? n : `0${n}`
 }
 export const getRect = function (context, selector, needAll = false) {
   return new Promise((resolve, reject) => {
     context
       .createSelectorQuery()[needAll ? 'selectAll' : 'select'](selector)
       .boundingClientRect((rect) => {
         if (rect) {
           resolve(rect);
         } else {
           reject(rect);
         }
       })
       .exec();
   });
 };
 // 获取N年前的时间戳
 export function getOldYearTimestamp(value) {
   // 获取当前日期
   const currentDate = new Date();

   // 获取当前年份
   const currentYear = currentDate.getFullYear();

   // 计算30年前的年份
   const minYear = currentYear - value;

   // 创建一个新的 Date 对象，设置为30年前的1月1日
   const minDate = new Date(minYear, 0, 1);

   // 获取时间戳（以毫秒为单位）
   const minTimestamp = minDate.getTime();
   return minTimestamp
 }




 /**
  * 根据房龄反推算房屋建成年份
  * @param {number} houseAge - 房龄
  * @returns {number|string} 房屋建成年份或错误信息
  */
 export function calculateBuiltYear(houseAge) {
   // 获取当前年份
   const currentYear = new Date().getFullYear();

   // 检查房龄是否为负数
   if (houseAge < 0) {
     return {
       builtYear: 0,
       message: "房龄无效，不能为负数。"
     };
   }

   // 检查房龄是否超过当前年份
   if (houseAge > currentYear) {
     return {
       builtYear: 0,
       message: "房龄无效，超过当前年份。"
     };
   }

   // 计算建成年份
   const builtYear = currentYear - houseAge;

   // 返回建成年份
   return {
     builtYear,
     message: ''
   };
 }

 function isNotEmpty(value) {
   if (_.isString(value)) {
     return _.isEmpty(_.trim(value))
   } else if (_.isNumber(value)) {
     return _.isNaN(value)
   }
 }
 /**
  * 计算 a + b = c 中的未知数
  * @param {number} a - 已知的 a 值，或者 null/undefined
  * @param {number} b - 已知的 b 值，或者 null/undefined
  * @param {number} c - 已知的 c 值，或者 null/undefined
  * @returns {object} - 返回计算结果 { a, b, c }
  * @throws {Error} - 如果输入无效，抛出错误
  */
 export function calculatePlus(a, b, c) {

   if (a === null && b !== null && c !== null) {
     return {
       a: NP.minus(c, b),
       b,
       c
     }
   } else if (b === null && a !== null && c !== null) {
     return {
       a,
       b: NP.minus(c, a),
       c
     }
   } else if (c === null && a !== null && b !== null) {
     return {
       a,
       b,
       c: NP.plus(a, b)
     }
   } else {
     throw new Error('Invalid input: Two values must be provided.');
   }
 }

 /**
  * 计算贷款额度
  * @param {number} wangqianPrice - 网签金额
  * @param {number} paymentRate - 首付比例 (如 0.85)
  * @param {string} unit - 金额单位 ('元' 或 '万')
  * @returns {number} - 最终贷款金额
  */
 export function calculateLoan(wangqianPrice, paymentRate, unit) {
   let result = 0;
   const loanRate = NP.minus(1, NP.divide(paymentRate, 100));

   result = Math.floor(NP.divide(NP.times(wangqianPrice, loanRate), 10000)) * 10000

   if (unit === '万元') {
     result = Math.floor(NP.times(loanRate, wangqianPrice))
   }
   console.log('计算贷款额度：', {
     wangqianPrice,
     paymentRate,
     unit,
     result
   })
   return result
 }

 /**
  * 反算网签金额
  * @param {number} price - 商贷金额/公积金贷款金额
  * @param {number} paymentRate - 首付比例 (如 0.85)
  * @param {string} unit - 金额单位 ('元' 或 '万')
  * @returns {number} - 最终贷款金额
  */
 export function calculateWangqianPrice(price, paymentRate, unit) {
   let result = 0;
   const loanRate = NP.minus(1, NP.divide(paymentRate, 100));

   result = Math.floor(NP.divide(price, loanRate))

   // if (unit === '万元') {
   //   result = Math.floor(NP.times(loanRate, wangqianPrice))
   // }
   return result
 }
 // 获取缓存数据
 export function getCachedData() {
   const data = wx.getStorageSync('result');
   return data ? JSON.parse(data) : {};
 }
 // 根据key获取当前data
 export function getCurrentCachedData(key) {
   const data = wx.getStorageSync('result');
   return data ? JSON.parse(data)[key] : {};
 }
 // 添加新数据到缓存中
 export function addDataToCache(value, timestamp) {
   const data = getCachedData()


   // 获取缓存数据的键，并按时间戳排序
   const keys = Object.keys(data).sort((a, b) => a - b);

   // 如果已有10条数据，删除最旧的那条数据
   if (keys.length >= 10) {
     delete data[keys[0]];
   }

   // 添加新数据
   data[timestamp] = value;

   // 保存更新后的数据
   wx.setStorageSync('result', JSON.stringify(data))
 }
 export function downloadAndOpenFile(id, path, fileName, fileType) {
   let url = `https://gitee.com/mklinmens/calc-docs/raw/main/${encodeURIComponent(path)}/${encodeURIComponent(fileName)}.${fileType}`
   console.log(url, path, fileName, fileType, 'downloadAndOpenFile')


   let tempFileListStorage = wx.getStorageSync('tempFileList') || {}
   console.log(tempFileListStorage[id], 'tempFileListStorage')
   if (tempFileListStorage[id]) {
     wx.openDocument({
       filePath: tempFileListStorage[id],
       fileType: fileType,
       success: function (res) {
         console.log(res, '打开文档成功')
       },
       fail: function (res) {
         console.log(res, '打开文档失败')
       }
     })
   } else {
     wx.downloadFile({
       url: url,
       success: function (res) {
         console.log(res)
         let filePath = res.tempFilePath
         tempFileListStorage[id] = filePath
         wx.setStorageSync('tempFileList', tempFileListStorage)
         wx.openDocument({
           filePath: filePath,
           fileType: fileType,
           success: function (res) {
             console.log(res, '打开文档成功')
           },
           fail: function (res) {
             console.log(res, '打开文档失败')
           }
         })
       }
     })
   }

 }

 /**
  * 计算等额本息还款
  * @param {number} loanAmount - 贷款金额
  * @param {number} annualInterestRate - 年利率（小数，例如0.05代表5%）
  * @param {number} loanTermYears - 贷款年限
  * @param {string} unit - 结算单位（'元' 或 '万'）
  * @returns {object} - 还款详情
  * loanMonths: 贷款月数。
  * monthlyPayment: 每月还款金额（ 固定）。
  * totalInterest: 支付的总利息。
  * totalPayment: 还款总额。
  */

 export function calculateEqualPrincipalAndInterest(loanAmount, annualInterestRate, loanTermYears, unit = '元') {
   const months = new BigNumber(loanTermYears).times(12); // 计算贷款月数
   const monthlyInterestRate = new BigNumber(annualInterestRate).div(12); // 计算月利率

   // 计算每月还款额
   const one = new BigNumber(1);
   const powPart = one.plus(monthlyInterestRate).pow(months);
   const numerator = new BigNumber(loanAmount).times(monthlyInterestRate).times(powPart);
   const denominator = powPart.minus(one);
   const monthlyPayment = numerator.div(denominator);

   // 计算总还款额和总利息
   const totalPayment = monthlyPayment.times(months);
   const totalInterest = totalPayment.minus(loanAmount);

   // 设置精度
   const precision = unit === '万元' ? 4 : 2;
   const precisionPrice = unit === '万元' ? 10000 : 1;
   const factor = new BigNumber(10).pow(precision);
   // 计算每月明细
   let remainingPrincipal = new BigNumber(loanAmount);
   const paymentDetails = [];

   for (let i = 0; i < months.toNumber(); i++) {
     const interestPayment = remainingPrincipal.times(monthlyInterestRate);
     const principalPayment = monthlyPayment.minus(interestPayment);
     remainingPrincipal = remainingPrincipal.minus(principalPayment);

     paymentDetails.push({
       period: i + 1,
       monthlyPayment: (monthlyPayment * precisionPrice).toFixed(2),
       principalPayment: (principalPayment * precisionPrice).toFixed(2),
       interestPayment: (interestPayment * precisionPrice).toFixed(2),
       remainingPrincipal: (remainingPrincipal * precisionPrice).toFixed(2)
     });
   }
   // 返回结果
   return {
     loanMonths: months.toNumber(),
     monthlyPayment: monthlyPayment.times(factor).integerValue(BigNumber.ROUND_HALF_UP).div(factor).toNumber(),
     totalInterest: totalInterest.times(factor).integerValue(BigNumber.ROUND_HALF_UP).div(factor).toNumber(),
     totalPayment: totalPayment.times(factor).integerValue(BigNumber.ROUND_HALF_UP).div(factor).toNumber(),
     paymentDetails
   };
 }

 /**
  * 计算等额本金还款
  * @param {number} loanAmount - 贷款金额
  * @param {number} annualInterestRate - 年利率（小数，例如0.05代表5%）
  * @param {number} loanTermYears - 贷款年限
  * @param {string} unit - 结算单位（'元' 或 '万'）
  * @returns {object} - 还款详情
  * loanMonths: 贷款月数。
  * firstMonthPayment: 首月还款金额。
  * lastMonthPayment: 末月还款金额。
  * monthlyDecrease: 每月递减金额。
  * totalInterest: 支付的总利息。
  * totalPayment: 还款总额。
  */

 export function calculateEqualPrincipal(loanAmount, annualInterestRate, loanTermYears, unit = '元') {
   const months = new BigNumber(loanTermYears).times(12); // 贷款月数
   const loanAmountBN = new BigNumber(loanAmount); // 贷款金额
   const monthlyPrincipal = loanAmountBN.div(months); // 每月还款本金
   const monthlyInterestRate = new BigNumber(annualInterestRate).div(12); // 月利率

   // 计算第一个月还款额
   const firstMonthPayment = monthlyPrincipal.plus(loanAmountBN.times(monthlyInterestRate));
   // 计算最后一个月还款额
   const lastMonthPayment = monthlyPrincipal.plus(monthlyPrincipal.times(monthlyInterestRate));
   // 每月减少的还款金额
   const monthlyDecrease = monthlyPrincipal.times(monthlyInterestRate);
   // 设置精度
   const precision = unit === '万元' ? 4 : 2;
   const precisionPrice = unit === '万元' ? 10000 : 1;
   const factor = new BigNumber(10).pow(precision);
   let totalInterest = new BigNumber(0); // 总利息

   const paymentDetails = [];

   for (let i = 0; i < months.toNumber(); i++) {
     const remainingPrincipal = loanAmountBN.minus(monthlyPrincipal.times(i));
     const interestPayment = remainingPrincipal.times(monthlyInterestRate);
     const totalPayment = monthlyPrincipal.plus(interestPayment);

     totalInterest = totalInterest.plus(interestPayment);

     paymentDetails.push({
       period: i + 1,
       monthlyPayment: (totalPayment * precisionPrice).toFixed(2),
       principalPayment: (monthlyPrincipal * precisionPrice).toFixed(2),
       interestPayment: (interestPayment * precisionPrice).toFixed(2),
       remainingPrincipal: remainingPrincipal.minus(monthlyPrincipal).times(precisionPrice).toFixed(2)
     });
   }
   // 总还款额
   const totalPayment = loanAmountBN.plus(totalInterest);



   // 返回结果
   return {
     loanMonths: months.toNumber(),
     firstMonthPayment: firstMonthPayment.times(factor).integerValue(BigNumber.ROUND_HALF_UP).div(factor).toNumber(),
     lastMonthPayment: lastMonthPayment.times(factor).integerValue(BigNumber.ROUND_HALF_UP).div(factor).toNumber(),
     monthlyDecrease: monthlyDecrease.times(factor).integerValue(BigNumber.ROUND_HALF_UP).div(factor).toNumber(),
     totalInterest: totalInterest.times(factor).integerValue(BigNumber.ROUND_HALF_UP).div(factor).toNumber(),
     totalPayment: totalPayment.times(factor).integerValue(BigNumber.ROUND_HALF_UP).div(factor).toNumber(),
     paymentDetails
   };
 }
 /**
  * 计算每月明细 
  * @param {*} principal 贷款本金
  * @param {*} annualRate 贷款利率
  * @param {*} months 合计贷款期数
  */
 export function calculateLoanDetails(principal, annualRate, months) {
   let monthlyRate = annualRate / 12 / 100;
   let monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);

   let details = [];

   for (let n = 1; n <= months; n++) {
     let interest = (principal - (monthlyPayment * (n - 1))) * monthlyRate;
     let principalPayment = monthlyPayment - interest;
     let remainingPrincipal = principal - (principalPayment * n);

     details.push({
       period: n,
       totalPayment: monthlyPayment,
       principalPayment: principalPayment,
       interestPayment: interest,
       remainingPrincipal: remainingPrincipal
     });
   }

   return details;
 }

 /**
  * 获取首付比例
  * @param bankType - 贷款类型（0, 1, 2）
  * @param purchaseType - 是否首次使用（0, 1） || 买方家庭下标 （0,1,2）
  * @returns 首付比例
  */
 export function getDownPaymentRatio(bankType, purchaseType) {
   const downPaymentRatios = {
     0: {
       0: 15,
       1: 25,
       2: 25
     },
     1: {
       0: 20,
       1: 25
     },
     2: {
       0: 20,
       1: 25
     }
   };

   return downPaymentRatios[bankType][purchaseType];
 }


 /**
  * 获取首付比例和利率
  * @param {number} loanType - 贷款类型（0: 商业贷款, 1: 公积金贷款, 2: 组合贷款）
  * @param {number} purchaseType - 购房类型（0: 首套, 1: 二套）
  * @param {number} commercialLoanYears - 商业贷款年限
  * @param {number} providentFundLoanYears - 公积金贷款年限
  * @returns {object} - 包含首付比例和利率的对象
  */
 export function getLoanDetails(loanType, purchaseType, commercialLoanYears, providentFundLoanYears) {
   const loanTypes = ['commercial', 'providentFund', 'combination'];
   const purchaseTypes = ['first', 'second'];

   const downPaymentRatios = {
     commercial: {
       first: 15,
       second: 25
     },
     providentFund: {
       first: 20,
       second: 25
     },
     combination: {
       first: 20,
       second: 25
     }
   };

   const interestRates = {
     first: {
       withinFiveYears: 2.35,
       overFiveYears: 2.85
     },
     second: {
       withinFiveYears: 2.775,
       overFiveYears: 3.325
     }
   };


   const commercialRateAdjustments = {
     first: {
       oneYear: 3.55,
       overFiveYears: 3.55
     },
     second: {
       oneYear: 3.9,
       overFiveYears: 3.9
     }
   };

   const loanTypeKey = loanTypes[loanType];
   const purchaseTypeKey = purchaseTypes[purchaseType];

   let commercialDownPaymentRatio = 0;
   let commercialInterestRate = 0;
   let providentFundDownPaymentRatio = 0;
   let providentFundInterestRate = 0;

   if (loanTypeKey === 'commercial' || loanTypeKey === 'combination') {
     commercialDownPaymentRatio = downPaymentRatios.commercial[purchaseTypeKey];
     commercialInterestRate = commercialLoanYears <= 5 ? commercialRateAdjustments[purchaseTypeKey].oneYear : commercialRateAdjustments[purchaseTypeKey].overFiveYears;
   }

   if (loanTypeKey === 'providentFund' || loanTypeKey === 'combination') {
     providentFundDownPaymentRatio = downPaymentRatios.providentFund[purchaseTypeKey];
     providentFundInterestRate = providentFundLoanYears <= 5 ? interestRates[purchaseTypeKey].withinFiveYears : interestRates[purchaseTypeKey].overFiveYears;
   }

   return {
     commercial: {
       downPaymentRatio: commercialDownPaymentRatio,
       interestRate: commercialInterestRate
     },
     providentFund: {
       downPaymentRatio: providentFundDownPaymentRatio,
       interestRate: providentFundInterestRate
     }
   };
 }
 /**
  * 判断贷款到期时的年龄是否超过法定退休年龄后 5 年
  * @param loanEndAge 当前年龄 + 贷款年限制 = 到期时的年龄
  * @param retirementAge 退休年龄
  */
 const RETIREMENT_EXTENSION_YEARS = 5;
 export function isBeyondRetirementExtension(loanEndAge, retirementAge) {
   return loanEndAge > (retirementAge + RETIREMENT_EXTENSION_YEARS);
 }

 export function fixPrice(property, t) {
   const {
     unitIndex
   } = t.data.calcForm
   let price = t.data.calcForm[property]
   if (price) {
     let fixedPrice = unitIndex === 1 ? price / 10000 : price * 10000;
     t.setData({
       [`calcForm.${property}`]: fixedPrice
     });
   }
 }
 export function createSelectorQuery(selector, all) {
   return new Promise((resolve) => {
     wx.createSelectorQuery()[all ? 'selectAll' : 'select'](selector).boundingClientRect((rect) => {
       resolve(rect)
     }).exec()
   })
 }
 export function createSelectViewport(selector, all) {
   return new Promise((resolve) => {
     const query = wx.createSelectorQuery();
     query.select(selector).boundingClientRect();
     query.selectViewport().scrollOffset();
     query.exec(function (res) {
       console.log("打印demo的元素的信息", res);
       resolve(res)

     });
   })
 }