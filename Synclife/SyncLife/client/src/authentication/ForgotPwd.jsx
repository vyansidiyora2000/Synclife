import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, checkOtp, forgotUser } from "../reducers/authSlice";
import { useNavigate } from "react-router-dom";
import signup from "../assets/images/signup.jpg";

const ForgotPwd = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [otpData, setOtpData] = useState({ otp: "" });
  const [otpMode, setOtpMode] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetData, setResetData] = useState({ email: "", password: "" });
  const [otpError, setOtpError] = useState("");
  const [logInSuccess, setLogInSuccess] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(forgotUser(formData));
    } catch (error) {
      console.error("Login error:", error);
    }
    setFormData({ email: "" });
    setOtpMode(true);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(checkOtp(otpData));
      if (response.payload.message === "OTP verified successfully") {
        setOtpVerified(true);
      }
    } catch (error) {
      setOtpError("Invalid OTP");
      console.error("Login error:", error);
    }
    setOtpData({ otp: "" });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (await dispatch(changePassword(resetData))) {
        setLogInSuccess(true);
      }
    } catch (error) {
      console.error("Error is resetting password");
    }
  };

  const handleResetChange = (e) => {
    setResetData({ ...resetData, [e.target.name]: e.target.value });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtpData({ ...otpData, [e.target.name]: e.target.value });
    setOtpError("");
  };

  useEffect(() => {
    if (logInSuccess && !error) {
      navigate("/home");
      setLogInSuccess(false);
    } else if (error) {
      console.error("LogIn error:", error);
      setLogInSuccess(false);
    }
  }, [logInSuccess, error, navigate]);

  return (
    <div className="grid md:grid-cols-2 md:bg-white bg-gray-100">
      <div className="h-screen hidden md:block bg-zinc-100">
        <img
          src={signup}
          alt="main image"
          className="object-cover h-full w-full"
        />
      </div>
      <div className="h-screen p-6 bg-white flex items-center justify-center">
        {otpVerified ? (
          <div className="h-screen w-full  p-6 flex items-center justify-center">
            <form
              className=" mt-8 bg-zinc-400 p-5 px-8 rounded-md shadow-xl"
              onSubmit={handlePasswordSubmit}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-base text-black text-left"
                >
                  Email address:
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="hellyD@example.com"
                  name="email"
                  value={resetData.email}
                  onChange={handleResetChange}
                  className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg mb-2"
                />
              </div>
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
                  onChange={handleResetChange}
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
        ) : (
          <div className="h-screen  w-full p-6 flex items-center justify-center">
            {otpMode ? (
              <form
                className=" mt-8 bg-zinc-400 p-5 px-8 rounded-md shadow-xl"
                onSubmit={handleOtpSubmit}
              >
                {" "}
                <p className="pb-2 text-2xl">Enter OTP</p>
                <div>
                  <label
                    htmlFor="otp"
                    className="block mb-2 text-base text-black text-left"
                  >
                    Enter otp recieved in email:
                  </label>
                  <input
                    id="otp"
                    type="text"
                    name="otp"
                    placeholder="otp"
                    value={otpData.otp}
                    onChange={handleOtpChange}
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg mb-2"
                  />
                </div>
                <div>
                  <button
                    className=" px-6 py-3 text-sm text-white capitalize transition-colors duration-300 transform bg-zinc-800 rounded-2xl hover:bg-zinc-700 "
                    type="submit"
                  >
                    confirm
                  </button>
                  {otpError && <div className="text-red-500">{otpError}</div>}
                </div>
              </form>
            ) : (
              <form
                className=" mt-8 bg-zinc-400 p-5 px-8 rounded-md shadow-xl"
                onSubmit={handleSubmit}
              >
                {" "}
                <p className="pb-2 text-2xl">Forgot Password</p>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-base text-black text-left"
                  >
                    Email address:
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="hellyD@example.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg mb-2"
                  />
                </div>
                <div>
                  <button
                    className=" px-6 py-3 text-sm text-white capitalize transition-colors duration-300 transform bg-zinc-800 rounded-2xl hover:bg-zinc-700 "
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "sending..." : "Send"}
                  </button>
                  {error && (
                    <div className="flex justify-center col-span-2">
                      <p className="text-red-500">{error}</p>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPwd;
