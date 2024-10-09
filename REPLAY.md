# 前端监控

- sdk
- server
- admin
- 性能监控
- 错误监控
- 行为监控
- PV、UV
- 数据埋点
- FP、FCP 等性能指标
  - 优化性能方式
- 上报方式
  - post
  - gif
  - sendBeacon
- 上报时机
  - requestIdleCallback
  - setTimeout
  - 批量
  - 缓存延迟上报
- 如何削峰
- 如何去重
- js 报错
- promise 报错
- vue 报错
- react 报错
- 小程序报错
- sourcemap 如何把错误定位到代码具体行数
- rrweb 如何接入
- rrweb 实现原理

## 问题

### 如何做性能优化？

- 先通过 light-house 计算得分，根据建议进行优化
- FCP 首屏内容渲染时间
  - 减少静态资源体积
    - 图片、png、雪碧图
    - css、js、html 压缩混淆、gzip
    - 分包、路由懒加载 import()
  - 升级 http2
    - 多路复用、压缩请求头（huffman 编码算法）
  - 缓存策略
    - 打包时静态资源都会加 hash，强缓存 cache-control: max-age: 360
    - 协商缓存 etag/if-none-match 、 expires/last-modified-since
      - 集群部署的项目不建议使用 etag，因为 etag 一般通过文件长度+修改时间计算的 hash，集群部署时，时间会不一样，导致每个节点生成的 etag 值都不一样
      - 集群部署的项目使用 expires，expires 虽然精确到时分秒会产生一定问题（在 1s 内修改文件多次），但现在项目部署往往自动化，不太可能在 1s 内去修改文件
      - 项目中往往使用 webpack 打包给文件加 hash，进行强制缓存设置 cache-control，不会走请求，但是如果设置 expires 协商缓存，然后会走一次请求，没改变再读取本地缓存
    - service-worker pwa
    - cdn
  - 预加载和懒加载
    - preload、prefetch
    - lazyload
  - 静态资源分离
    - 别分离太多，会 dns 解析耗时
    - 网站是一个域名，静态资源是一个域名，静态资源不需要携带 cookie
  - UI 框架按需加载
    - tree-shaking
  - 组件重复打包抽离为公共组件
    - webpack commonchunk minichunks
  - js、css、dom 顺序放置正确
    - css 解析为 css 规则、dom 解析为 dom 树，然后一起渲染到页面
    - 避免重排重绘
    - css 放置在 head 里，js 放置在最后
  - font-face 的使用
    - 引入的第三方字体比较大，设置 font-display: swap;也就是先用默认字体渲染，字体下载完成后再替换
  - 视觉优化
    - loading
    - 骨架屏
  - js 逻辑导致阻塞
    - 使用 web-worker 处理耗性能的逻辑
- LCP 最大内容渲染时间
  - 减小 css 体积；
    - 压缩 css；借助 webpack 插件
    - 移除未使用的 css；借助 webpack 插件
  - 预请求；对 link 设置 preconnect preload prefetch；
  - 避免页面重定向；避免设置 301 302；
- CLS 累计布局偏移时间
  - 减少不确定元素；
    - 固定图片的宽高；
    - 使用 transform 属性设置元素动画，布局替代 top、bottom 属性；会新开一个图层，不影响页面布局；
- TBT 总共阻塞时间 js 阻塞时间
  - 找到 long task 代码，使用 react fiber 中的 requestIdleCallback 进行优化，在空闲时间处理长任务
  - 使用 webworker 处理耗时逻辑

### 如何做前端监控？

- 采集性能信息
  - performance
  - performanceObserver
- 采集报错信息
  - try-catch 能捕捉同步，捕捉不到异步
  - window.onerror 能捕捉同步异步，当前域名，捕捉不到 promise、语法错误、网络异常
  - window.addEventListener('error') 能捕获同步异步 promise，捕捉不到图片错误、静态资源报错
  - window.addEventListener('unhandlerejection')
  - vue.config.errorHandler
  - react class getDerivedStateFromError
  - wx.onError
  - 无法捕获跨域的脚本，设置 crossorigin 也能捕捉到
    - `<script src="xxx" crossorigin="anonymous"></script>`
- 上报错误信息
  - ajax 需要解决跨域问题、页面退出会取消请求
  - img gif 通过 new Image dofin 所采用的方式
  - navigator.sendBeacon 相比 img 更标准
  - 存储到 elastic search
  - 性能指标采样上报，错误全量上报
  - 对同一时间内相同报错去重上报
  - 存储到 localstorage 中， requestIdleCallback 空闲时间上报
  - 流量削峰 rabbitMQ
- 数据分析和展示
  - FCP、LCP、CLS、TBT
  - P50、75 90 99 100
  - 报警规则；邮件、飞书 bot
  - 提供 source-map 快速定位到问题错误
  - [使用 rrweb 录制和回放用户的操作路径](./examples/rrweb/README.md)
- 解决问题和复盘
  - 针对性性能优化
  - 及时修复线上 bug

## 资料

- [如何将 Lighthouse Performance 评分从 20 提高到 96](https://juejin.cn/post/7012567366198362120)
- [Web Vitals 核心指标](https://web.wcrane.cn/1-%E5%89%8D%E7%AB%AF%E7%9F%A5%E8%AF%86%E4%BD%93%E7%B3%BB/20-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%8C%96/10-%E5%89%8D%E7%AB%AF%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/1-Web%20Vitals%E6%A0%B8%E5%BF%83%E6%8C%87%E6%A0%87.html)
- [JavaScript 异常监控策略](https://web.wcrane.cn/1-%E5%89%8D%E7%AB%AF%E7%9F%A5%E8%AF%86%E4%BD%93%E7%B3%BB/20-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%8C%96/15-%E5%89%8D%E7%AB%AF%E7%A8%B3%E5%AE%9A%E6%80%A7/30-JavaScript%E5%BC%82%E5%B8%B8%E7%9B%91%E6%8E%A7%E7%AD%96%E7%95%A5.html)
- [分享 3 种常用的前端埋点方式](https://www.cnblogs.com/houxianzhou/p/18001681)
- [使用 Sentry 做性能监控 - 分析优化篇](https://juejin.cn/post/7151753139052347399)
