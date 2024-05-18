import React, { useState } from "react";
import styles from "./styles/feedingComputer.module.css";

const DogFeedingCalculator = () => {
  /** 體重 */
  const [weight, setWeight] = useState("");

  /** 年齡 */
  const [age, setAge] = useState("");

  /** 狀態 */
  const [type, setType] = useState("puppy");

  /** 結果 */
  const [result, setResult] = useState(null);

  /** 根據狗狗年齡篩選適當的類型選項 */
  const getTypeOptions = (dogAge) => {
    // 幼犬
    if (dogAge < 0.5) {
      return [{ value: "puppy", label: "幼犬" }];
    }
    // 成犬
    else if (dogAge >= 0.5 && dogAge < 7) {
      return [
        { value: "adult", label: "成犬" },
        { value: "neutered_adult", label: "已結紮成犬" },
        { value: "unneutered_adult", label: "未結紮成犬" },
        { value: "pregnant", label: "懷孕中的狗狗" },
      ];
    }
    // 老年犬
    else if (dogAge >= 7) {
      return [{ value: "senior", label: "老年犬" }];
    }
  };

  /** 計算基礎熱量需求（RER）*/
  const calculateRER = (weight) => {
    const baseRER = Math.pow(weight, 0.75) * 70;
    return Math.round(baseRER * 10) / 10;
  };

  /** 計算每日熱量需求（DER）並應用DER乘數 */
  const calculateDER = (baseRER, type) => {
    const multipliers = {
      puppy: [3.0, 4.0],
      adult: [1.6, 2.0],
      neutered_adult: [1.2, 1.4],
      unneutered_adult: [1.4, 1.6],
      senior: [1.2, 1.4],
      pregnant: [1.6, 2.0],
    };

    const [minMultiplier, maxMultiplier] = multipliers[type];
    const minDER = baseRER * minMultiplier;
    const maxDER = baseRER * maxMultiplier;

    return { minDER: Math.round(minDER), maxDER: Math.round(maxDER) };
  };

  /** 計算狗狗一天所需喝水量 */
  const calculateWaterRequirement = (weight) => {
    const minWater = weight * 50;
    const maxWater = weight * 100;
    return { minWater: Math.round(minWater), maxWater: Math.round(maxWater) };
  };

  /** 處理 input Change 事件 */
  const handleChange = (e, setStateFunc) => {
    setResult(null);
    setStateFunc(e.target.value);
  };

  /** 處理點擊 */
  const handleClick = (e) => {
    e.preventDefault();
    const baseRER = calculateRER(weight);
    const { minDER, maxDER } = calculateDER(baseRER, type);
    const { minWater, maxWater } = calculateWaterRequirement(weight);

    setResult({
      baseRER: baseRER,
      DER: [minDER, maxDER],
      water: [minWater, maxWater],
    });
  };

  return (
    <div>
      <h1>狗狗餵食計算機</h1>
      <form className={`${styles.form}`}>
        <label>狗狗體重（公斤）：</label>
        <input
           min="0"
          type="number"
          className="form-control mt-2"
          value={weight}
          onChange={(e) => handleChange(e, setWeight)}
        />
        <br />
        <label>狗狗年齡(輸入小數點為月份)：</label>
        <input
           min="0"
           type="number"
          className="form-control mt-2"
          value={age}
          onChange={(e) => handleChange(e, setAge)}
        />
        <br />
        <label>狗狗類型：</label>
        <select
          className="form-select mt-2"
          value={type}
          onChange={(e) => handleChange(e, setType)}
        >
          {getTypeOptions(Number(age)).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <br />
        {result && (
          <div>
            <label>狗狗的基礎熱量需求（RER）為：</label>
            <input
              value={`${
                result && result.baseRER ? `${result.baseRER} 卡路里` : ""
              }`}
              className="form-control mt-2"
              type="text"
              readOnly
            />
            <br />
            <label>狗狗的每日熱量需求（DER）範圍為：</label>
            <input
              value={`${
                result ? `${result.DER[0]} - ${result.DER[1]} 卡路里` : ""
              }`}
              className="form-control mt-2"
              type="text"
              readOnly
            />
            <br />
            <label>狗狗的每天喝水量範圍為：</label>
            <input
              value={`${
                result ? `${result.water[0]} - ${result.water[1]} 毫升` : ""
              }`}
              className="form-control mt-2"
              type="text"
              readOnly
            />
          </div>
        )}
        <div
          onClick={handleClick}
          className={`${styles.btn} w-100 mt-4`}
          type="submit"
        >
          計算
        </div>
      </form>
    </div>
  );
};

export default DogFeedingCalculator;
