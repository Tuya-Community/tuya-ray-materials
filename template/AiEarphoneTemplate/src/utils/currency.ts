// 货币映射表
const currencyMap = {
  USD: {
    name: '美元',
    englishName: 'United States Dollar',
    currency: 'USD',
    sign: '$',
  },
  RUB: {
    name: '俄罗斯卢布',
    englishName: 'Russian Ruble',
    currency: 'RUB',
    sign: '₽',
  },
  GBP: {
    name: '英镑',
    englishName: 'Pound Sterling',
    currency: 'GBP',
    sign: '£',
  },
  BRL: {
    name: '巴西雷亚尔',
    englishName: 'Brazilian Real',
    currency: 'BRL',
    sign: 'R$',
  },
  CNY: {
    name: '人民币',
    englishName: 'Chinese Yuan',
    currency: 'CNY',
    sign: '¥',
  },
  JPY: {
    name: '日元',
    englishName: 'Japanese Yen',
    currency: 'JPY',
    sign: '¥',
  },
  INR: {
    name: '印度卢比',
    englishName: 'Indian Rupee',
    currency: 'INR',
    sign: '₹',
  },
  AUD: {
    name: '澳元',
    englishName: 'Australian Dollar',
    currency: 'AUD',
    sign: 'A$',
  },
  EUR: {
    name: '欧元',
    englishName: 'Euro',
    currency: 'EUR',
    sign: '€',
  },
  KRW: {
    name: '韩元',
    englishName: 'South-Korean Won',
    currency: 'KRW',
    sign: '₩',
  },
  HKD: {
    name: '港币',
    englishName: 'Hong Kong Dollar',
    currency: 'HKD',
    sign: 'HK$',
  },
  CLP: {
    name: '智利比索',
    englishName: 'Chilean Peso',
    currency: 'CLP',
    sign: 'CLP$',
  },
  COP: {
    name: '哥伦比亚比索',
    englishName: 'Colombian Peso',
    currency: 'COP',
    sign: 'COL$',
  },
  JOD: {
    name: '约旦第纳尔',
    englishName: 'Jordanian Dinar',
    currency: 'JOD',
    sign: 'ا. د',
  },
  NGN: {
    name: '尼日利亚奈拉',
    englishName: 'Nigerian Naira',
    currency: 'NGN',
    sign: '₦',
  },
  KES: {
    name: '肯尼亚先令',
    englishName: 'Kenyan Shilling',
    currency: 'KES',
    sign: 'KSh',
  },
  XAF: {
    name: '中非法郎',
    englishName: 'Central African CFA Franc',
    currency: 'XAF',
    sign: 'F CFA',
  },
  MXN: {
    name: '墨西哥比索',
    englishName: 'Mexican Peso',
    currency: 'MXN',
    sign: 'Mex$',
  },
  ARS: {
    name: '阿根廷比索',
    englishName: 'Argentina Peso',
    currency: 'ARS',
    sign: 'ARS$',
  },
  VES: {
    name: '委内瑞拉玻利瓦尔',
    englishName: 'Venezuela Bolivar',
    currency: 'VES',
    sign: 'BS.F',
  },
  IDR: {
    name: '印尼卢比',
    englishName: 'Indonesia Rupiah',
    currency: 'IDR',
    sign: 'Rp',
  },
  THB: {
    name: '泰铢',
    englishName: 'Thai Baht',
    currency: 'THB',
    sign: '฿',
  },
  DKK: {
    name: '丹麦克朗',
    englishName: 'Danish Krone',
    currency: 'DKK',
    sign: 'kr',
  },
  NOK: {
    name: '挪威克朗',
    englishName: 'Norwegian Krone',
    currency: 'NOK',
    sign: 'kr',
  },
  SEK: {
    name: '瑞典克朗',
    englishName: 'Swedish Krona',
    currency: 'SEK',
    sign: 'kr',
  },
  CHF: {
    name: '瑞士法郎',
    englishName: 'Swiss Franc',
    currency: 'CHF',
    sign: 'CHF',
  },
  CZK: {
    name: '捷克克朗',
    englishName: 'Czech Koruna',
    currency: 'CZK',
    sign: 'Kč',
  },
  PLN: {
    name: '波兰兹罗提',
    englishName: 'Polish Złoty',
    currency: 'PLN',
    sign: 'zł',
  },
  SGD: {
    name: '新加坡元',
    englishName: 'Singapore Dollar',
    currency: 'SGD',
    sign: 'S$',
  },
  HUF: {
    name: '匈牙利福林',
    englishName: 'Hungarian Forint',
    currency: 'HUF',
    sign: 'Ft',
  },
  RON: {
    name: '罗马尼亚列伊',
    englishName: 'Romanian Leu',
    currency: 'RON',
    sign: 'RON',
  },
  UAH: {
    name: '乌克兰格里夫纳',
    englishName: 'Ukrainian Hryvnia',
    currency: 'UAH',
    sign: '₴',
  },
  TRY: {
    name: '土耳其里拉',
    englishName: 'Turkish Lira',
    currency: 'TRY',
    sign: '₺',
  },
  SAR: {
    name: '沙特里亚尔',
    englishName: 'Saudi Riyal',
    currency: 'SAR',
    sign: '﷼',
  },
  AED: {
    name: '阿拉伯联合酋长国迪拉姆',
    englishName: 'United Arab Emirates Dirham',
    currency: 'AED',
    sign: 'د.إ',
  },
  ILS: {
    name: '以色列新谢克尔',
    englishName: 'Israeli New Shekel',
    currency: 'ILS',
    sign: '₪',
  },
  ZAR: {
    name: '南非兰特',
    englishName: 'South African Rand',
    currency: 'ZAR',
    sign: 'R',
  },
  MYR: {
    name: '马来西亚令吉',
    englishName: 'Malaysian Ringgit',
    currency: 'MYR',
    sign: 'RM',
  },
  BGN: {
    name: '保加利亚列弗',
    englishName: 'Bulgarian Lev',
    currency: 'BGN',
    sign: 'лв',
  },
  NZD: {
    name: '新西兰元',
    englishName: 'New Zealand Dollar',
    currency: 'NZD',
    sign: 'NZ$',
  },
}

/**
 * 当前货币的 code 转化为货币符号
 * @param currencyCode 当前货币的 code
 */
export const getCurrencySignFromCode = (currencyCode) => {
  return currencyMap[currencyCode]?.sign || currencyCode || ''
}
