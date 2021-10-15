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
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ...prodPlugins,
    [
      'import',
      {
        libraryName: 'element-plus',
        customStyleName: (name) => {
          name = name.slice(3)
          return `element-plus/packages/theme-chalk/src/${name}.scss`
        }
      }
    ]
  ]
}
