/**
 * 這是一個使用 @Joi 庫來進行數據驗證的文件。這個文件包含了三個函數，分別用於驗證註冊表單中的用戶輸入、
 * 登入表單中的用戶輸入以及課程表單中的輸入。
 * 每個函數都使用 @Joi 提供的 API 定義了一個 schema，該 schema 包含了每個字段的驗證規則。然後，通過調用 schema 的 validate 方法，
 * 可以將用戶輸入的數據與 schema 進行比較，從而確定數據是否符合預期的格式和條件。
 * 將這些驗證函數導出為模塊的一部分，以便在其他文件中使用。 */

// ========= 導入 =========

const Joi = require("joi");

// ========= 函數 =========

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(6).max(50).email().required(),
    password: Joi.string().min(6).max(255).required(),
    birthDate: Joi.string().required(),
    cellPhone: Joi.string().length(10).pattern(/^09\d{8}$/).required(), // 驗證以"09"開頭的10位數字
    gender: Joi.string().required().valid("male", "female"),
  });
  return schema.validate(data);
};

/** 用於驗證登入表單中的用戶輸入，包括電子郵件和密碼。同樣，這些字段也有相應的限制。 */
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).required().email().required(),
    password: Joi.string().min(6).max(255).required(),
  });
  return schema.validate(data);
};

/** 用於驗證前端的商品資料是否符合規格 */
const productValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(150).required(),
    type: Joi.string()
      .valid("dog_product", "cat_product", "dog_food_can", "cat_food_can")
      .required(),
    price: Joi.number().min(10).max(9999).required(),
    folderName: Joi.string().min(0).max(50).required(),
  });
  return schema.validate(data);
};

/** 用於驗證課程表單中的輸入，包括標題、描述和價格。這些字段的限制也類似於其他驗證函數。 */
const courseValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(6).max(50).required(),
    description: Joi.string().min(6).max(50).required(),
    price: Joi.number().min(10).max(9999).required(),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.productValidation = productValidation;
module.exports.courseValidation = courseValidation;
