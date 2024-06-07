import React from "react";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import Calendar from "../Calendar/Calendar";
import ActivityPage from "./ActivityPage";
import { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../reducers/authSlice";
import {
  deleteEntry,
  fetchMoodData,
  setMoodData,
} from "../../reducers/moodSlice";
import ConfirmBox from "../ConfirmBox";

const Mood = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const moods = useSelector((state) => state.mood.moodData);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPage, setShowPage] = useState(false);
  const [searchDate, setSearchDate] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteDate, setDeleteDate] = useState();

  const fetchAndSetMoods = async () => {
    try {
      if (user) {
        const response = await dispatch(fetchMoodData(user.token));
        dispatch(setMoodData(response.payload));
      } else {
        console.log("No user from mood");
      }
    } catch (error) {
      console.log("error in fetching mood:", error);
    }
  };

  useEffect(() => {
    fetchAndSetMoods();
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [dispatch]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    fetchAndSetMoods();
  };

  const closePage = () => {
    setShowPage(false);
    fetchAndSetMoods();
    setSelectedDate(new Date());
    setSearchDate();
  };

  const handleSearchDateChange = (e) => {
    setSearchDate(e.target.value);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    setShowPage(true);
  };

  const handleDeleteConfrim = () => {
    setConfirmDelete(false);
    handleDelete({ deleteDate });
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
  };

  const handleDeleteClick = (date) => {
    setDeleteDate(date);
    setConfirmDelete(true);
  };
  const renderFilteredMoods = () => {
    const filteredMoods = moods.filter((mood) =>
      moment(mood.date).isSame(moment(selectedDate), "day")
    );

    if (filteredMoods.length === 0) {
      return <p className="text-lg text-gray-400">No entry available</p>;
    }

    return (
      <div>
        {filteredMoods.map((filteredMood) => (
          <div key={filteredMood._id} className="flex justify-center">
            <li className="bgHabit m-2 rounded-md p-4 shadow-sm shadow-black list-none max-w-80 ">
              <span className="text-3xl font-subTag text-gray-700 underline">
                {moment(filteredMood.date).format("DD-MM-YYYY")}
              </span>
              <div className="mt-2 grid gap-2">
                <div
                  key={filteredMood._id}
                  className="flex flex-col justify-center items-center gap-2"
                >
                  <span className="text-2xl font-serif text-gray-700">
                    {filteredMood.feeling.value}
                  </span>
                  <img
                    src={filteredMood.feeling.image}
                    alt={filteredMood.feeling.value}
                    className="h-12 w-12"
                  />
                </div>

                <p className="text-sm">
                  Activities that made you feel this way
                </p>
                {filteredMood.activity[0].weather.length === 0 &&
                filteredMood.activity[0].social.length === 0 &&
                filteredMood.activity[0].location.length === 0 &&
                filteredMood.activity[0].food.length === 0 &&
                filteredMood.activity[0].health.length === 0 &&
                filteredMood.activity[0].hobby.length === 0 ? (
                  <p className="text-gray-500">No activity selected</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {!filteredMood.activity[0].weather.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].weather.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-2xl font-subTag text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                    {!filteredMood.activity[0].social.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].social.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-2xl font-subTag text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                    {!filteredMood.activity[0].location.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].location.map(
                        (emotion, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-center items-center gap-2"
                          >
                            <span className="text-2xl font-subTag text-gray-700">
                              {emotion.value}
                            </span>
                            <img
                              src={emotion.image}
                              alt={emotion.value}
                              className="h-12 w-12"
                            />
                          </div>
                        )
                      )}
                    {!filteredMood.activity[0].food.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].food.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-2xl font-subTag text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                    {!filteredMood.activity[0].health.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].health.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-2xl font-subTag text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                    {!filteredMood.activity[0].hobby.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].hobby.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-2xl font-subTag text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </li>
          </div>
        ))}
      </div>
    );
  };

  const handleDelete = async ({ deleteDate }) => {
    let date = null;

    if (user) {
      try {
        date = moment(deleteDate).format("YYYY-MM-DD");

        await dispatch(deleteEntry({ date, userToken: user.token }));
        fetchAndSetMoods();
      } catch (error) {
        console.log("Error deleting list:", error);
      }
    }
  };

  useEffect(() => {
    if (confirmDelete) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "scroll";
    }
  }, [confirmDelete]);

  return (
    <div className="bg-gray-100 ">
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        {showPage ? (
          <div>
            <ActivityPage onClose={closePage} searchDate={searchDate} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 flex flex-col gap-3">
              <h1 className="text-5xl font-mainTag mb-5">Emo sense</h1>
              <p className="text-3xl font-subTag mb-2">
                How are you Feeling Today?
              </p>
              {/* <p className="text-2xl">Let's track your mood</p> */}

              <form
                className="flex flex-col xl:flex-row justify-center items-center gap-3"
                onSubmit={handleSearch}
              >
                <p className="text-2xl font-serif">Enter entry for :</p>
                <div>
                  <input
                    type="date"
                    name="searchDate"
                    value={searchDate}
                    onChange={handleSearchDateChange}
                    className="p-2 border-2 border-gray-200 shadow-md shadow-slate-400 rounded-md mb-2 mr-2 placeholder-slate-900"
                  />
                  <button
                    className=" bg-white border-2 border-gray-200 text-black shadow-md shadow-slate-500 px-4 py-2 rounded-md hover:border-gray-500 transition duration-300 ease-in-out "
                    type="submit"
                  >
                    Enter
                  </button>
                </div>
              </form>

              {selectedDate && moods && renderFilteredMoods()}

              {moods.filter((mood) =>
                moment(mood.date).isSame(moment(selectedDate), "day")
              ).length > 0 && (
                <div>
                  <button
                    // className="mt-5 bg-slate-600 bottom-0 text-white px-4 py-2 rounded-full hover:bg-slate-700 transition duration-300 ease-in-out focus:outline-none focus:ring focus:border-slate-900"
                    className="bg-gray-300 border-2 border-white py-1 px-2 rounded-md shadow-sm shadow-black"
                    onClick={() => handleDeleteClick(selectedDate)}
                  >
                    Delete entry
                  </button>
                </div>
              )}
            </div>
            <div className="flex pb-10 sm:p-14 items-start justify-center">
              <Calendar
                onDateClick={handleDateClick}
                selectedDate={selectedDate}
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
      <ConfirmBox
        visible={confirmDelete}
        message="Do you want to delete?"
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfrim}
      />
    </div>
  );
};

export default Mood;
