import React, { useState, useEffect } from "react";
import "./GratiCalendar.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useSelector } from "react-redux";
const VITE_SERVER_IMAGE_URL = import.meta.env.VITE_SERVER_IMAGE_URL;

const GratiCalender = ({ onDateClick, selectedDate }) => {
  const [currDate, setCurrDate] = useState(new Date());
  const [currYear, setCurrYear] = useState(currDate.getFullYear());
  const [currMonth, setCurrMonth] = useState(currDate.getMonth());

  const gratitudes = useSelector((state) => state.gratitude.gratitudes);
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
  const today = new Date();
  return (
    <div className="w-[250px] signup:w-[320px] min-[400px]:w-[420px] sm:w-[420px]  bg-white rounded-md shadow-md flex flex-col p-3">
      <header className="grid grid-cols-2 gap-10 justify-between py-7 px-14 items-center">
        <p className="text-[27px] sm:text-4xl font-semibold font-subTag ">{`${months[currMonth]} ${currYear}`}</p>
        <div className="flex text-gray-600 h-9 w-9 cursor-pointer items-center justify-center text-center gap-3 ">
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
      <div className="cal ">
        <ul className="weeks p-2 grid grid-cols-7 gap-x-9 gap-y-2 list-none text-center justify-items-center">
          <li>Sun</li>
          <li>Mon</li>
          <li>Tue</li>
          <li>Wed</li>
          <li>Thu</li>
          <li>Fri</li>
          <li>Sat</li>
        </ul>
        <ul className="days p-2 grid grid-cols-7 gap-x-9 gap-y-2 list-none text-center justify-items-center">
          {[...Array(firstDayOfMonth)].map((_, index) => (
            <li key={`inactive-${index}`} className="inactive font-subTag">
              {lastDateOfLastMonth - firstDayOfMonth + index + 1}
            </li>
          ))}

          {[...Array(lastDateOfMonth)].map((_, index) => (
            <li
              key={`activee-${index}`}
              className={
                selectedDate && selectedDate.getDate() === index + 1
                  ? " font-bold font-subTag underline  text-white"
                  : "activee min-h-14 font-extralight font-subTag"
              }
              onClick={() =>
                onDateClick(new Date(currYear, currMonth, index + 1))
              }
            >
              <div className="grid ">
                <div className={selectedDate && selectedDate.getDate() === index + 1 ? "w-[40px] h-10 border-2 rounded-xl border-black items-center relative": "w-[40px] items-center relative" }>
                  {gratitudes &&
                    gratitudes.map((data, idx) => {
                      const gratitudeDate = new Date(data.date);
                      const gratitudeDay = gratitudeDate.getDate();
                      const gratitudeMonth = gratitudeDate.getMonth();

                      if (
                        gratitudeDay === index + 1 &&
                        gratitudeMonth === currMonth &&
                        gratitudeDate.getFullYear() === currYear
                      ) {
                        return (
                          <div key={data._id}>
                            <img
                              src={`${VITE_SERVER_IMAGE_URL}/${data.image}`}
                              alt="entry"
                              className="h-10 w-full opacity-50 rounded-xl"
                            />
                            <p
                              key={`gratitude-${index}-${idx}`}
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-black"
                            >
                              {index + 1}
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <p
                            key={`default-${index}-${idx}`}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-black"
                          >
                            {index + 1}
                          </p>
                        );
                      }
                    })}
                  {!gratitudes.some((data) => {
                    const gratitudeDate = new Date(data.date);
                    const gratitudeDay = gratitudeDate.getDate();
                    const gratitudeMonth = gratitudeDate.getMonth();
                    return (
                      gratitudeDay === index + 1 &&
                      gratitudeMonth === currMonth &&
                      gratitudeDate.getFullYear() === currYear
                    );
                  }) && (
                    <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-black">
                      {index + 1}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}

          {[...Array(6 - lastDayOfMonth)].map((_, index) => (
            <li key={`inactive-next-${index}`} className="inactive font-subTag">
              {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GratiCalender;
