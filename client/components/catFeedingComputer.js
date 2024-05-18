import React, { useState } from "react";
import styles from "./styles/feedingComputer.module.css";

/**
 * 1.基礎熱量需求（RER）計算方式：
 * RER = 70 x (體重(kg))^0.75
 *
 * 2.每日熱量需求（DER）調整：
 * 根據狗狗的活動量和生理狀態，DER 可以在 RER 的基礎上進行調整，通常調整比例介於 RER x 0.8 到 RER x 1.8 之間。
 *
 * === 每日熱量需求因素表 ===
 *
 * 幼貓（還沒結紮）：2.5（基本上小貓能吃就是福）
 * 已結紮成貓：1.2~1.4
 * 未結紮成貓：1.4~1.6
 * 過胖的成貓：0.8~1.0（乘以理想體重的ERE）
 * 過瘦的成貓：1.2~1.8（乘以理想體重的ERE）
 * 中年貓咪（711歲左右）：1.11.4
 * 老年貓咪（11歲以上）：1.1~1.6
 * 懷孕中的貓咪：1.6~2.0
 * 哺乳中的貓咪：2.0（餵奶時也是能吃就是福啦） */

const CatFeedingCalculator = () => {
  /** 體重 */
  const [weight, setWeight] = useState("");

  /** 年齡 */
  const [age, setAge] = useState("");

  /** 狀態 */
  const [type, setType] = useState("kitten");

  /** 結果 */
  const [result, setResult] = useState(null);


 /** 根據貓咪年齡篩選適當的類型選項 */
  const getTypeOptions = (catAge) => {
    // 哺乳中的貓咪
    if (catAge <= 0.3) {
      return [{ value: "lactating", label: "哺乳中的貓咪" }];
    }
    // 幼貓
    else if (catAge < 0.6) {
      return [{ value: "kitten", label: "幼貓" }];
    }
    // 可以懷孕的貓
    else if (catAge >= 0.6 && catAge < 0.8) {
      return [{ value: "pregnant", label: "懷孕中的貓咪" }];
    }
    // 成貓
    else if (catAge >= 0.8 && catAge < 7) {
      return [
        { value: "intact_adult", label: "未結紮成貓" },
        { value: "neutered_adult", label: "已結紮成貓" },
        { value: "overweight_adult", label: "過胖的成貓" },
        { value: "underweight_adult", label: "過瘦的成貓" },
        { value: "pregnant", label: "懷孕中的貓咪" },
      ];
    }
    // 中年貓
    else if (catAge >= 7 && catAge < 11) {
      return [{ value: "middle_aged", label: "中年貓" }];
    }
    // 老年貓
    else if (catAge >= 11) {
      return [{ value: "senior", label: "老年貓" }];
    }
  };

  /** 計算基礎熱量需求（RER） */
  const calculateRER = (weight) => {
    const baseRER = Math.pow(weight, 0.75) * 70;
    return Math.round(baseRER * 10) / 10;
  };

   /** 計算每日熱量需求（DER）並應用DER乘數 */
  const calculateDER = (baseRER, type) => {
    const multipliers = {
      kitten: [2.5, 2.5],
      neutered_adult: [1.2, 1.4],
      intact_adult: [1.4, 1.6],
      overweight_adult: [0.8, 1.0],
      underweight_adult: [1.2, 1.8],
      middle_aged: [1.1, 1.4],
      senior: [1.1, 1.6],
      pregnant: [1.6, 2.0],
      lactating: [2.0, 2.0],
    };

    const [minMultiplier, maxMultiplier] = multipliers[type];
    const minDER = baseRER * minMultiplier;
    const maxDER = baseRER * maxMultiplier;

    return { minDER: Math.round(minDER), maxDER: Math.round(maxDER) };
  };

  /** 計算貓咪一天所需喝水量 */
  const calculateWaterRequirement = (weight) => {
    const minWater = weight * 50;
    const maxWater = weight * 60;
    return { minWater: Math.round(minWater), maxWater: Math.round(maxWater) };
  };

  /** 處理 input Change 事件 */
  const handleChange = (e, setStateFunc) => {
    setResult(null);
    setStateFunc(e.target.value);
  };

  /** 處理點擊 */
  const handleClick = (e) => {
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
      <h1>貓咪餵食計算機</h1>
      <form className={`${styles.form}`}>
        <label>貓咪體重（公斤）：</label>
        <input
        min="0"
          type="number"
          className="form-control mt-2"
          onChange={(e) => handleChange(e, setWeight)}
        />
        <br />
        <label>貓咪年齡(輸入小數點為月份)：</label>
        <input
        min="0"
          type="number"
          className="form-control mt-2"
          onChange={(e) => handleChange(e, setAge)}
        />
        <br />
        <label>貓咪類型：</label>
        <select
          className="form-select mt-2"
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
            <label>貓咪的基礎熱量需求（RER）為：</label>
            <input
              value={`${
                result && result.baseRER ? `${result.baseRER} 卡路里` : ""
              }`}
              className="form-control mt-2"
              type="text"
              readOnly
            />
            
            <br />
            <label>貓咪的每日熱量需求（DER）範圍為：</label>
            <input
              value={`${
                result ? `${result.DER[0]} - ${result.DER[1]} 卡路里` : ""
              }`}
              className="form-control mt-2"
              type="text"
              readOnly
            />

            <br />

            <label>貓咪的每天喝水量範圍為：</label>
            <input
              value={`${
                result ? `${result.water[0]} - ${result.water[1]} c.c.` : ""
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

export default CatFeedingCalculator;
