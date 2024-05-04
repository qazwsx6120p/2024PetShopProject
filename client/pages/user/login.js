import Layout from "../../components/layout";
import styles from "../../styles/pages/login.module.css";
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { DataContext } from "../_app.js";
import Joi from "joi";
import authService from "../../public/services/auth.services.js";

export default function Login() {
  const { isLogin } = useContext(DataContext);

  // =================================== useRouter ===================================

  const router = useRouter();

  // =================================== useState ===================================
  /** 使用者郵件狀態 */
  const [email, setEmail] = useState("");

  /** 使用者密碼狀態 */
  const [password, setPassword] = useState("");

  /** joi 錯誤訊息 */
  const [errors, setErrors] = useState({});

  // =================================== function ===================================

  /** 使用 joi 驗證表單 */
  const validateForm = (data) => {
    const schema = Joi.object({
      email: Joi.string()
        .min(6)
        .max(50)
        .email({ tlds: { allow: false } })
        .required()
        .messages({
          "any.required": "郵件不能為空",
          "string.email": "請輸入有效的郵件地址",
          "string.min": "郵件至少包含 6 個字元",
          "string.max": "郵件最多包含 50 個字元",
        }),
      password: Joi.string().min(6).max(255).required().messages({
        "string.empty": "密碼不能為空",
        "string.min": "密碼至少包含 6 個字元",
        "string.max": "密碼最多包含 255 個字元",
      }),
    });
    return schema.validate(data, { abortEarly: false });
  };

  /** 處理使用者郵件 @event input 事件 */
  const handleChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  /** 處理使用者密碼 @event input 事件 */
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };

  /** 處理使用者登入，會將使用者資訊存在 @setCurrentUser 狀態 ，
   *  並一併存在 localStorage ( 為了使用 JWT)，然後重新導向至個人頁面 */
  const handleLogin = async () => {
    // 前端驗證阻擋
    const { error } = validateForm({ email, password });
    if (error) {
      const errors = {};
      error.details.forEach((item) => {
        errors[item.path[0]] = item.message;
      });
      setErrors(errors);
      return;
    }

    try {
      const response = await authService.login(email, password);
      localStorage.setItem("user", JSON.stringify(response.data));
      alert("登入成功，您現在將被導向首頁");
      router.push("/"); // 將路由導向個人頁面
    } catch (error) {
      alert(error.response.data);
    }
  };

  // =================================== useEffect ===================================

  // 如果已經登入將自動導向 /user/personalPage
  useEffect(() => {
    if (isLogin()) {
      router.push("/user/personalPage");
    }
  }, []);

  // =================================== useEffect ===================================
  return (
    <Layout>
      <div
        className={`${isLogin() && "align-content-center"} ${
          styles.loginContainer
        } container mt-5`}
      >
        <div className="row justify-content-center">
          <div className="col-lg-6 ">
            <h2 className="text-center mb-4 ">登入</h2>
            {!isLogin() && (
              <div>
                <form id="loginForm" className={`${styles.form} mx-auto`}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      郵件
                    </label>
                    <input
                      onChange={(event) => {
                        handleChangeEmail(event);
                      }}
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="請輸入郵件"
                      required
                    />
                    {/* 顯示錯誤訊息 */}
                    {errors && errors.email && (
                      <p className="text-danger">{errors.email}</p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      密碼
                    </label>
                    <input
                      onChange={(event) => {
                        handleChangePassword(event);
                      }}
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="請輸入密碼"
                      required
                    />
                    {/* 顯示錯誤訊息 */}
                    {errors && errors.password && (
                      <p className="text-danger">{errors.password}</p>
                    )}
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleLogin}
                      // 避免重新加載
                      type="button"
                      className={`${styles.loginBtn} btn  w-100 mb-2`}
                    >
                      開始購物吧!
                    </button>
                  </div>
                </form>
                <h2 className="text-center mb-4 mt-5">還不是會員?</h2>
                <Link
                  className="d-flex  justify-content-center"
                  href="/user/register"
                >
                  <button type="submit" className="btn  w-100">
                    註冊會員
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
