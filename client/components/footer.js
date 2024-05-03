import styles from "./styles/footer.module.css";
export default function Footer() {
  return (
    <footer className="mt-5" >
      <div className={`${styles.footerBlock} container-fluid`}>
        <div className="container h-100">
          <div className="row h-100  align-items-center">
            <div className="text-center col-12 col-md-6 col-lg-3">
              <img
                className={`${styles.logo}`}
                src="../commonResource/whiteLogo.png"
                alt=""
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3 ">
              <ul className={`${styles.customUl} text-center`}>
                <li>
                  <h4 className={`${styles.whiteText}`}>ABOUT</h4>
                </li>
                <li className={`${styles.whiteText}`}>購物說明</li>
                <li className={`${styles.whiteText}`}>會員福利社</li>
                <li className={`${styles.whiteText}`}>退換貨政策</li>
                <li className={`${styles.whiteText}`}>常見QA</li>
                <li className={`${styles.whiteText}`}>服務條款及隱私政策</li>
              </ul>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <ul className={`${styles.customUl} text-center`}>
                <li>
                  <h4 className={`${styles.whiteText}`}>聯絡我們</h4>
                </li>
                <li className={`${styles.whiteText}`}>LINE@：@xxxxxxx</li>
                <li className={`${styles.whiteText}`}>電話：02-6666666</li>
                <li className={`${styles.whiteText}`}>周一-周五；</li>
                <li className={`${styles.whiteText}`}>9:00-12:30；13:30-18:00</li>
                <li className={`${styles.whiteText}`}>qazwsx6120p</li>
              </ul>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <h4 className={`${styles.whiteText} text-center`}>FOLLOWS US</h4>
              <div className="imgBox d-flex  justify-content-center">
                <img  className={`${styles.followUSIcon}`}  src="../commonResource/original.png" alt="" />
                <img className={`${styles.followUSIcon}`} src="../commonResource/original (1).png" alt="" />
                <img className={`${styles.followUSIcon}`} src="../commonResource/social_facebook.png" alt="" />
                <img className={`${styles.followUSIcon}`} src="../commonResource/social_line.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
