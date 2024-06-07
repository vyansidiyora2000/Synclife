import React, { useEffect, useRef, useState } from "react";
import Footer from "../Home/Footer";
import Navbar from "../Home/Navbar";
import GratiCalender from "../Calendar/GratiCalender";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../reducers/authSlice";
import {
  addGratitude,
  fetchGratitudes,
  setGratitudes,
} from "../../reducers/gratiSlice";
import GratiDetails from "./GratiDetails";
import ConfirmBox from "../ConfirmBox";

const Gratitude = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    date: "",
    entry: "",
    file: null,
  });
  const [gratiDetailsVisible, setGratiDetailsVisible] = useState(false);
  const [confirmBoxVisible, setConfirmBoxVisible] = useState(false);
  const [confirmAddEntry, setConfirmAddEntry] = useState(false);
  const [dataError, setDataError] = useState("");

  const fileInputRef = useRef(null);

  const user = useSelector(selectUser);
  const gratitudes = useSelector((state) => state.gratitude.gratitudes);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setDataError("");
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0],
    });
  };

  const fetchAndSetGratitude = async () => {
    try {
      if (user) {
        const response = await dispatch(fetchGratitudes(user.token));
        dispatch(setGratitudes(response.payload));
      } else {
        console.log("No user from Gratitude");
      }
    } catch (error) {
      console.log("Error in fetching gratitude: ", error);
    }
  };

  useEffect(() => {
    fetchAndSetGratitude();
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [dispatch]);

  const handleUpload = async () => {
    try {
      if (user) {
        const { date, entry, file } = formData;
        const imageFile = file ? file : "blank.jpg";

        await dispatch(
          addGratitude({
            date,
            entry,
            imageFile,
            userToken: user.token,
          })
        );

        setFormData({
          date: "",
          entry: "",
          file: null,
        });

        fileInputRef.current.value = "";
      }
      fetchAndSetGratitude();
    } catch (error) {
      console.error("Error in submitting gratitude:", error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setGratiDetailsVisible(true);
  };

  const closeGratiDetails = () => {
    setGratiDetailsVisible(false);
    fetchAndSetGratitude();
  };

  useEffect(() => {
    if (gratiDetailsVisible || confirmBoxVisible || confirmAddEntry) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "scroll";
    }
  }, [gratiDetailsVisible, confirmBoxVisible, confirmAddEntry]);

  const handleConfirmCancel = () => {
    setConfirmBoxVisible(false);
    setFormData({
      date: "",
      entry: "",
      file: null,
    });
  };

  const handleConfirmChange = async () => {
    setConfirmBoxVisible(false);
    const { date, entry, file } = formData;
    const imageFile = file ? file : "blank.jpg";
    await dispatch(
      addGratitude({
        date,
        entry,
        imageFile,
        userToken: user.token,
      })
    );

    setFormData({
      date: "",
      entry: "",
      file: null,
    });

    fileInputRef.current.value = "";
    fetchAndSetGratitude();
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (user) {
      const { date } = formData;

      if (!formData.date.trim()) {
        setDataError("Date cannot be empty");
        return;
      }
      const existingEntry = gratitudes.filter((gratitude) =>
        moment(gratitude.date).isSame(date, "day")
      );

      if (existingEntry.length > 0) {
        setConfirmBoxVisible(true);
        return;
      } else {
        setConfirmAddEntry(true);
      }
    }
  };
  const handleAddConfirm = (e) => {
    setConfirmAddEntry(false);
    handleUpload();
  };

  const handleAddCancel = () => {
    setConfirmAddEntry(false);
    setFormData({
      date: "",
      entry: "",
      file: null,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="bg-gray-100">
        <h1 className="mt-5 text-4xl signup:text-5xl font-mainTag text-slate-800">GratiMemo</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full gap-10 justify-items-center">
          <div className="pt-5 signup:p-10">
            <GratiCalender
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
          </div>
          <div className="flex flex-col justify-center items-center pb-10">
            <div className="cardBG  p-8 w-3/4 rounded-lg">
              <span>
                <h2 className="font-subTag font-bold text-2xl signup:text-3xl text-slate-700 mb-4">
                  <p>Enter your HAPPY Moment</p>
                </h2>
              </span>
              <form className="flex flex-col gap-4" onSubmit={handleAddSubmit}>
                <label>
                  <span className="text-base signup:text-lg font-semibold text-gray-900">
                    Select date:
                  </span>

                  <input
                    className="border-2 border-gray-200 w-full p-2 shadow-md shadow-slate-500 rounded-md  placeholder-slate-900"
                    type="date"
                    name="date"
                    onChange={handleChange}
                    value={formData.date}
                  />
                </label>
                {dataError && (
                  <p className="text-red-500 text-sm">{dataError}</p>
                )}
                <label>
                  <span className="text-base signup:text-lg font-semibold text-gray-900">
                    Enter your entry:
                  </span>
                  <input
                    className="border-2 border-gray-200 w-full p-2 shadow-md shadow-slate-500 rounded-md  placeholder-slate-900"
                    type="text"
                    name="entry"
                    placeholder="I am greatful for...."
                    onChange={handleChange}
                    value={formData.entry}
                  />
                </label>
                <label>
                  <span className="text-base signup:text-lg font-semibold text-gray-900">
                    Attach Image:
                  </span>
                  <input
                    className="border-2 border-gray-200 bg-white w-full p-2 shadow-md shadow-slate-500 rounded-md  placeholder-slate-900"
                    type="file"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <div>
                  <button
                    type="submit"
                    className="bg-slate-600 mt-5 text-white shadow-md shadow-black hover:bg-stone-400  py-3 px-6 rounded-md transition duration-300 ease-in-out"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
          {selectedDate && gratiDetailsVisible && (
            <GratiDetails date={selectedDate} onClose={closeGratiDetails} />
          )}
        </div>
      </div>
      <Footer />
      <ConfirmBox
        visible={confirmAddEntry}
        message="Are you sure?"
        onCancel={handleAddCancel}
        onConfirm={handleAddConfirm}
      />
      <ConfirmBox
        visible={confirmBoxVisible}
        message=" An entry already exists for this date. Do you want to change the
              existing entry?"
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmChange}
      />
    </div>
  );
};

export default Gratitude;
