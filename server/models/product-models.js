// 資料夾位置 models/product-models.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

// 使用者模型
const productSchema = new Schema({
  /** 商品的唯一識別碼 */
  id: { type: String },
  /** 商品的名稱 */
  title: { type: String, required: true },
  /** 商品的描述 */
  description: { type: String, required: true },
  /** 商品的種類 */
  type: {
    type: String,
    enum: ["dog_product", "cat_product", "dog_food_can", "cat_food_can"],
    required: true,
  },
  /** 商品的價格 */
  price: { type: Number, required: true },
  /** 商品的圖片資料夾 */
  folderName: { type: String, required: true },
  /** 商品的銷售量 */
  sales: { type: Number, default: 0 },
});

// 將 productSchema 匯出為一個 Mongoose 模型，並使用 mongoose.model() 方法將其命名為 "Product"
module.exports = mongoose.model("Product", productSchema);
