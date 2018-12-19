// polyfill events
let addEvent = (element, type, handler) => {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false)
  } else if (element.attachEvent) {
    element.attachEvent('on' + type, handler)
  } else {
    element['on' + type] = handler
  }
}

class Carousel {
  // 构造函数
  constructor(selector, userOptions = {}) {
    // 默认配置
    this.defaultOptions = {
      width: '600px',
      height: '300px',
      arrow: 'hover', // 'hover/always/none'
      indicator: 'inside', // 'indicator/outside/none' 指示器位置
      autoplay: true, // true/false
      interval: 3000, // 轮播时间
      triggerType: 'hover', // 'hover/click' 触发指示器方式
      index: 0 // 初始索引
    }
    // 合并配置
    this.options = $.extend({}, this.defaultOptions, userOptions)
    // 获取轮播元素
    this.selector = $(selector)
    // 加载轮播
    this.init()
  }

  init() {
    const options = this.options
    const selector = this.selector

    selector.append(this._getCarouselContent())

    // 判断页面中是否有轮播元素
    if (!selector[0]) {
      console.log('no selector')
      return
    }

    // 重置索引
    if (options.index < 0) {
      options.index = 0
    }
    if (options.index >= options.imgSrc.length) {
      options.index = this.options.imgSrc.length - 1
    }

    // 自动切换间隔 不得小于 800ms
    if (options.interval < 800) {
      options.interval = 800
    }

    this.indicator()
    this.arrow()
    this.autoplay()
    this.events()
  }

  // 生成 IMG DOM 元素
  _getCarouselContent() {
    let carouselContent = document.createElement('div')
    $(carouselContent).attr('class', 'carousel-content')
    let fragment = document.createDocumentFragment()
    let imgElem = document.createElement('img')

    // 遍历图片数组
    this.options.imgSrc.forEach((img, index) => {
      imgElem = imgElem.cloneNode(false)
      $(imgElem).attr('src', img).attr('alt', index + 1)
      fragment.appendChild(imgElem)
    })

    carouselContent.appendChild(fragment)

    return carouselContent
  }

  // 指示器
  indicator() {

  }

  // 轮播箭头
  arrow() {

  }

  // 自动播放
  autoplay() {

  }

  // 事件绑定
  events() {

  }
}

export default Carousel