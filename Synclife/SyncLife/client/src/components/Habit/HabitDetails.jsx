import React from "react";
import moment from "moment";
import { useState, useEffect } from "react";

const HabitDetails = ({ habit, onClose, onToggleCompletion }) => {
  const [localCompletionStatus, setLocalCompletionStatus] = useState({});
  const [isDisable, setIsDisable] = useState(false);

  useEffect(() => {
    const initialStatus = habit.data.reduce((status, habitDate) => {
      status[habitDate.date] = habitDate.isCompleted;
      return status;
    }, {});
    setLocalCompletionStatus(initialStatus);
  }, [habit.data]);

  const handleToggle = async (habitId, date) => {
    try {
      setLocalCompletionStatus((prevStatus) => ({
        ...prevStatus,
        [date]: !prevStatus[date],
      }));

      await onToggleCompletion(habitId, date);
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const today = moment();
  const endDate = moment(habit.endDate);

  const isButtonDisabled = endDate.isBefore(today);

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 "
      onClick={onClose}
    >
      <div
        className="bgHabitDetail p-8 rounded-md min-w-60 w-80 sm:w-3/4 shadow-lg max-h-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[35px] font-semibold text-slate-800 mb-4 capitalize">
          {habit.name}
        </h2>
        <p className="mb-4  text-gray-700 flex flex-col justify-center sm:flex-row sm:gap-2">
          <p>
            <span className="font-bold">Start Date:</span>{" "}
            {moment(habit.startDate).format("DD-MM-YYYY")}
          </p>
          <p>
            <span className="font-bold">End Date:</span>{" "}
            {moment(habit.endDate).format("DD-MM-YYYY")}
          </p>
        </p>
        <h3 className="text-xl font-medium mb-2 text-slate-800">
          Completion Status:
        </h3>
        <div>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {habit.data.map((habitDate) => (
              <li key={habitDate.date} className="mb-2 flex flex-col gap-2">
                <span className="mr-2 font-semibold text-gray-800">
                  {moment(habitDate.date).format("DD-MM-YYYY")}:
                </span>
                <div>
                  <button
                    disabled={isButtonDisabled}
                    onClick={() => handleToggle(habit._id, habitDate.date)}
                    className={`py-1 px-2 rounded ${
                      localCompletionStatus[habitDate.date]
                        ? "bg-green-700"
                        : "bg-red-700"
                    } text-white `}
                    style={{ opacity: isButtonDisabled ? 0.6 : 1 }}
                  >
                    {localCompletionStatus[habitDate.date]
                      ? "Completed"
                      : "Incomplete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;
