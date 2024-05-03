// CatFeedingCalculator.js

import React, { useState } from 'react';

const CatFeedingCalculator = () => {
  // 定義組件內部的狀態
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [type, setType] = useState('');

  // 計算基礎熱量需求（RER）
  const calculateRER = (weight) => {
    const baseRER = Math.pow(weight, 0.75) * 70; // 使用指數運算符計算體重的0.75次方，然後乘以70
    return Math.round(baseRER * 10) / 10; // 四捨五入到小數點後一位
  };

  // 計算每日熱量需求（DER）並應用DER乘數
  const calculateDER = (baseRER, type) => {
    // 定義不同類型貓咪的DER乘數
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

    // 根據貓咪類型獲取對應的DER乘數範圍
    const [minMultiplier, maxMultiplier] = multipliers[type];

    // 根據DER乘數計算最小和最大DER
    const minDER = baseRER * minMultiplier;
    const maxDER = baseRER * maxMultiplier;

    return { minDER: Math.round(minDER), maxDER: Math.round(maxDER) }; // 四捨五入到整數
  };

  // 計算貓咪一天所需喝水量
  const calculateWaterRequirement = (weight) => {
    const minWater = weight * 50; // 最小喝水量：體重（公斤） x 50c.c.
    const maxWater = weight * 60; // 最大喝水量：體重（公斤） x 60c.c.
    return { minWater: Math.round(minWater), maxWater: Math.round(maxWater) }; // 四捨五入到整數
  };

  // 處理提交表單事件
  const handleSubmit = (e) => {
    e.preventDefault();
    // 計算基礎熱量需求（RER）
    const baseRER = calculateRER(weight);
    // 計算每日熱量需求（DER）並應用DER乘數
    const { minDER, maxDER } = calculateDER(baseRER, type);
    // 計算貓咪一天所需喝水量
    const { minWater, maxWater } = calculateWaterRequirement(weight);
    // 在警告框中顯示計算結果
    alert(`貓咪的基礎熱量需求（RER）為：${baseRER} 千卡\n貓咪的每日熱量需求（DER）範圍為：${minDER} - ${maxDER} 千卡\n貓咪的每天喝水量範圍為：${minWater}c.c. - ${maxWater}c.c.`);
  };

  return (
    <div>
      {/* 貓咪餵食計算機標題 */}
      <h1>貓咪餵食計算機</h1>
      {/* 表單，當提交時調用handleSubmit函數 */}
      <form onSubmit={handleSubmit}>
        {/* 體重輸入欄 */}
        <label>
          貓咪體重（公斤）：
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </label>
        <br />
        {/* 年齡輸入欄 */}
        <label>
          貓咪年齡：
          <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
        <br />
        {/* 類型選擇下拉菜單 */}
        <label>
          貓咪類型：
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="kitten">幼貓</option>
            <option value="neutered_adult">已結紮成貓</option>
            <option value="intact_adult">未結紮成貓</option>
            <option value="overweight_adult">過胖的成貓</option>
            <option value="underweight_adult">過瘦的成貓</option>
            <option value="middle_aged">中年貓</option>
            <option value="senior">老年貓</option>
            <option value="pregnant">懷孕中的貓</option>
            <option value="lactating">哺乳中的貓</option>
          </select>
        </label>
        <br />
        {/* 提交按鈕 */}
        <button type="submit">計算</button>
      </form>
    </div>
  );
};

export default CatFeedingCalculator;
