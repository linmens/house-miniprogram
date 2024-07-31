 import NP from 'number-precision'
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
  * @param {string} unit - 金额单位 ('元' 或 '万元')
  * @returns {number} - 最终贷款金额
  */
 export function calculateLoan(wangqianPrice, paymentRate, unit) {
   let result = 0;
   const loanRate = NP.minus(1, NP.divide(paymentRate, 100));

   result = Math.floor(NP.divide(NP.times(wangqianPrice, loanRate), 10000)) * 10000

   if (unit === '万元') {
     result = Math.floor(NP.times(loanRate, wangqianPrice))
   }
   return result
 }

 /**
  * 反算网签金额
  * @param {number} price - 商贷金额/公积金贷款金额
  * @param {number} paymentRate - 首付比例 (如 0.85)
  * @param {string} unit - 金额单位 ('元' 或 '万元')
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
 function getCachedData() {
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
  * @param {string} unit - 结算单位（'元' 或 '万元'）
  * @returns {object} - 还款详情
  * loanMonths: 贷款月数。
  * monthlyPayment: 每月还款金额（ 固定）。
  * totalInterest: 支付的总利息。
  * totalPayment: 还款总额。
  */
 export function calculateEqualPrincipalAndInterest(loanAmount, annualInterestRate, loanTermYears, unit = '元') {
   const months = loanTermYears * 12;
   const monthlyInterestRate = NP.divide(annualInterestRate, 12);
   console.log(monthlyInterestRate, 'monthlyInterestRate')
   const monthlyPayment = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months) / (Math.pow(1 + monthlyInterestRate, months) - 1);
   const totalPayment = monthlyPayment * months;
   const totalInterest = totalPayment - loanAmount;

   const precision = unit === '万元' ? 4 : 2;

   return {
     loanMonths: months,
     monthlyPayment: Math.round((monthlyPayment) * Math.pow(10, precision)) / Math.pow(10, precision),
     totalInterest: Math.round((totalInterest) * Math.pow(10, precision)) / Math.pow(10, precision),
     totalPayment: Math.round((totalPayment) * Math.pow(10, precision)) / Math.pow(10, precision)
   };
 }
 /**
  * 计算等额本金还款
  * @param {number} loanAmount - 贷款金额
  * @param {number} annualInterestRate - 年利率（小数，例如0.05代表5%）
  * @param {number} loanTermYears - 贷款年限
  * @param {string} unit - 结算单位（'元' 或 '万元'）
  * @returns {object} - 还款详情
  * loanMonths: 贷款月数。
  * firstMonthPayment: 首月还款金额。
  * lastMonthPayment: 末月还款金额。
  * monthlyDecrease: 每月递减金额。
  * totalInterest: 支付的总利息。
  * totalPayment: 还款总额。
  */
 export function calculateEqualPrincipal(loanAmount, annualInterestRate, loanTermYears, unit = '元') {
   const months = loanTermYears * 12;
   const monthlyPrincipal = loanAmount / months;
   const monthlyInterestRate = annualInterestRate / 12;
   const firstMonthPayment = monthlyPrincipal + (loanAmount * monthlyInterestRate);
   const lastMonthPayment = monthlyPrincipal + (monthlyPrincipal * monthlyInterestRate);
   const monthlyDecrease = monthlyPrincipal * monthlyInterestRate;
   let totalInterest = 0;

   for (let i = 0; i < months; i++) {
     totalInterest += (loanAmount - i * monthlyPrincipal) * monthlyInterestRate;
   }

   const totalPayment = loanAmount + totalInterest;

   const precision = unit === '万元' ? 4 : 2;

   return {
     loanMonths: months,
     firstMonthPayment: Math.round((firstMonthPayment) * Math.pow(10, precision)) / Math.pow(10, precision),
     lastMonthPayment: Math.round((lastMonthPayment) * Math.pow(10, precision)) / Math.pow(10, precision),
     monthlyDecrease: Math.round((monthlyDecrease) * Math.pow(10, precision)) / Math.pow(10, precision),
     totalInterest: Math.round((totalInterest) * Math.pow(10, precision)) / Math.pow(10, precision),
     totalPayment: Math.round((totalPayment) * Math.pow(10, precision)) / Math.pow(10, precision)
   };
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

     //  wx.createSelectorQuery()[all ? 'selectAll' : 'select'](selector).scrollOffset()((scrollOffset) => {
     //    console.log(scrollOffset)
     //    resolve(scrollOffset)
     //  }).exec()
   })
 }