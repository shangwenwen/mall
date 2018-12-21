// 轮播
class Carousel {
  // 构造函数
  constructor(element, userOptions = {}) {
    // 合并配置
    this.options = $.extend({}, {
      width: '600px',
      height: '300px',
      arrow: 'hover', // 'hover/always/none'
      indicator: 'inside', // 'indicator/outside/none' 指示器位置
      autoplay: true, // true/false
      interval: 3000, // 轮播时间
      triggerType: 'hover', // 'hover/click' 触发指示器方式
      index: 0 // 初始索引
    }, userOptions)
    // 获取轮播元素
    this.element = $(element)

    // 获取轮播项
    this.elementItem = this.element.find('.carousel-content').children()
    // 加载轮播
    this.init()
  }

  init() {
    const options = this.options
    const element = this.element

    // 判断页面中是否有轮播元素
    if (!element[0]) {
      console.log('no element')
      return
    }

    // 重置索引
    if (options.index < 0) {
      options.index = 0
    }
    if (options.index >= this.elementItem.length) {
      options.index = this.elementItem.length - 1
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

  // 获取上一个等待索引
  _prevIndex() {
    let options = this.options
    let prevIndex = options.index - 1

    if (prevIndex < 0) {
      prevIndex = this.elementItem.length - 1
    }

    return prevIndex
  }

  // 获取下一个等待索引
  _nextIndex() {
    let options = this.options
    let nextIndex = options.index + 1

    if (nextIndex > this.elementItem.length) {
      nextIndex = 0
    }

    return nextIndex
  }

  // 索引递增
  _addIndex(num) {
    let options = this.options
    num = num || 1
    options.index = options.index + num

    if (options.index >= this.elementItem.length) {
      options.index = 0
    }
  }

  // 索引递减
  _subIndex(num) {
    let options = this.options
    num = num || 1
    options.index = options.index - num

    if (options.index < 0) {
      options.index = this.elementItem.length - 1
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

  // 指示器
  indicator() {
    let _this = this
    let options = this.options

    let indicatorTpl = $(
      [
        '<ul class="carousel-indicator">',
        (function() {
          let li = []

          $.each(_this.elementItem, function(index) {
            li.push('<li' + (options.index === index ? ' class="this"' : '') + '></li>')
          })

          return li.join('')
        })(),
        '</ul>'
      ].join(''))

    this.element.attr('indicator-type', options.indicator)

    // 避免重复加载
    if (this.element.find('.carousel-indicator')[0]) {
      this.element.find('.carousel-indicator').remove()
    }

    this.element.append(indicatorTpl)
  }

  // 轮播箭头
  arrow() {
    let _this = this
    let options = this.options
    let arrowTpl = $([
      '<a class="layui-icon" lay-type="sub">&gt;</a>',
      '<a class="layui-icon" lay-type="add">&gt;</a>'
    ].join(''))

    this.element.attr('arrow-type', options.arrow)
    this.element.append(arrowTpl)

    arrowTpl.on('click', function() {
      let thisElem = $(this)
      let type = thisElem.attr('lay-type')
      _this._slide(type)
    })
  }

  // 切换
  _slide(type, num) {
    let _this = this
    let options = this.options
    let index = options.index

    if(_this.haveSlide) return;

    if (type === 'sub') {
      _this._subIndex(num)
      _this.elementItem.eq(options.index).addClass('carousel-prev')

      setTimeout(function(){
        _this.elementItem.eq(options.index).addClass('carousel-right')
      },50)
    } else{
      _this._addIndex(num)
      _this.elementItem.eq(options.index).addClass('carousel-next')

      setTimeout(function(){
        _this.elementItem.eq(options.index).addClass('carousel-left')
      },50)
    }

    setTimeout(function(){
      _this.elementItem.removeClass('this carousel-prev carousel-right carousel-next carousel-left')
      _this.elementItem.eq(options.index).addClass('this')
      _this.haveSlide = false
    },300)

    _this.haveSlide = true
  }

  // 事件绑定
  events() {
    let _this = this
    let options = this.options

    this.element.on('mouseenter', function(){
      clearInterval(_this.timer);
    }).on('mouseleave', function(){
      _this.autoplay()
    })
  }
}

export default Carousel