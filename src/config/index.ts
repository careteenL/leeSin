// 默认参数
export let Config = {
  // 上报地址
  reportUrl: 'http://localhost:10000',
  // 提交参数
  token: '',
  // app版本
  appVersion: '1.0.0',
  // 环境
  environment: 'production',
  // 脚本延迟上报时间
  outtime: 300,
  // 开启单页面？
  enableSPA: true,
  // 是否自动上报pv
  autoSendPv: true,
  // 是否上报页面性能数据
  isPage: true,
  // 是否上报ajax性能数据
  isAjax: true,
  // 是否上报页面资源数据
  isResource: true,
  // 是否上报错误信息
  isError: true,
  // 是否录屏
  isRecord: true,
  // 是否上报行为
  isBehavior: true,
  ignore: {
    ignoreErrors: [],
    ignoreUrls: [],
    ignoreApis: ['/api/v1/report/web', 'livereload.js?snipver=1', '/sockjs-node/info'],
  },
  behavior: {
    console: ['log', 'error'], // 取值可以是"debug", "info", "warn", "log", "error"
    click: true,
  },
  // 最长上报数据长度
  maxLength: 1000,
}

// 设置参数
export function setConfig(options) {
  Config = {
    ...Config,
    ...options
  }
}
export function getConfig(e: string) {
  return e ? Config[e] ? Config[e] : {} : {}
}
