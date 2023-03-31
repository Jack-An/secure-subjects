module.exports = {
	// 配置路径别名
	// configureWebpack: {
	// 	devServer: {
	// 		// 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
	// 		disableHostCheck: true
	// 	}
	// },
	devServer: {
	    proxy: {
	      '/api': {
	        target: 'https://service-0pbcc59q-1254422925.gz.apigw.tencentcs.com/release',
	        pathRewrite: {
	          '^/api': ''
	        }
	      }
	    },
	  }
	//productionSourceMap: false,
}
