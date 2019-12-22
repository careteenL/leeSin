import {
  Config,
  setConfig
} from './config'

// import {
//   on
// } from './utils'

import {
  handlePerformance
} from './performance'

import {
  handleResource
} from './resources'

import {
  handleErr
} from './errorCatch'

import {
  hackhook
} from './ajax'

export default class LeeSin {
  constructor(options) {
    this.init(options)
  }

  init(options) {
    if (options && !options.token) {
      console.warn('[Required]: token is required !')
      return
    }
    setConfig(options)
    Config.isPage && this.sendPerf()

    Config.enableSPA && this.addListenRouterChange()
    Config.isError && this.addListenJs()
    Config.isAjax && this.addListenAjax()
    Config.isRecord && this.addRrweb()
    Config.isBehavior && this.addListenBehavior()
    Config.isResource && this.sendResource()
  }

  sendPerf() {
    handlePerformance()
  }

  addListenRouterChange() {

  }

  addListenJs() {
    handleErr()
    // // js错误或静态资源加载错误
    // on('error', handleErr)
    // //promise错误
    // on('unhandledrejection', handleErr)
  }

  addListenAjax() {
    hackhook()
  }

  addRrweb() {

  }

  addListenBehavior() {

  }

  sendResource() {
    handleResource()
  }
}