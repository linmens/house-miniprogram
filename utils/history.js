/**
 * 读取操作历史
 * @param {string} key - 本地存储的键名
 * @returns {Array<{label: string, value: number}>} 操作历史列表
 */
export function readHistory(key) {
  if (!key) {
    console.error("未提供有效的存储键名");
    return [];
  }

  try {
    const history = wx.getStorageSync(key);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error(`读取历史记录失败 (${key}):`, error);
    return [];
  }
}

/**
 * 添加操作历史
 * @param {string} key - 本地存储的键名
 * @param {Object} newItem - 新的历史记录项
 * @param {string} newItem.label - 历史记录标签
 * @param {number} newItem.value - 历史记录值
 */
export function writeHistory(key, newItem) {
  console.log(newItem, 'newItem')
  if (!key) {
    console.error("未提供有效的存储键名");
    return;
  }

  if (!newItem || typeof newItem.label !== "string" || typeof newItem.value !== "number") {
    console.error("无效的历史记录格式，应为 {label: string, value: number}");
    newItem.value = Number(newItem.value)
    // return;
  }

  try {
    const history = readHistory(key);

    // 去重：如果存在相同的值，先移除
    const updatedHistory = history.filter(item => item.value !== newItem.value);

    // 添加到列表头部
    updatedHistory.unshift(newItem);

    // 保留最多 20 条记录
    const trimmedHistory = updatedHistory.slice(0, 20);

    // 写入本地存储
    wx.setStorageSync(key, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error(`写入历史记录失败 (${key}):`, error);
  }
}

/**
 * 清空操作历史
 * @param {string} key - 本地存储的键名
 */
export function clearHistory(key) {
  if (!key) {
    console.error("未提供有效的存储键名");
    return;
  }

  try {
    wx.removeStorageSync(key);
  } catch (error) {
    console.error(`清空历史记录失败 (${key}):`, error);
  }
}

// 示例操作
// const key1 = "history_key_1";
// const key2 = "history_key_2";

// writeHistory(key1, {
//   label: "操作1",
//   value: 100
// });
// writeHistory(key1, {
//   label: "操作2",
//   value: 200
// });

// console.log("当前历史记录 (key1):", readHistory(key1));

// writeHistory(key2, {
//   label: "另一个历史记录",
//   value: 300
// });
// console.log("当前历史记录 (key2):", readHistory(key2));

// clearHistory(key1);
// console.log("清空后历史记录 (key1):", readHistory(key1));