import React from 'react';
import signup from "../assets/images/signup.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {  registerUser } from "../reducers/authSlice";
import { useSelector } from "react-redux";
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    password: "",
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleRedirect = () => {
    dispatch({ type: "auth/clearError" });
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    dispatch({ type: "auth/clearError" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      await dispatch(registerUser(formData));
      setRegistrationSuccess(true);
     

    } catch (error) {
      console.error("Signup error:", error);
      setRegistrationSuccess(false);
      return;
    }
  };
  useEffect(() => {
  
    if (registrationSuccess && !error) {
      navigate("/home");
      setRegistrationSuccess(false);
    } else if (error) {
      console.error("Registration error:", error);
      setRegistrationSuccess(false);
    }
  }, [registrationSuccess, error, navigate]);
  
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
        <form
          className="flex flex-col signup:grid signup:grid-cols-2 gap-2 signup:gap-6 mt-8 bg-zinc-400 py-4 px-2 galaxyF:p-5 signup:p-10 rounded-md shadow-xl"
          onSubmit={handleSubmit}
        >
        
          <div className='flex flex-col justify-center items-center'>
            <label
              htmlFor="firstName"
              className="block mb-2  text-base lg:text-lg text-black text-left"
            >
              First Name:
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Helly"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="block w-4/6 signup:w-full px-4 py-2 signup:px-5 signup:py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className='flex flex-col justify-center items-center'>
            <label
              htmlFor="lastName"
              className="block mb-2  text-base lg:text-lg text-black text-left"
            >
              Last name:
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Diyora"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="block w-4/6 signup:w-full px-4 py-2 signup:px-5 signup:py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className='flex flex-col justify-center items-center'>
            <label
              htmlFor="email"
              className="block mb-2  text-base lg:text-lg text-black text-left"
            >
              Email address:
            </label>
            <input
              type="email"
              id="email"
              placeholder="hellyd@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-4/6 signup:w-full px-4 py-2 signup:px-5 signup:py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg  focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className='flex flex-col justify-center items-center'>
            <label
              htmlFor="birthdate"
              className="block mb-2 text-base lg:text-lg text-black text-left"
            >
              Birthdate:
            </label>
            <input
              id="birthDate"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="block w-4/6 signup:w-full px-4 py-2 signup:px-5 signup:py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg  focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className='flex flex-col justify-center items-center'>
            <label
              htmlFor="password"
              className="block mb-2  text-base lg:text-lg text-black text-left"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-4/6 signup:w-full px-4 py-2 signup:px-5 signup:py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg  focus:border-blue-400  focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="signup:col-span-2">
            <p className="text-sm text-black text-center mb-2 " onClick={handleRedirect}>
              Already have an account?{" "}
              <a href="#" className="text-blue-950 underline decoration-solid">
                Login here
              </a>
            </p>
          </div>
          <div className="flex justify-center signup:col-span-2">
            <button
              className="w-60 px-6 py-3 text-sm text-white capitalize transition-colors duration-300 transform bg-zinc-800 rounded-lg hover:bg-zinc-700"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>
          </div>
          {error && (
            <div className="flex justify-center signup:col-span-2">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
