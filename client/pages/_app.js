"use client";
import "../styles/globals.css";
import React, { useState, createContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";
export const DataContext = createContext();

export default function App({ Component, pageProps }) {
  // =================================== useEffect ===================================

  // 處理 bs5 JS 不能運作的問題
  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap")
      : null;
  }, []);

  // =================================== 常數 ===================================

  /** 商品種類物件 */
  const productType = {
    // 全部商品
    all: "all",

    // 狗狗商品
    dog_product: "dog_product",

    // 貓咪商品
    cat_product: "cat_product",

    // 狗狗鮮食罐
    dog_food_can: "dog_food_can",

    // 貓咪鮮食罐
    cat_food_can: "cat_food_can",
  };

  // =================================== useState ===================================

  /** 商品種類狀態 */
  const [currentProductType, setCurrentProductType] = useState(productType.all);

  /** header 高度 */
  const [headerHeight, setHeaderHeight] = useState(0);

  /** 商品種類狀態 */
  const [ssrCompleted, setSsrCompleted] = useState(false);

  /** 使用者是否登入 */
  const isLogin = () => {
    if (ssrCompleted) {
      const userString = localStorage.getItem("user");
      if (userString) {
        return JSON.parse(userString);
      }
    }
    return false;
  };

  // =================================== useEffect ===================================

  /** 確認目前 SSR 是否已經的結束 */
  useEffect(() => setSsrCompleted(true), []);

  return (
    <DataContext.Provider
      value={{
        headerHeight,
        productType,
        currentProductType,
        setCurrentProductType,
        isLogin,
        headerHeight,
        setHeaderHeight,
      }}
    >
      <Component {...pageProps} />;
    </DataContext.Provider>
  );
}
