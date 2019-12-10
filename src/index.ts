import {
  Config,
  setConfig
} from './config'

import {
  handlePerformance
} from './performance'

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

  }

  addListenAjax() {

  }

  addRrweb() {

  }

  addListenBehavior() {

  }

  sendResource() {

  }
}