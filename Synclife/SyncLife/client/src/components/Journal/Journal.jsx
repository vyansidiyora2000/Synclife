import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addList,
  deleteList,
  fetchLists,
  listCompleted,
  setLists,
  updateList,
} from "../../reducers/journalSlice";
import Calendar from "../Calendar/Calendar";

import moment from "moment";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import { selectUser } from "../../reducers/authSlice";
import ConfirmBox from "../ConfirmBox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Journal = () => {
  const dispatch = useDispatch();
  const lists = useSelector((state) => state.list.lists);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newList, setNewList] = useState("");
  const [newUpdatedList, setNewUpdatedList] = useState("");
  const [updateMode, setUpdateMode] = useState("add");
  const [selectedListId, setSelectedListId] = useState(null);
  const [selecteddataId, setDataId] = useState(null);
  const [TaskError, setTaskError] = useState("");
  const [confirmBoxVisible, setConfirmBoxVisible] = useState(false);
  const [updateconfirmBoxVisible, setUpdateConfirmBoxVisible] = useState(false);
  const [deleteBoxVisible, setDeleteBoxVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [editHover, setEditHover] = useState(null);

  const user = useSelector(selectUser);

  const fetchAndSetLists = async () => {
    try {
      if (user) {
        const response = await dispatch(fetchLists(user.token));
        dispatch(setLists(response.payload));
      } else {
        console.log("user not exist");
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  useEffect(() => {
    fetchAndSetLists();
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [dispatch]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    fetchAndSetLists();
  };

  const handleAddList = async () => {
    try {
      if (user) {
        const newDate = moment(selectedDate).format("YYYY-MM-DD");

        await dispatch(
          addList({
            date: newDate,
            list: newList,
            userToken: user.token,
          })
        );
        fetchAndSetLists();
      }
    } catch (error) {
      console.log("Error adding list:", error);
    }
    setNewList("");
  };

  const handleDelete = async ({ selecteddataId, selectedListId }) => {
    if (user) {
      try {
        await dispatch(
          deleteList({ selecteddataId, selectedListId, userToken: user.token })
        );
        fetchAndSetLists();
      } catch (error) {
        console.log("Error deleting list:", error);
      }
    }
  };

  const handleUpdate = async ({ dataId, listId }) => {
    const listToUpdate = lists.find((list) => list._id === dataId);

    const listItemToUpdate = listToUpdate.data.find(
      (item) => item._id === listId
    );
    setNewUpdatedList(listItemToUpdate.list);
    setUpdateMode("update");
    setSelectedListId(listId);
    setDataId(dataId);
    setIsChecked(listItemToUpdate.isCompleted);
    setTaskError("");
  };

  const handleListUpdate = async ({ selectedListId, selecteddataId }) => {
    if (user) {
      try {
        await dispatch(
          updateList({
            listId: selectedListId,
            dataId: selecteddataId,
            updatedList: newUpdatedList,
            isCompleted: isChecked,
            userToken: user.token,
          })
        );
        fetchAndSetLists();

        setUpdateMode("add");
      } catch (error) {
        console.error("Error in updation", error);
      }
    }
  };

  const handleButtonClick = async ({ dataId, listId }) => {
    try {
      if (user) {
        await dispatch(
          listCompleted({ dataId, listId, userToken: user.token })
        );

        fetchAndSetLists();
      }
    } catch (error) {
      console.error("Error in button click: ", error);
    }
  };

  const handleInputChange = (e) => {
    setNewList(e.target.value);
    setTaskError("");
  };

  const handleUpdateInputChange = (e) => {
    setNewUpdatedList(e.target.value);
    setTaskError("");
  };

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setTaskError("");
  };

  const handleConfirmCancel = () => {
    setConfirmBoxVisible(false);
    setNewList("");
  };

  const handleConfirmChange = async () => {
    setConfirmBoxVisible(false);
    await handleAddList();
    setTaskError("");
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    if (user) {
      if (!newList.trim()) {
        setTaskError("Task cannot be empty");
        return;
      }
    }
    setConfirmBoxVisible(true);
  };

  const handleUpdateConfirmCancel = () => {
    setUpdateConfirmBoxVisible(false);
    setNewUpdatedList("");
    setUpdateMode("add");
  };

  const handleUpdateConfirmChange = async () => {
    setUpdateConfirmBoxVisible(false);
    await handleListUpdate({ selectedListId, selecteddataId });
  };

  const handleUpdateClick = ({ selectedListId, selecteddataId }) => {
    setSelectedListId(selectedListId);
    setDataId(selecteddataId);
    const listToUpdate = lists.find((list) => list._id === selecteddataId);
    const listItemToUpdate = listToUpdate.data.find(
      (item) => item._id === selectedListId
    );
    if (
      newUpdatedList === listItemToUpdate.list &&
      isChecked === listItemToUpdate.isCompleted
    ) {
      setTaskError("No changes made");
      return;
    }
    setUpdateConfirmBoxVisible(true);
  };

  const handleDeleteCancel = () => {
    setDeleteBoxVisible(false);
  };

  const handleDeleteConfirm = () => {
    setDeleteBoxVisible(false);
    handleDelete({ selecteddataId, selectedListId });
  };

  const handleDeleteClick = ({ selecteddataId, selectedListId }) => {
    setSelectedListId(selectedListId);
    setDataId(selecteddataId);
    setDeleteBoxVisible(true);
  };

  const handleHover = (id) => {
    setHoveredItem(id);
  };

  const handleUnhover = () => {
    setHoveredItem(null);
  };

  const handleEditHover = (id) => {
    setEditHover(id);
  };

  const handleEditUnhover = () => {
    setEditHover(null);
  };
  useEffect(() => {
    if (deleteBoxVisible || updateconfirmBoxVisible || confirmBoxVisible) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "scroll";
    }
  }, [deleteBoxVisible, updateconfirmBoxVisible, confirmBoxVisible]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="pt-5 pb-10 bg-gray-100 ">
        <h2 className="text-5xl font-mainTag text-slate-900">
          <span className="text-slate-950 text-6xl">T</span>ask
          <span className="text-slate-950 text-6xl">M</span>ate
        </h2>
        <div className="grid lg:grid-cols-2 md:grid-cols-1 grid-cols-1 h-full gap-10 rounded-md">
          <div className="flex flex-col gap-5 items-center">
            <div className="flex  justify-center items-center mb-2 signup:mb-4">
              {updateMode === "add" ? (
                <form onSubmit={handleAddClick}>
                  <h1 className="text-2xl font-subTag font-semibold mb-3">
                    Add Task
                  </h1>
                  <div className="flex signup:flex-row flex-col signup:gap-0 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Add your task"
                        value={newList}
                        onChange={handleInputChange}
                        className="p-2 border-2 border-gray-200 shadow-md shadow-slate-400 rounded-md mr-2  placeholder-slate-900"
                      />
                      {TaskError && (
                        <p className="text-red-500 text-sm">{TaskError}</p>
                      )}
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="h-11 bg-slate-200 border-2 border-gray-300 shadow-lg shadow-gray-400 py-2 px-4 rounded-md hover:bg-slate-300 transition duration-300 ease-in-out"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div>
                  <h1 className="text-2xl font-subTag mb-2 sm:mb-3">
                    Update Task
                  </h1>
                  <div className="flex flex-col sm:flex-row ">
                    <div className="flex flex-col gap-5 sm:gap-0 sm:grid sm:grid-cols-2 sm:justify-items-center  sm:items-center w-[450px]">
                      <div>
                        <input
                          type="text"
                          placeholder="Update list"
                          value={newUpdatedList}
                          onChange={handleUpdateInputChange}
                          className="ml-2 p-2 border-2 border-gray-200  shadow-md shadow-slate-400 rounded-md  placeholder-slate-900"
                        />
                      </div>
                      <div>
                        <label className="bg-white py-2 px-3 border-2 border-gray-200  shadow-md shadow-slate-400 rounded-md">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                          />
                          Completed
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        {TaskError && (
                          <p className="text-red-500 text-sm">{TaskError}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          handleUpdateClick({ selectedListId, selecteddataId })
                        }
                        className="h-11 bg-slate-200 border-2 border-gray-300 shadow-lg shadow-gray-400 py-2 px-4 rounded-md hover:bg-slate-300 transition duration-300 ease-in-out"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Calendar
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
              className="p-4"
            />
          </div>
          <div className="px-10 sm:p-10">
            <div className="flex flex-col gap-4 ">
              <h3 className="text-3xl font-subTag font-medium mb-2">
                Tasks for {moment(selectedDate).format("DD-MM-YYYY")}
              </h3>
              {lists &&
              lists.filter(
                (list) =>
                  moment(new Date(list.date)).format("YYYY-MM-DD") ===
                  moment(selectedDate).format("YYYY-MM-DD")
              ).length === 0 ? (
                <p className="text-gray-500 text-lg">No data available</p>
              ) : (
                <div>
                 
                  <div className="">
                    <div className="grid grid-cols-1 signup:grid-cols-2 gap-4 font-allTag">
                      {lists &&
                        lists
                          .filter(
                            (list) =>
                              moment(new Date(list.date)).format(
                                "YYYY-MM-DD"
                              ) === moment(selectedDate).format("YYYY-MM-DD")
                          )
                          .map((list) =>
                            list.data.map((item) => (
                              <tr key={item._id}className="mb-2 bg-slate-300 shadow-lg shadow-slate-400 flex flex-col items-center justify-center p-2 text-gray-800 ">
                                <tr >
                                  <td className="py-2 px-4  break-all capitalize">
                                    Task: {item.list}
                                  </td>
                                </tr>
                                <tr className="">
                                  <td className="py-2 px-4 ">
                                    <button
                                      onClick={() =>
                                        handleButtonClick({
                                          dataId: list._id,
                                          listId: item._id,
                                        })
                                      }
                                      className="text-black py-1 px-2"
                                    >
                                      Status:{" "}
                                      {item.isCompleted ? (
                                        <CheckCircleIcon />
                                      ) : (
                                        <RadioButtonUncheckedIcon />
                                      )}
                                    </button>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="py-2 px-4 ">
                                    <div className="flex justify-center gap-3">
                                      <button
                                        onClick={() =>
                                          handleDeleteClick({
                                            selecteddataId: list._id,
                                            selectedListId: item._id,
                                          })
                                        }
                                        className="relative text-red-500 py-1 px-2 rounded-md shadow-sm shadow-black"
                                        onMouseEnter={() =>
                                          handleHover(item._id)
                                        }
                                        onMouseLeave={handleUnhover}
                                      >
                                        <div>
                                          <DeleteIcon />
                                        </div>
                                        <span
                                          className={`${
                                            hoveredItem === item._id
                                              ? "block"
                                              : "hidden"
                                          } absolute bg-gray-700 text-white rounded-md -right-1/2 -left-1/2 -bottom-3/4`}
                                        >
                                          Delete
                                        </span>{" "}
                                      </button>

                                      <button
                                        className="relative text-blue-500 py-1 px-2 rounded-md shadow-sm shadow-black"
                                        onClick={() =>
                                          handleUpdate({
                                            dataId: list._id,
                                            listId: item._id,
                                          })
                                        }
                                        onMouseEnter={() =>
                                          handleEditHover(item._id)
                                        }
                                        onMouseLeave={handleEditUnhover}
                                      >
                                        <div>
                                          <EditIcon />
                                        </div>
                                        <span
                                          className={`${
                                            editHover === item._id
                                              ? "block"
                                              : "hidden"
                                          } absolute bg-gray-700 text-white rounded-md -right-1/2 -left-1/2 -bottom-3/4`}
                                        >
                                          Edit
                                        </span>{" "}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              </tr>
                            ))
                          )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ConfirmBox
        visible={confirmBoxVisible}
        message="Are you sure?"
        onCancel={handleConfirmCancel}
        onConfirm={handleConfirmChange}
      />
      <ConfirmBox
        visible={updateconfirmBoxVisible}
        message=" You are updating existing data. Are you sure?"
        onCancel={handleUpdateConfirmCancel}
        onConfirm={handleUpdateConfirmChange}
      />
      <ConfirmBox
        visible={deleteBoxVisible}
        message="Do you want to delete?"
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Journal;
