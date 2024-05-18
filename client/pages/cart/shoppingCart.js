import styles from "../../styles/pages/shoppingCart.module.css";
import { RxCrossCircled } from "react-icons/rx";
import NoFooterLayout from "../../components/noFooterLayout";
import React, { useEffect, useRef, useState, useContext } from "react";
import { useRouter } from "next/router";
import ShoppingCartServices from "../../public/services/shoppingCart.services";
import Link from "next/link";
import { DataContext } from "../_app.js";

export default function ShoppingCart() {
  // =================================== useContext ===================================

  /**  @isLogin 當前是否登入函數 */
  const { headerHeight, isLogin } = useContext(DataContext);
  // =================================== 常數 ===================================

  /** 商品卡片的商品資料夾 */
  const PRODUCT_CARD_IMG_URL = "/resource/product";

  /** 運費 */
  const FREIGHT = 100;

  // =================================== useRef ===================================

  const cartCol = useRef(null);
  const checkoutBox = useRef(null);

  // =================================== useState ===================================

  /** main元素高度 */
  const [mainHeight, setMainHeight] = useState(0);

  /** 商品數量 */
  const [quantity, setQuantity] = useState(1);

  /** 購物車列表 */
  const [cartList, setCartList] = useState([]);

  /** 購物車列表的所有總計金額陣列 */
  const [productTotalPrice, setProductTotalPrice] = useState(0);

  /** 當前正在更改數量的商品id */
  const [curEditQuantityProductId, setCurEditQuantityProductId] =
    useState(null);

  // =================================== useRouter ===================================

  const router = useRouter();

  // =================================== 函數 ===================================

  /** 處理結帳 */
  const handleCheckout = async (orderTotal) => {
    try {
      await ShoppingCartServices.checkout(cartList, orderTotal);
      setCartList([]);
      alert("結帳成功，您現在將被導向訂單頁面");
      router.push("/user/personalPage");
    } catch (error) {
      console.log(error);
    }
  };

  /** 獲取購物車列表 */
  const getCartList = async () => {
    try {
      const response = await ShoppingCartServices.get();
      setCartList(response.data.shoppingCartList);
      console.warn("取得使用者購物車資料", response);
    } catch (error) {
      if (!isLogin()) {
        console.log("使用者尚未登入");
        return;
      }
      console.log(error);
    }
  };

  /** 清除所有購物車資料  */
  const handleClearCart = async () => {
    try {
      const response = await ShoppingCartServices.clearCart();
      setCartList(response.data.shoppingCartList);
      console.warn("清除所有購物車", response);
    } catch (error) {
      console.log(error);
    }
  };

  /** 將特定 id 的商品從購物車刪除 */
  const handleRemoveProductFromCartById = async (id) => {
    try {
      const response = await ShoppingCartServices.removeProductFromCartById(id);
      setCartList(response.data.shoppingCartList);
      console.warn("將特定商品從購物車刪除", response);
    } catch (error) {
      if (!isLogin()) {
        console.log("使用者尚未登入");
        return;
      }
      console.log(error);
    }
  };

  /** 修改特定 id 的商品數量 */
  const handleEditProductQuantityById = async (id, newQuantity) => {
    try {
      const response = await ShoppingCartServices.editProductQuantityById(
        id,
        newQuantity
      );
      setCartList(response.data.shoppingCartList);
      console.warn("修改特定商品數量", response);
    } catch (error) {
      if (!isLogin()) {
        console.log("使用者尚未登入");
        return;
      }
      console.log(error);
    }
  };

  /** 點擊增加按鈕時只更改相應商品的數量，而不是直接增加一個固定的數量 */
  const handleIncreaseQuantityButton = (id) => {
    const updatedCartList = cartList.map((item) =>
      item.productId === id
        ? { ...item, productNumber: item.productNumber + 1 }
        : item
    );
    setCartList(updatedCartList);
    const productNumber = updatedCartList.find(
      (item) => item.productId === id
    ).productNumber;
    handleEditProductQuantityById(id, productNumber);
  };

  /** 點擊減少按鈕時只更改相應商品的數量，而不是直接減少一個固定的數量 */
  const handleDecreaseQuantityButton = (id) => {
    const updatedCartList = cartList.map((item) =>
      item.productId === id && item.productNumber > 1
        ? { ...item, productNumber: item.productNumber - 1 }
        : item
    );
    setCartList(updatedCartList);
    const productNumber = updatedCartList.find(
      (item) => item.productId === id
    ).productNumber;
    handleEditProductQuantityById(id, productNumber);
  };

  /** 處理單項商品的總計金額 */
  const handleProductTotalPrice = (price, quantity) => {
    const totalPrice = Number(price) * Number(quantity);
    return totalPrice;
  };

  /** 處理 768Px 以上購物渲染 */
  const handleAbove768PxCartListRender = () => {
    if (!cartList)
      return (
        <tr>
          <td colSpan="6">購物車為空</td>
        </tr>
      );
    return cartList.map((productData, i) => {
      return (
        <tr
          key={productData._id}
          className={`${styles.tbodyTr} w-100 ps-2 pe-2`}
        >
          <td className={`${styles.tbodyTrTdFirst}`}>
            <div className={styles.imgBox}>
              <img
                className={styles.img}
                src={`${PRODUCT_CARD_IMG_URL}/${productData.folderName}/${
                  i + 1
                }.webp`}
                alt=""
              />
            </div>
          </td>
          <td className={`${styles.tbodyTrTdTitleBox} `}>
            {productData.title}
          </td>
          <td className={`${styles.tbodyTrTd}`}>
            <div className="w-100 d-flex justify-content-center align-items-center">
              <button
                onClick={() => {
                  handleRemoveProductFromCartById(productData.productId);
                }}
                style={{ whiteSpace: "nowrap" }}
                className={`${styles.p}`}
              >
                <RxCrossCircled
                  className={`me-1 mb-1 ${styles.rxCrossCircled}`}
                />
                刪除
              </button>
            </div>
          </td>
          <td
            style={{ whiteSpace: "nowrap" }}
            className={`${styles.tbodyTrTd}`}
          >
            {"NT$" + productData.price}
          </td>
          <td className={`${styles.tbodyTrTd}`}>
            <div
              className={`${styles.modifyProductQuantityTd} d-flex justify-content-center`}
            >
              <button
                onClick={() => {
                  handleDecreaseQuantityButton(productData.productId);
                }}
                className={`${styles.decreaseQuantity}`}
              >
                -
              </button>
              <div className={`${styles.quantity}`}>
                {productData.productNumber}
              </div>
              <button
                onClick={() => {
                  handleIncreaseQuantityButton(productData.productId);
                }}
                className={`${styles.increaseQuantity} `}
              >
                +
              </button>
            </div>
          </td>
          <td
            style={{ whiteSpace: "nowrap" }}
            className={`${styles.tbodyTrTdLast}`}
          >
            {"NT$" +
              handleProductTotalPrice(
                productData.price,
                productData.productNumber
              )}
          </td>
        </tr>
      );
    });
  };

  /** 處理 768Px 以下購物渲染 */
  const handleBelow768PxCartListRender = () => {
    if (!cartList) return;
    return cartList.map((productData, i) => {
      return (
        <div
          key={productData._id}
          style={{ width: "100%" }}
          className={`${styles.cartItem} row`}
        >
          {/* 商品圖片/價格 */}
          <div className="col-3  d-flex align-items-center">
            <div className="w-100 d-flex flex-column align-items-center">
              <div className={styles.imgBox}>
                <img
                  className={styles.img}
                  src={`${PRODUCT_CARD_IMG_URL}/${productData.folderName}/${
                    i + 1
                  }.webp`}
                  alt=""
                />
              </div>
              <p className={`${styles.price} mt-2`}>NT$ {productData.price}</p>
            </div>
          </div>
          {/* 商品名稱/數量加減器 */}
          <div className="col-6 h-100 d-flex align-items-center">
            <p>{productData.title}</p>
          </div>
          <div className="col-3 h-100 d-flex flex-column my-auto">
            <div className={`${styles.modifyProductQuantityTd} d-flex my-auto`}>
              <button
                onClick={() => {
                  handleDecreaseQuantityButton(productData.productId);
                }}
                className={`${styles.below768PxDecreaseQuantity} text-center`}
              >
                -
              </button>
              <div className={`${styles.below768PxQuantity} text-center`}>
                {productData.productNumber}
              </div>
              <button
                onClick={() => {
                  handleIncreaseQuantityButton(productData.productId);
                }}
                className={`${styles.below768PxIncreaseQuantity} text-center`}
              >
                +
              </button>
            </div>
            <div
              onClick={() => {
                handleRemoveProductFromCartById(productData.productId);
              }}
              className="btn"
            >
              刪除
            </div>
          </div>
        </div>
      );
    });
  };

  /** 處理所有商品的總計金額 */
  const handleTotalProductPrice = () => {
    if (cartList === null) return;

    const totalPrice = cartList.reduce((accumulator, product) => {
      const productTotalPrice = handleProductTotalPrice(
        product.price,
        product.productNumber
      );
      return accumulator + productTotalPrice;
    }, 0);
    setProductTotalPrice(totalPrice);
  };

  // =================================== useEffect ===================================

  useEffect(() => {
    getCartList();
  }, []);

  useEffect(() => {
    handleTotalProductPrice();
  }, [cartList]);

  useEffect(() => {
    const updateHeights = () => {
      // 如果 cartCol.current 或 checkoutBox.current 不存在，直接返回
      if (!cartCol.current || !checkoutBox.current) {
        return;
      }

      // 彈性高度 (依照喜好微調)
      let adjustableHeight = 30;

      // 購物車元素高度
      const cartColHeight = cartCol.current.clientHeight;

      // 結帳元素高度
      const checkoutBoxHeight = checkoutBox.current.clientHeight;

      // window 減去 header 的高度
      const mainContentHeightWithoutElements =
        window.innerHeight - headerHeight;

      let totalHeight;

      // 如果主要內容高度大於購物車元素高度，就使用主要內容高度
      if (
        mainContentHeightWithoutElements >
        cartColHeight + checkoutBoxHeight
      ) {
        totalHeight = mainContentHeightWithoutElements;
        return;
      }

      // 否則，使用購物車元素高度和結帳元素高度的總和
      totalHeight = cartColHeight + checkoutBoxHeight + adjustableHeight;

      setMainHeight(totalHeight);
    };

    // 監聽元素尺寸變化時重新計算高度
    const resizeObserver = new ResizeObserver(() => {
      updateHeights();
    });

    if (cartCol.current) {
      resizeObserver.observe(cartCol.current);
    }
    if (checkoutBox.current) {
      resizeObserver.observe(checkoutBox.current);
    }

    // 清除 ResizeObserver
    return () => {
      resizeObserver.disconnect();
    };
  }, [cartCol.current, checkoutBox.current, headerHeight]); // 確保在 cartList 改變時更新高度

  return (
    <NoFooterLayout>
      <main className={styles.main} style={{ height: mainHeight }}>
        {!isLogin() && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-11 col-lg-9 col-12 ">
                <div
                  style={{ whiteSpace: "nowrap" }}
                  className={`${styles.breadcrumbBox}  mt-4 mb-4 mx-auto d-flex justify-content-center align-items-center`}
                >
                  <div>購物車 / 運送&付款</div>
                </div>
                <div className="align-items-center d-flex flex-column">
                  <div>
                    <img src="/resource/cart/1.png" alt="" />
                    <h3 className="mt-1">請家長們先登入</h3>
                  </div>

                  <Link
                    className={`${styles.goLoginBtn}  mt-3`}
                    href="/user/login"
                  >
                    點我前往登入頁
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        {isLogin() && (
          <div className="container">
            <div className="row  justify-content-center">
              <div ref={cartCol} className="col-md-11 col-lg-9 col-12  ">
                <div
                  style={{ whiteSpace: "nowrap" }}
                  className={`${styles.breadcrumbBox}  mt-4 mb-4 mx-auto d-flex justify-content-center align-items-center`}
                >
                  <div>購物車 / 運送&付款</div>
                </div>
                {/* 購物車沒有商品 */}
                {cartList.length === 0 && (
                  <div
                    className={`${styles.noProductsBox} w-100 d-flex align-items-center justify-content-center`}
                  >
                    <div>
                      <img src="/resource/cart/1.png" alt="" />
                      <h3 className="mt-1">購物車中沒有商品</h3>
                    </div>
                  </div>
                )}

                {/* ========= md 以上顯示的購物車版型 ========= */}
                {cartList.length !== 0 && (
                  <div
                    className={`${styles.cartAbove768} d-md-block d-none w-100 ps-2 pt-2 pe-2 pb-2 d-flex flex-column align-items-center`}
                  >
                    {/* 商品 table */}
                    <table className={`${styles.table} w-100 `}>
                      <thead className={`${styles.thead} w-100`}>
                        <tr className={`${styles.theadTr} w-100 ps-2 pe-2`}>
                          {/* 商品 */}
                          <td className={`${styles.theadTrTdFirst}`}>商品</td>
                          <td className={`${styles.theadTrTd}`}></td>
                          {/* 清空購物車 */}
                          <td className={`${styles.clearShoppingCart}`}>
                            <div className="w-100 d-flex justify-content-center align-items-center ">
                              <button
                                onClick={handleClearCart}
                                style={{ whiteSpace: "nowrap" }}
                                className={`${styles.clearShoppingCartButton} `}
                              >
                                <RxCrossCircled
                                  className={`me-1 mb-1 ${styles.rxCrossCircled}`}
                                />
                                清空購物車
                              </button>
                            </div>
                          </td>
                          {/* 價格 */}
                          <td className={`${styles.theadTrTd}`}>價格</td>
                          {/* 數量 */}
                          <td className={`${styles.theadTrTd}`}>數量</td>
                          {/* 總計 */}
                          <td className={`${styles.theadTrTdLast}`}>總計</td>
                        </tr>
                      </thead>
                      <tbody>
                        {/* 商品 */}
                        {handleAbove768PxCartListRender()}
                      </tbody>
                    </table>

                    {/* 總額計算器 */}
                    <div
                      className={`${styles.totalCalculatorBox}  ps-1 pt-1 pe-1 pb-1`}
                    >
                      <div
                        className={`${styles.itemBox} ps-2 pt-2 pe-2 pb-2  mt-2 mb-2 ms-1 me-1  d-flex justify-content-center flex-column align-items-center`}
                      >
                        {/* 商品總金額 */}
                        <div
                          className={`${styles.item} w-100 d-flex justify-content-between`}
                        >
                          <p>商品總金額</p>
                          <p>NT$ {productTotalPrice}</p>
                        </div>
                        {/* 運費 */}
                        <div
                          className={`${styles.item} w-100 d-flex justify-content-between`}
                        >
                          <p>運費</p>
                          <p>NT$ {FREIGHT}</p>
                        </div>
                        {/* 線 */}
                        <div className={`${styles.item} w-100`}>
                          <hr />
                        </div>
                        {/* 總計 */}
                        <div
                          className={`${styles.item} w-100 d-flex justify-content-between`}
                        >
                          <p>總計</p>
                          <p>NT$ {productTotalPrice + FREIGHT}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========= md 以下顯示的購物車版型 ========= */}
                {cartList.length !== 0 && (
                  <div className=" cartBelow768 d-flex d-block d-md-none flex-column d-md-none d-block mt-5">
                    {/* 購物車標題 */}
                    <div
                      className={`${styles.titleBox} d-flex align-items-center justify-content-between `}
                    >
                      <p className={`${styles.productTitle} ms-2`}>商品</p>
                      <div
                        className={`${styles.clearCart} me-2 d-flex justify-content-center`}
                      >
                        <button
                          onClick={handleClearCart}
                          className={`${styles.button} ms-2`}
                        >
                          <RxCrossCircled
                            style={{ color: "white" }}
                            className="my-auto "
                          />
                          清空購物車
                        </button>
                      </div>
                    </div>
                    <div
                      className={`${styles.itemBoxBelow768px} align-items-center  d-flex flex-column w-100`}
                    >
                      {/* cartItem */}
                      {handleBelow768PxCartListRender()}

                      {/* 總額計算器 */}
                      <div
                        className={`${styles.totalCalculatorBox}  ps-1 pt-1 pe-1 pb-1`}
                      >
                        <div
                          className={`${styles.itemBox} ps-2 pt-2 pe-2 pb-2  mt-2 mb-2 ms-1 me-1  d-flex justify-content-center flex-column align-items-center`}
                        >
                          {/* 商品總金額 */}
                          <div
                            className={`${styles.item} w-100 d-flex justify-content-between`}
                          >
                            <p>商品總金額</p>
                            <p>NT$ {productTotalPrice}</p>
                          </div>
                          {/* 運費 */}
                          <div
                            className={`${styles.item} w-100 d-flex justify-content-between`}
                          >
                            <p>運費</p>
                            <p>NT$ {FREIGHT}</p>
                          </div>
                          {/* 線 */}
                          <div className={`${styles.item} w-100`}>
                            <hr />
                          </div>
                          {/* 總計 */}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 定位於最下方的總額 */}
        {isLogin() && cartList.length !== 0 && (
          <div ref={checkoutBox} className={styles.checkoutBox}>
            <div className="d-flex justify-content-end">
              <div className="d-flex align-items-center">
                <p style={{ margin: "0" }}>
                  總計 NT$ {productTotalPrice + FREIGHT}
                </p>
              </div>
              <button
                onClick={() => handleCheckout(productTotalPrice + FREIGHT)}
                className={`${styles.checkoutBoxBtn} `}
              >
                結帳
              </button>
            </div>
          </div>
        )}
      </main>
    </NoFooterLayout>
  );
}
