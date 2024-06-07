import React, { useState, useEffect } from "react";
import "./Calendar.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Calendar = ({ onDateClick, selectedDate }) => {
  const [currDate, setCurrDate] = useState(new Date());
  const [currYear, setCurrYear] = useState(currDate.getFullYear());
  const [currMonth, setCurrMonth] = useState(currDate.getMonth());

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevNext = (change) => {
    const newMonth = currMonth + change;
    let newDate;

    if (newMonth < 0 || newMonth > 11) {
      newDate = new Date(currYear, newMonth, new Date().getDate());
      setCurrYear(newDate.getFullYear());
      setCurrMonth(newDate.getMonth());
    } else {
      newDate = new Date(currYear, newMonth);
      setCurrMonth(newMonth);
    }
  };

  const firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
  const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
  const lastDayOfMonth = new Date(
    currYear,
    currMonth,
    lastDateOfMonth
  ).getDay();
  const lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();

  return (
    <div className="w-[250px] signup:w-[320px] bg-white rounded-md shadow-md flex flex-col p-3">
      <header className="grid grid-cols-2 p-2 items-center gap-20">
        <p className="text-[20px] signup:text-[25px] sm:text-3xl font-semibold">{`${months[currMonth]} ${currYear}`}</p>
        <div className="flex text-gray-600 h-9 w-9 cursor-pointer items-center justify-center text-center gap-4 ">
          <span
            onClick={() => handlePrevNext(-1)}
            className="hover:bg-gray-100 rounded-full p-2"
          >
            <KeyboardArrowLeftIcon />
          </span>
          <span
            onClick={() => handlePrevNext(1)}
            className="hover:bg-gray-100 rounded-full p-2"
          >
            <KeyboardArrowRightIcon />
          </span>
        </div>
      </header>
      <div className="flex flex-col  ">
      <ul className="weeks grid grid-cols-7 gap-5 list-none text-center justify-items-center pb-5">
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className="days grid grid-cols-7  gap-5 list-none text-center">
          {[...Array(firstDayOfMonth)].map((_, index) => (
            <li key={`inactive-${index}`} className="text-gray-400">
            {lastDateOfLastMonth - firstDayOfMonth + index + 1}
            </li>
          ))}

          {[...Array(lastDateOfMonth)].map((_, index) => (
            <li
              key={`active-${index}`}
              className={
                selectedDate  && selectedDate.getDate() === index + 1 ? "underline font-extrabold" : "active "
              }
              onClick={() =>
                onDateClick(new Date(currYear, currMonth, index + 1))
              }
            >
              <p>{index + 1}</p>
            </li>
          ))}

          {[...Array(6 - lastDayOfMonth)].map((_, index) => (
            <li key={`inactive-next-${index}`} className="inactive ">
              {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calendar;
