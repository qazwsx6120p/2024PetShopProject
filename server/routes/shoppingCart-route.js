// =================================== 導入 ===================================
/** 使用 Router */
const router = require("express").Router();

/** 導入 courseModels */
const User = require("../models").user;
const Product = require("../models").product;
const passport = require("passport");

// =================================== middlewares ===================================

/** 用於認證使用者是否登入的中間鍵，用 Passport.js進行身份驗證後，它會將驗證成功的使用者資訊放置在req.user物件中
 *  @一般登入 使用 jwt 認證 */
const authenticateUser = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    // 是否經過授權
    let isAuthorize = user;

    /** @伺服器錯誤 ，回復 "伺服器在處理請求時發生錯誤" */
    if (err) {
      return res
        .status(500)
        .json({ message: "伺服器在處理請求時發生錯誤，導致無法完成請求" });
    }

    /** @未經授權 ，回復 "未經授權，用戶需要進行身份驗證" */
    if (!isAuthorize) {
      return res
        .status(401)
        .json({ message: "未經授權，用戶需要進行身份驗證" });
    }
    /**
     * @授權成功 ，讓控制權轉交給下一個中間件或路由處理程序，並將 @user 存到 @req_use */
    req.user = user;
    next();
  })(req, res, next);
};

// =================================== Routes ===================================

/** 結帳 */
router.post("/checkout", authenticateUser, async (req, res) => {
  const { cartList, orderTotal } = req.body;
  try {
    // 用Passport.js進行身份驗證後，它會將驗證成功的使用者資訊放置在req.user物件中
    const foundUser = await User.findOne({ email: req.user.email });
    if (!foundUser) return res.status(400).send("使用者資訊錯誤");

    /** 把 _id 屬性刪掉，無用的 id ，只需要 productId
     * {
     *    "productId": "661e20954ef9899dabf44287",
     *    "title": "鮮肉罐｜貓咪98%無膠鮮肉主食罐",
     *    "price": 90,
     *    "folderName": "貓咪無膠鮮肉主食罐",
     *    "checked": 0,
     *    "productNumber": 4,
     *    "_id": 4,
     *  }  */
    const updatedProducts = cartList.map((product) => {
      const { _id, ...productWithoutId } = product;
      return productWithoutId;
    });

    // 更新購物車
    foundUser.shoppingCartList = [];

    // 更新訂單
    if (foundUser.order.length !== 0) {
      foundUser.order.push({
        products: updatedProducts,
        orderTotal: orderTotal,
      });
    }
    // 從未消費過
    else {
      foundUser.order = [
        {
          products: updatedProducts,
          orderTotal: orderTotal,
        },
      ];
    }
    await foundUser.save();

    return res.status(200).send({
      message: `成功取得使用者:${foundUser.username}。的訂單資料`,
      order: foundUser.order,
      shoppingCartList: foundUser.cartList,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/** 使用用戶 id 取得該用戶的購物車資料  */
router.get("/", authenticateUser, async (req, res) => {
  try {
    // 用Passport.js進行身份驗證後，它會將驗證成功的使用者資訊放置在req.user物件中
    const foundUser = await User.findOne({ email: req.user.email });
    if (!foundUser) return res.status(400).send("使用者資訊錯誤");
    return res.status(200).send({
      message: `成功取得使用者:${foundUser.username}。的購物車資料`,
      shoppingCartList: foundUser.shoppingCartList,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/** 清除所有購物車資料  */
router.post("/clearCart", authenticateUser, async (req, res) => {
  try {
    // 用Passport.js進行身份驗證後，它會將驗證成功的使用者資訊放置在req.user物件中
    const foundUser = await User.findOne({ email: req.user.email });
    if (!foundUser) return res.status(400).send("使用者資訊錯誤");
    foundUser.shoppingCartList = [];
    await foundUser.save();
    return res.status(200).send({
      message: `成功刪除所有購物車資料`,
      shoppingCartList: foundUser.shoppingCartList,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/** 將商品加入購物車 */
router.post("/:_id", authenticateUser, async (req, res) => {
  let { _id } = req.params;
  console.log(_id);
  try {
    // 用Passport.js進行身份驗證後，它會將驗證成功的使用者資訊放置在req.user物件中
    const foundUser = await User.findOne({ email: req.user.email });
    // 當前要加入購物車的商品
    const foundProduct = await Product.findOne({ _id });
    if (!foundUser) return res.status(400).send("使用者資訊錯誤");
    if (!foundProduct) return res.status(400).send("找不到商品");

    // 商品本身已經在自購物車內
    let existingProductInCart;

    // 查看當前要加入購物車的商品使否已經存在購物車
    if (foundUser.shoppingCartList.length !== 0) {
      foundUser.shoppingCartList.forEach((product) => {
        if (product.productId === _id) {
          existingProductInCart = product;
          product.productNumber++;
        }
      });
    }

    // 如果商品本身已經在自購物車內，將變更數量後的 User 保存
    if (existingProductInCart) {
      await foundUser.save();
      return res.status(201).send({
        message: "商品已保存至購物車內",
        shoppingCartList: foundUser.shoppingCartList,
      });
    }
    // 如果商品尚未存在購物車內
    else {
      let newShoppingCartItem = {
        productId: _id,
        title: foundProduct.title,
        price: foundProduct.price,
        folderName: foundProduct.folderName,
        checked: 0,
        productNumber: 1,
      };
      foundUser.shoppingCartList.push(newShoppingCartItem);
      await foundUser.save();
      return res.status(201).send({
        message: "商品已保存至購物車內",
        shoppingCartList: foundUser.shoppingCartList,
      });
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});

/** 將特定 id 商品從購物車刪除 */
router.post(
  "/removeProductFromCartById/:_id",
  authenticateUser,
  async (req, res) => {
    try {
      let { _id } = req.params;

      // 用Passport.js進行身份驗證後，它會將驗證成功的使用者資訊放置在req.user物件中
      const foundUser = await User.findOne({ email: req.user.email });

      if (!foundUser) return res.status(400).send("使用者資訊錯誤");

      // 過濾掉符合 _id 的商品
      const filterProducts = foundUser.shoppingCartList.filter((product) => {
        return product.productId !== _id;
      });

      foundUser.shoppingCartList = filterProducts;
      await foundUser.save();
      return res.status(201).send({
        message: "已將商品從購物車中刪除",
        shoppingCartList: foundUser.shoppingCartList,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

/** 修改特定 id 的商品數量 */
router.post(
  "/editProductQuantityById/:_id",
  authenticateUser,
  async (req, res) => {
    try {
      let { _id } = req.params;
      let { quantity } = req.body;

      // 用Passport.js進行身份驗證後，它會將驗證成功的使用者資訊放置在req.user物件中
      const foundUser = await User.findOne({ email: req.user.email });

      if (!foundUser) return res.status(400).send("使用者資訊錯誤");

      foundUser.shoppingCartList.forEach((product) => {
        if (product.productId === _id) {
          product.productNumber = quantity;
        }
      });

      await foundUser.save();
      return res.status(201).send({
        message: "已更改商品數量",
        shoppingCartList: foundUser.shoppingCartList,
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

module.exports = router;
