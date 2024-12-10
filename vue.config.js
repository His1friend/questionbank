const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081, // 设置默认端口为8081
    open: true  // 启动服务时自动打开浏览器（可选）
  }
})
