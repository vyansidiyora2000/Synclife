import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axiosNew from "./axioInstance";
import { setHabits } from "./habitSlice";
import { setLists } from "./journalSlice";
import { useEffect } from "react";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(forgotUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
    .addCase(forgotUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    })
    .addCase(forgotUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    })
    .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    try {
      const response = await axiosNew.post("/login", { email, password });
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/signup",
  async (userData) => {
    try {
      const response = await axiosNew.post("/signup", userData);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("user");
    dispatch(setLists(null));
    dispatch(setHabits(null));
    return null;
  }
);


export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async ({ email }) => {
    
    try {
      const response = await axiosNew.get("/user", { params: { email } });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
);

export const forgotUser = createAsyncThunk(
  "auth/forgotUser",
  async ({ email}) => {
    try {
      const response = await axiosNew.post("/forgotPassword", { email});
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const checkOtp = createAsyncThunk("auth/checkOtp" , async({otp}) => {
  try {
   
    const response = await axiosNew.post("/forgotPassword/otp", { otp});
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error);
  }
});

export const changePassword = createAsyncThunk(
  "auth/changePassword" , 
  async ({ email, password}) => {
    try {
      const response = await axiosNew.post("/resetpassword", { email , password});
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.error);
    }
  }
);

export const selectUserFromLocalStorage = createSelector(
  () => localStorage.getItem("user"),
  (user) => JSON.parse(user) || {}
);

export const selectAuth = (state) => state.auth;

export const selectUser = createSelector(
  selectAuth,
  selectUserFromLocalStorage,
  (auth, savedUser) => savedUser || auth.user
);


export default authSlice.reducer;
