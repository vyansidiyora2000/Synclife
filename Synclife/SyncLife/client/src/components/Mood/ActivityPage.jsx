import React from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  addMoodData,
  fetchMoodData,
  setMoodData,
} from "../../reducers/moodSlice";
import { selectUser } from "../../reducers/authSlice";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";

import {
  food,
  health,
  hobbies,
  location,
  social,
  weather,
} from "../../assets/data/moodPage";
import Feeling from "./Feeling";
import ConfirmBox from "../ConfirmBox";

const SelectionList = ({ items, onSelect }) => (
  <>
    <ul className="grid grid-cols-3 signup:grid-cols-5 bg-slate-300 rounded-xl items-center justify-center shadow-md shadow-slate-300">
      {items.map((item) => (
        <li
          key={item.value}
          onClick={() => onSelect(item)}
          className="p-2 rounded-xl flex flex-col justify-center items-center hover:shadow-2xl hover:shadow-black"
        >
          <img src={item.image} alt={item.value} className="w-12 h-12" />
          <p className="text-sm">{item.value}</p>
        </li>
      ))}
    </ul>
  </>
);

const SelectedActivities = ({ selectedActivities }) => (
  <div className="flex flex-wrap justify-center items-center">
    {selectedActivities.map((activity) => (
      <div key={activity.value} className="m-1 px-2">
        <img src={activity.image} className="w-12 h-12" alt={activity.value} />
        <p>{activity.value}</p>
      </div>
    ))}
  </div>
);

