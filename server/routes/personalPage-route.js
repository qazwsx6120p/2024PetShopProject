// =================================== 導入 ===================================
/** 使用 Router */
const router = require("express").Router();

/** 導入 UserModels */
const User = require("../models").user;

/** 身分驗證 */
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

/** 獲取所有訂單以及使用者 */
router.get("/personalPage", authenticateUser, async (req, res) => {
  try {
    const foundUser = await User.findOne({ email: req.user.email });
    const userData = {
      username: foundUser.username,
      email: foundUser.email,
      cellPhone: foundUser.cellPhone,
      gender: foundUser.gender,
    };
    if (!foundUser) return res.status(400).send("使用者資訊錯誤");
    return res.status(200).send({
      message: `成功取得使用者:${foundUser.username}。的全部訂單資料`,
      userData: userData,
      order: foundUser.order,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

/** 更新使用者資料 */
router.patch("/updatePersonalData", authenticateUser, async (req, res) => {
  try {
    // 從請求的 body 中獲取更新的資料
    const updateFormData = req.body;

    // 執行部分更新並確保僅更新指定的屬性
    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email }, // 查詢條件
      { $set: updateFormData }, // 要更新的資料
      { new: true } // 返回更新後的文檔
    );

    // 如果沒有找到使用者，則回傳錯誤訊息
    if (!updatedUser) {
      return res.status(400).send("使用者資訊錯誤");
    }

    // 回覆成功的訊息和更新後的使用者資料
    res.send({
      message: "成功更新使用者資料",
      updatedUser: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send("無法更新使用者資料，請稍後再試");
  }
});

module.exports = router;
