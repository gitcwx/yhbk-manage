const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push([
    'transform-remove-console',
    {
      // 保留 console.error 与 console.warn
      exclude: ['error', 'warn']
    }
  ])
}
console.log(1)
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ...prodPlugins
  ]
}
