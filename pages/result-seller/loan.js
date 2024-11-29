import dayjs from 'dayjs';

export function calculateLoan(loanBackIndex, principal, annualRate, years, unit) {
  const months = years * 12; // 总期数
  const monthlyRate = annualRate / 12 / 100; // 月利率
  if (unit === '万元') {
    principal = principal * 10000
  }
  let result = {};

  if (loanBackIndex === 0) {
    // 等额本息
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const firstInterest = principal * monthlyRate; // 首月利息
    const firstPrincipal = monthlyPayment - firstInterest; // 首月本金
    const remainingPrincipal = principal - firstPrincipal; // 剩余本金
    const remainingInterest = monthlyPayment * (months - 1) - remainingPrincipal; // 剩余利息

    result = {
      firstPrincipal: firstPrincipal.toFixed(2),
      firstInterest: firstInterest.toFixed(2),
      remainingPrincipal: remainingPrincipal.toFixed(2),
      remainingInterest: remainingInterest.toFixed(2),
    };
  } else if (loanBackIndex === 1) {
    // 等额本金
    const monthlyPrincipal = principal / months; // 每月本金
    const firstInterest = principal * monthlyRate; // 首月利息
    const firstPayment = monthlyPrincipal + firstInterest; // 首月总还款
    const remainingPrincipal = principal - monthlyPrincipal; // 剩余本金
    const remainingInterest = ((principal + remainingPrincipal) / 2) * monthlyRate * (months - 1); // 剩余利息

    result = {
      firstPrincipal: monthlyPrincipal.toFixed(2),
      firstInterest: firstInterest.toFixed(2),
      remainingPrincipal: remainingPrincipal.toFixed(2),
      remainingInterest: remainingInterest.toFixed(2),
    };
  }

  return result;
}

export function calculateLoanDetails(loanBackIndex, principal, annualRate, years, loanBackFirstDate, unit) {
  const months = years * 12; // 总期数
  const monthlyRate = annualRate / 12 / 100; // 月利率
  const firstPaymentDate = dayjs(loanBackFirstDate); // 首次还款日
  const now = dayjs(); // 当前日期

  // 计算已还款期数
  const paidMonths = Math.min(now.diff(firstPaymentDate, 'month'), months); // 确保不超过总期数

  let result = {};
  if (unit === '万元') {
    principal = principal * 10000
  }
  if (loanBackIndex === 0) {
    // 等额本息计算
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    let totalPaidInterest = 0;
    let totalPaidPrincipal = 0;
    let remainingPrincipal = principal;

    for (let i = 0; i < paidMonths; i++) {
      const interest = remainingPrincipal * monthlyRate; // 当月利息
      const principalPayment = monthlyPayment - interest; // 当月本金
      totalPaidInterest += interest;
      totalPaidPrincipal += principalPayment;
      remainingPrincipal -= principalPayment;
    }

    const remainingInterest = monthlyPayment * (months - paidMonths) - remainingPrincipal; // 剩余利息

    result = {
      paidMonths,
      totalPaidPrincipal: totalPaidPrincipal.toFixed(2),
      totalPaidInterest: totalPaidInterest.toFixed(2),
      remainingPrincipal: remainingPrincipal.toFixed(2),
      remainingInterest: remainingInterest.toFixed(2),
    };
  } else if (loanBackIndex === 1) {
    // 等额本金计算
    const monthlyPrincipal = principal / months; // 每月本金
    let totalPaidInterest = 0;
    let totalPaidPrincipal = 0;
    let remainingPrincipal = principal;

    for (let i = 0; i < paidMonths; i++) {
      const interest = remainingPrincipal * monthlyRate; // 当月利息
      totalPaidInterest += interest;
      totalPaidPrincipal += monthlyPrincipal;
      remainingPrincipal -= monthlyPrincipal;
    }

    const remainingInterest = ((remainingPrincipal + monthlyPrincipal) / 2) * monthlyRate * (months - paidMonths); // 剩余利息

    result = {
      paidMonths,
      totalPaidPrincipal: totalPaidPrincipal.toFixed(2),
      totalPaidInterest: totalPaidInterest.toFixed(2),
      remainingPrincipal: remainingPrincipal.toFixed(2),
      remainingInterest: remainingInterest.toFixed(2),
    };
  }

  return result;
}