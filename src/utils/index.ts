export const noop = function () {}

// 将{ method: 'get', state: '200' }转为?method=get&state=200
export const serialize = (obj: Object): String => {
  var str = []
  for (var p in obj)
   if (obj.hasOwnProperty(p)) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
   }
  return str.join("&")
}

// 兼容warn
export const warn: any = function () {
  var e = "object" == typeof console ? console.warn : noop
  try {
    var t = {
      warn: e
    }
    t.warn.call(t)
  } catch (n) {
    return noop
  }
  return e
}()
