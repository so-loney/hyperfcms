module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ?  process.env.VUE_APP_BASE_URL : '/',
  configureWebpack: {
    resolve: {
      alias: {
        '@public': '@/../public'
      }
    }
  },
  css: {
    loaderOptions: {

    }
  },

  devServer: {
    proxy: {
      '/admin_api': {
        target: process.env.VUE_APP_POROXY_TARGET,
        changeOrigin: true,
        pathRewrite: {
          // '^/admin_api': 'admin_api'
        }
      }
    } 
  }

}
