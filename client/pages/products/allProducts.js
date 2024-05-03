import Layout from "../../components/layout";
import DropdownMenu from "../../components/dropdownMenu";
import { SlMagnifier } from "react-icons/sl";
import { useState, useContext, useEffect } from "react";
import { DataContext } from "../_app.js";
import styles from "../../styles/pages/allProducts.module.css";
import Link from "next/link";
import ProductService from "../../public/services/allProducts.services.js";

/** 創建頁面所需的數據 */
export async function getStaticProps() {
  const result = await ProductService.getAll();
  const productData = result.data;
  return { props: { productData } };
}

export default function AllProducts({ productData }) {
  // =================================== 常數 ===================================

  /** 依價格排序:低至高 */
  const SORT_PRICE_LOW_TO_HIGH = 1;

  /** 依價格排序:高至低 */
  const SORT_PRICE_HIGH_TO_LOW = 2;

  /** 商品卡片的商品資料夾 */
  const PRODUCT_CARD_IMG_URL = "/resource/product";

  /** 取消圓角 style */
  const NO_ROUNDED = { borderRadius: "0" };

  /** 商品頁一頁能顯示的商品數 */
  const ITEMS_PER_PAGE = 12;

  // =================================== useContext ===================================

  /**
   *  @productType 商品種類物件
   *  @currentProductType 當前使用者選擇的商品種類
   *  @setCurrentProductType 當前使用者選擇的商品種類函數 */
  const { productType, currentProductType, setCurrentProductType } =
    useContext(DataContext);

  // =================================== 變數 ===================================

  /** 搜索欄位的 String */
  let searchString = "";

  // =================================== useState ===================================

  /** 排序選單狀態 */
  const [sortType, setSortType] = useState(SORT_PRICE_LOW_TO_HIGH);

  /** 當前使用者選取的商品種類的該種類商品資料 */
  const [selectedProductData, setSelectedProductData] = useState(null);

  /** 當前頁碼的頁數 */
  const [currentPerPage, setCurrentPerPage] = useState(1);

  /** 是否以搜尋的字串搜尋商 */
  const [isSearch, setIsSearch] = useState(false);

  /** 使用搜尋欄位搜尋出來的商品資料 */
  const [searchProductData, setSearchProductData] = useState(null);

  console.log(selectedProductData);

  // =================================== function ===================================

  // ===== 商品搜尋 =====

  /** 使用搜索關鍵字作為參數，然後根據搜索關鍵字過濾商品列表，以顯示與搜索相關的商品
   *  @event input 事件
   *  @return input 關鍵字 */
  const getProductSearchString = (event) => {
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
    setIsSearch(true);
    setSearchProductData(
      productData.filter((product) => product.title.includes(searchString))
    );
  };

  // ===== 頁碼功能 =====

  /** 取得頁碼總頁數
   *  @return 頁碼總頁數 */
  const getTotalPerPage = () => {
    if (selectedProductData) {
      return Math.ceil(selectedProductData.length / ITEMS_PER_PAGE);
    } else {
      return 0; // 或者根據你的邏輯返回其他值
    }
  };

  /** 上一頁 */
  const goToPreviousPage = () => {
    if (currentPerPage > 1) setCurrentPerPage(currentPerPage - 1);
  };

  /** 下一頁 */
  const goToNextPage = () => {
    const totalPerPage = getTotalPerPage();
    if (currentPerPage < totalPerPage) setCurrentPerPage(currentPerPage + 1);
  };

  /** 根據商品頁數，渲染頁碼 */
  const preparePerPageDataToShow = () => {
    const pages = [];
    const totalPerPage = getTotalPerPage();
    for (let i = 1; i <= totalPerPage; i++) {
      pages.push(
        <li
          onClick={() => setCurrentPerPage(i)}
          key={i}
          className={`${styles.li}`}
        >
          <a
            className={`${i === currentPerPage ? styles.aActive : styles.a}`}
            href="#"
          >
            {i}
          </a>
        </li>
      );
    }
    return pages;
  };

  /** 篩選出當前頁的所有商品
   *  @return 當前頁的所有商品資料 */
  const getProductsPerPage = () => {
    return selectedProductData.filter((product, i) => {
      // 當前頁要顯示的商品開始 Index
      let startProductIndex = currentPerPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE;

      // 當前頁要顯示的商品結束 Index
      let endProductIndex = currentPerPage * ITEMS_PER_PAGE - 1;
      return i >= startProductIndex && i <= endProductIndex;
    });
  };

  // ===== 麵包屑功能 =====

  /** 依照使用者選取的商品種類，渲染該商品種類麵包屑
   *  @return 該商品種類麵包屑 html */
  const switchBreadcrumbTypeToShow = () => {
    switch (currentProductType) {
      case productType.all:
        break;

      case productType.cat_product:
        return (
          <li className="breadcrumb-item">
            <Link className={`${styles.breadcrumbLink}`} href="#">
              貓咪商品
            </Link>
          </li>
        );

      case productType.dog_product:
        return (
          <li className="breadcrumb-item">
            <Link className={`${styles.breadcrumbLink}`} href="#">
              狗狗商品
            </Link>
          </li>
        );

      case productType.dog_food_can:
        return (
          <li className="breadcrumb-item">
            <Link className={`${styles.breadcrumbLink}`} href="#">
              狗狗鮮食罐
            </Link>
          </li>
        );

      case productType.cat_food_can:
        return (
          <li className="breadcrumb-item">
            <Link className={`${styles.breadcrumbLink}`} href="#">
              貓咪鮮食罐
            </Link>
          </li>
        );
    }
  };

  // ===== 商品種類功能 =====

  /** 根據使用者選擇的商品種類 (currentProductType)，從全部的商品資料 (productData) 中篩選出相對應的商品資料，
   *  並依照目前的排序種類進行排序 */
  const handleSelectedProductData = () => {
    let newSelectedProductData;

    // 先篩選出當前種類商品
    if (currentProductType === productType.all) {
      newSelectedProductData = productData;
    } else {
      newSelectedProductData = productData.filter(
        (product) => product.type === currentProductType
      );
    }

    // 將篩選出的商品，依照當前排序進行排序
    if (sortType === SORT_PRICE_LOW_TO_HIGH) {
      newSelectedProductData.sort((a, b) => a.price - b.price);
    } else {
      newSelectedProductData.sort((a, b) => b.price - a.price);
    }
    setSelectedProductData(newSelectedProductData);
  };

  // ===== 排序功能 =====

  /** 根據排序種類進行排序 */
  const handleSort = () => {
    if (!selectedProductData) return;
    let sortedProducts = [...selectedProductData];

    if (sortType === SORT_PRICE_LOW_TO_HIGH) {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setSelectedProductData(sortedProducts);
  };

  // =================================== useEffect ===================================

  /**
   *  @handleSelectedProductData 根據使用者選取不同種類的商品，根據商品種類篩選出該商品的全部資料
   *  @sortType 排序種類
   *  @currentProductType 當前使用者選擇的商品種類 */
  useEffect(() => {
    handleSelectedProductData();
  }, [currentProductType, sortType]);

  /** 切換商品種類時，將 currentPerPage 設置為 1*/
  useEffect(() => {
    setCurrentPerPage(1);
  }, [currentProductType]);

  return (
    <Layout>
      <div
        style={{ paddingLeft: "0", paddingRight: "0" }}
        className="container-fluid"
      >
        <div className="banner row ">
          <img src="/resource/allProducts/banner.png" alt="" />
        </div>
      </div>
      <div className="container mt-3">
        {/* 麵包屑和搜尋欄位 */}
        <div className="row justify-content-between align-items-center mb-4">
          <div className="col-lg-3">
            {/* 麵包屑 */}
            <nav aria-label="breadcrumb" className={`${styles.breadcrumb}`}>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className={`${styles.breadcrumbLink}`} href="/">
                    首頁
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link className={`${styles.breadcrumbLink}`} href="">
                    全部商品
                  </Link>
                </li>
                {switchBreadcrumbTypeToShow()}
              </ol>
            </nav>
          </div>

          {/* 搜尋欄位和排序 */}
          <div className="col-lg-9 d-flex justify-content-lg-end justify-content-between">
            {/* 搜尋欄位 */}
            <div className={`${styles.searchField} d-flex me-5`}>
              <input
                onChange={(event) => getProductSearchString(event)}
                type="text"
                className={`${styles.input} form-control`}
                placeholder="幫毛寶貝搜尋產品"
              />
              <div
                style={NO_ROUNDED}
                onClick={handleSearchProductData}
                type="button"
                className={`${styles.btn}`}
              >
                <SlMagnifier className={`${styles.btnIcon}`} />
              </div>
            </div>

            {/* 排序下拉選單 */}
            <DropdownMenu
              SORT_PRICE_LOW_TO_HIGH={SORT_PRICE_LOW_TO_HIGH}
              SORT_PRICE_HIGH_TO_LOW={SORT_PRICE_HIGH_TO_LOW}
              setSortType={setSortType}
              handleSort={handleSort}
            ></DropdownMenu>
          </div>
        </div>

        {/* 商品分類和商品卡片 */}
        <div className="row">
          <div className="col-lg-3 mb-4">
            {/* 商品分類 */}
            <ul className={`${styles.categoryBox} list-group d-flex`}>
              <li
                style={NO_ROUNDED}
                onClick={() => {
                  setCurrentProductType(productType.all);
                }}
                className={` ${styles.category} ${
                  currentProductType === productType.all &&
                  styles.categoryActive
                } list-group-item btn text-start`}
              >
                全部商品
              </li>
              <li
                style={NO_ROUNDED}
                onClick={() => {
                  setCurrentProductType(productType.cat_product);
                }}
                className={`${styles.category} ${
                  currentProductType === productType.cat_product &&
                  styles.categoryActive
                } list-group-item btn text-start`}
              >
                貓咪商品
              </li>
              <li
                style={NO_ROUNDED}
                onClick={() => {
                  setCurrentProductType(productType.dog_product);
                }}
                className={`${styles.category} ${
                  currentProductType === productType.dog_product &&
                  styles.categoryActive
                } list-group-item btn text-start`}
              >
                狗狗商品
              </li>
              <li
                style={NO_ROUNDED}
                onClick={() => {
                  setCurrentProductType(productType.cat_food_can);
                }}
                className={`${styles.category} ${
                  currentProductType === productType.cat_food_can &&
                  styles.categoryActive
                } list-group-item btn text-start`}
              >
                貓咪鮮食罐
              </li>
              <li
                style={NO_ROUNDED}
                onClick={() => {
                  setCurrentProductType(productType.dog_food_can);
                }}
                className={`${styles.category} ${
                  currentProductType === productType.dog_food_can &&
                  styles.categoryActive
                } list-group-item btn text-start`}
              >
                狗狗鮮食罐
              </li>
            </ul>
          </div>

          {/* 商品卡片 */}
          <div className="col-lg-9">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
              {/* 根據種類顯示商品，_id mongoose 裡面存的 id 是 _id 的形式，故要使用 _id  */}
              {selectedProductData &&
                !isSearch &&
                getProductsPerPage().map((product) => (
                  <Link
                    className={`${styles.cardLink}`}
                    key={product._id}
                    href={`/products/${product._id}`}
                  >
                    <div className="col h-100">
                      <div className={`${styles.card} card`}>
                        <img
                          src={`${PRODUCT_CARD_IMG_URL}/${product.folderName}/1.webp`}
                          className="card-img-top"
                          alt={product.title}
                        />
                        <div className="card-body d-flex flex-column">
                          {/* 使用 flex-column 将按钮容器设置为纵向排列 */}
                          <div className="cardTitleBox">
                            <h5 className="card-title">{product.title}</h5>
                          </div>
                          <p className="card-text">NT${product.price}</p>
                          <div className="mt-auto">
                            {/* 使用 mt-auto 将按钮容器推至卡片底部 */}
                            <button href="#" className={`${styles.btn} btn`}>
                              立即購買
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

              {/* 根據搜索欄位顯示商品，_id mongoose 裡面存的 id 是 _id 的形式，故要使用 _id */}
              {searchProductData &&
                isSearch &&
                searchProductData.map((product) => (
                  <Link
                    className={`${styles.cardLink}`}
                    key={product._id}
                    href={`/products/${product._id}`}
                  >
                    <div className="col h-100">
                      <div className={`${styles.card} card`}>
                        <img
                          src={`${PRODUCT_CARD_IMG_URL}/${product.folderName}/1.webp`}
                          className="card-img-top"
                          alt={product.title}
                        />
                        <div className="card-body d-flex flex-column">
                          {/* 使用 flex-column 将按钮容器设置为纵向排列 */}
                          <div className="cardTitleBox">
                            <h5 className="card-title">{product.title}</h5>
                          </div>
                          <p className="card-text">NT${product.price}</p>
                          <div className="mt-auto">
                            {/* 使用 mt-auto 将按钮容器推至卡片底部 */}
                            <button href="#" className={`${styles.btn} btn`}>
                              立即購買
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

              {/* 找不到商品時顯示 */}
              {searchProductData &&
                searchProductData.length === 0 &&
                isSearch && (
                  <div className="col  mx-auto my-auto">
                    <h5>沒有符合的商品</h5>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* 商品頁碼 */}
        <div className="row mt-5">
          <div className="col">
            {/* <nav className={`${styles.pageBox}`} aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li className={`${styles.pageItem} page-item`} onClick={goToPreviousPage} >
                  <a className="page-link" href="#" aria-label="Previous">
                    <span className={`${styles.span}`} aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                {selectedProductData && preparePerPageDataToShow()}
                <li className={`${styles.pageItem} page-item`} onClick={goToNextPage} >
                  <a className="page-link" href="#" aria-label="Next">
                    <span className={`${styles.span}`} aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </ul>
            </nav> */}
            <ul className={`${styles.pagination}`}>
              <li onClick={goToPreviousPage} className={`${styles.li}`}>
                <a className={`${styles.a}`} href="#">
                  &laquo;
                </a>
              </li>
              {preparePerPageDataToShow()}
              <li onClick={goToNextPage} className={`${styles.li}`}>
                <a className={`${styles.a}`} href="#">
                  &raquo;
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
