import React, { useState } from "react";
import DogFeedingCalculator from "../components/dogFeedingComputer .js";
import CatFeedingCalculator from "../components/catFeedingComputer.js";
import styles from "../styles/pages/feedingComputer.module.css";
import Layout from "../components/layout";
const FeedingComputer = () => {
  /** 商品詳細區的按鈕選取樣式 */
  const BTN_ACTIVE = {
    color: "white",
    backgroundColor: "#6c5c53",
    borderRadius: "10rem",
  };

  /** 按鈕狀態 */
  const BTN = {
    DOG: "dog",
    CAT: "cat",
  };

  const [selectedAnimal, setSelectedAnimal] = useState("dog");

  const handleAnimalChange = (animal) => {
    setSelectedAnimal(animal);
  };

  return (
    <Layout>
      <div className={`${styles.feedingComputer} container`}>
        <div className="row justify-content-center">
          <div className="col-md-9 ">
            <div className="w-100 row mx-auto justify-content-center ">
              <div className="col-md-9 ">
                <h3 className="mb-4">
                  【汪喵計算機】貓狗每日熱量、食量和飲水量計算
                </h3>
                <img
                  className="w-100 mb-4"
                  src="/commonResource/feedingComputer.jpg"
                  alt=""
                />
              </div>
              <div className={styles.animalSelector}>
                <div
                  style={selectedAnimal === BTN.DOG ? BTN_ACTIVE : null}
                  className={`${styles.animalSelectorBtn} `}
                  onClick={() => handleAnimalChange("dog")}
                >
                  狗狗
                </div>
                <div
                  style={selectedAnimal === BTN.CAT ? BTN_ACTIVE : null}
                  className={`${styles.animalSelectorBtn} `}
                  onClick={() => handleAnimalChange("cat")}
                >
                  貓貓
                </div>
              </div>
              <div className={styles.calculatorContainer}>
                {selectedAnimal === "dog" ? (
                  <div>
                    <DogFeedingCalculator />
                  </div>
                ) : (
                  <div>
                  
                    <CatFeedingCalculator />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeedingComputer;
