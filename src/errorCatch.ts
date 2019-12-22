import {
  report
} from './reporter'

export const handleErr = () => {
  let _originOnerror = window.onerror
  window.onerror = (...arg) => {
    let [errorMessage, scriptURI, lineNumber, columnNumber, errorObj] = arg
    // console.log(arg, 'error')
    let errorInfo = formatError(errorObj)
    errorInfo._errorMessage = errorMessage
    errorInfo._scriptURI = scriptURI
    errorInfo._lineNumber = lineNumber
    errorInfo._columnNumber = columnNumber
    errorInfo.t = 'err'
    console.log(errorInfo, 'normal err')
    // report(errorInfo)
    _originOnerror && _originOnerror.apply(window, arg)
  }

  let _originOnunhandledrejection = window.onunhandledrejection
  window.onunhandledrejection = (...arg) => {
    let e = arg[0]
    let reason = e.reason
    let errorInfo = {
      t: e.type || 'unhandledrejection',
      r: reason
    }
    console.log(errorInfo, 'promise err')
    report(errorInfo)
    _originOnunhandledrejection && _originOnunhandledrejection.apply(window, arg)
  }
}


let formatError = (errObj) => {
  let col = errObj.column || errObj.columnNumber // Safari Firefox
  let row = errObj.line || errObj.lineNumber // Safari Firefox
  let message = errObj.message
  let name = errObj.name

  let {stack} = errObj
  if (stack) {
    let matchUrl = stack.match(/https?:\/\/[^\n]+/)
    let urlFirstStack = matchUrl ? matchUrl[0] : ''
    let regUrlCheck = /https?:\/\/(\S)*\.js/

    let resourceUrl = ''
    if (regUrlCheck.test(urlFirstStack)) {
      resourceUrl = urlFirstStack.match(regUrlCheck)[0]
    }

    let stackCol = null
    let stackRow = null
    let posStack = urlFirstStack.match(/:(\d+):(\d+)/)
    if (posStack && posStack.length >= 3) {
      [, stackCol, stackRow] = posStack
    }

    // TODO formatStack
    // stack 前十行就够了
    return {
      content: stack,
      col: Number(col || stackCol),
      row: Number(row || stackRow),
      _errorMessage: undefined,
      _scriptURI: undefined,
      _lineNumber: undefined,
      _columnNumber: undefined,
      t: undefined,
      message, name, resourceUrl
    }
  }

  return {
    row, col, message, name
  }
}
