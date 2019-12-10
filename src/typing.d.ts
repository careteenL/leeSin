interface Navigator {
  connection: any
}
 
interface Window {
  mozPerformance: any,
  msPerformance: any,
  webkitPerformance: any,
  attachEvent: any
  detachEvent: any
  CustomEvent: any
  __oXMLHttpRequest_: any
  XMLHttpRequest: any
  __bb: any
  __bb_onpopstate_: any
}

interface Document {
  attachEvent: any
}

interface HTMLStyleElement {
  styleSheet: {
    cssText: string
  }
}