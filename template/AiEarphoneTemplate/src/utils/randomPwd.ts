// 生成4位字母数字混合密码
export const randomPwd = () => {
  // 生成4位字母数字混合密码
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let pwd = '';
  // 确保至少包含一个字母和一个数字
  pwd += chars[Math.floor(Math.random() * 52)]; // 字母
  pwd += chars[52 + Math.floor(Math.random() * 10)]; // 数字
  // 剩余2位随机生成
  for (let i = 0; i < 2; i++) {
    pwd += chars[Math.floor(Math.random() * chars.length)];
  }
  // 打乱顺序
  pwd = pwd.split('').sort(() => Math.random() - 0.5).join('');
  return pwd;
};