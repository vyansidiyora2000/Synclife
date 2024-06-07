import React from "react";
import { feelings } from "../../assets/data/moodPage";

const Feeling = ({
  selectedOption,
  handleToggle,
  handleOptionClick,
}) => {
  return (
    <div>
      <p className="text-center font-semibold text-2xl m-2">
        How are you feeling today?
      </p>
      <div onClick={handleToggle}>
        {selectedOption && (
          <div className="flex flex-col justify-center items-center">
            <img
              src={selectedOption.image}
              className="w-12 h-12"
              alt={selectedOption.value}
            />
            <p>{selectedOption.value}</p>
          </div>
        )}
      </div>

      <ul className="grid grid-cols-3 signup:grid-cols-5 bg-slate-300 rounded-3xl items-center justify-center shadow-md shadow-slate-300">
        {feelings.map((item) => (
          <li
            key={item.value}
            onClick={() => handleOptionClick(item)}
            className="p-2 rounded-3xl flex flex-col justify-center items-center hover:shadow-2xl hover:shadow-black"
          >
            <img src={item.image} alt={item.value} className="w-12 h-12" />
            <p>{item.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Feeling;
