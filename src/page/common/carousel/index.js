// 轮播
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
      interval: 1000, // 轮播时间
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

  // 获取上一个等待索引
  _prevIndex() {
    let options = this.options
    let prevIndex = options.index - 1

    if (prevIndex < 0) {
      prevIndex = options.imgSrc.length - 1
    }

    return prevIndex
  }

  // 获取下一个等待索引
  _nextIndex() {
    let options = this.options
    let nextIndex = options.index + 1

    if (nextIndex > options.imgSrc.length) {
      nextIndex = 0
    }

    return nextIndex
  }

  // 索引递增
  _addIndex(num) {
    let options = this.options
    num = num || 1
    options.index = options.index + num

    if (options.index >= options.imgSrc.length) {
      options.index = 0
    }
  }

  // 索引递减
  _subIndex(num) {
    let options = this.options
    num = num || 1
    options.index = options.index - num

    if (options.index < 0) {
      options.index = options.imgSrc.length - 1
    }
  }

  // 自动轮播
  autoplay() {
    let _this = this
    let options = this.options

    if (!options.autoplay) return

    this.timer = setInterval(function() {
      _this._slide()
    }, options.interval)
  }

  _slide(type) {
    console.log(type)
  }

  // 指示器
  indicator() {
    let options = this.options

    let indicatorTpl = $(
      [
        '<ul class="carousel-indicator">',
        function() {
          let li = []

          $.each(options.imgSrc, function(index) {
            li.push('<li class="' + index + '"></li>')
          })

          return li.join('')
        }(),
        '</ul>'
      ].join(''))

    this.selector.attr('indicator-type', options.indicator)

    this.selector.append(indicatorTpl)
  }

  // 轮播箭头
  arrow() {
    let _this = this
    let options = this.options
    let arrowTpl = $([
      '<button class="layui-icon" lay-type="sub">&gt;</button>',
      '<button class="layui-icon" lay-type="add">&gt;</button>'
    ].join(''))

    this.selector.attr('arrow-type', options.arrow)
    this.selector.append(arrowTpl)

    arrowTpl.on('click', function() {
      let thisElem = $(this)
      let type = thisElem.attr('lay-type')
      _this._slide(type)
    })
  }

  // 事件绑定
  events() {

  }
}

export default Carousel