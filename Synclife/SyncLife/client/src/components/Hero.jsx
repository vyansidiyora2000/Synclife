import React from 'react';
import mainImg from "../assets/images/main2.jpg";
import mainImg2 from "../assets/images/main.png";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div className="h-screen bg-slate-100 flex-col">
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="text-6xl signup:text-7xl md:text-8xl lg:text-9xl m-5 font-mainTag text-red-900">
            <span className="text-red-950">S</span>ync
            <span className="text-red-950">L</span>ife
          </h1>
          <p className="p-4 text-2xl md:text-3xl lg:text-4xl font-subTag tracking-tighter text-amber-950">
            Want to sync your life?
          </p>
          <p className="mb-10 pl-10 pr-10 text-sm md:text-base lg:text-lg text-lime-950">
            <span>Efficiently organize your daily tasks and </span>
            <span>workflow in a modern manner, enhancing</span>
            <span>your productivity effortlessly.</span>
          </p>
          <div >
          <button className="bg-gradient-to-r from-green-800 to-orange-800 text-white font-mono text-xl font-semibold py-2 px-4 rounded ">
            <Link to="/signup">Join Now</Link>
          </button>
          </div>
        </div>
      </div>
      <div className="hidden sm:block h-screen bg-zinc-300">
        <img
          src={mainImg}
          alt="main image"
          className="object-cover h-full w-full"
        />
      </div>
    </div>
  );
};

export default Hero;
