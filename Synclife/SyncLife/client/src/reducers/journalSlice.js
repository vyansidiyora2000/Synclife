import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosNew from "./axioInstance";

const journalSlice = createSlice({
  name: "list",
  initialState: {
    lists: [],
  },
  reducers: {
    setLists: (state, action) => {
      state.lists = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addDefaultCase((state) => state);
  },
});

export const { setLists } = journalSlice.actions;

export const fetchLists = createAsyncThunk(
  "list/fetchLists",
  async (userToken) => {
    try {
      const response = await axiosNew.get("/journal", {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      return response.data.map((item) => ({ ...item, id: item._id }));
    } catch (error) {
      console.error("Error in fetching lists: ", error);
      throw error;
    }
  }
);

export const addList = createAsyncThunk(
  "list/addList",
  async ({ date, list, userToken }) => {
    try {
      await axiosNew.post(
        "/journal",
        {
          date,
          list,
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      return { date, list };
    } catch (error) {
      console.error("Error in adding event: ", error);
      throw error;
    }
  }
);

export const deleteList = createAsyncThunk(
  "list/deleteList",
  async ({ selecteddataId, selectedListId, userToken }) => {
   
    try {

      await axiosNew.delete(`/journal/${selectedListId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
        data: { selecteddataId },
      });

      return { selecteddataId, selectedListId };
    } catch (error) {
      console.error("Error in deleting list:", error);
      throw error;
    }
  }
);

export const updateList = createAsyncThunk(
  "list/updateList",
  async ({ listId,dataId, updatedList,isCompleted, userToken }) => {
    try {
      await axiosNew.put(
        `/journal/${listId}`,
        {
          updatedList,dataId,isCompleted
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      return { listId, updatedList ,dataId ,isCompleted};
    } catch (error) {
      console.error("Error in updation: ", error);
      throw error;
    }
  }
);
export const listCompleted = createAsyncThunk(
  "list/listCompleted",
  async ({ dataId, listId, userToken }) => {
    try {
      await axiosNew.post(
        `/journal/${listId}`,
        {dataId},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      return {dataId , listId};
    } catch (error) {
      console.error("Error completing list is that:", error);
      throw error;
    }
  }
);

export default journalSlice.reducer;
