import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosNew from "./axioInstance";

export const habitSlice = createSlice({
  name: "habit",
  initialState: { habits: [] },
  reducers: {
    setHabits: (state, action) => {
      state.habits = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  },
});

export const { setHabits } = habitSlice.actions;

export const fetchHabits = createAsyncThunk(
  "habit/fetchHabits",
  async (userToken) => {
    try {
      const response = await axiosNew.get("/habits", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching habits:", error);
      throw error;
    }
  }
);

export const addHabit = createAsyncThunk(
  "habit/addHabit",
  async ({ name, startDate, endDate, userToken }) => {
    try {
      await axiosNew.post(
        "/habits",
        {
          name,
          startDate,
          endDate,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      return { name, startDate, endDate };
    } catch (error) {
      console.error("Error in adding habits: ", error);
      throw error;
    }
  }
);

export const deleteHabit = createAsyncThunk(
  "habits/deleteHabit",
  async ({ habitId, userToken }) => {
    try {
      await axiosNew.delete(`/habits/${habitId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      return habitId;
    } catch (error) {
      console.error("Error in deleting habits: ", error);
      throw error;
    }
  }
);

export const updateHabits = createAsyncThunk(
  "habits/updateHabits",
  async ({ habitId, name, startDate, endDate, userToken }) => {
    try {
      const response = await axiosNew.put(
        `/habits/${habitId}`,
        {
          name,
          startDate,
          endDate,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error in updating habits: ", error);
      throw error;
    }
  }
);
export const toggleCompletion = createAsyncThunk(
  "habits/toggleCompletion",
  async ({ habitId, date, userToken }) => {
    try {
      await axiosNew.post(
        `/habits/${habitId}`,
        { date },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      return { habitId, date };
    } catch (error) {
      console.error("Error in Completion: ", error);
    }
  }
);

export default habitSlice.reducer;
