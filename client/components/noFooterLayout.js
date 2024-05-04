import React, { useContext } from "react";
import Head from "next/head";
import Header from "./header.js";
import styles from "./styles/noFooterLayout.module.css";
import { DataContext } from "../pages/_app.js"; // 导入 _app.js 中的 DataContext

export default function NoFooterLayout({ children }) {
  // ========= useContext =========
  const { productType, currentProductType, setCurrentProductType,headerHeight } =
    useContext(DataContext); // 使用 useContext 来訪問上下文

  return (
    <div className={`${styles.layoutContainer}`}>
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
      <main style={{marginTop:headerHeight}} className={`${styles.mainContent}`}>{children}</main>
    </div>
  );
}
