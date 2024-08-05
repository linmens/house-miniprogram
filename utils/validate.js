import {
  showMessage
} from './message'
// 验证贷款金额函数
export function validateLoanAmounts(bankType, loanPrice, loanGjjPrice) {
  if (bankType === 0 && !loanPrice) {
    showMessage.call(this, '请输入商业贷款金额');
    return false;
  }
  if (bankType === 1 && !loanGjjPrice) {
    showMessage.call(this, '请输入公积金贷款金额');
    return false;
  }
  if (bankType === 2) {
    if (!loanPrice) {
      showMessage.call(this, '请输入商业贷款金额');
      return false;
    }
    if (!loanGjjPrice) {
      showMessage.call(this, '请输入公积金贷款金额');
      return false;
    }
  }
  return true;
}