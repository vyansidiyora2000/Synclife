import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import data from "../../assets/data/homeData";
import { useNavigate } from "react-router-dom";

import homeImg from "../../assets/images/home1.png";
import homeImg2 from "../../assets/images/home2.jpg";

const Home = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  const handleCardClick = (index, link) => {
    setSelectedCard(index);
    navigate(link);
  };

  return (
    <div className="grid grid-rows-[auto,auto,auto,auto]">
      <Navbar />
      <div>
        <div className="relative h-screen">
          <div
            className="absolute inset-0 "
            style={{
              backgroundImage: `url(${homeImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          ></div>
          <div className="flex flex-col gap-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-danceTag text-slate-900 bg-orange-50 px-1">
              Welcome to SyncLife
            </h1>
            <div>
              <p className="inline-block text-[10px] md:text-[15px] ll:text-lg  font-mainTag px-2 bg-slate-900 text-whit ">
                Navigating TODAY, designing TOMORROW
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full bg-slate-200">
        <div className="w-full text-center text-white">
          <div className="py-10 flex flex-col gap-10">
            <div>
              <h1 className="px-3 inline-block text-2xl min-[300px]:text-4xl min-[400px]:text-5xl min-[500px]:text-6xl  font-danceTag bg-slate-900 text-orange-200 font-thin">
                What we provide
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 justify-items-center gap-5 px-10">
              {data.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col gap-2 cardBg rounded-xl p-4 max-w-xs min-[300px]-min-h-[400px] ${
                    selectedCard === index ? "selected" : ""
                  }`}
                  onClick={() => handleCardClick(index, item.link)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="hidden min-[300px]:block sm:block md:block object-cover h-64 rounded-md lg:h-64"
                  />
                  <h1 className="font-subTag font-bold text-2xl md:text-xl text-white ">
                    {item.title}
                  </h1>
                  <p className="text-white font-mainTag text-lg md:text-base  ">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
