// =================================== 導入 ===================================
/** 使用 Router */
const router = require("express").Router();

/** 導入 courseModels */
const Product = require("../models").product;


const productValidation = require("../validation").productValidation;

// =================================== middlewares ===================================
router.use((req, res, next) => {
  console.log("course route正在接受一個request...");
  next();
});

// =================================== Routes ===================================

/** 獲取全部的商品 */
router.get("/", async (req, res) => {
  try {
    /** 獲取全部商品的 Promise 物件 */
    const foundAllProduct = await Product.find({}).exec();
    return res.send(foundAllProduct);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/** 獲取銷量最高的商品 */
router.get("/", async (req, res) => {
  try {
    /** 獲取全部商品的 Promise 物件 */
    const foundAllProduct = await Product.find({}).exec();
    return res.send(foundAllProduct);
  } catch (error) {
    return res.status(500).send(error);
  }
});


/** 使用商品 id 獲取該商品
 *  @_id mongoose 裡面存的 id 是 @_id 的形式，故此 route 要使用 @_id */
router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    /** 獲取該商品的 Promise 物件 */
    const foundAllProduct = await Product.findOne({ _id }).exec();
    return res.send(foundAllProduct);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/** 新增商品 */
router.post("/", async (req, res) => {
  // 用於驗證前端的商品資料是否符合規格
  const { error } = productValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, description, type, price, folderName } = req.body;
  try {
    const newProduct = new Product({
      title,
      description,
      type,
      folderName,
      price,
    });
    const savedProduct = await newProduct.save();
    res.send("新增商品成功:" + savedProduct);
  } catch (error) {
    res.status(500).send("新增商品時出错：" + error.message);
  }
});

/** 刪除商品 */
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;

  try {
    let productFound = await Product.findOne({ _id }).exec();

    // 確認商品是否存在，不存在返回 "找不到商品。無法刪除商品。"
    if (!productFound) {
      return res.status(400).send("找不到商品。無法刪除商品。");
    }
    await Product.deleteOne({ _id }).exec();
    return res.send("商品已被刪除。");
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
