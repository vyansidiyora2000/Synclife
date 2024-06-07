import React, { useState } from "react";
import JournalProgress from "./JournalProgress";
import Navbar from "../Home/Navbar";
import Footer from "../Home/Footer";
import HabitProgress from "./HabitProgress";
import MoodProgress from "./MoodProgress";

const Progress = ({
  onJournalProgressClick,
  onHabitProgressClick,
  onMoodProgressClick,
}) => {
  return (
    <div>
      <ul className="grid signup:grid-cols-3 sm:text-lg userP:text-2xl md:text-xl gap-4">
        <li className="bg-gray-300  rounded-md flex justify-center items-center p-5 cursor-pointer">
          <span onClick={onJournalProgressClick} >
            TaskMate
          </span>{" "}
        </li>
        <li className="bg-gray-300 rounded-md flex justify-center items-center p-5 cursor-pointer">
          <span onClick={onHabitProgressClick} >
            GoalMinder
          </span>{" "}
        </li>
        <li className="bg-gray-300 rounded-md flex justify-center items-center p-5 cursor-pointer">
          <span onClick={onMoodProgressClick} >
            EmoSense
          </span>
        </li>
      </ul>
    </div>
  );
};

const UserProfile = () => {
  const [activeProgress, setActiveProgress] = useState("journal");

  const handleProgressClick = (progress) => {
    setActiveProgress(progress);
  };

  return (
    <div className="flex flex-col ">
      <Navbar />
      <div className="min-h-screen bg-gray-100 ">
        <h1 className="font-mainTag text-5xl pt-5"> Progress</h1>
        <div className="grid">
          <div className="p-5 flex justify-center items-center gap-5">
            <Progress
              onJournalProgressClick={() => handleProgressClick("journal")}
              onHabitProgressClick={() => handleProgressClick("habit")}
              
              onMoodProgressClick={() => handleProgressClick("mood")}
            />
          </div>
          <div >
            {activeProgress === "journal" && <JournalProgress />}
            {activeProgress === "habit" && <HabitProgress />}

            {activeProgress === "mood" && <MoodProgress />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
