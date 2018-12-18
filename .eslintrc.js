module.exports = {
  extends: ['eslint-config-alloy'],
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    //
    jQuery: false,
    $: false
  },
  rules: {
    'indent': ['error', 2, { SwitchCase: 1, flatTernaryExpressions: true }], // @fixable 一个缩进必须用两个空格替代
    'semi': ['error', 'never', { 'beforeStatementContinuationChars': 'always' }], // 不加分号
    'no-multiple-empty-lines': [2, { 'max': 1 }] // 不能有多个空行,最多1行
  }
}