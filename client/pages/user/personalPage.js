import { useState, useRef, useEffect, useContext } from "react";
import NoFooterLayout from "../../components/noFooterLayout";
import styles from "../../styles/pages/personalPage.module.css";
import personalServices from "../../public/services/personalPage.services";
import { DataContext } from "../_app";
export default function PersonalPage() {
  // =================================== 變數 ===================================

  /** 搜索欄位的 String */
  let searchString = "";

  // =================================== useRef ===================================

  /**  @setCurrentUser 設定當前使用者函數 */
  const { headerHeight } = useContext(DataContext);

  // =================================== useRef ===================================

  const order = useRef(null);
  const orderRow = useRef(null);

  // =================================== useState ===================================

  /** 種類狀態 */
  const [activeTab, setActiveTab] = useState("orders");

  /** main 高度 */
  const [mainHeight, setMainHeight] = useState();

  /** 訂單資料 */
  const [orderData, setOrderData] = useState(null);

  /** 是否以搜尋的字串搜尋商 */
  const [isSearch, setIsSearch] = useState(false);

  /** 是否有訂單資料 */
  const [hasOrderData, setHasOrderData] = useState(false);

  /** 使用搜尋欄位搜尋出來的訂單資料 */
  const [searchOrderData, setSearchOrderData] = useState(null);

  /** 個人資料 */
  const [personalData, setPersonalData] = useState({
    username: "",
    gender: "",
    cellPhone: "",
  });

  /** 是否編輯資料 */
  const [isEditPersonalData, setIsEditPersonalData] = useState(false);

  // =================================== 常數 ===================================

  /** 商品卡片的商品資料夾 */
  const PRODUCT_IMG_URL = "/resource/product";

  /** 是否使用 Search 資料 */
  const isUseSearchData = searchOrderData && isSearch;

  /** 是否使用 Order 資料 */
  const isUseOrderData = orderData && !isSearch;

  // =================================== function ===================================

  /** 使用搜索關鍵字作為參數，然後根據搜索關鍵字過濾商品列表，以顯示與搜索相關的商品
   *  @event input 事件
   *  @return input 關鍵字 */
  const getOrderSearchString = (event) => {
    searchString = event.target.value.trim(); // 清除字串前後的空格
    if (searchString === "") setIsSearch(false);
  };

  /** 按下搜尋按鈕後，使用搜尋的字串篩選出符合該字串的商品 */
  const handleSearchProductData = () => {
    // 防呆，以免使用者送出空字串
    if (searchString === "") {
      setIsSearch(false);
      return;
    }

    // 過濾訂單資料，找出符合搜尋字串的訂單
    const filteredOrders = orderData.filter((order) => {
      // 檢查訂單的商品陣列是否有符合搜尋字串的商品
      return (
        order.products.filter((product) => product.title.includes(searchString))
          .length > 0
      );
    });

    setSearchOrderData(filteredOrders); // 設定過濾後的訂單資料到 setSearchOrderData
    setIsSearch(true); // 設定搜尋狀態為 true
  };

  /** 取得個人頁面的高度為 window 高度減去 header 的高度
   *  @return 個人頁面的高度 */
  const getPersonalPageBgcHeight = () => {
    return window.innerHeight - headerHeight;
  };

  /** 取得個人頁面資料 */
  const getPersonalData = async () => {
    try {
      const response = await personalServices.getPersonalData();

      // 如果使用者有訂單資料
      response.data.order.length !== 0
        ? setHasOrderData(true)
        : setHasOrderData(false);

      setOrderData(response.data.order);
      setPersonalData(response.data.userData);
      console.warn("取得使用者資料", response);
      console.warn("取得使用者訂單資料", response);
    } catch (error) {
      console.log(error);
    }
  };

  /** 將後端的訂單日期與時間轉換為台灣的日期與時間
   *  @dateString 後端的訂單時間
   *  @returns 轉換後的台灣日期與時間*/
  const convertToTaiwanTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      timeZone: "Asia/Taipei",
      hour12: false, // 使用 24 小時制
    };
    const taiwanDate = date.toLocaleString("zh-TW", options);
    return taiwanDate;
  };

  /** 處理使用者更新的資料狀態 */
  const handleChange = (event) => {
    setPersonalData({
      ...personalData,
      [event.target.name]: event.target.value.trim(),
    });
  };

  /** 處理更新使用者的資料至後端 */
  const updatePersonalData = async () => {
    setIsEditPersonalData(false);
    try {
      const updatedUser = await personalServices.updatePersonalData(
        personalData
      );
      console.warn("更新完的使用者資料", updatedUser);
    } catch (error) {
      console.log(error);
    }
  };

  // =================================== useEffect ===================================

  // 取得訂單資料
  useEffect(() => {
    getPersonalData();
  }, []);
  return (
    <NoFooterLayout>
      <div
        style={
          activeTab === "orders"
            ? { height: mainHeight }
            : { height: getPersonalPageBgcHeight() }
        }
        className={`container-fluid ${styles.background}`}
      >
        <div ref={orderRow} className="row justify-content-center ">
          {/* 左側分類 */}

          <div className={`${styles.tabContainer} col-md-3`}>
            <div className="list-group">
              {/* 個人頭像和帳號名稱 */}
              <div className={`d-flex align-items-center mb-3`}>
                <span>帳號名稱 : {personalData && personalData.email}</span>
              </div>
              <div
                type="button"
                className={` ${activeTab === "personal" ? styles.active : ""} ${
                  styles.button
                }`}
                onClick={() => setActiveTab("personal")}
              >
                個人頁面
              </div>
              <div
                type="button"
                className={` ${activeTab === "orders" ? styles.active : ""} ${
                  styles.buttonLast
                }`}
                onClick={() => setActiveTab("orders")}
              >
                全部訂單
              </div>
            </div>
          </div>

          {/* 右側顯示 */}
          <div ref={order} className={`${styles.orderContainer} col-md-5`}>
            {activeTab === "personal" && (
              <div className={`card ${styles.personalCard}`}>
                <div className={`card-body  ${styles.cardBody}`}>
                  <div className={`${styles.titleBox}`}>
                    <p className={styles.p}>管理你的檔案以保護你的帳戶</p>
                  </div>
                  <div>
                    <div className={`${styles.dataBox} `}>
                      <label htmlFor="name" className="form-label">
                        姓名 :
                      </label>
                      <p className={`${isEditPersonalData && "d-none"} `}>
                        {personalData.username}
                      </p>
                      <hr className={`${isEditPersonalData && "d-none"} `} />
                      <input
                        type="text"
                        className={`${
                          !isEditPersonalData && "d-none"
                        } form-control`}
                        id="name"
                        name="username"
                        placeholder="請輸入姓名"
                        value={personalData.username}
                        required
                        onChange={(event) => {
                          handleChange(event);
                        }}
                      />
                    </div>
                    <div className={`${styles.dataBox} `}>
                      <label className="form-label">性別 :</label>
                      <p className={`${isEditPersonalData && "d-none"} `}>
                        {personalData.gender === "male" ? "男性" : "女性"}
                      </p>
                      <hr className={`${isEditPersonalData && "d-none"} `} />
                      <select
                        className={`${
                          !isEditPersonalData && "d-none"
                        } form-select`}
                        name="gender"
                        required
                        value={personalData.gender}
                        onChange={(event) => {
                          handleChange(event);
                        }}
                      >
                        <option value="">選擇性別</option>
                        <option value="male">男性</option>
                        <option value="female">女性</option>
                      </select>
                    </div>
                    <div className={`${styles.dataBox}`}>
                      <label htmlFor="phone" className="form-label">
                        聯絡電話 :
                      </label>
                      <p className={`${isEditPersonalData && "d-none"} `}>
                        {personalData.cellPhone}
                      </p>
                      <input
                        type="tel"
                        className={`${
                          !isEditPersonalData && "d-none"
                        } form-control`}
                        id="phone"
                        name="cellPhone"
                        placeholder="請輸入聯絡電話"
                        value={personalData.cellPhone}
                        required
                        onChange={(event) => {
                          handleChange(event);
                        }}
                      />
                    </div>
                    <div
                      className={`${styles.dataBox} mb-3 d-flex justify-content-around`}
                    >
                      <div
                        type="button"
                        onClick={() => setIsEditPersonalData(true)}
                        className={` ${isEditPersonalData && "d-none"} ${
                          styles.storeBtn
                        } mt-3`}
                      >
                        編輯
                      </div>
                      <div
                        type="button"
                        onClick={updatePersonalData}
                        className={` ${!isEditPersonalData && "d-none"} ${
                          styles.storeBtn
                        } mt-3`}
                      >
                        儲存
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "orders" && (
              <div className={`card ${styles.orderCard}`}>
                <div style={{ padding: "0" }} className="card-body">
                  {/* 有訂單時才顯示搜索欄位 */}
                  {hasOrderData && (
                    <div className="input-group mb-3">
                      <input
                        onChange={(event) => getOrderSearchString(event)}
                        type="text"
                        className="form-control"
                        placeholder=" 搜尋訂單"
                        aria-label="Search"
                        aria-describedby="button-addon2"
                      />
                      <button
                        onClick={handleSearchProductData}
                        className="btn btn-outline-secondary"
                        type="button"
                        id="button-addon2"
                      >
                        搜尋
                      </button>
                    </div>
                  )}

                  {/* 所有訂單 */}
                  {isUseOrderData &&
                    orderData.map((order, i) => (
                      <div className={styles.order} key={i}>
                        <div className={`${styles.pBox}`}>
                          <p className={`${styles.p}`}>
                            訂單成立時間: {convertToTaiwanTime(order.date)}
                          </p>
                        </div>

                        {order.products.map((product, i) => (
                          <div
                            className={`${styles.orderItem}  mt-1`}
                            key={i}
                          >
                            <div style={{ padding: "10px" }} className="d-flex">
                              {/* 圖片 */}
                              <div className={`${styles.imgBox} me-2`}>
                                <img
                                  className={`${styles.img} `}
                                  src={`${PRODUCT_IMG_URL}/${product.folderName}/1.webp`}
                                />
                              </div>
                              {/* 商品內容文字 */}
                              <div
                                className={`${styles.detailText} d-flex mt-1   align-items-center justify-content-between`}
                              >
                                <p style={{ width: "70%" }}>{product.title}</p>
                                <p style={{ textWrap: "nowrap" }}>
                                  商品價格 : {product.price}
                                </p>
                              </div>
                            </div>
                            {/* 底線 */}
                            <div className={`${styles.hr}`}>
                              <hr />
                            </div>
                          </div>
                        ))}

                        <div
                          style={{ paddingRight: "10px" }}
                          className={`${styles.orderItemPrice} mb-md-3 mb-2 d-flex align-items-center justify-content-end`}
                        >
                          <p style={{ margin: "0" }}>訂單金額 : </p>
                          <h6 style={{ margin: "0" }}>${order.orderTotal}</h6>
                        </div>
                      </div>
                    ))}

                  {/* 沒有訂單時顯示 */}
                  {!hasOrderData && (
                    <div className="d-flex justify-content-center align-items-center flex-column">
                      <img src="/resource/cart/1.png" alt="" />
                      <h3 className="mt-1">目前還沒有訂單</h3>
                    </div>
                  )}

                  {/* 使用搜尋欄位搜索的訂單 */}
                  {isUseSearchData &&
                    searchOrderData.map((order, i) => (
                      <div className={styles.order} key={i}>
                        <div className={`${styles.pBox}`}>
                          <p className={`${styles.p}`}>
                            訂單成立時間: {convertToTaiwanTime(order.date)}
                          </p>
                        </div>

                        {order.products.map((product,i) => (
                          <div
                            className={`${styles.orderItem}  mt-1`}
                            key={i}
                          >
                            <div style={{ padding: "10px" }} className="d-flex">
                              {/* 圖片 */}
                              <div className={`${styles.imgBox} me-2`}>
                                <img
                                  className={`${styles.img} `}
                                  src={`${PRODUCT_IMG_URL}/${product.folderName}/1.webp`}
                                />
                              </div>
                              {/* 商品內容文字 */}
                              <div
                                className={`${styles.detailText} d-flex mt-1   align-items-center justify-content-between`}
                              >
                                <p style={{ width: "70%" }}>{product.title}</p>
                                <p style={{ textWrap: "nowrap" }}>
                                  商品價格 : {product.price}
                                </p>
                              </div>
                            </div>
                            {/* 底線 */}
                            <div className={`${styles.hr}`}>
                              <hr />
                            </div>
                          </div>
                        ))}

                        <div
                          style={{ paddingRight: "10px" }}
                          className={`${styles.orderItemPrice} mb-md-3 mb-2 d-flex align-items-center justify-content-end`}
                        >
                          <p style={{ margin: "0" }}>訂單金額 : </p>
                          <h6 style={{ margin: "0" }}>${order.orderTotal}</h6>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </NoFooterLayout>
  );
}
