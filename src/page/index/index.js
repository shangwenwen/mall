// import Dom from '../../helpers/dom'
import Carousel from '../common/carousel/index.js'
// import Dialog from '../common/dialog/index.js'

// const layout = require('page/common/base.css')
// const style = require('page/index/style.css')

// const imags = require('images/01.jpg')

const images = require('../../images/01.jpg')

// let util = require('helpers/common.js')

// util.request({
//   url: '/product/list.do?keyword=1',
//   success: function(res) {
//     console.log(res)
//   },
//   error: function(errMsg) {
//     console.log(errMsg)
//   }
// })

var carousel = new Carousel('.carousel-wrap', {
  width: '1000px',
  imgSrc: [
    images,
    images,
    images
  ]
})

console.log(carousel)

// new Dialog()
