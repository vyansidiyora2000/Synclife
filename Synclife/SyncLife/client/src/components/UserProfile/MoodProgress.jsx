import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoodData, setMoodData } from "../../reducers/moodSlice";
import { selectUser } from "../../reducers/authSlice";
import { Bar } from "react-chartjs-2";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MoodProgress = () => {
  const moods = useSelector((state) => state.mood.moodData);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [view, setView] = useState("week");
  
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

  const feelingColors = {
    Excellent: "rgba(255, 99, 132, 0.5)",
    Happy: "rgba(54, 162, 235, 0.5)",
    Average: "rgba(255, 206, 86, 0.5)",
    Sad: "rgba(75, 192, 192, 0.5)",
    Terrible: "rgba(153, 102, 255, 0.5)",
  };

  const borderColors = {
    Excellent: "rgba(255, 99, 132, 1)",
    Happy: "rgba(54, 162, 235, 1)",
    Average: "rgba(255, 206, 86, 1)",
    Sad: "rgba(75, 192, 192, 1)",
    Terrible: "rgba(153, 102, 255, 1)",
  };

  const calculateFeelingCounts = (moods, startDate, endDate) => {
    const feelingCounts = {
      Excellent: 0,
      Happy: 0,
      Average: 0,
      Sad: 0,
      Terrible: 0,
    };

    moods.forEach((mood) => {
      const moodDate = moment(new Date(mood.date)).format("YYYY-MM-DD");
      if (
        moodDate >= startDate &&
        moodDate <= endDate &&
        feelingCounts.hasOwnProperty(mood.feeling.value)
      ) {
        feelingCounts[mood.feeling.value]++;
      }
    });
    return feelingCounts;
  };

  const updateData = (feelingCounts) => {
    const labels = Object.keys(feelingCounts);
    const totalCount = Object.values(feelingCounts).reduce(
      (acc, cv) => acc + cv
    );

    const datasets = [
      {
        label: "count",
        data: labels.map((label) => feelingCounts[label]),
        backgroundColor: labels.map((label) => feelingColors[label]),
        borderColor: labels.map((label) => borderColors[label]),
        borderWidth: 1,
        borderRadius: 13,
        barThickness: 40,
        minBarLength: 3,
      },
    ];
    const data = { labels, datasets };

    return { totalCount, data };
  };

  const today = moment().format("YYYY-MM-DD");
  const startOfMonth = moment(today).startOf("month").format("YYYY-MM-DD");
  const lastWeek = moment(today).subtract(7, "days").format("YYYY-MM-DD");

  const yearlyFeelingCounts = calculateFeelingCounts(
    moods,
    "0000-01-01",
    today
  );
  const monthlyFeelingCounts = calculateFeelingCounts(
    moods,
    startOfMonth,
    today
  );
  const weeklyFeelingCounts = calculateFeelingCounts(moods, lastWeek, today);

  const yearlyData = updateData(yearlyFeelingCounts);
  const monthlyData = updateData(monthlyFeelingCounts);
  const weeklyData = updateData(weeklyFeelingCounts);

  const yearlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: "bottom",
        text: "Yearly Mood Progress",
      },
    },
  };

  const weeklyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: "bottom",
        text: "Weekly Mood Progress",
      },
    },
  };

  const monthlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: "bottom",
        text: "Monthly Mood Progress",
      },
    },
  };

  const handleChange = (e) => {
    setView(e.target.value);
  };

  /**activity */

  /*good mood"*/
  const data = moods.filter(
    (mood) =>
      mood.feeling.value === "Excellent" || mood.feeling.value === "Happy"
  );

  const activities = [];

  data.forEach((mood) => {
    if (mood.activity && mood.activity.length > 0) {
      mood.activity.forEach((activityCategory) => {
        Object.keys(activityCategory).forEach((category) => {
          if (Array.isArray(activityCategory[category])) {
            activityCategory[category].forEach((activity) => {
              activities.push(activity.value);
            });
          }
        });
      });
    }
  });

  const activityCount = {};

  activities.forEach((activity) => {
    if (activityCount[activity]) {
      activityCount[activity]++;
    } else {
      activityCount[activity] = 1;
    }
  });

  const activityCountArray = Object.entries(activityCount)
    .filter(([name, count]) => count > 2)
    .map(([name, count]) => ({ name, count }));

  const labels = activityCountArray
    ? activityCountArray.map((activity) => activity.name)
    : [];
  const activityExcellentdata = activityCountArray
    ? activityCountArray.map((activity) => activity.count)
    : [];

  const datasets = [
    {
      label: "count",
      data: activityExcellentdata,
      backgroundColor: "rgba(85, 209, 25 , 0.6)",
      borderColor: "rgba(85, 209, 25 , 1)",
      borderWidth: 1,
      borderRadius: 13,
      barThickness: 36,
      minBarLength: 3,
    },
  ];

  const bardata = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display:false,
      },
    },
  };

  /*bad mood" */
  const badData = moods.filter(
    (mood) =>
      mood.feeling.value === "Sad" ||
      mood.feeling.value === "Terrible" ||
      mood.feeling.value === "Average"
  );

  const badActivities = [];

  badData.forEach((mood) => {
    if (mood.activity && mood.activity.length > 0) {
      mood.activity.forEach((activityCategory) => {
        Object.keys(activityCategory).forEach((category) => {
          if (Array.isArray(activityCategory[category])) {
            activityCategory[category].forEach((activity) => {
              badActivities.push(activity.value);
            });
          }
        });
      });
    }
  });

  const badActivityCount = {};

  badActivities.forEach((activity) => {
    if (badActivityCount[activity]) {
      badActivityCount[activity]++;
    } else {
      badActivityCount[activity] = 1;
    }
  });

  console.log(badActivityCount)
  const badActivityCountArray = Object.entries(badActivityCount)
    .filter(([name, count]) => count > 2)
    .map(([name, count]) => ({ name, count }));

  const badActivityLabels = badActivityCountArray
    ? badActivityCountArray.map((activity) => activity.name)
    : [];

  const badActivityData = badActivityCountArray
    ? badActivityCountArray.map((activity) => activity.count)
    : [];

  const badDatasets = [
    {
      label: "count",
      data: badActivityData,
      backgroundColor: "rgba(245, 100, 62, 0.6)",
      borderColor: "rgba(245, 100, 62, 1)",
      borderWidth: 1,
      borderRadius: 13,
      barThickness: 40,
      minBarLength: 3,
    },
  ];

  const badMoodData = { labels: badActivityLabels, datasets: badDatasets };

  return (
    <div className="flex flex-col gap-5 items-center">
      <p className="text-5xl font-subTag underline">Mood Tracking</p>
      <div>
        {moods && moods.length > 0 ? (
          <div>
            <div>
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
                defaultValue="week"
              >
                <MenuItem
                  value="week"
                  style={{
                    color: "black",
                    backgroundColor: " rgb(231 229 228)",
                    height: "44px",
                  }}
                >
                  Weekly tracking
                </MenuItem>
                <MenuItem
                  value="month"
                  style={{
                    color: "black",
                    backgroundColor: " rgb(231 229 228)",
                    height: "44px",
                  }}
                >
                  Monthly tracking
                </MenuItem>
                <MenuItem
                  value="year"
                  style={{
                    color: "black",
                    backgroundColor: " rgb(231 229 228)",
                    height: "44px",
                  }}
                >
                  All data
                </MenuItem>
              </Select>
            </div>
            {view === "year" ? (
              <div   className="w-[270px] h-[200px]  signup:h-[230px] signup:w-[280px] moodP:w-[450px] moodP:h-[200px] sm:w-[600px] sm:h-[300px]">
                <p>Total entry: {yearlyData.totalCount}</p>
                <Bar data={yearlyData.data} options={yearlyOptions} />
              </div>
            ) : view === "month" ? (
              <div   className="w-[270px] h-[200px]  signup:h-[230px] signup:w-[280px] moodP:w-[450px] moodP:h-[200px] sm:w-[600px] sm:h-[300px]">
                <p>Total entry: {monthlyData.totalCount}</p>
                <Bar data={monthlyData.data} options={monthlyOptions} />
              </div>
            ) : (
              <div   className="w-[270px] h-[200px]  signup:h-[230px]  signup:w-[280px] moodP:w-[450px] moodP:h-[200px] sm:w-[600px] sm:h-[300px]">
                <p>Total entry: {weeklyData.totalCount}</p>
                <Bar data={weeklyData.data} options={weeklyOptions} />
              </div>
            )}
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <div className="pb-7">
        {moods && moods.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              {" "}
              <h1>Good mood affectors</h1>
              <div 
                className="w-[270px] h-[200px]  signup:h-[200px] signup:w-[280px] moodP:w-[450px] moodP:h-[200px] sm:w-[600px] sm:h-[300px]"
              >
                <Bar data={bardata} options={options} />
              </div>
            </div>
            <div>
              {" "}
              <h1>Bad mood affectors</h1>
              <div 
              className="w-[270px] h-[200px]  signup:h-[200px] signup:w-[280px] moodP:w-[450px] moodP:h-[200px] sm:w-[600px] sm:h-[300px]"
              >
                <Bar data={badMoodData} options={options} />
              </div>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>

     
    </div>
  );
};

export default MoodProgress;
