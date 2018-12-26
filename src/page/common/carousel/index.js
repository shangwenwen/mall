require('page/common/carousel/style.css')

// 轮播
class Carousel {
  // 构造函数
  constructor(element, options = {}) {
    // 合并配置
    this.options = $.extend(true, {}, {
      slideType: 'default',
      autoplay: true,
      dots: true,
      dotsTrigger: 'hover',
      arrowType: 'hover',
      interval: 3000,
      duration: 300,
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
    _this._arrow()
    _this._dots()
    _this._events()
  }

  // 自动播放
  _autoplay() {
    var _this = this
    var options = this.options

    if (!options.autoplay) return

    this.timer = setInterval(function() {
      _this.slide()
    }, options.interval)
  }

  _addIndex(num) {
    var options = this.options
    var elementItem = this.elementItem

    var num = num || 1
    options.index = options.index + num


    if (options.index >= elementItem.length) {
      options.index = 0
    }
  }

  _subIndex(num) {
    var options = this.options
    var elementItem = this.elementItem

    var num = num || 1
    options.index = options.index - num

    if (options.index < 0) {
      options.index = elementItem.length - 1
    }
  }

  slide(arrowType, num) {
    var _this = this
    var isSliding = this.isSliding
    var options = this.options
    var elementItem = this.elementItem

    if (_this.isSliding) return

    if (arrowType === 'sub') {
      _this._subIndex(num)
      elementItem.eq(options.index).addClass('carousel-item-prev')

      setTimeout(function() {
        elementItem.eq(options.index + 1).addClass('carousel-item-right')
        elementItem.eq(options.index).addClass('carousel-item-right')
      }, 50)
    } else {
      _this._addIndex(num)
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
    }, 50)

    // 指示器焦点
    _this.elementDots.find('li').eq(options.index).addClass('active').siblings().removeClass('active')

    isSliding = true
  }

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

  _arrow() {
    var _this = this
    var options = this.options
    var element = this.element

    var arrowTpl = $('<a href="javascript:" class="carousel-arrow prev" arrow-type="sub">&lt;</a><a href="javascript:" class="carousel-arrow next" arrow-type="add">&gt;</a>')

    element.attr('arrow-type', options.arrowType)

    if (element.find('.carousel-arrow')) {
      element.find('.carousel-arrow').remove()
    }

    element.append(arrowTpl)

    arrowTpl.on('click', function() {
      var arrowType = $(this).attr('arrow-type')
      _this.slide(arrowType)
    })
  }

  _dots() {
    var _this = this
    var options = this.options
    var element = this.element
    var elementItem = this.elementItem

    var dotsTpl = _this.elementDots = $([
      '<ul class="carousel-dots">',
      function() {
        var str = []

        $.each(elementItem, function(index, val) {
          str.push('<li' + (options.index === index ? ' class="active"' : '') + '></li>')
        })

        return str.join('')
      }(),
      '</ul>'
    ].join(''))

    element.append(dotsTpl)

    dotsTpl.find('li').on('mouseover', function() {
      var index = $(this).index()
      console.log(index)
      console.log(options.index)
      if (index > options.index) {
        _this.slide('add', index - options.index)
      } else if (index < options.index) {
        _this.slide('sub', options.index - index)
      }
    })

  }

}

export default Carousel