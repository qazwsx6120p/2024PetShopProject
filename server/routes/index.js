/** 管理所有 route 的導出，如果要導入任何 route 就要先導入此檔案  */
module.exports = {
  product: require("./product-route"),
  auth: require("./auth-route"),
  shoppingCart: require("./shoppingCart-route"),
  personalPage: require("./personalPage-route"),
};
