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
     return "房龄无效，不能为负数。";
   }

   // 检查房龄是否超过当前年份
   if (houseAge > currentYear) {
     return "房龄无效，超过当前年份。";
   }

   // 计算建成年份
   const builtYear = currentYear - houseAge;

   // 返回建成年份
   return builtYear;
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