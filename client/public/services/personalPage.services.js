import axios from "axios";
const API_URL = "http://localhost:8080/api/personalPage";

/** 處理個人頁面的 axios */
class PersonalPage {
  /** 獲取所有訂單 */
  getPersonalData() {
    const JWT = JSON.parse(localStorage.getItem("user")).token;
    return axios.get(API_URL + "/personalPage", {
      headers: {
        Authorization: JWT,
      },
    });
  }

  /** 修改使用者資料
   *  @personalData 使用者修改的資料 */
  updatePersonalData(personalData) {
    const JWT = JSON.parse(localStorage.getItem("user")).token;
    return axios.patch(API_URL + "/updatePersonalData", personalData, {
      headers: {
        Authorization: JWT,
      },
    });
  }
}
export default new PersonalPage();
