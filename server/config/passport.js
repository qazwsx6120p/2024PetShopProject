const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").user;

// =================================== JWT 驗證策略 ===================================

/** JWT 驗證策略，要求的 object 格式 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: process.env.PASSPORT_SECRET,
};

/**
 *  @jwt_payload 用戶資訊
 *  @done  Passport 中的一個回調函數，用於指示 Passport 策略完成驗證過程並提供結果。
 *  它的作用是將驗證的結果返回給 Passport，以便 Passport 能夠繼續後續的處理。
 *  @doneParam1 錯誤
 *  @doneParam2 找到的User */
passport.use(
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    try {
      const foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
      if (foundUser) {
        return done(null, foundUser);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);



module.exports = passport;
