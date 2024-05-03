import axios from "axios";
const API_URL = "http://localhost:8080/api/shoppingCart";

/** 處理購物車的 axios */
class ShoppingCartServices {
  /** 將購物結帳
   *  @cartList 購物車資料
   *  @orderTotal 訂單總額 */
  checkout(cartList, orderTotal) {
    const JWT = JSON.parse(localStorage.getItem("user")).token;
    return axios.post(
      API_URL + "/checkout",
      { cartList, orderTotal },
      {
        headers: {
          Authorization: JWT,
        },
      }
    );
  }

  /** 取得購物車資料 */
  get() {
    const JWT = JSON.parse(localStorage.getItem("user")).token;
    return axios.get(API_URL, {
      headers: {
        Authorization: JWT,
      },
    });
  }

  /** 修改特定 id 的商品數量
   *  @_id 特定 id 的商品
   *  @quantity 商品數量 */
  editProductQuantityById(_id, quantity) {
    const JWT = JSON.parse(localStorage.getItem("user")).token;
    return axios.post(
      API_URL + "/editProductQuantityById/" + _id,
      { quantity },
      {
        headers: {
          Authorization: JWT,
        },
      }
    );
  }

  /** 清除所有購物車資料  */
  clearCart() {
    const JWT = JSON.parse(localStorage.getItem("user")).token;
    return axios.post(API_URL + "/clearCart/", null, {
      headers: {
        Authorization: JWT,
      },
    });
  }

  /** 將特定 id 的商品從購物車刪除
   *  @_id 特定 id 的商品 */
  removeProductFromCartById(_id) {
    const JWT = JSON.parse(localStorage.getItem("user")).token;
    return axios.post(API_URL + "/removeProductFromCartById/" + _id, null, {
      headers: {
        Authorization: JWT,
      },
    });
  }

  /** 將該 id 商品加入購物車
   *  @_id 商品 id*/
  addToCart(_id) {
    const JWT = JSON.parse(localStorage.getItem("user")).token;
    return axios.post(API_URL + "/" + _id, null, {
      headers: {
        Authorization: JWT,
      },
    });
  }
}
export default new ShoppingCartServices();
