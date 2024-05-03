import { useState } from "react";

export default function DropdownMenu({
  setSortType,
  SORT_PRICE_HIGH_TO_LOW,
  SORT_PRICE_LOW_TO_HIGH,
  handleSort,
}) {
  /** 是否展開排序下拉選單 */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /** 是否展開排序下拉選單 */
  const [selectedOptionText, setSelectedOptionText] = useState("依價格排序:低至高");

  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectOption = (optionText) => {
    setIsDropdownOpen(false);
    setSelectedOptionText(optionText);
    handleSort();
  };

  return (
    <div className="dropdown ">
      <button
        className="w-100 btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        aria-expanded={isDropdownOpen ? "true" : "false"}
        onClick={toggleDropdown}
      >
        {selectedOptionText}
      </button>
      <ul
        className={` dropdown-menu${isDropdownOpen ? " show" : ""}`}
        aria-labelledby="dropdownMenuButton"
      >
        <li>
          <a
            onClick={() => {
              setSortType(SORT_PRICE_LOW_TO_HIGH);
              handleSelectOption("依價格排序:低至高");
            }}
            className="dropdown-item"
            href="#"
          >
            依價格排序:低至高
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setSortType(SORT_PRICE_HIGH_TO_LOW);
              handleSelectOption("依價格排序:高至低");
            }}
            className="dropdown-item"
            href="#"
          >
            依價格排序:高至低
          </a>
        </li>
      </ul>
    </div>
  );
}
