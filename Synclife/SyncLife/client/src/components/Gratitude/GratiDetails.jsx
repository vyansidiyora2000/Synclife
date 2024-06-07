import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { deleteGratitude } from "../../reducers/gratiSlice";
import { selectUser } from "../../reducers/authSlice";
import ConfirmBox from "../ConfirmBox";
const VITE_SERVER_IMAGE_URL = import.meta.env.VITE_SERVER_IMAGE_URL;

const GratiDetails = ({ date, onClose }) => {
  const gratitudes = useSelector((state) => state.gratitude.gratitudes);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletedate, setDeleteDate] = useState();

  const handleDeleteConfirm = () => {
    setConfirmDelete(false);
    handleDelete({ deletedate });
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(false);
  };

  const handleDeleteClick = (date) => {
    setDeleteDate(date);
    setConfirmDelete(true);
  };
  const gratitudesForDate = gratitudes.filter((entry) =>
    moment(entry.date).isSame(date, "day")
  );

  const handleDelete = async ({ deletedate }) => {
    let newDate = null;

    if (user) {
      try {
        newDate = moment(deletedate).format("YYYY-MM-DD");
        await dispatch(deleteGratitude({ newDate, userToken: user.token }));
      } catch (error) {
        console.log("Error deleting list:", error);
      }
    }
    onClose();
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bgHabitDetail p-8 rounded-md shadow-lg min-w-[600px] max-w-[800px] min-h-[300px] max-h-96 overflow-y-auto z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-4xl font-subTag underline mb-10">
          Entry for {moment(date).format("DD-MM-YYYY")} Date
        </p>
        <div>
          {gratitudesForDate.length === 0 ? (
            <p className="text-gray-700 mb-28 text-center">No data available</p>
          ) : (
            gratitudesForDate.map((entry) => (
              <div key={entry._id}>
                <div className="flex justify-center gap-10 items-center">
                  <h1 className="break-all w-1/2">{entry.entry}</h1>
                  <div className="w-1/2">
                    <img
                      src={`${VITE_SERVER_IMAGE_URL}/${entry.image}`}
                      alt="entry"
                      onClick={() =>
                        setSelectedImage(
                          `${VITE_SERVER_IMAGE_URL}/${entry.image}`
                        )
                      }
                      onError={(e) => console.error("image load error", e)}
                      className="w-96 h-72 object-cover cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  className="mt-5 bg-slate-600 bottom-0 text-white px-4 py-2 rounded-full hover:bg-slate-700 transition duration-300 ease-in-out focus:outline-none focus:ring focus:border-slate-900"
                  onClick={() => handleDeleteClick(date)}
                >
                  Delete Entry
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-screen-lg">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-screen max-w-full"
            />
          </div>
        </div>
      )}
      <ConfirmBox
        visible={confirmDelete}
        message="Do you want to delete entry?"
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default GratiDetails;
