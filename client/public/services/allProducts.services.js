import axios from "axios";
const API_URL = "http://localhost:8080/api/product";

/** 向後端取得商品 */
class AllProductsServices {
  /** 取得所有商品 */
  async getAll() {
    return axios.get(API_URL);
  }
  /** 使用商品 id 獲取該商品
   *  @_id mongoose 裡面存的 id 是 @_id 的形式，故要使用 @_id */
  getProductByID(id) {
    return axios.get(API_URL + "/" + id);
  }
}
export default new AllProductsServices();
