process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/uni/" : "/",
  pwa: {
    themeColor: "#778899",
    workboxOptions: {
      skipWaiting: true
    }
  },
  configureWebpack: {},
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  },
  transpileDependencies: ["vuetify"]
};
