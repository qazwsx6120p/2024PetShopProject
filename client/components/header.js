// components/header.js
import { FaUser } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import styles from "./styles/header.module.css";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from "next/link";
import { DataContext } from "../pages/_app.js";
import React, { useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import authServices from "../public/services/auth.services.js";

/** 網站的頂部導覽列，負責顯示網站的標誌、連結以及使用者操作按鈕。在這個組件中，
 *  我們使用了 @ReactIcons 庫來表示使用者、購物車和登出功能。總體來說，這個 Header
 *  組件是網站的重要結構之一，提供了主要的導覽和功能入口，同時也提升了用戶體驗和導航性能。 */
export default function Header({ productType, setCurrentProductType }) {
  // =================================== useRef ===================================

  const header = useRef(null);

  // =================================== 常數 ===================================

  /** navBar 中 a 的顏色 */
  const A_TAG_COLOR = "color: #543b17";

  /** navBar 的背景色 */
  const NAV_BAR_BACKGROUND_COLOR = "rgb(255, 255, 255)";

  // =================================== useContext ===================================

  /**  @setCurrentUser 設定當前使用者函數 */
  const { isLogin, setHeaderHeight } = useContext(DataContext);

  // =================================== useRouter ===================================

  const router = useRouter();

  // =================================== function ===================================

  /** 處理 Navbar 商品連結點擊 */
  const handleNavbarLinkClick = (productType) => {
    setCurrentProductType(productType);
  };

  /** 處理登出 */
  const handelLogOut = () => {
    if (!isLogin()) {
      alert("您還尚未登入");
      return;
    }
    authServices.logout();

    alert("您已經成功登出，將您導向首頁");
    // 重新導向首頁
    if (router) router.push("/");
  };

  // =================================== useEffect ===================================

  // 隨時監聽 header 高度
  useEffect(() => {
    const updateHeights = () => {
      if (header.current) {
        setHeaderHeight(header.current.offsetHeight);
      }
    };

    window.addEventListener("resize", updateHeights);
    updateHeights();
    return () => {
      window.removeEventListener("resize", updateHeights);
    };
  }, [header.current]);

  return (
    <div
      style={{ backgroundColor: NAV_BAR_BACKGROUND_COLOR, padding: "0" }}
      ref={header}
      className={`${styles.containerFluid} container-fluid`}
    >
      <div className={`${styles.messageBox} `}>
        <div className="d-flex h-100 align-items-center justify-content-md-between justify-content-center container">
          <font className={`${styles.font} d-inline-block`}>
            <strong>首購優惠！凍乾主食２小包 $399🔥</strong>
          </font>
          <div className=" d-none d-md-block">
            <div className="d-flex ">
              <Link className={`${styles.p}`} href="/feedingComputer">
                餵食小工具
              </Link>
            </div>
          </div>
        </div>
      </div>
      <nav className={` ${styles.navbar}  navbar navbar-expand-lg container`}>
        <div className="container-fluid">
          <Link className={`${styles.logoA} me-4`} href="/">
            <img
              className={`${styles.logoIMG}`}
              src="/commonResource/logo.png"
              alt=""
            />
          </Link>
          <div
            className={`${styles.navbarTogglerBox} d-block d-lg-none`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <RxHamburgerMenu className={`${styles.hamburger} `} />
          </div>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li
                onClick={() => handleNavbarLinkClick(productType.all)}
                className="nav-item"
              >
                <Link
                  className={`${styles.navBarLink} ${styles.a} nav-link active`}
                  href="/products/allProducts"
                >
                  全部商品
                </Link>
              </li>
              <li
                onClick={() => handleNavbarLinkClick(productType.cat_product)}
                className="nav-item"
              >
                <Link
                  className={`${styles.navBarLink}  ${styles.a} nav-link`}
                  href="/products/allProducts"
                >
                  貓咪商品
                </Link>
              </li>
              <li
                onClick={() => handleNavbarLinkClick(productType.dog_product)}
                className="nav-item"
              >
                <Link
                  className={`${styles.navBarLink} ${styles.a} nav-link`}
                  style={{ color: A_TAG_COLOR }}
                  href="/products/allProducts"
                >
                  狗狗商品
                </Link>
              </li>
              <li
                onClick={() => handleNavbarLinkClick(productType.cat_food_can)}
                className="nav-item"
              >
                <Link
                  className={`${styles.navBarLink} ${styles.a} nav-link`}
                  style={{ color: A_TAG_COLOR }}
                  href="/products/allProducts"
                >
                  貓咪鮮食罐
                </Link>
              </li>
              <li
                onClick={() => handleNavbarLinkClick(productType.dog_food_can)}
                className="nav-item"
              >
                <Link
                  className={`${styles.navBarLink} ${styles.a} nav-link`}
                  style={{ color: A_TAG_COLOR }}
                  href="/products/allProducts"
                >
                  狗狗鮮食罐
                </Link>
              </li>

              {/* 手機顯示 */}
              <li className="nav-item d-md-none d-block">
                <Link
                  className={`${styles.navBarLink} nav-link`}
                  style={{ color: A_TAG_COLOR }}
                  href={"/user/login"}
                >
                  {isLogin() ? "個人頁面" : "登入"}
                </Link>
              </li>
              <li className="nav-item d-md-none d-block">
                <Link
                  className={`${styles.navBarLink} nav-link`}
                  style={{ color: A_TAG_COLOR }}
                  href="/cart/shoppingCart"
                >
                  購物車
                </Link>
              </li>
              <li className="nav-item d-md-none d-block">
                <Link
                  onClick={handelLogOut}
                  className={`${styles.navBarLink} nav-link`}
                  style={{ color: A_TAG_COLOR }}
                  href="/"
                >
                  登出
                </Link>
              </li>
            </ul>

            {/* 電腦顯示 */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-none d-md-block">
              {/* 登入頁面 ""*/}
              <li className={`${styles.iconUserBox}`}>
                <Link href="/user/login">
                  <FaUser className={`${styles.iconUser} ms-2 me-2`} />
                </Link>
              </li>

              {/* 購物車 */}
              <li className={`${styles.iconCartBox}`}>
                <Link href="/cart/shoppingCart">
                  <FaShoppingCart className={`${styles.iconCart} ms-2 me-2`} />
                </Link>
              </li>

              {/* 登出 */}
              <li className={`${styles.iconLogOutBox}`}>
                <IoLogOutOutline
                  onClick={handelLogOut}
                  className={`${styles.iconLogOut} ms-2 me-2`}
                />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
