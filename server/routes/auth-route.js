// =================================== 導入 ===================================
/** 使用 Router */
const router = require("express").Router();

/** 導入 UserModels */
const User = require("../models").user;

/** 身分驗證 */
const passport = require("passport");

/** jsonWebToken */
const jwt = require("jsonwebtoken");

/** 導入 joi 製作的驗證函數 */
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;

// =================================== middlewares ===================================

router.use((req, res, next) => {
  console.log("正在接收一個跟 auth 有關的請求");
  next();
});

// =================================== Routes ===================================

/** 註冊使用者，使用 joi 套件認證 */
router.post("/register", async (req, res) => {
  // 可以將錯誤 message 傳給前端，要用 cmd 才可以用 log 看到訊息，不要用 vscode 的終端機
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否被註冊過
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("此信箱已經被註冊過");

  // 註冊新用戶
  let { username, email, password, cellPhone, gender, birthDate } = req.body;
  console.log("cellPhone", cellPhone);
  let newUser = new User({
    username,
    email,
    password,
    gender,
    birthDate,
    cellPhone,
    // 預設為客戶
    role: "consumer",
  });
  try {
    console.log("/register", newUser);
    let savedUser = await newUser.save();
    return res.send({
      message: "成功儲存使用者",
      savedUser,
    });
  } catch (error) {
    return res.status(500).send("無法儲存使用者");
  }
});

// 如果使用 Google 登入要將 req.session 刪除
router.post("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ message: "成功登出" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "服務器錯誤" });
  }
});

/** 使用者登入，使用 jsonwebtoken (JWT)，如果登入成功會產出 JWT 回覆給前端 */
router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // 確認信箱是否存在
  const foundUser = await User.findOne({ email: req.body.email });
  if (!foundUser) {
    return res.status(401).send("無法找到使用者，請確認信箱是否正確");
  }

  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send(err);
    if (!isMatch) return res.status(401).send("密碼錯誤");

    // 如果使用者登入密碼與資料庫雜奏的值一樣，製作 json web token
    const tokenObject = {
      _id: foundUser._id,
      email: foundUser.email,
    };

    /** 生成 JWT： 如果密碼匹配成功，則創建一個 JSON 物件，其中包含使用者的 _id 和 email 資訊。
     *  然後使用 @jwtSign 方法將這個 JSON 物件簽名為一個 JWT。簽名過程需要使用一個密鑰，
     *  這個密鑰存儲在環境變數 PASSPORT_SECRET 中。
     *  @signParam1 tokenObject
     *  @signParam2 密鑰 */
    const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
    console.log(token);
    return res.send({
      message: "成功登入",
      token: "JWT " + token,
      user: foundUser,
    });
  });
});

module.exports = router;
