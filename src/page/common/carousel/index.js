require('page/common/carousel/style.css')

// 轮播
class Carousel {
  // 定义静态属性
  static CLASS = {
    CAROUSEL_ITEM_THIS: 'carousel-item-this',
    CAROUSEL_ITEM_PREV: 'carousel-item-prev',
    CAROUSEL_ITEM_NEXT: 'carousel-item-next',
    CAROUSEL_ITEM_LEFT: 'carousel-item-left',
    CAROUSEL_ITEM_RIGHT: 'carousel-item-right'
  }

  // 构造函数
  constructor(element, options = {}) {
    // 合并配置
    this.options = $.extend(true, {}, {
      carouselType: 'default',
      autoplay: true,
      dots: false,
      dotsTrigger: 'click', // CLICK/HOVER
      arrowType: 'hover', // HOVER/ALWAYS/NONE
      interval: 3000,
      duration: 300,
      index: 0
    }, options)

    // 获取轮播外层
    this.element = $(element)
    // 获取轮播元素
    this.elementItem = $(element).find('.carousel-container').children()
    // 加载轮播
    this.init()
  }

  init() {
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

    element.attr('carousel-type', options.carouselType)

    elementItem.eq(options.index).addClass(Carousel.CLASS.CAROUSEL_ITEM_THIS)

    _this._autoplay()
    _this._arrows()
    _this._dots()
    _this._events()
  }

  // 自动播放
  _autoplay() {
    var _this = this
    var options = this.options

    if (!options.autoplay) return

    this.timer = setInterval(function() {
      _this.goto()
    }, options.interval)
  }

  // 右轮播
  next(num) {
    var options = this.options
    var elementItem = this.elementItem

    var num = num || 1
    options.index = options.index + num

    if (options.index >= elementItem.length) {
      options.index = 0
    }

    return options.index
  }

  // 左轮播
  prev(num) {

    var options = this.options
    var elementItem = this.elementItem
    console.log(options.index)

    var num = num || 1
    options.index = options.index - num

    console.log(options.index)

    if (options.index < 0) {
      options.index = elementItem.length - 1
    }

    return options.index
  }

  // 轮播
  goto(arrowType, num) {
    var _this = this
    var isSliding = this.isSliding
    var options = this.options
    var elementItem = this.elementItem

    if (_this.isSliding) return

    if (arrowType === 'sub') {
      _this.prev(num)
      elementItem.eq(options.index).addClass(Carousel.CLASS.CAROUSEL_ITEM_PREV)

      setTimeout(function() {
        elementItem.eq(options.index + 1).addClass(Carousel.CLASS.CAROUSEL_ITEM_RIGHT)
        elementItem.eq(options.index).addClass(Carousel.CLASS.CAROUSEL_ITEM_RIGHT)
      }, 50)
    } else {
      _this.next(num)
      elementItem.eq(options.index).addClass(Carousel.CLASS.CAROUSEL_ITEM_NEXT)

      setTimeout(function() {
        elementItem.eq(options.index - 1).addClass(Carousel.CLASS.CAROUSEL_ITEM_LEFT)
        elementItem.eq(options.index).addClass(Carousel.CLASS.CAROUSEL_ITEM_LEFT)
      }, 50)
    }

    setTimeout(function() {
      elementItem.removeClass(Carousel.CLASS.CAROUSEL_ITEM_THIS + ' ' + Carousel.CLASS.CAROUSEL_ITEM_NEXT + ' ' + Carousel.CLASS.CAROUSEL_ITEM_PREV + ' ' + Carousel.CLASS.CAROUSEL_ITEM_LEFT + ' ' + Carousel.CLASS.CAROUSEL_ITEM_RIGHT)
      elementItem.eq(options.index).addClass(Carousel.CLASS.CAROUSEL_ITEM_THIS)
      isSliding = false
    }, 300)

    // 指示器焦点
    _this.elementDots.find('li').eq(options.index).addClass('active').siblings().removeClass('active')

    isSliding = true
  }

  // 绑定事件
  _events() {
    var _this = this

    if (this.element.data('haveEvents')) return

    this.element.on('mouseover', function() {
      clearInterval(_this.timer)
      _this.timer = null
    }).on('mouseleave', function() {
      _this._autoplay()
    })

    this.element.data('haveEvents', true)
  }

  // 初始化箭头
  _arrows() {
    var _this = this
    var options = this.options
    var element = this.element

    var arrowHTML = $('<a href="javascript:" class="carousel-arrow prev" arrow-type="sub">&lt;</a><a href="javascript:" class="carousel-arrow next" arrow-type="add">&gt;</a>')

    element.attr('arrow-type', options.arrowType)

    if (element.find('.carousel-arrow')) {
      element.find('.carousel-arrow').remove()
    }

    element.append(arrowHTML)

    arrowHTML.on('click', function() {
      var arrowType = $(this).attr('arrow-type')
      _this.goto(arrowType)
    })
  }

  // 初始化指示器
  _dots() {
    var _this = this
    var options = this.options
    var element = this.element
    var elementItem = this.elementItem

    var dotsHTML = _this.elementDots = $('<ul class="carousel-dots">' + getDotsItem() + '</ul>')

    function getDotsItem() {
      var dotsItems = ''

      $.each(elementItem, function(index, val) {
        dotsItems += '<li' + (options.index === index ? ' class="active"' : '') + '></li>'
      })

      return dotsItems
    }

    element.append(dotsHTML)

    // 添加指示器事件
    dotsHTML.find('li').on((options.dotsTrigger === 'hover' ? 'mouseover' : options.dotsTrigger), function() {
      var index = $(this).index()

      if (index > options.index) {
        _this.goto('add', index - options.index)
      } else if (index < options.index) {
        _this.goto('sub', options.index - index)
      }
    })
  }
}

export default Carousel