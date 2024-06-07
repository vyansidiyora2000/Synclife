import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosNew from "./axioInstance";

export const gratiSlice = createSlice({
  name: "gratitude",
  initialState: { gratitudes: [] },
  reducers: {
    setGratitudes: (state, action) => {
      state.gratitudes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  },
});

export const { setGratitudes } = gratiSlice.actions;

export const fetchGratitudes = createAsyncThunk(
  "gratitude/fetchGratitudes",
  async (userToken) => {
    try {
      const response = await axiosNew.get("/gratitude", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error in fetching gratitudes:", error);
      throw error;
    }
  }
);

export const addGratitude = createAsyncThunk(
  "gratitude/addGratitude",
  async ({ date , entry, imageFile, userToken }) => {
    try {
      const formData = new FormData();
      formData.append("date", date);
      formData.append("entry", entry);
      formData.append("file", imageFile);

      const response = await axiosNew.post("/gratitude", formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error in adding gratitude:", error);
      throw error;
    }
  }
);

export const deleteGratitude = createAsyncThunk(
  "list/deleteGratitude",
  async ({ newDate, userToken }) => {
    try {
   
      await axiosNew.delete("/gratitude", {
        headers: { Authorization: `Bearer ${userToken}` },
        data: { newDate },
      });

      return { newDate};
    } catch (error) {
      console.error("Error in deleting list:", error);
      throw error;
    }
  }
);

export default gratiSlice.reducer;
