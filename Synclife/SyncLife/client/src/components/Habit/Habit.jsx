import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addHabit,
  deleteHabit,
  fetchHabits,
  setHabits,
  toggleCompletion,
  updateHabits,
} from "../../reducers/habitSlice";
import HabitDetails from "./HabitDetails";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { selectUser } from "../../reducers/authSlice";
import ConfirmBox from "../ConfirmBox";
import moment from "moment";

const Habit = () => {
  const dispatch = useDispatch();
  const habits = useSelector((state) => state.habit.habits);
  const [habit, setHabit] = useState({ name: "", startDate: "", endDate: "" });
  const [habitDetailsVisible, setHabitDetailsVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [updateHabit, setUpdateHabit] = useState({
    name: "",
    startDate: "",
    endDate: "",
    habitId: null,
  });
  const [updateFormVisible, setUpdateFormVisible] = useState(false);
  const [nameError, setNameError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [addConfirm, setAddConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateConfirm, setUpdateConfirm] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const user = useSelector(selectUser);

  const fetchAndSetHabits = async () => {
    try {
      if (user) {
        const response = await dispatch(fetchHabits(user.token));
        dispatch(setHabits(response.payload));
      } else {
        console.log("No user from habit");
      }
    } catch (error) {
      console.log("error in fetching habits: ", error);
    }
  };

  useEffect(() => {
    fetchAndSetHabits();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [dispatch]);

  const handleChange = (e) => {
    setHabit({ ...habit, [e.target.name]: e.target.value });
    setNameError("");
    setStartDateError("");
    setEndDateError("");
  };

  const handleSubmit = async () => {
    try {
      if (user) {
        await dispatch(
          addHabit({
            name: habit.name,
            startDate: habit.startDate,
            endDate: habit.endDate,
            userToken: user.token,
          })
        );
      }

      await fetchAndSetHabits();
      setHabit({
        name: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error submitting habit:", error);
    }
  };

  const handleUpdateChange = (e) => {
    setUpdateHabit({ ...updateHabit, [e.target.name]: e.target.value });
    setUpdateError("");
  };

  const handleUpdate = async () => {
    try {
      if (user) {
        const { name, startDate, endDate, habitId } = updateHabit;
        await dispatch(
          updateHabits({
            habitId,
            name,
            startDate,
            endDate,
            userToken: user.token,
          })
        );

        setUpdateFormVisible(false);
        setUpdateHabit({
          name: "",
          startDate: "",
          endDate: "",
          habitId: null,
        });
        fetchAndSetHabits();
      }
    } catch (error) {
      console.error("Error in updating habits: ", error);
    }
  };

  const handleUpdateButtonClick = (habit) => {
    setUpdateHabit({
      name: habit.name,
      startDate: habit.startDate,
      endDate: habit.endDate,
      habitId: habit._id,
    });
    
    setUpdateFormVisible(true);
  };

  const handleHabitDelete = async (id) => {
    try {
      if (user) {
        await dispatch(deleteHabit({ habitId: id, userToken: user.token }));
        fetchAndSetHabits();
      }
    } catch (error) {
      console.log("Error in deleting habits: ", error);
    }
  };

  const handleToggle = async (habitId, date) => {
    try {
      if (user) {
        await dispatch(
          toggleCompletion({ habitId, date, userToken: user.token })
        );
        fetchAndSetHabits();
      }
    } catch (error) {
      console.error("Error toggling completion:", error);
    }
  };

  const showHabitDetails = (habit) => {
    setSelectedHabit(habit);
    setHabitDetailsVisible(true);
  };

  const closeHabitDetails = () => {
    setHabitDetailsVisible(false);
  };

  useEffect(() => {
    if (habitDetailsVisible || addConfirm || deleteConfirm || updateConfirm) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
  }, [habitDetailsVisible, addConfirm, deleteConfirm, updateConfirm]);

  const handleAddConfirm = () => {
    setAddConfirm(false);
    handleSubmit();
  };

  const handleAddCancel = () => {
    setAddConfirm(false);
    setHabit({
      name: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    if (user) {
      if (!habit.name.trim()) {
        setNameError("Habit name cannot be empty");

        return;
      }
      if (!habit.startDate) {
        setStartDateError("Date can't be empty");
        return;
      }
      if (!habit.endDate) {
        setEndDateError("Date can't be empty");
        return;
      }

      if (habit.endDate < habit.startDate) {
        setEndDateError("End date should be after start date");
        return;
      }
    }
    setAddConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteConfirm(false);
    handleHabitDelete(deleteId);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteConfirm(true);
  };

  const handleUpdateConfirm = () => {
    setUpdateConfirm(false);
    handleUpdate();
  };

  const handleUpdateCancel = () => {
    setUpdateConfirm(false);
    setUpdateHabit({
      name: "",
      startDate: "",
      endDate: "",
      habitId: null,
    });
    setUpdateError("");
    setUpdateFormVisible(false);
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    if (user) {
      
      const habitUpdate = habits.find(
        (habit) => habit._id === updateHabit.habitId
      );
     
      if (
        updateHabit.name === habitUpdate.name &&
        updateHabit.startDate === habitUpdate.startDate &&
        updateHabit.endDate === habitUpdate.endDate
      ) {
        setUpdateError("No changes made");
        return;
      }
    }
    setUpdateConfirm(true);
  };
  const today = moment();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 h-full p-10 gap-8 bg-gray-100 flex-grow ">
        <div className="flex flex-col items-center">
          <span>
            <h2 className="text-4xl signup:text-5xl mb-4 font-mainTag text-slate-900">
              <span className="text-slate-950 ">G</span>oal
              <span className="text-slate-950 ">M</span>inder
            </h2>
          </span>
          {updateFormVisible ? (
            <div className="cardBG p-8  rounded-lg">
              <form
                onSubmit={handleUpdateClick}
                className="flex flex-col gap-4"
              >
                <span>
                  <h2 className="font-subTag font-bold text-3xl text-blue-900">
                    <span className=" text-blue-950">U</span>pdate
                    <span className=" text-blue-950 "> H</span>abit
                  </h2>
                </span>
                <label>
                  <span className="text-lg font-semibold text-gray-900">
                    Habit Name:
                  </span>
                  <input
                    className="form-input mt-1 w-full p-3 shadow-md shadow-slate-500 rounded-md bg-white placeholder-slate-900"
                    type="text"
                    name="name"
                    value={updateHabit.name}
                    onChange={handleUpdateChange}
                    placeholder="Enter updated habit name"
                  />
                </label>
                <label>
                  <span className="text-lg font-semibold text-gray-900">
                    Start Date:
                  </span>
                  <input
                    className="form-input mt-1 w-full p-3 shadow-md shadow-slate-500 rounded-md bg-white  placeholder-slate-900"
                    type="date"
                    name="startDate"
                    value={moment(updateHabit.startDate).format("YYYY-MM-DD")}
                    onChange={handleUpdateChange}
                  />
                </label>
                <label>
                  <span className="text-lg font-semibold text-gray-900">
                    End Date:
                  </span>
                  <input
                    className="form-input mt-1 w-full p-3 shadow-md shadow-slate-500 rounded-md  bg-white placeholder-slate-900"
                    type="date"
                    name="endDate"
                    value={moment(updateHabit.endDate).format("YYYY-MM-DD")}
                    onChange={handleUpdateChange}
                  />
                </label>
                {updateError && (
                  <p className="text-red-500 text-sm">{updateError}</p>
                )}
                <button
                  className="bg-slate-600 mt-5 text-white shadow-md shadow-black hover:bg-slate-400 font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out"
                  type="submit"
                >
                  Update Habit
                </button>
              </form>
            </div>
          ) : (
            <div className="cardBG  p-4 md:p-8 max-w-96 rounded-lg">
              <span>
                <h2 className="font-subTag font-bold text-3xl text-slate-700 mb-4">
                  <span className=" text-slate-800">A</span>dd
                  <span className=" text-slate-800 "> H</span>abit
                </h2>
              </span>
              <form onSubmit={handleAddClick}>
                <label>
                  <span className="text-lg font-semibold text-gray-900">
                    Habit Name:
                  </span>
                  <input
                    className="border-2 border-gray-200 my-1 w-full p-3 shadow-md shadow-slate-500 rounded-md mr-2 placeholder-slate-900"
                    type="text"
                    name="name"
                    value={habit.name}
                    onChange={handleChange}
                    placeholder="Enter habit name"
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm">{nameError}</p>
                  )}
                </label>
                <label>
                  <span className="text-lg font-semibold text-gray-900">
                    Start Date:
                  </span>
                  <input
                    className="form-input  border-2 bg-white border-gray-200 my-1 w-full p-3 shadow-md shadow-slate-500 rounded-md mr-2  placeholder-slate-900"
                    type="date"
                    name="startDate"
                    value={habit.startDate}
                    onChange={handleChange}
                  />
                  {startDateError && (
                    <p className="text-red-500 text-sm">{startDateError}</p>
                  )}
                </label>
                <label>
                  <span className="text-lg font-semibold text-gray-900">
                    End Date:
                  </span>
                  <input
                    className="form-input border-2 bg-white border-gray-200 my-1 w-full p-3 shadow-md shadow-slate-500 rounded-md mr-2  placeholder-slate-900"
                    type="date"
                    name="endDate"
                    value={habit.endDate}
                    onChange={handleChange}
                  />
                  {endDateError && (
                    <p className="text-red-500 text-sm">{endDateError}</p>
                  )}
                </label>

                <button
                  className="bg-slate-600 mt-5 text-white shadow-md shadow-black hover:bg-slate-400 font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out"
                  type="submit"
                >
                  Add Habit
                </button>
              </form>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-subTag text-4xl text-slate-900 pb-5">
            Habit Lists
          </h2>
          {habits && habits.length === 0 ? (
            <p className="text-gray-500 text-lg">No data available</p>
          ) : (
            <div>
            <ul className="grid gap-4 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 signup:grid-cols-2 ">
              {habits &&
                habits.filter((data) => moment(data.endDate).isAfter(today))
                .map((habit) => (
                  <li
                    key={habit._id}
                    className="w-52 signup:w-auto bgHabit m-2 rounded-md p-4 shadow-sm shadow-black"
                  >
                    <div className="flex flex-col justify-center gap-5">
                      <span className="text-4xl font-subTag text-gray-700 capitalize">
                        {habit.name}
                      </span>
                      <span className="flex flex-col signup:flex-col xl:flex-row justify-center gap-3">
                        <button
                          className="btnH  p-2 rounded-md transition duration-300 ease-in-out shadow-sm shadow-gray-800"
                          onClick={() => showHabitDetails(habit)}
                        >
                          Status
                        </button>
                        <button
                          className="btnH p-2 rounded-md transition duration-300 ease-in-out shadow-sm shadow-gray-800"
                          onClick={() => handleDeleteClick(habit._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btnH p-2 rounded-md transition duration-300 ease-in-out shadow-sm shadow-gray-800"
                          onClick={() => handleUpdateButtonClick(habit)}
                        >
                          Update
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
            <p className="p-2 text-lg text-gray-500">Expired Habits</p>
            <ul className="grid gap-4 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 signup:grid-cols-2 ">
              {habits &&
                habits.filter((data) => moment(data.endDate).isBefore(today))
                .map((habit) => (
                  <li
                    key={habit._id}
                    className="w-52 signup:w-auto bgHabitExpired m-2 rounded-md p-4 shadow-sm shadow-black"
                  >
                    <div className="flex flex-col justify-center gap-5">
                      <span className="text-4xl font-subTag text-gray-600 capitalize">
                        {habit.name}
                      </span>
                      <span className="flex flex-col signup:flex-col xl:flex-row justify-center gap-3 ">
                        <button
                          className="btnH text-gray-600  p-2 rounded-md transition duration-300 ease-in-out shadow-sm shadow-gray-800"
                          onClick={() => showHabitDetails(habit)}
                        >
                          Status
                        </button>
                        <button
                          className="btnH text-gray-600 p-2 rounded-md transition duration-300 ease-in-out shadow-sm shadow-gray-800"
                          onClick={() => handleDeleteClick(habit._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btnH text-gray-600 p-2 rounded-md transition duration-300 ease-in-out shadow-sm shadow-gray-800"
                          onClick={() => handleUpdateButtonClick(habit)}
                        >
                          Update
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
            </div>
          )}
        </div>
        {habitDetailsVisible && (
          <HabitDetails
            habit={selectedHabit}
            onClose={closeHabitDetails}
            onToggleCompletion={handleToggle}
          />
        )}
      </div>
      <Footer />
      <ConfirmBox
        visible={deleteConfirm}
        message="Do you want to delete Habit?"
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
      <ConfirmBox
        visible={addConfirm}
        message="Are you sure?"
        onCancel={handleAddCancel}
        onConfirm={handleAddConfirm}
      />
      <ConfirmBox
        visible={updateConfirm}
        message="Data already exist. Do you want to update it?"
        onCancel={handleUpdateCancel}
        onConfirm={handleUpdateConfirm}
      />
    </div>
  );
};

export default Habit;
