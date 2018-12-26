require('page/common/carousel/style.css')

// 轮播
class Carousel {
  // 构造函数
  constructor(element, options = {}) {
    // 合并配置
    this.config = options
    this.options = $.extend({}, {
      slideType: 'default',
      duration: 300,
      autoplay: true,
      interval: 1000,
      dots: true,
      dotsTrigger: 'hover',
      arrow: 'hover',
      index: 0
    }, options)
    // 获取轮播外层
    this.element = $(element)
    // 获取轮播元素
    this.elementItem = $(element).find('.carousel-container').children()
    // 加载轮播
    this._init()
  }

  _init() {
    var _this = this
    var options = this.options
    var element = this.element
    var elementItem = this.elementItem

    if (!element || elementItem.length <= 1) return

    if (options.index < 0) {
      options.index = 0
    }

    if (options.index > elementItem.length) {
      options.index = elementItem.length - 1
    }

    if (options.interval < 800) {
      options.interval = 800
    }

    element.attr('slide-type', options.slideType)

    elementItem.eq(options.index).addClass('carousel-item-this')

    _this._autoplay()
    _this._events()
  }

  // 自动播放
  _autoplay() {
    var _this = this
    var options = this.options

    if(!options.autoplay) return

    this.timer = setInterval(function() {
      _this.slide()
    }, options.interval)
  }

  _addIndex() {
    var options = this.options
    var elementItem = this.elementItem

    options.index = options.index + 1

    if (options.index >= elementItem.length) {
      options.index = 0
    }
  }

  _subIndex() {
    var options = this.options
    var elementItem = this.elementItem

    options.index = options.index - 1

    if (options.index < 0) {
      options.index = elementItem.length - 1
    }
  }

  slide(type, num) {
    var _this = this
    var isSliding = this.isSliding
    var options = this.options
    var elementItem = this.elementItem

    if (_this.isSliding) return

    if (type === 'sub') {
      _this._subIndex(num)
      elementItem.eq(options.index).addClass('carousel-item-prev')

      setTimeout(function() {
        elementItem.eq(options.index + 1).addClass('carousel-item-right')
        elementItem.eq(options.index).addClass('carousel-item-right')
      }, 50)
    } else {
      _this._addIndex()
      elementItem.eq(options.index).addClass('carousel-item-next')

      setTimeout(function() {
        elementItem.eq(options.index - 1).addClass('carousel-item-left')
        elementItem.eq(options.index).addClass('carousel-item-left')
      }, 50)
    }

    setTimeout(function() {
      elementItem.removeClass('carousel-item-this carousel-item-next carousel-item-prev carousel-item-left carousel-item-right')
      elementItem.eq(options.index).addClass('carousel-item-this')
      isSliding = false
    }, 300)

    isSliding = true
  }

  _events(){
    var _this = this

    if(this.element.data('haveEvents')) return

    this.element.on('mouseover', function(){
      clearInterval(_this.timer)
      _this.timer = null
    }).on('mouseleave', function(){
      _this._autoplay()
    })

    this.element.data('haveEvents', true)
  }

}

export default Carousel