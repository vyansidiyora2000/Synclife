import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUser, fetchUser } from "../../reducers/authSlice";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const UserBar = ({ userOpen, setUserOpen }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const fetchU = useSelector(selectUser);

  const getDetails = () => {
    try {
      const email = fetchU.email;
      dispatch(fetchUser({ email }));
    } catch (error) {
      console.error("Error in fetching: ", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, [dispatch]);

  const handleLogOut = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      console.log("Error in logging out: ", error);
    }
  };

  const handleClose = () => {
    setUserOpen(false);
  };
  return (
    <div className="h-full bg-slate-200 z-50 flex justify-center">
      <div className="p-5 flex flex-col text-left items-center mx-auto  w-full ">
        <h1 className="text-4xl font-mainTag mb-4 ">
          {userData.firstName}'s data
        </h1>
        {userData && (
          <div className="flex flex-col gap-1 text-sm sm:text-xl p-5 border rounded bg-white shadow-md">
            <p>
              <span className="font-semibold">First Name:</span>{" "}
              {userData.firstName}
            </p>
            <p>
              <span className="font-semibold">Last Name:</span>{" "}
              {userData.lastName}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <p>
              <span className="font-semibold">Birth Date:</span>{" "}
              {moment(userData.birthDate).format("DD-MM-YYYY")}
            </p>
          </div>
        )}

        <button
          onClick={handleLogOut}
          className="mt-4 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition duration-300 "
        >
          Log Out
        </button>
      </div>
      {/* <div
        onClick={handleClose}
        className="flex justify-center items-center cursor-pointer"
      >
        <ArrowBackIosNewIcon />
      </div> */}
    </div>
  );
};

export default UserBar;
