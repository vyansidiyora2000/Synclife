import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import progress from "../../assets/images/progress.png";
import profile from "../../assets/images/profile.png";
import {
  fetchUser,
  selectUser,
} from "../../reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/images/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import UserBar from "../UserProfile/UseBar";

const NavBox = ({ onClose }) => {
  return (
    <div>
      <div
        className="z-50 backCustom rounded-b-lg"
        onClick={onClose} // Close NavBox when clicked outside
      >
        <ul className="grid grid-rows-4 items-center text-center text-lg text-white font-medium font-subTag md:text-xl lg:text-2xl ">
          <li className="hover:bg-slate-400 px-6 py-2">
            <Link to="/journal">
              {" "}
              <span className=" hover:text-black transition duration-300 ease-in-out">
                TaskMate
              </span>
            </Link>
          </li>
          <li className="hover:bg-slate-400 px-6 py-2">
            <Link to="/habits">
              <span className="hover:text-black transition duration-300 ease-in-out">
                GoalMinder
              </span>
            </Link>
          </li>
          <li className="hover:bg-slate-400 px-6 py-2">
            <Link to="/gratitude">
              <span className="hover:text-black transition duration-300 ease-in-out">
                GratiMemo
              </span>
            </Link>
          </li>
          <li className="hover:bg-slate-400  hover:rounded-b-lg px-6 py-2">
            <Link to="/mood">
              <span className="hover:text-black transition duration-300 ease-in-out">
                EmoSense
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.user);

  const fetchU = useSelector(selectUser);

  useEffect(() => {
    const getDetails = () => {
      try {
        const email = fetchU.email;
        dispatch(fetchUser({ email }));
      } catch (error) {
        console.error("Error in fetching: ", error);
      }
    };

    getDetails();
  }, [dispatch]);

  const handleToggle = () => {
    setIsVisible(!isVisible);
    setUserOpen(false);
  };
  useEffect(() => {
    if (isVisible || userOpen) {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
  }, [isVisible, userOpen]);

  const handleClick = () => {
    setUserOpen(!userOpen);
    setIsVisible(false);
  };
  const handleClose = () => {
    setUserOpen(false);
  };
  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-5 backCustom p-2 items-center relative">
        <div>
          {" "}
          <Link to="/home" className="text-left">
            <img src={logo} alt="synclife" className="h-12 w-12" />
          </Link>
        </div>
        <div className=" sm:col-span-3  ">
          <div className="hidden sm:block">
            <ul className="grid grid-cols-4 items-center text-right text-lg text-white font-medium  font-subTag md:text-xl lg:text-2xl gap-10">
              <Link to="/journal">
                {" "}
                <span className=" hover:text-orange-200 transition duration-300 ease-in-out">
                  TaskMate
                </span>
              </Link>
              <Link to="/habits">
                <span className="hover:text-orange-200 transition duration-300 ease-in-out">
                  GoalMinder
                </span>
              </Link>

              <Link to="/mood">
                <span className="hover:text-orange-200 transition duration-300 ease-in-out">
                  EmoSense
                </span>
              </Link>
              <Link to="/gratitude">
                <span className="hover:text-orange-200 transition duration-300 ease-in-out">
                  GratiMemo
                </span>
              </Link>
            </ul>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 flex justify-end items-center gap-2">
          <div className="flex justify-center items-center">
            <Link to="/user" className=" text-white">
              <img src={progress} className="h-12 w-12 p-2" />
            </Link>
            
              <div>
                <span
                  onClick={handleClick}
                  className="text-white hover:text-orange-200 transition duration-300 ease-in-out font-mainTag cursor-pointer"
                >
                 <img src={profile} className="h-12 w-12 p-1" />
                </span>
                {userOpen && (
                  <div
                    className="fixed top-16 inset-0 bg-black opacity-50 z-40"
                    onClick={handleClose}
                  ></div>
                )}
                <div
                  className={`${
                    userOpen
                      ? "left-0 top-16 transition-all duration-800 fixed h-full z-50 "
                      : "fixed top-16 -left-96 signup:left-[-100%] transition-all h-full duration-700"
                  }`}
                >
                  <UserBar userOpen={userOpen} setUserOpen={setUserOpen} />
                </div>
              </div>
            
          </div>
          <div
            className="block sm:hidden cursor-pointer"
            onClick={handleToggle}
          >
            {isVisible ? (
              <CloseIcon className="text-white" />
            ) : (
              <MenuIcon className="text-white " />
            )}
          </div>
        </div>
        {isVisible && (
          <div
            className="fixed top-16 inset-0 bg-black opacity-50 z-40"
            onClick={handleToggle}
          ></div>
        )}
        <div
          className={`${
            isVisible
              ? "right-0 top-16 transition-all z-50 duration-200 fixed "
              : "fixed right-[-100%] top-16 transition-all duration-700"
          }`}
        >
          <NavBox onClose={handleToggle} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
