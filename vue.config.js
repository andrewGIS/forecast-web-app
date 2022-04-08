const path = require('path');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  //publicPath: process.env.VUE_APP_PUBLIC_PATH,
  // configureWebpack: {
  //   "devServer": {
  //     "proxy": {
  //       "^/api":
  //         {
  //           "target": "http://localhost:8000",
  //           "ws": true,
  //           "changeOrigin": true
  //         },
  //       "^/admin":
  //         {
  //           "target": "http://localhost:8000",
  //           "ws": true,
  //           "changeOrigin": true
  //         },
  //       "^/media": {
  //           "target": "http://localhost:8000",
  //           "ws": true,
  //           "changeOrigin": true
  //       },
  //       "^/static":
  //         {
  //           "target": "http://localhost:8000",
  //           "ws": true,
  //           "changeOrigin": true
  //         },
  //     }
  //   }
  // }
  publicPath: '/static/src/vue/dist/', // Should be STATIC_URL + path/to/build
  outputDir: path.resolve(__dirname, '../static/src/vue/dist/'), // Output to a directory in STATICFILES_DIRS
  filenameHashing: false, // Django will hash file names, not webpack
  runtimeCompiler: true, // See: https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  devServer: {
    writeToDisk: true, // Write files to disk in dev mode, so Django can serve the assets
  },
}
