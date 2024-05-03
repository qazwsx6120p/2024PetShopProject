import React, { useState } from "react";
import Joi from "joi";
import Layout from "../../components/layout";
import styles from "../../styles/pages/register.module.css";
import authServices from "../../public/services/auth.services";
import { useRouter } from "next/router"; // 導入路由器

export default function Register() {
  // =================================== router ===================================

  const router = useRouter(); // 初始化路由器

  // =================================== useState ===================================

  /** 註冊資料 */
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    birthDate: "",
    cellPhone: "",
  });

   /** joi 錯誤訊息 */
  const [errors, setErrors] = useState({});

  // =================================== 函數 ===================================

  /** 處理 input 事件 */
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  /** 使用 joi 驗證表單 */
  const validateForm = (data) => {
    const schema = Joi.object({
      username: Joi.string().min(2).max(50).required().messages({
        "string.empty": "姓名不能為空",
        "string.min": "姓名至少包含 2 個字元",
        "string.max": "姓名最多包含 50 個字元",
      }),
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
      gender: Joi.string().required().messages({
        "string.empty": "性別不能為空",
      }),
      birthDate: Joi.string().required().messages({
        "any.required": "請選擇出生年月日",
      }),
      cellPhone: Joi.string()
        .pattern(/^09\d{8}$/)
        .min(10)
        .max(10)
        .required()
        .messages({
          "string.min": "您的電話號碼尚未填滿10位數字",
          "string.max": "您的電話號碼不能超過10位數字",
          "string.empty": "聯絡電話不能為空",
          "string.pattern.base":
            "聯絡電話格式不正確，應為以 '09' 開頭的 10 位數字",
        }),
    });
    return schema.validate(data, { abortEarly: false });
  };

  /** 送出資料 */
  const handleSubmit = async (event) => {
    event.preventDefault(); // 阻止表單的默認提交行為
    const { error } = validateForm(formData);
    if (error) {
      const errors = {};
      error.details.forEach((item) => {
        errors[item.path[0]] = item.message;
      });
      setErrors(errors);
      return;
    }
    try {
      await authServices.register(formData);
      alert("註冊成功，您現在將被導向登入頁面");
      router.push("/user/login"); // 導向登入頁
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className={`${styles.registerContainer} container mt-5`}>
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <h2 className="text-center mb-4">註冊表單</h2>
            <form
              className={`${styles.form} mx-auto`}
              onSubmit={(event) => {
                handleSubmit(event);
              }}
            >
              {/* 姓名 */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  姓名
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="username"
                  placeholder="請輸入姓名"
                  required
                  onChange={handleChange}
                />
                {/* 顯示錯誤訊息 */}
                {errors && errors.username && (
                  <p className="text-danger">{errors.username}</p>
                )}
              </div>
              {/* 郵件 */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  郵件
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="請輸入郵件"
                  required
                  onChange={handleChange}
                />
                {/* 顯示錯誤訊息 */}
                {errors && errors.email && (
                  <p className="text-danger">{errors.email}</p>
                )}
              </div>
              {/* 密碼 */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  密碼
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="請輸入密碼"
                  required
                  onChange={handleChange}
                />
                {/* 顯示錯誤訊息 */}
                {errors && errors.password && (
                  <p className="text-danger">{errors.password}</p>
                )}
              </div>
              {/* 性別 */}
              <div className="mb-3">
                <label className="form-label">性別</label>
                <select
                  className="form-select"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">選擇性別</option>
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                </select>
                {/* 顯示錯誤訊息 */}
                {errors && errors.gender && (
                  <p className="text-danger">{errors.gender}</p>
                )}
              </div>
              {/* 出生年月日 */}
              <div className="mb-3">
                <label htmlFor="dob" className="form-label">
                  出生年月日
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="dob"
                  name="birthDate" 
                  required
                  onChange={handleChange}
                />
                {/* 顯示錯誤訊息 */}
                {errors && errors.birthDate && (
                  <p className="text-danger">{errors.birthDate}</p> 
                )}
              </div>
              {/* 聯絡電話 */}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  聯絡電話
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="cellPhone"
                  placeholder="請輸入聯絡電話"
                  required
                  onChange={handleChange}
                />
                {/* 顯示錯誤訊息 */}
                {errors && errors.cellPhone && (
                  <p className="text-danger">{errors.cellPhone}</p>
                )}
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className={`${styles.registerBtn} btn  w-100 mb-5`}
                >
                  註冊
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
