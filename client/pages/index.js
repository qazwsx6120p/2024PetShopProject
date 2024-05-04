import Layout from "../components/layout";
import Link from "next/link";
import styles from "../styles/pages/index.module.css";

export default function Home() {
  return (
    <Layout>
      {/* 輪播 banner */}
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={0}
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={1}
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={2}
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              className="d-block w-100"
              src="/resource/index/banner1.webp"
              alt=""
            />
            <div className="carousel-caption d-none d-md-block"></div>
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100"
              src="/resource/index/banner2.webp"
              alt=""
            />
            <div className="carousel-caption d-none d-md-block"></div>
          </div>
          <div className="carousel-item">
            <img
              className="d-block w-100"
              src="/resource/index/banner3.webp"
              alt=""
            />
            <div className="carousel-caption d-none d-md-block"></div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* 送貨圖文-手機以上 */}
      <div className="container mt-4 d-none d-md-block">
        <div className="row justify-content-center">
          <div className=" col-md-3 col-4">
            <img
              className="w-100 "
              src="/resource/index/picturesAndText2.webp"
              alt=""
            />
          </div>
          <div className=" col-md-3 col-4">
            <img
              className="w-100 "
              src="/resource/index/picturesAndText1.webp"
              alt=""
            />
          </div>
          <div className=" col-md-3 col-4">
            <img
              className="w-100 "
              src="/resource/index/picturesAndText3.webp"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* 送貨圖文-手機以下 */}
      <div className="d-flex d-block d-md-none justify-content-center mt-5">
        <img
          className={`${styles.picturesAndText}`}
          src="/resource/index/picturesAndText2RWD.webp"
          alt=""
        />
        <img
          className={`${styles.picturesAndText}`}
          src="/resource/index/picturesAndText1RWD.webp"
          alt=""
        />
        <img
          className={`${styles.picturesAndText}`}
          src="/resource/index/picturesAndText3RWD.webp"
          alt=""
        />
      </div>

      {/* 產品連結 container  */}
      <div className="container mt-3">
        <div className="row  justify-content-center">
          <div className={`${styles.cardLink} col-12 col-md-3`}>
            <Link
              style={{ textDecoration: "none" }}
              href="/products/allProducts"
            >
              <div style={{ border: "none" }} className="card">
                <img
                  className="card-img card-img-top"
                  src="/resource/index/1.png"
                  alt=""
                />
                <div className="card-body text-center">
                  <h5 className="card-title">全部產品</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className={`${styles.cardLink} col-12 col-md-3`}>
            <Link
              style={{ textDecoration: "none" }}
              href="/products/allProducts"
            >
              <div style={{ border: "none" }} className="card">
                <img
                  className="card-img card-img-top"
                  src="/resource/index/2.png"
                  alt=""
                />
                <div className="card-body text-center">
                  <h5 className="card-title">貓咪產品</h5>
                </div>
              </div>
            </Link>
          </div>
          <div className={`${styles.cardLink} col-12 col-md-3`}>
            <Link
              style={{ textDecoration: "none" }}
              href="/products/allProducts"
            >
              <div style={{ border: "none" }} className="card">
                <img
                  className="card-img card-img-top"
                  src="/resource/index/3.png"
                  alt=""
                />
                <div className="card-body text-center">
                  <h5 className="card-title">狗狗產品</h5>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 花邊裝飾圖片 */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9">
            <img
              className={`w-100 d-none d-sm-block`}
              src="/resource/index/lace.webp"
              alt=""
            />
            <img
              className={`w-100 d-sm-none d-block`}
              src="/resource/index/laceRwd.png"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* 圖文 */}
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col d-none d-md-block">
            <img
              className="w-100"
              src="/resource/index/picturesAndText4.png"
              alt=""
            />
          </div>
          <div className="col d-block d-md-none">
            <img
              className={`${styles.picturesAndText4}`}
              src="/resource/index/picturesAndText4RWD.png"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* 花邊裝飾圖片 */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9">
            <img
              className={`w-100 d-none d-sm-block`}
              src="/resource/index/lace.webp"
              alt=""
            />
            <img
              className={`w-100 d-sm-none d-block`}
              src="/resource/index/laceRwd.png"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* 圖文 */}
      <div className="container mt-5 mb-5">
        <div className="row">
          <div className="col d-none d-md-block">
            <img
              className="w-100"
              src="/resource/index/picturesAndText5.png"
              alt=""
            />
          </div>
          <div className="col d-block d-md-none">
            <img
              className={`${styles.picturesAndText5}`}
              src="/resource/index/picturesAndText5RWD.png"
              alt=""
            />
          </div>
        </div>
      </div>

   

      {/* 熱門商品 */}
      {/* <div className="container mt-5">
        <div className="row  row-cols-2 row-cols-md-2 row-cols-lg-4 g-xl-2">
          <div className="col my-2 d-flex justify-content-center">
            <div
              style={{ borderRadius: "0" }}
              className={`${styles.customCard}  card h-100`}
            >
              <img src="https://picsum.photos/300/200?random=10" alt="" />
              <div className="card-body">
                <h5 className="card-title">
                  貓主食罐｜98% 鮮肉無膠主食罐｜台灣首款無膠主食罐
                </h5>
                <h6>NT$350</h6>
                <a
                  style={{ borderRadius: "0" }}
                  href="#"
                  className="btn btn-primary"
                >
                  立即購買
                </a>
              </div>
            </div>
          </div>
          <div className="col my-2 d-flex justify-content-center">
            <div
              style={{ borderRadius: "0" }}
              className={`${styles.customCard} card h-100`}
            >
              <img src="https://picsum.photos/300/200?random=10" alt="" />
              <div className="card-body">
                <h5 className="card-title">
                  貓主食罐｜98% 鮮肉無膠主食罐｜台灣首款無膠主食罐
                </h5>
                <h6>NT$350</h6>
                <a
                  style={{ borderRadius: "0" }}
                  href="#"
                  className="btn btn-primary"
                >
                  立即購買
                </a>
              </div>
            </div>
          </div>
          <div className="col my-2 d-flex justify-content-center">
            <div
              style={{ borderRadius: "0" }}
              className={`${styles.customCard} card h-100`}
            >
              <img src="https://picsum.photos/300/200?random=10" alt="" />
              <div className="card-body">
                <h5 className="card-title">
                  貓主食罐｜98% 鮮肉無膠主食罐｜台灣首款無膠主食罐
                </h5>
                <h6>NT$350</h6>
                <a
                  style={{ borderRadius: "0" }}
                  href="#"
                  className="btn btn-primary"
                >
                  立即購買
                </a>
              </div>
            </div>
          </div>
          <div className="col my-2 d-flex justify-content-center">
            <div
              style={{ borderRadius: "0" }}
              className={`${styles.customCard} card h-100`}
            >
              <img src="https://picsum.photos/300/200?random=10" alt="" />
              <div className="card-body">
                <h5 className="card-title">
                  貓主食罐｜98% 鮮肉無膠主食罐｜台灣首款無膠主食罐
                </h5>
                <h6>NT$350</h6>
                <a
                  style={{ borderRadius: "0" }}
                  href="#"
                  className="btn btn-primary"
                >
                  立即購買
                </a>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </Layout>
  );
}
