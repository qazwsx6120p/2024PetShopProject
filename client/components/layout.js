import React, { useContext } from "react";
import Head from "next/head";
import Footer from "./footer";
import Header from "./header";
import styles from "./styles/layout.module.css";
import { DataContext } from "../pages/_app.js";

export default function Layout({ children }) {
  // =================================== useContext ===================================
  const {
    productType,
    currentProductType,
    setCurrentProductType,
    headerHeight,
    footerHeight,
    ssrCompleted,
  } = useContext(DataContext);

  // =================================== 函數 ===================================

  /**
   *  @minHeight 設定 Main 的最小高度
   *  @marginTop 因為使用 fixed 將 header 貼至頂部，故 Main 要使用 marginTop 退下去，
   *  才不會與 header 重疊 */
  const getMainStyle = () => {
    if (!ssrCompleted) {
      return;
    }
    const __nextHeight = 24;
    const mainHeight = headerHeight + footerHeight + __nextHeight;

    return {
      marginTop: headerHeight,
      minHeight: `calc(100% - ${mainHeight}px)`,
    };
  };

  return (
    <div style={{ height: "100%" }}>
      {/* head 資訊，bootstrap5 CDN 連結 / bootstrap5 script */}
      <Head>
        <title>寵物網站</title>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Header
        productType={productType}
        currentProductType={currentProductType}
        setCurrentProductType={setCurrentProductType}
      ></Header>
      {/* 為主要組件的內容，用 marginTop 將內容往下推 header 的高度 */}
      <main style={getMainStyle()}>{children}</main>
      <Footer></Footer>
    </div>
  );
}
