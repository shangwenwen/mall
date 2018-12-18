import Dom from '../../helpers/dom'

const layout = require('page/common/base.css')
const style = require('page/index/style.css')

const imags = require('images/01.jpg')

let dom = new Dom()

console.log(dom)

let util = require('helpers/common.js')

util.request({
  url: '/product/list.do?keyword=1',
  success: function(res) {
    console.log(res)
  },
  error: function(errMsg) {
    console.log(errMsg)
  }
})

const carousel = require('../common/carousel/index.js')

carousel.render({
	elem: '.carousel-demo',
  width: '800px'
})