export function getRandom9Objects(arr) {
  const res = arr.slice(); // 复制一份，避免修改原数组
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res.slice(0, Math.min(9, res.length)); // 如果数组少于9个则返回全部
}
