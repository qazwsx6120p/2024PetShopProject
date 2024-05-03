import axios from "axios";
const API_URL = "http://localhost:8080/api/user";

class AuthServices {
  /** 用於登入的函數
   * @email 使用者郵件
   * @password 使用者密碼 */
  login(email, password) {
    return axios.post(API_URL + "/login", { email, password });
  }

  /** 用於登出的函數，將使用者的資料從 localStorage 刪除 */
  logout() {
    localStorage.removeItem("user");
  }

  /** 用於註冊的函數，
   * @userRegisterObject 使用者註冊資料 */
  register(userRegisterObject) {
    return axios.post(API_URL + "/register", userRegisterObject);
  }
}

export default new AuthServices();
