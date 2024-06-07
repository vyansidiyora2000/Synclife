import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { changePassword } from "../reducers/authSlice";

const ResetPwd = () => {
  const [resetData, setResetData] = useState({password: "" });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
   try{
    await dispatch(changePassword(resetData))
   }catch(error)
   {
    console.error("Error is resetting password");
   }
    setResetData({ password: "" });
  };

  const handleChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center align-middle  min-h-screen">
      <form className=" mt-8 bg-zinc-400 p-5 px-8 rounded-md shadow-xl" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-xl text-black text-left"
          >
            Enter new Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            name="password"
            value={resetData.password}
            onChange={handleChange}
            className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg mb-2"
          />
        </div>
        <div>
          <button
            className=" px-6 py-3 text-sm text-white capitalize transition-colors duration-300 transform bg-zinc-800 rounded-2xl hover:bg-zinc-700 "
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPwd;
