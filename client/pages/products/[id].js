import Layout from "../../components/layout";
import { useState, useEffect, useContext } from "react";
import React from "react";
import { useRouter } from "next/router";
import styles from "../../styles/pages/productDetail.module.css";
import ProductService from "../../public/services/allProducts.services.js";
import ShoppingCartService from "../../public/services/shoppingCart.services.js";
import { DataContext } from "../_app.js";
import Link from "next/link";

/** 依照商品數量創建 html 並生成動態路由 */
export async function getStaticPaths() {
  const result = await ProductService.getAll();
  const data = result.data;
  const paths = data.map((product) => {
    return {
      params: {
        id: product._id.toString(), // 改為 id
      },
    };
  });
  return { paths, fallback: false };
}
/** 創建頁面所需的數據 */
export async function getStaticProps({ params }) {
  const result = await ProductService.getProductByID(params.id);
  const productData = result.data;
  return {
    props: {
      productData,
    },
  };
}

export default function ProductDetail({ productData }) {
  // =================================== useRouter ===================================

  const router = useRouter();

  // =================================== useContext ===================================

  /**  @setCurrentUser 設定當前使用者函數 */
  const { isLogin, productType, currentProductType } = useContext(DataContext);

  // =================================== 常數 ===================================

  /** 商品卡片的商品資料夾 */
  const PRODUCT_CARD_IMG_URL = "/resource/product";

  /** 當前商品圖片選取樣式 ( 透明度 100 / 外框線 ) */
  const IMG_ACTIVE = {
    opacity: "1",
    border: "1px solid rgba(0, 0, 0, 0.277)",
  };

  /** 商品詳細區的按鈕選取樣式 */
  const BTN_ACTIVE = {
    color: "white",
    backgroundColor: "#6c5c53",
    borderRadius: "10rem",
  };

  /** 商品詳細區的按鈕狀態 */
  const BTN = {
    DESCRIBE: "DESCRIBE",
    QA: "QA",
  };

  /** 去除圓角 */
  const NO_ROUNDED = { borderRadius: "0" };

  /** 通用注意事項 */
  const precautions = [
    "※ 由於重量限制，單筆購買 4 件以上商品將僅提供宅配服務。",
    "※ 訂購的部分商品可能在運送過程中出現真空漏氣情況，這是正常現象並不會影響商品品質，請放心使用。",
    "※ 為保障商品完整，所有貨物（如同一訂單內有多件商品）均以獨立包裝方式配送，可能會在不同時間段送達。",
    "※ 訂單一經確認，將無法更改送貨地址，請務必仔細確認資料後再進行結帳。",
    "※ 如對商品品質或訂單有任何疑問，請在收貨後的 3 天內與我們聯繫，我們將竭誠為您服務。",
  ];

  // =================================== useState ===================================

  /** 商品圖片的 Url ( index 前四為商品圖片 / 後四為商品宣傳圖文 ) */
  const [imagesUrl, setImagesUrl] = useState([]);

  /** 商品詳細區的按鈕狀態 */
  const [btnState, setBtnState] = useState(BTN.DESCRIBE);

  /** 當前大圖的圖片索引 */
  const [currentMainImgIndex, setCurrentMainImgIndex] = useState(0);

  // =================================== function ===================================

  /** 初始化時處理商品圖片的路徑並存放置
   *  @imagesUrl 狀態 */
  const handleImagesUrl = () => {
    const imagesUrlArray = Array.from({ length: 7 }, (_, i) => {
      return `${PRODUCT_CARD_IMG_URL}/${productData.folderName}/${i + 1}.webp`;
    });
    setImagesUrl(imagesUrlArray);
  };

  /** 處理 描述 & QA 按鈕狀態  */
  const handleBtnActive = (type) => {
    type === BTN.DESCRIBE ? setBtnState(BTN.DESCRIBE) : setBtnState(BTN.QA);
  };

  /** 渲染注意事項 */
  const handlePrecautionsStyleAndRender = () => {
    return precautions.map((precaution, i) => (
      <p key={i} className={`${styles.precautions} mt-1 mb-1`}>
        {precaution}
      </p>
    ));
  };

  /** 處理商品小圖的樣式，依照當前使用者顯取的圖片 */
  const handleSecondaryImagesStyleAndRender = () => {
    if (!imagesUrl) return;

    // 圖片小圖的樣式
    const imgBoxStyle = {
      first: styles.firstSecondaryImgBox,
      middle: styles.middleSecondaryImgBox,
      last: styles.lastSecondaryImgBox,
    };

    return imagesUrl.map((url, i) => {
      if (i < 4) {
        const currentSelect = i === currentMainImgIndex; // 當前選擇的圖片
        const firstImgBox = i === 0; // 第一張圖
        const middleImgBox = i === 1 || i === 2; // 第二/三張圖
        const lastImgBox = i === 3; // 第四張圖
        return (
          // 小圖的容器
          <div
            onClick={() => setCurrentMainImgIndex(i)}
            key={i}
            style={{ ...NO_ROUNDED, ...(currentSelect ? IMG_ACTIVE : null) }}
            className={`
              btn 
              ${styles.secondaryImgBox} 
              ${firstImgBox && imgBoxStyle.first}  
              ${middleImgBox && imgBoxStyle.middle}
              ${lastImgBox && imgBoxStyle.last}
            `}
          >
            <img
              className={styles.secondaryImg}
              src={url}
              alt={productData.title}
            />
          </div>
        );
      }
    });
  };

  /** 將商品加入購物車 */
  const handleProductAddToCart = async () => {
    if (!isLogin()) {
      alert(`請先登入，才能夠將商品加入購物車`);
      router.push("/user/login");
    }
    try {
      await ShoppingCartService.addToCart(productData._id);
      alert(`已成功將 ${productData.title} 加入購物車`);
      router.push("/cart/shoppingCart"); // 重定向至首页
    } catch (error) {
      console.log(error);
    }
  };

  /** 根據商品種類變化麵包屑文字 */
  const handleSwitchBreadcrumbLink = () => {
    switch (currentProductType) {
      case productType.all:
        return (
          <li className="breadcrumb-item">
            <Link
              className={styles.breadcrumbLink}
              href="/products/allProducts"
            >
              全部商品
            </Link>
          </li>
        );

      case productType.cat_product:
        return (
          <li className="breadcrumb-item">
            <Link
              className={`${styles.breadcrumbLink}`}
              href="/products/allProducts"
            >
              貓咪商品
            </Link>
          </li>
        );

      case productType.dog_product:
        return (
          <li className="breadcrumb-item">
            <Link
              className={`${styles.breadcrumbLink}`}
              href="/products/allProducts"
            >
              狗狗商品
            </Link>
          </li>
        );

      case productType.dog_food_can:
        return (
          <li className="breadcrumb-item">
            <Link
              className={`${styles.breadcrumbLink}`}
              href="/products/allProducts"
            >
              狗狗鮮食罐
            </Link>
          </li>
        );

      case productType.cat_food_can:
        return (
          <li className="breadcrumb-item">
            <Link
              className={`${styles.breadcrumbLink}`}
              href="/products/allProducts"
            >
              貓咪鮮食罐
            </Link>
          </li>
        );
    }
  };

  // =================================== useEffect ===================================

  useEffect(() => {
    console.log("向後端取得當前商品資料:", productData);
    handleImagesUrl();
  }, []);

  return (
    <Layout>
      <div className={`container ${styles.productDetailContainer}`}>
        {/* 麵包屑 */}
        <nav aria-label="breadcrumb">
          <ol className={`${styles.breadcrumb} breadcrumb`}>
            <li className="breadcrumb-item">
              <Link className={styles.breadcrumbLink} href="/">
                首頁
              </Link>
            </li>
            {handleSwitchBreadcrumbLink()}
            <li className="breadcrumb-item active" aria-current="page">
              {productData.title}
            </li>
          </ol>
        </nav>

        <div className="row  justify-content-center">
          {/* 左側商品圖 */}
          <div className="col-md-4 col-12">
            {/* 大圖 */}
            <div className={styles.mainImgBox}>
              <img
                src={imagesUrl[currentMainImgIndex]}
                alt=""
                className={styles.mainImg}
              />
            </div>

            {/* 小圖 */}
            <div className={`${styles.secondaryImgContainer} w-100 d-flex`}>
              {handleSecondaryImagesStyleAndRender()}
            </div>
          </div>

          {/* 右側商品資料 */}
          <div className="col-md-4">
            <div className={styles.productInfoContainer}>
              <h3>{productData.title}</h3>
              <hr></hr>
              <div className={`${styles.description} mt-3 mb-3`}>
                <p>
                  {/* 資料庫的詳細文字是用 \n 做分隔*/}
                  {productData.description.split("\n").map((description, i) => (
                    <React.Fragment key={i}>
                      {description}
                      <br />
                    </React.Fragment>
                  ))}
                </p>
              </div>

              <h4 className={`mt-3 mb-3`}>NT${productData.price}</h4>
              {handlePrecautionsStyleAndRender()}
              <button
                onClick={handleProductAddToCart}
                className={`${styles.btnColor} btn mt-4 mb-4`}
                disabled={!isLogin()}
              >
                加入購物車
              </button>
              {!isLogin() && <p>※ 此商品限登入會員購買</p>}
            </div>
          </div>
        </div>

        {/* 線 */}
        <div className="row justify-content-center br">
          <div className="col-md-8 col-12 ">
            <hr></hr>
          </div>
        </div>

        {/* 商品詳細宣傳圖文 */}
        <div
          className={`${styles.graphicsAndTextBlock} row mt-2 justify-content-center`}
        >
          <div className=" col-md-8 col-12 mb-3">
            <div
              onClick={() => handleBtnActive(BTN.DESCRIBE)}
              style={btnState === BTN.DESCRIBE ? BTN_ACTIVE : null}
              className={`btn ${styles.graphicsAndTextBtn}`}
            >
              描述
            </div>
            <div
              onClick={() => handleBtnActive(BTN.QA)}
              style={btnState === BTN.QA ? BTN_ACTIVE : null}
              className={`btn ${styles.graphicsAndTextBtn}`}
            >
              Q&A
            </div>
          </div>
          <div className="col-md-8 col-12">
            {btnState === BTN.DESCRIBE &&
              imagesUrl.map((url, i) => {
                if (i >= 4) {
                  return (
                    btnState === BTN.DESCRIBE && (
                      <img key={i} className="w-100" src={url} alt="" />
                    )
                  );
                }
              })}
            {btnState === BTN.QA && (
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      物流沒辦法配送 ?
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p>
                        無法合併配送，需麻煩分開下單喔！ <br />
                        因為配合物流調整運送規範，2019 年 5
                        月起，汪喵常溫與冷凍品項採分開配送，在官網購買冷凍商品（如汪喵沙西米、生食新手包）與常溫商品（如罐罐、凍乾、零嘴、保健品）需要請毛拔麻分開下單喔！
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      付款方式
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p>
                        【 信用卡 】 <br />
                        汪喵採用的信用卡付款系統有兩個：Epay、Tpay，如遇到信用卡因為單一系統無法刷過，可換另一個系統刷刷看，並且聯繫客服確認是否有刷卡成功，如未確認又遇上刷卡失敗，該訂單會自動轉成取消。
                        <br />
                        <br />
                        【 LINE PAY 】 只要手機 LINE PAY <br />
                        有綁定信用卡，就可選擇此付款。如果是用電腦版購物的毛拔麻，可以在最後結帳頁＞
                        選擇 LINE PAY 後，直接拿手機掃完畫面中條碼進入LINE
                        付款頁，不須另外輸入信用卡號，還能折抵 LINE POINTS
                        超方便！ 【街口支付】
                        開通「街口支付工具」帳戶，並完成綁定信用卡或連結銀行帳戶，即可使用此付款方式。
                        若採手機結帳，會由系統自動跳轉至支付工具的付款流程。
                        若採電腦結帳，只要在結帳頁選擇「街口支付」＞手機開啟街口支付選擇「掃描條碼」＞掃描QRcode付款，最後確認結帳金額等資訊，即可快速完成付款程序囉！
                        <br />
                        <br />
                        【 超商代碼繳費 】 <br />
                        汪喵會提供一組付款序號，請依照序號的截止日期內盡快繳費。
                        ＊此服務尚未開放海外訂購
                        ＊繳費完成才會出貨，如未繳費商品不會出貨，請毛拔麻們注意！
                        ＊產生的條碼均可至 7-11、萊爾富、全家、OK
                        便利商品的機台進行繳費動作，若不熟可以詢問店員指示操作。
                        ＊選用此付款方式不代表商品是使用超商取貨，請毛拔麻們特別留意！
                        <br />
                        <br />
                        【 ATM 轉帳 】 若選擇 ATM <br />
                        轉帳付款，在確認訂單後，請依照系統指示步驟，選擇欲轉帳之銀行後，系統將自動產生一組匯款帳號，並且到
                        ATM 機台選擇繳費，就可以使用後續動作。 <br />
                        ＊此服務尚未開放海外訂購 <br />
                        ＊付款完後系統會自動告知並且更新動態，無需另外告知。
                        <br />
                        ＊部分銀行入帳時間比較晚，可能會有耽誤到出貨時間，如是急件商品建議選擇其他付款方式。
                        <br />
                        <br />
                        【 宅配貨到付款 】 <br />
                        此服務適用於全品項商品，商品到達時請將金額轉交給貨運人員，只可付現金，無法使用其他付款方式。
                        <br />
                        ＊此服務尚未開放海外訂購 ＊如遇到商品超過 7
                        天未領取退回，次數達三次以上，汪喵有權利決定是否繼續該帳號的貨到付款服務，請毛拔麻們善用汪喵提供的權利。
                        <br />
                        <br />
                        【 超商貨到付款 】 <br />
                        常溫商品為7-11取貨付款、冷凍商品為全家取貨付款，收到汪喵的出貨簡訊後隔
                        2~3 天後均可自行到超商取貨付款。 <br />
                        ＊此服務尚未開放海外訂購 <br />
                        ＊部分超商取貨時會需要出示證件，請毛麻們多加注意，並記得攜帶證件前往唷。
                        <br />
                        ＊如遇到商品超過 7
                        天未領取退回，次數達三次以上，汪喵有權利決定是否繼續該帳號的貨到付款服務，請務必留心。
                        <br />
                        <br />
                        ※※ 網路交易注意事項 ※※ <br />
                        在此特別提醒毛拔麻！汪喵星球與全體工作人員，均不會主動致電要求毛拔麻們至提款機操作任何功能，請小心勿上當，網路詐騙案件層出不窮、手法也不斷更新，若接獲不明人士來電，應立即撥打
                        165 防詐騙專線查詢或撥電話至汪喵客服專線 (02) 2546-4922
                        查證喔。
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      發票
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p>
                        關於發票，汪喵提供五種方式 …<br />
                        <br />
                        毛拔麻可以選擇：
                        <br />
                        1. 捐贈發票 ＞直接輸入捐贈機構（ 共 3 種動物救援團體 ）
                        <br />
                        2. 會員載具 ＞即是會員當時輸入的郵件信箱
                        <br />
                        3. 自然人憑證 ＞
                        需要至財政部申請自然人憑證會獲得一組條碼，輸入即可存入發票資訊。
                        <br />
                        4. 手機條碼 ＞
                        需要至財政部申請手機條碼，輸入條碼後可以直接進行後續對獎動作。
                        <br />
                        5.統一編號 ＞
                        如有需要報帳或是公司行號請務必輸入統一編號。
                        <br />
                        <br />
                        以上發票都是使用電子發票進行，如有錯誤請馬上聯繫客服人員進行後續變更。
                        <br />
                        <br />
                        其他詳細介紹，可至財政部電子發票整合服務平台查詢（https://www.einvoice.nat.gov.tw/
                        ）。
                        <br />
                        <br />
                        【 發票捐贈 】 汪喵捐贈機構有三家：台灣動物不再流浪協會
                        /
                        <br />
                        財團法人臺北市支持流浪貓絕育計畫協會 ／
                        財團法人惠光導盲犬教育基金會
                        毛拔麻輸入愛心碼後會直接捐贈給單位，中獎後汪喵會有記錄，捐贈機構即可以直接領取愛心獎金。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