const ActivityPage = ({ onClose, searchDate }) => {
  const dispatch = useDispatch();
  const moods = useSelector((state) => state.mood.moodData);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState([]);
  const [selectedSocialActivity, setSelectedSocialActivity] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedFood, setSelectedFood] = useState([]);
  const [selectedHealth, setSelectedHealth] = useState([]);
  const [selectedHobby, setSelectedHobby] = useState([]);
  const [isOpenFeeling, setIsOpenFeeling] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [msg, setMsg] = useState();
  const [error, setError] = useState();

  const user = useSelector(selectUser);

  const handleToggleFeeling = () => {
    setIsOpenFeeling(!isOpenFeeling);
  };

  const handleOptionClickFeeling = (feeling) => {
    setSelectedOption(feeling);
    setIsOpenFeeling(false);
    setError("");
  };

  const handleActivityClick = (weatherD) => {
    const isAlreadySelected = selectedActivity.some(
      (activity) => activity.value === weatherD.value
    );

    if (isAlreadySelected) {
      setSelectedActivity((prevActivities) =>
        prevActivities.filter((activity) => activity.value !== weatherD.value)
      );
    } else {
      setSelectedActivity((prevActivities) => [...prevActivities, weatherD]);
    }
  };

  const handleSocialClick = (socialD) => {
    const isAlreadySelected = selectedSocialActivity.some(
      (activity) => activity.value === socialD.value
    );

    if (isAlreadySelected) {
      setSelectedSocialActivity((prevSocialActivities) =>
        prevSocialActivities.filter(
          (activity) => activity.value !== socialD.value
        )
      );
    } else {
      setSelectedSocialActivity((prevSocialActivities) => [
        ...prevSocialActivities,
        socialD,
      ]);
    }
  };

  const handleLocationClick = (locationD) => {
    const isAlreadySelected = selectedLocation.some(
      (activity) => activity.value === locationD.value
    );

    if (isAlreadySelected) {
      setSelectedLocation((prevLocations) =>
        prevLocations.filter((activity) => activity.value != locationD.value)
      );
    } else {
      setSelectedLocation((prevLocations) => [...prevLocations, locationD]);
    }
  };

  const handleFoodClick = (foodD) => {
    const isAlreadySelected = selectedFood.some(
      (activity) => activity.value === foodD.value
    );

    if (isAlreadySelected) {
      setSelectedFood((prevFoods) =>
        prevFoods.filter((activity) => activity.value !== foodD.value)
      );
    } else {
      setSelectedFood((prevFoods) => [...prevFoods, foodD]);
    }
  };

  const handleHealthClick = (healthD) => {
    const isAlreadySelected = selectedHealth.some(
      (activity) => activity.value === healthD.value
    );

    if (isAlreadySelected) {
      setSelectedHealth((prevHealth) =>
        prevHealth.filter((activity) => activity.value !== healthD.value)
      );
    } else {
      setSelectedHealth((prevHealth) => [...prevHealth, healthD]);
    }
  };

  const handleHobbyClick = (hobbyD) => {
    const isAlreadySelected = selectedHobby.some(
      (activity) => activity.value === hobbyD.value
    );

    if (isAlreadySelected) {
      setSelectedHobby((prevHobby) =>
        prevHobby.filter((activity) => activity.value !== hobbyD.value)
      );
    } else {
      setSelectedHobby((prevHobby) => [...prevHobby, hobbyD]);
    }
  };

  const handleDataEnter = () => {
    onClose();
    const newDate = moment(searchDate).format("YYYY-MM-DD");

    if (selectedOption && selectedOption.value && user) {
      dispatch(
        addMoodData({
          date: newDate,
          feeling: { value: selectedOption.value, image: selectedOption.image },
          activity: [
            {
              weather: selectedActivity.map((activity) => ({
                value: activity.value,
                image: activity.image,
              })),
              social: selectedSocialActivity.map((activity) => ({
                value: activity.value,
                image: activity.image,
              })),
              location: selectedLocation.map((activity) => ({
                value: activity.value,
                image: activity.image,
              })),
              food: selectedFood.map((activity) => ({
                value: activity.value,
                image: activity.image,
              })),
              health: selectedHealth.map((activity) => ({
                value: activity.value,
                image: activity.image,
              })),
              hobby: selectedHobby.map((activity) => ({
                value: activity.value,
                image: activity.image,
              })),
            },
          ],
          userToken: user.token,
        })
      );
    }
    fetchAndSetMoods();
  };

  const fetchAndSetMoods = async () => {
    try {
      if (user) {
        const response = await dispatch(fetchMoodData(user.token));
        dispatch(setMoodData(response.payload));
      } else {
        console.log("No user from mood");
      }
    } catch (error) {
      console.log("error in fetching mood:", error);
    }
  };

  useEffect(() => {
    fetchAndSetMoods();
  }, [dispatch]);

  const handleSaveConfirm = () => {
    setConfirmSave(false);
    handleDataEnter();
  };

  const handleSaveCancel = () => {
    setConfirmSave(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSaveClick();
  };

  const handleSaveClick = () => {
    const hasPreviousEntry = moods.some((mood) =>
      moment(mood.date).isSame(moment(searchDate), "day")
    );
    if (!selectedOption) {
      setError("Select your mood");
      return;
    }
    if (hasPreviousEntry) {
      setMsg("Do you want to update existing data?");
    } else {
      setMsg("Are you sure?");
    }
    setConfirmSave(true);
  };

  // useEffect(() => {
  //   if (confirmSave) {
  //     document.documentElement.style.overflow = "hidden";
  //   } else {
  //     document.documentElement.style.overflow = "";
  //   }
  // }, [confirmSave]);

  const renderFilteredMoods = () => {
    const filteredMoods = moods.filter((mood) =>
      moment(mood.date).isSame(moment(searchDate), "day")
    );

    return (
      <div>
        {filteredMoods.map((filteredMood) => (
          <div key={filteredMood._id} className="flex justify-center">
            <li className="bgHabit m-2 rounded-md p-4 shadow-sm shadow-black list-none max-w-80">
              <span className="text-xl sm:text-xl md:text-lg lg:text-xl font-mono text-gray-700 underline">
                Previous Entry
              </span>
              <div className="mt-2 grid gap-2">
                <div
                  key={filteredMood._id}
                  className="flex flex-col justify-center items-center gap-2"
                >
                  <span className="text-2xl font-serif text-gray-700">
                    {filteredMood.feeling.value}
                  </span>
                  <img
                    src={filteredMood.feeling.image}
                    alt={filteredMood.feeling.value}
                    className="h-12 w-12"
                  />
                </div>

                {filteredMood.activity[0].weather.length === 0 &&
                filteredMood.activity[0].social.length === 0 &&
                filteredMood.activity[0].location.length === 0 &&
                filteredMood.activity[0].food.length === 0 &&
                filteredMood.activity[0].health.length === 0 &&
                filteredMood.activity[0].hobby.length === 0 ? (
                  <p className="text-gray-500">No activity selected</p>
                ) : (
                  <div
                    className="grid grid-cols-2 md:grid-cols-1 activityP:grid-cols-2 gap-2 max-h-20 pr-5 overflow-y-auto"
                    id="style-1"
                  >
                    {!filteredMood.activity[0].weather.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].weather.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-xl font-serif text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                    {!filteredMood.activity[0].social.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].social.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-xl font-serif text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                    {!filteredMood.activity[0].location.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].location.map(
                        (emotion, index) => (
                          <div
                            key={index}
                            className="flex flex-col justify-center items-center gap-2"
                          >
                            <span className="text-xl font-serif text-gray-700">
                              {emotion.value}
                            </span>
                            <img
                              src={emotion.image}
                              alt={emotion.value}
                              className="h-12 w-12"
                            />
                          </div>
                        )
                      )}
                    {!filteredMood.activity[0].food.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].food.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-xl font-serif text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                    {!filteredMood.activity[0].health.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].health.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-xl font-serif text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                    {!filteredMood.activity[0].hobby.some(
                      (emotion) =>
                        emotion.value === null || emotion.image === null
                    ) &&
                      filteredMood.activity[0].hobby.map((emotion, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-center items-center gap-2"
                        >
                          <span className="text-xl font-serif text-gray-700">
                            {emotion.value}
                          </span>
                          <img
                            src={emotion.image}
                            alt={emotion.value}
                            className="h-12 w-12"
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </li>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full grid gap-20">
      <form
        className="flex flex-col items-center gap-4"
        onSubmit={handleSubmit}
      >
        <div>
          <div>
            <div className="flex justify-start w-full items-center gap-2 p-5">
              <div className="w-1/12 cursor-pointer" onClick={onClose}>
                <ArrowCircleLeftIcon />
              </div>
              <p className="w-11/12 text-center font-serif underline  text-lg signup:text-2xl md:text-3xl ">
                Fill entry for {moment(searchDate).format("DD-MM-YYYY")}
              </p>
            </div>
            <div >
              {moods.filter((mood) =>
                moment(mood.date).isSame(moment(searchDate), "day")
              ).length > 0 ? (
                <>
                  {" "}
                  <div className="grid grid-rows-[1fr,1.1fr] gap-2 md:grid-rows-none md:grid-cols-4 justify-items-center">
                  <div className="md:col-span-3 w-[250px] signup:w-[350px] activityP:w-[450px] ">
                    {" "}
                    <Feeling
                      selectedOption={selectedOption}
                      isOpenFeeling={isOpenFeeling}
                      handleToggle={handleToggleFeeling}
                      handleOptionClick={handleOptionClickFeeling}
                    />
                  </div>
                  {searchDate && moods && renderFilteredMoods()}
                  </div>
                </>
              ) : (
                <div className="grid md:grid-rows-none md:grid-cols-4 justify-items-center">
                <div className="md:col-span-4 w-[250px] signup:w-[350px] activityP:w-[450px]">
                  {" "}
                  <Feeling
                    selectedOption={selectedOption}
                    isOpenFeeling={isOpenFeeling}
                    handleToggle={handleToggleFeeling}
                    handleOptionClick={handleOptionClickFeeling}
                  />
                </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <label className="text-center font-semibold text-2xl m-2">
          What activity caused this feeling?
        </label>
        
        <div className="max-w-[250px] px-5 flex flex-wrap signup:max-w-3xl bg-stone-200 rounded-3xl shadow-md shadow-slate-300">
          <div>
            {selectedActivity && selectedActivity.length > 0 && (
              <SelectedActivities selectedActivities={selectedActivity} />
            )}
          </div>
          <div>
            {selectedSocialActivity && selectedSocialActivity.length > 0 && (
              <SelectedActivities selectedActivities={selectedSocialActivity} />
            )}
          </div>
          <div>
            {selectedLocation && selectedLocation.length > 0 && (
              <SelectedActivities selectedActivities={selectedLocation} />
            )}
          </div>
          <div>
            {selectedFood && selectedFood.length > 0 && (
              <SelectedActivities selectedActivities={selectedFood} />
            )}
          </div>
          <div>
            {selectedHealth && selectedHealth.length > 0 && (
              <SelectedActivities selectedActivities={selectedHealth} />
            )}
          </div>
          <div>
            {selectedHobby && selectedHobby.length > 0 && (
              <SelectedActivities selectedActivities={selectedHobby} />
            )}
          </div>
        </div>
        <div className="w-full gap-5 grid justify-items-center xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
          <div className="w-[250px] signup:w-[350px] activityP:w-[400px]">
            <p className="text-center font-mono text-xl">Weather</p>
            <SelectionList items={weather} onSelect={handleActivityClick} />
          </div>
          <div className="w-[250px] signup:w-[350px] activityP:w-[400px]">
            <p className="text-center font-mono text-xl">Social</p>
            <SelectionList items={social} onSelect={handleSocialClick} />
          </div>
          <div className="w-[250px] signup:w-[350px] activityP:w-[400px]">
            <p className="text-center font-mono text-xl">Location</p>
            <SelectionList
              items={location}
              onSelect={handleLocationClick}
              selectedOptions={selectedLocation}
            />
          </div>
          <div className="w-[250px] signup:w-[350px] activityP:w-[400px]">
            <p className="text-center font-mono text-xl">Food</p>
            <SelectionList
              items={food}
              onSelect={handleFoodClick}
              selectedOptions={selectedFood}
            />
          </div>
          <div className="w-[250px] signup:w-[350px] activityP:w-[400px]">
            <p className="text-center font-mono text-xl">Health</p>
            <SelectionList
              items={health}
              onSelect={handleHealthClick}
              selectedOptions={selectedHealth}
            />
          </div>
          <div className="w-[250px] signup:w-[350px] activityP:w-[400px]">
            <p className="text-center font-mono text-xl">Hobby</p>
            <SelectionList
              items={hobbies}
              onSelect={handleHobbyClick}
              selectedOptions={selectedHobby}
            />
          </div>
        </div>
        <div>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            className=" mt-2 mb-10 bg-slate-700 text-white shadow-lg shadow-slate-400 dark:shadow-slate-5 py-2 px-4 rounded-3xl "
            type="submit"
          >
            Save
          </button>
        </div>
      </form>

      <ConfirmBox
        visible={confirmSave}
        message={msg}
        onCancel={handleSaveCancel}
        onConfirm={handleSaveConfirm}
      />
    </div>
  );
};

export default ActivityPage;
