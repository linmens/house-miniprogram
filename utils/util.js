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
// module.exports = {
//   formatTime
// }