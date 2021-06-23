const { path } = require("@vuepress/utils");

module.exports = {
  name: "vuepress-theme-local",
  extends: "@vuepress/theme-default",
  layouts: {
    Layout: path.resolve(__dirname, "../Layout/Layout"),
  },
};
