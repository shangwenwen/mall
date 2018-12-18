// 定义
const conf = {
  serverHost: ''
}

let util = {
  // 数据请求
  request: function(param) {
    let _this = this

    $.ajax({
      type: param.method || 'get',
      url: param.url || '',
      dataType: param.type || 'json',
      data: param.data || '',
      success: function(res) {
        if (res.status === 0) {
          typeof param.success === 'function' && param.success(res.data, res.msg)
        } else if (res.status === 10) {
          _this.doLogin()
        } else if (res.status === 1) {
          typeof param.error === 'function' && param.error(res.msg)
        }
      },
      error: function(err) {
        typeof param.error === 'function' && param.error(err.statusText)
      }
    })
  },
  // 获取服务器地址
  getServerUrl: function(path) {
    return conf.serverHost + path
  },
  // 成功提示
  successTips: function() {

  },
  // 登陆跳转
  doLogin: function() {
    window.location.href = './login.html?redirect=' + encodeURIComponent(window.location.href)
  }
}

module.exports = util