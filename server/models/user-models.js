const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  // 使用者名稱
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  // 使用者郵件
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  // 使用者密碼
  password: {
    type: String,
    required: true,
  },
  // 電話
  cellPhone: {
    type: String,
    required: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  // 性別
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  // 使用者身分 (消費者/管理者)
  role: {
    type: String,
    enum: ["consumer", "manager"],
    required: true,
  },
  // 使用者購物車
  shoppingCartList: [
    {
      productId: String, //商品id
      title: String, //商品名稱
      price: Number, //商品價格
      folderName: String, //商品圖片資料夾
      productNumber: Number, //商品數量
    },
  ],

  // 使用者購訂單
  order: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
      products: [
        {
          productId: String, //商品id
          title: String, //商品名稱
          price: Number, //商品價格
          folderName: String, //商品圖片資料夾
          checked: Number, //商品是否於購物車中勾選
          productNumber: Number, //商品數量
        },
      ],
      orderTotal: Number,
    },
  ],

  googleID: String, // Google ID 欄位
  googleAccessToken: String, // Google OAuth 2.0 存取令牌
  googleRefreshToken: String, // Google OAuth 2.0 更新令牌

  // 創建時間
  date: {
    type: Date,
    default: Date.now,
  },
});

/** 是否是學生 @returns true/false */
userSchema.methods.isConsumer = function () {
  return this.role === "consumer";
};

/** 是否是學生 @returns true/false */
userSchema.methods.isManager = function () {
  return this.role === "manager";
};

/** 用於比較使用者輸入的密碼與資料庫中已雜湊的密碼是否相符
 *  @password 來自使用者輸入的密碼
 *  @cb 登入的路由在驗證實執行的 cb 我們會傳匹配結果給登入路由 */
userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    // 將使用者輸入的未雜湊密碼與資料庫中已雜湊的密碼進行比較
    result = await bcrypt.compare(password, this.password);
    return cb(null, result); // 匹配成功沒有 err
  } catch (error) {
    return cb(error, result);
  }
};

/** 若使用者為新用戶，或者正在更改密碼，則將密碼進行雜湊處理
 *  @pre ("save", async function (next) { ... })`:
 *  這裡使用了 Mongoose 中的 `pre` 鉤子。這個鉤子會在每次調用 `save` 方法時被觸發。
 *  @isModified  檢查特定屬性是否已被修改。如果是新的文件，或者密碼屬性已經被修改，則返回 true；否則返回 false */
userSchema.pre("save", async function (next) {
  //  檢查是否為新用戶，或是改動過密碼 (this 代表 mondoDB 內的 document)
  if (this.isNew || this.isModified("password")) {
    // 將密碼雜湊處理
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
