import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../reducers/authSlice";
import { fetchLists, setLists } from "../../reducers/journalSlice";
import { useEffect, useState } from "react";
import moment from "moment";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);

const JournalProgress = () => {
  const lists = useSelector((state) => state.list.lists);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [view, setView] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  const fetchTasks = async () => {
    try {
      if (user) {
        const response = await dispatch(fetchLists(user.token));
        dispatch(setLists(response.payload));
      } else {
        console.log("user not exist");
      }
    } catch (error) {
      console.log("Error in fetching in progress in journal: ", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [dispatch]);

  const toggleView = (selectedView) => {
    setView(selectedView);
  };

  /**Daily View */
  const totaltask =
    lists &&
    lists.filter((list) => {
      const listDate = moment(new Date(list.date)).format("YYYY-MM-DD");
      const currentDate = moment(new Date()).format("YYYY-MM-DD");
      return listDate === currentDate;
    });

  const totalTasksToday = totaltask[0] ? totaltask[0].data.length : 0;

  const dailyCompletedTasks = totaltask[0]
    ? totaltask[0].data.filter((task) => task.isCompleted).length
    : 0;

  const dailyIncompletedTasks = totaltask[0]
    ? totaltask[0].data.filter((task) => !task.isCompleted).length
    : 0;

  const dailyData = {
    labels: ["Incompleted", "Completed"],
    datasets: [
      {
        label: "Number of tasks",
        data: [dailyIncompletedTasks, dailyCompletedTasks],
        backgroundColor: ["rgb(255, 99, 132 , 0.5)", "rgb(54, 162, 235 , 0.5)"],
        borderColor: ["rgba(255, 19, 19, 0.5)", "rgba(19, 19, 235, 0.5)"],
        borderWidth: 1,
      },
    ],
  };

  /**Weekly View */

  const today = moment().format("YYYY-MM-DD");
  const lastweek = moment(today).subtract(7, "days").format("YYYY-MM-DD");
  const weeklytask =
    lists &&
    lists.filter(
      (list) =>
        moment(new Date(list.date)).format("YYYY-MM-DD") >= lastweek &&
        moment(new Date(list.date)).format("YYYY-MM-DD") <= today
    );
  const totalweektask = weeklytask[0]
    ? weeklytask.map((task) => task.data.length).reduce((acc, cv) => acc + cv)
    : 0;

  const weeklyCompletedTasks = weeklytask
    ? weeklytask.flatMap((task) => task.data).filter((task) => task.isCompleted)
        .length
    : 0;
  const weeklyIncompletedTasks = weeklytask
    ? weeklytask
        .flatMap((task) => task.data)
        .filter((task) => !task.isCompleted).length
    : 0;

  const weekData = {
    labels: ["Incompleted", "Completed"],
    datasets: [
      {
        label: "Number of tasks",
        data: [weeklyIncompletedTasks, weeklyCompletedTasks],
        backgroundColor: ["rgb(255, 99, 132 , 0.5)", "rgb(54, 162, 235 , 0.5)"],
        borderColor: ["rgba(255, 19, 19, 0.5)", "rgba(19, 19, 235, 0.5)"],
        borderWidth: 1,
      },
    ],
  };

  /**Monthly View */
  const startOfMonth = moment(today).startOf("month").format("YYYY-MM-DD");

  const monthlyTask =
    lists &&
    lists.filter(
      (list) =>
        moment(new Date(list.date)).format("YYYY-MM-DD") >= startOfMonth &&
        moment(new Date(list.date)).format("YYYY-MM-DD") <= today
    );

  const totalMonthlytask = monthlyTask[0]
    ? monthlyTask.map((task) => task.data.length).reduce((acc, cv) => acc + cv)
    : 0;

  const monthlyCompletedTasks = monthlyTask
    ? monthlyTask
        .flatMap((task) => task.data)
        .filter((task) => task.isCompleted).length
    : 0;

  const monthlyIncompletedTasks = monthlyTask
    ? monthlyTask
        .flatMap((task) => task.data)
        .filter((task) => !task.isCompleted).length
    : 0;

  const monthData = {
    labels: ["Incompleted", "Completed"],
    datasets: [
      {
        label: "Number of tasks",
        data: [monthlyIncompletedTasks, monthlyCompletedTasks],
        backgroundColor: ["rgb(255, 99, 132 , 0.5)", "rgb(54, 162, 235 , 0.5)"],
        borderColor: ["rgba(255, 19, 19, 0.5)", "rgba(19, 19, 235, 0.5)"],
        borderWidth: 1,
      },
    ],
  };

  /**Yearly View */

  const startOfYear = moment(today).startOf("year").format("YYYY-MM-DD");

  const yearlyTask =
    lists &&
    lists.filter(
      (list) =>
        moment(new Date(list.date)).format("YYYY-MM-DD") >= startOfYear &&
        moment(new Date(list.date)).format("YYYY-MM-DD") <= today
    );

  const yearlyTotalTask = yearlyTask[0]
    ? yearlyTask.map((task) => task.data.length).reduce((acc, cv) => acc + cv)
    : 0;

  const yearlyCompletedTask = yearlyTask
    ? yearlyTask.flatMap((task) => task.data).filter((task) => task.isCompleted)
        .length
    : 0;

  const yearlyInompletedTask = yearlyTask
    ? yearlyTask
        .flatMap((task) => task.data)
        .filter((task) => !task.isCompleted).length
    : 0;

  const yearData = {
    labels: ["Incompleted", "Completed"],
    datasets: [
      {
        label: "Number of tasks",
        data: [yearlyInompletedTask, yearlyCompletedTask],
        backgroundColor: ["rgb(255, 99, 132 , 0.5)", "rgb(54, 162, 235 , 0.5)"],
        borderColor: ["rgba(255, 19, 19, 0.5)", "rgba(19, 19, 235, 0.5)"],
        borderWidth: 1,
      },
    ],
  };

  /**search date */

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    toggleView("search");
    console.log(selectedDate);
  };

  const selectedDateTasks =
    lists &&
    lists.filter(
      (list) =>
        moment(new Date(list.date)).format("YYYY-MM-DD") === selectedDate
    );

  const totalSelectedDateTasks = selectedDateTasks[0]
    ? selectedDateTasks
        .map((task) => task.data.length)
        .reduce((acc, cv) => acc + cv)
    : 0;

  const completedSelectedDateTasks = selectedDateTasks
    ? selectedDateTasks
        .flatMap((task) => task.data)
        .filter((task) => task.isCompleted).length
    : 0;

  const incompletedSelectedDateTasks = selectedDateTasks
    ? selectedDateTasks
        .flatMap((task) => task.data)
        .filter((task) => !task.isCompleted).length
    : 0;

  const selectedDateData = {
    labels: ["Incompleted", "Completed"],
    datasets: [
      {
        label: "Number of tasks",
        data: [incompletedSelectedDateTasks, completedSelectedDateTasks],
        backgroundColor: ["rgb(255, 99, 132 , 0.5)", "rgb(54, 162, 235 , 0.5)"],
        borderColor: ["rgba(255, 19, 19, 0.5)", "rgba(19, 19, 235, 0.5)"],
        borderWidth: 1,
      },
    ],
  };

  const handleChange = (event) => {
    toggleView(event.target.value);
  };
  return (
    <div>
      <h1 className="text-5xl underline decoration-1 font-subTag mb-2">
        TaskMate
      </h1>
      <div className="flex flex-col min-h-96 items-center mb-10">
        <div className="py-7 px-2 rounded-md flex-col sm:flex-row items-center gap-6">
          <div className="flex flex-col signup:flex-row items-center">
            {" "}
            <p className="pr-3 text-lg font-sans">Search data for:</p>
            <input
              type="date"
              className="bg-inherit shadow-xl shadow-stone-300 border-stone-600 border-[1px] p-2 rounded-md hover:border-stone-500"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          <Select
            onChange={handleChange}
            style={{
              color: "black",
              backgroundColor: "inherit",
              height: "44px",
              fontSize: "20px",
            }}
            sx={{
              "& fieldset": { border: "none" },
              ":hover": { borderColor: "red", backgroundColor: "red" },
            }}
            defaultValue="daily"
          >
            <MenuItem
              value="daily"
              style={{
                color: "black",
                backgroundColor: " rgb(231 229 228)",
                height: "44px",
              }}
            >
              Daily View
            </MenuItem>
            <MenuItem
              value="weekly"
              style={{
                color: "black",
                backgroundColor: " rgb(231 229 228)",
                height: "44px",
              }}
            >
              Weekly View
            </MenuItem>
            <MenuItem
              value="monthly"
              style={{
                color: "black",
                backgroundColor: " rgb(231 229 228)",
                height: "44px",
              }}
            >
              Monthly View
            </MenuItem>
            <MenuItem
              value="yearly"
              style={{
                color: "black",
                backgroundColor: " rgb(231 229 228)",
                height: "44px",
              }}
            >
              Yearly View
            </MenuItem>
          </Select>
        </div>
        {view === "yearly" ? (
          <div className=" flex flex-col items-center">
            {yearlyTotalTask === 0 ? (
              <p>No data available</p>
            ) : (
              <div>
                <h1 className="text-2xl font-mono">Analysis of this YEAR</h1>
                <p>Total task : {yearlyTotalTask}</p>
                <div className="w-60 signup:w-80  my-4">
                  <Pie data={yearData} />
                </div>
              </div>
            )}
          </div>
        ) : view === "monthly" ? (
          <div className="flex flex-col items-center">
            {totalMonthlytask === 0 ? (
              <p>No data available</p>
            ) : (
              <div>
                <h1 className="text-2xl font-mono">Analysis of this MONTH</h1>
                <p>Total task : {totalMonthlytask}</p>
                <div className="w-60 signup:w-80  my-4">
                  <Pie data={monthData} />
                </div>
              </div>
            )}
          </div>
        ) : view === "weekly" ? (
          <div className="flex flex-col items-center">
            {totalweektask === 0 ? (
              <p>No data available</p>
            ) : (
              <div>
                {" "}
                <h1 className="text-2xl font-mono">Analysis of a WEEK</h1>
                <p>Total task : {totalweektask}</p>
                <div className="w-60 signup:w-80  my-4">
                  <Pie data={weekData} />
                </div>
              </div>
            )}
          </div>
        ) : view === "daily" ? (
          <div className="flex flex-col items-center">
            {totalTasksToday === 0 ? (
              <p>No data available</p>
            ) : (
              <div>
                <h1 className="text-2xl font-mono">Today's data</h1>
                <p>Total task : {totalTasksToday} </p>
                <div className="w-60 signup:w-80 my-4">
                  <Pie data={dailyData} />
                </div>
              </div>
            )}
          </div>
        ) : (
          view === "search" && (
            <div className="flex flex-col items-center">
              {totalSelectedDateTasks === 0 ? (
                <p>No data available</p>
              ) : (
                <div>
                  <h1 className="text-2xl font-mono">
                    Tasks on {moment(selectedDate).format("MMMM D, YYYY")}
                  </h1>
                  <p>Total task: {totalSelectedDateTasks}</p>
                  <div className="w-60 signup:w-80 my-4">
                    <Pie data={selectedDateData} />
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
     
    </div>
  );
};

export default JournalProgress;
