import React, { useEffect } from "react";

const ConfirmBox = ({ visible, message, onCancel, onConfirm }) => {

  return (
    visible && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 " onClick={onCancel}>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg text-gray-900 mb-4">{message}</p>
          <div className="flex justify-center">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-4"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="bg-stone-600 text-white px-4 py-2 rounded-md"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmBox;