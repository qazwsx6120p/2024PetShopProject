// ============================================ 導入 ===================================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");

/** 跨來源資源共用 */
const cors = require("cors");

/** route */
const productRoute = require("./routes").product;
const authRoute = require("./routes").auth;
const shoppingCartRoute = require("./routes").shoppingCart;
const personalPageRoute = require("./routes").personalPage;
require("./routes");

/**
 *  dotenv.config() 方法會在應用程式啟動時被調用，
 *  並且會將 .env 檔案中的環境變數加載到應用程式的環境中，
 *  從而讓應用程式能夠使用這些環境變數。 */
const dotenv = require("dotenv");
dotenv.config();

/** 處理身分驗證的專屬檔案 ( jwt 驗證策略 / Google OAuth 2.0 驗證策略 ) */
const passport = require("./config/passport");

// =================================== 連接 db ===================================
mongoose
  .connect("mongodb://localhost:27017/PetShopWebsiteProject")
  .then(() => {
    console.log("connect mongodb ...");
  })
  .catch((err) => {
    console.log(err);
  });

// =================================== 所有 Router 皆會通過的 middlewares ===================================

// 解析傳入的 JSON 格式的請求體，並將解析後的資料儲存在 req.body 中
app.use(express.json());

// 使用 express.urlencoded() 將 HTTP 請求方法 POST、DELETE、PUT 和 PATCH，放在 HTTP 主體 (body) 發送的參數存放在 req.body
app.use(express.urlencoded({ extended: true }));

// 跨來源資源共用
app.use(cors());

// 使用 express-session 中間件來管理用戶會話的功能
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// 初始化 Passport，使其能夠在 Express 應用程序中使用
app.use(passport.initialize());

// 用於管理用戶會話的功能，並在每次請求中使用 Passport 來處理持久登錄會話
// 這個函式應該在 express-session 之後調用，以確保在初始化 Passport 之前已經啟用了會話支援
app.use(passport.session());



// =================================== Router 管理 ===================================

// 登入 Router
app.use("/api/user", authRoute);

// 商品 Router
app.use("/api/product", productRoute);


// 購物車 Router
app.use("/api/shoppingCart", shoppingCartRoute);

// 個人頁面 Router
app.use("/api/personalPage", personalPageRoute);

// =================================== listen ===================================

// react 預設 3000 後端預設 8080
app.listen(8080, () => {
  console.log("後端伺服器正在運行在 port 8080");
});
