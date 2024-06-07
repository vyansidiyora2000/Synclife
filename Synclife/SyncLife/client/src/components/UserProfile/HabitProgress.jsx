import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../reducers/authSlice";
import { fetchHabits, setHabits } from "../../reducers/habitSlice";
import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import moment from "moment";

ChartJS.register(ArcElement, Legend, Tooltip);

const HabitProgress = () => {
  const habits = useSelector((state) => state.habit.habits);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const today = moment();

  const fetchHabitData = async () => {
    try {
      if (user) {
        const response = await dispatch(fetchHabits(user.token));
        dispatch(setHabits(response.payload));
      } else {
        console.log("User doesn't exist");
      }
    } catch (error) {
      console.log("Error in fetching habits in progress page: ", error);
    }
  };

  useEffect(() => {
    fetchHabitData();
  }, [dispatch]);

  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-5xl underline decoration-1 font-subTag mb-6">
          GoalMinder
        </h1>
      </div>
      <div className="m-2 min-h-96 grid  grid-cols-1 md:grid-cols-2 gap-2">
      <div>
      <p className="text-5xl underline font-subTag mb-5">Going Habits</p>
        <div className="grid grid-cols-1 habitP:grid-cols-2 md:grid-cols-2 gap-1">
          {habits &&
            habits
              .filter((data) => moment(data.endDate).isAfter(today))
              .map((habit) => (
                <div
                  key={habit._id}
                  className="mb-4 flex flex-col justify-center items-center"
                >
                  <p className="text-2xl  capitalize">{habit.name}</p>
                  <p>Total Streak Days: {habit.data.length}</p>
                  <div className="flex items-center justify-center w-60 ">
                    <Pie
                      data={{
                        labels: ["Completed days", "Incompleted days"],
                        datasets: [
                          {
                            data: [
                              habit.data.filter((day) => day.isCompleted)
                                .length,
                              habit.data.length -
                                habit.data.filter((day) => day.isCompleted)
                                  .length,
                            ],
                            backgroundColor: [
                              "rgba(65, 109, 25 , 0.8)",
                              "rgba(179, 19, 18, 0.8)",
                            ],
                            borderColor: [
                              "rgba(19, 255, 19, 1)",
                              "rgba(255, 19, 19, 1)",
                            ],
                            borderWidth: 1,
                          },
                        ],
                      }}
                    />
                  </div>
                  <p className="text-lg mt-4 font-semibold">
                    {habit.data.length ===
                    habit.data.filter((day) => day.isCompleted).length
                      ? "You achieved it✌"
                      : habit.data.filter((day) => day.isCompleted).length === 0
                      ? "Try harder💪"
                      : habit.data.filter((day) => day.isCompleted).length ===
                        habit.data.length / 2
                      ? "You are on the right path👍"
                      : habit.data.filter((day) => day.isCompleted).length >
                        habit.data.length / 2
                      ? "You are almost there🤞"
                      : "Keep trying👊"}
                  </p>{" "}
                </div>
              ))}
        </div>
        </div>
        <div>
          <p className="text-5xl underline font-subTag mb-5">Expired Habits</p>
          <div className="grid grid-cols-1 habitP:grid-cols-2 md:grid-cols-2 gap-4">
            {habits &&
              habits
                .filter((data) => moment(data.endDate).isBefore(today))
                .map((habit) => (
                  <div
                    key={habit._id}
                    className="mb-4 flex flex-col justify-center items-center"
                  >
                    <p className="text-2xl  capitalize">{habit.name}</p>
                    <p>Total Streak Days: {habit.data.length}</p>
                    <div className="flex items-center justify-center w-60 ">
                      <Pie
                        data={{
                          labels: ["Completed days", "Incompleted days"],
                          datasets: [
                            {
                              data: [
                                habit.data.filter((day) => day.isCompleted)
                                  .length,
                                habit.data.length -
                                  habit.data.filter((day) => day.isCompleted)
                                    .length,
                              ],
                              backgroundColor: [
                                "rgba(65, 109, 25 , 0.5)",
                                "rgba(179, 19, 18, 0.5)",
                              ],
                              borderColor: [
                                "rgba(19, 255, 19, 0.8)",
                                "rgba(255, 19, 19, 0.8)",
                              ],
                              borderWidth: 1,
                            },
                          ],
                        }}
                      />
                    </div>
                    <p className="text-lg text-gray-600 mt-4 font-semibold">
                      {habit.data.length ===
                      habit.data.filter((day) => day.isCompleted).length
                        ? "You achieved it✌"
                        : habit.data.filter((day) => day.isCompleted).length ===
                          0
                        ? "You should Try harder💪"
                        : habit.data.filter((day) => day.isCompleted).length ===
                          habit.data.length / 2
                        ? "You were on the right path👍"
                        : habit.data.filter((day) => day.isCompleted).length >
                          habit.data.length / 2
                        ? "You were almost there🤞"
                        : "You lost it👊"}
                    </p>{" "}
                  </div>
                ))}
          </div>
        </div>
      </div>{" "}
    </div>
  );
};
export default HabitProgress;
