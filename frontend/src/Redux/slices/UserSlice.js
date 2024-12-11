import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  updateAddressSuccess: false,
  updateAddressError: null,
};

export const GetUser = createAsyncThunk("user/getUserSingle", async () => {
  const response = await axios.get("/api/v2/user/getuser");
  return response.data.user;
});

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/v2/user/updateuser", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.user;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      throw error;
    }
  }
);

export const uploadAddress = createAsyncThunk(
  "user/uploadAddress",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/v2/user/update-address", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      throw error;
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.delete("/api/v2/user/remove-address", {
        data: { id },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message);
      }
      throw error;
    }
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.updateAddressSuccess = false;
      state.updateAddressError = null;
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetUser.pending, (state) => {
        state.isAuthenticated = false;
        state.loading = true;
        state.user = null;
      })
      .addCase(GetUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(GetUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.error = action.error.message;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(uploadAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.updateAddressError = null;
        state.updateAddressSuccess = true;
      })
      .addCase(uploadAddress.rejected, (state, action) => {
        state.loading = false;
        state.updateAddressSuccess = false;
        state.updateAddressError = action.payload || action.error.message;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.updateAddressError = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.updateAddressError = action.payload || action.error.message;
      });
  },
});

export const { clearErrors, clearUser } = UserSlice.actions;

export default UserSlice.reducer;
